import {AWS_REKOG_COLNAMES} from "../../consts/AWS_REKOG_COLNAMES"
import {BUCKET_FOLDERS} from "../../consts/BUCKET_FOLDERS"
import {extractFaceIdsFromSearchResults} from "../../utils/rekogFaceUtils"
import {
  compareFaces,
  detectImageText,
  searchFacesByImage,
} from "../../utils/rekogUtils"
import {getSignedUrlOfBucketObject} from "../../utils/s3BucketUtils"
import {s3CropAndUploadFacePhoto} from "../../utils/s3CropAndUploadFacePhoto"
import {s3UploadFullPhoto} from "../../utils/s3UploadFullPhoto"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {serverFileSchema} from "../../utils/server/serverSchemas"
import {ensureMemberOfVenue} from "../auth/authUtils"
import {parseDocText} from "../docPhoto/docPhoto_parseText"
import {DocPhotoStore} from "../docPhoto/docPhoto_store"
import {LivePhotoStore} from "../livePhoto/livePhoto_store"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {scan_byMember_eDef} from "./scan_byMember_eDef.iso"
import {ScanStore} from "./scan_store"

export default createEdgeGroup(scan_byMember_eDef, {
  uploadLivePhoto: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.SCAN_CREATE],
      {isDeviceEnabled: true}
    )

    // Extract the photo buffer
    const {buffer: bodyBuffer} = serverFileSchema().parse(body.livePhotoFile)

    // Upload image files and detect face
    const {fullImage, s3FullImage} = await s3UploadFullPhoto(
      bodyBuffer,
      BUCKET_FOLDERS.LIVE_PHOTO_FULL
    )
    const {awsFaceId, faceMeta, s3FaceImage} = await s3CropAndUploadFacePhoto(
      fullImage,
      s3FullImage,
      BUCKET_FOLDERS.LIVE_PHOTO_FACE,
      AWS_REKOG_COLNAMES.LIVE
    )

    // Save to database
    const livePhoto = await LivePhotoStore.createOne({
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
      faceMeta,
      awsFaceId,
      s3FullImage,
      s3FaceImage,
    })

    return {
      livePhotoId: livePhoto.id,
      livePhotoUrl: await getSignedUrlOfBucketObject(livePhoto.s3FaceImage),
    }
  },

  uploadDocPhotoAndCreate: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.SCAN_CREATE],
      {isDeviceEnabled: true}
    )

    // Get the live face photo
    const livePhoto = await LivePhotoStore.getOne({
      venueId: auth.venue.id,
      id: body.livePhotoId,
    })

    // Extract the photo buffer
    const {buffer: bodyBuffer} = serverFileSchema().parse(body.docPhotoFile)

    // Upload image files and detect face
    const {fullImage, s3FullImage} = await s3UploadFullPhoto(
      bodyBuffer,
      BUCKET_FOLDERS.DOC_PHOTOS_FULL
    )
    const [{awsFaceId, faceMeta, s3FaceImage}, textResult] = await Promise.all([
      s3CropAndUploadFacePhoto(
        fullImage,
        s3FullImage,
        BUCKET_FOLDERS.DOC_PHOTOS_FACE,
        AWS_REKOG_COLNAMES.DOC
      ),
      detectImageText(s3FullImage),
    ])

    // Format text values
    const detectedText =
      textResult.TextDetections?.filter((i) => i.Type === "LINE")
        .map((i) => i.DetectedText)
        .join(" ") ?? ""

    // Detect face similarity
    const compareResult = await compareFaces(livePhoto.s3FaceImage, s3FaceImage)

    // Save the photos to the database
    const docPhoto = await DocPhotoStore.createOne({
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
      faceMeta,
      awsFaceId,
      s3FullImage,
      s3FaceImage,
      detectedText,
    })

    // Save the scan to the database
    const scan = await ScanStore.createOne({
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
      livePhotoId: livePhoto.id,
      docPhotoId: docPhoto.id,
      faceSimilarity: compareResult.FaceMatches?.[0]?.Similarity ?? 0,
      liveFaceMeta: livePhoto.faceMeta,
      docMeta: parseDocText(detectedText),
      detectedText,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.SCAN,
      dataId: scan.id,
    })

    return scan
  },

  createFromPreviousDocPhoto: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.SCAN_CREATE],
      {isDeviceEnabled: true}
    )

    // Get the face photos
    const [livePhoto, docPhoto] = await Promise.all([
      LivePhotoStore.getOne({
        venueId: auth.venue.id,
        id: body.livePhotoId,
      }),
      DocPhotoStore.getOne({
        venueId: auth.venue.id,
        id: body.docPhotoId,
      }),
    ])

    // Detect face similarity and text
    const compareResult = await compareFaces(
      livePhoto.s3FaceImage,
      docPhoto.s3FaceImage
    )

    // Save the scan to the database
    const scan = await ScanStore.createOne({
      venueId: auth.venue.id,
      createdByUserId: auth.user.id,
      livePhotoId: livePhoto.id,
      docPhotoId: docPhoto.id,
      faceSimilarity: compareResult.FaceMatches?.[0]?.Similarity ?? 0,
      docMeta: parseDocText(docPhoto.detectedText),
      liveFaceMeta: livePhoto.faceMeta,
      detectedText: docPhoto.detectedText,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.SCAN,
      dataId: scan.id,
    })

    return scan
  },

  listSimilarDocPhotos: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.SCAN_SEARCH],
      {isDeviceEnabled: true}
    )

    const livePhoto = await LivePhotoStore.getOne({
      venueId: auth.venue.id,
      id: body.livePhotoId,
    })

    // Search for faces that match the doc face
    const searchResults = await searchFacesByImage(
      livePhoto.s3FaceImage,
      AWS_REKOG_COLNAMES.DOC
    )

    // Get the AWS face IDs
    const awsFaceIds = extractFaceIdsFromSearchResults(searchResults)
    if (!awsFaceIds.length) throw new Error("Failed to recognize face")

    // Get the doc face photos
    const docPhotos = await DocPhotoStore.getMany({
      venueId: auth.venue.id,
      awsFaceId: {$in: awsFaceIds},
    })

    // Get the scans
    const scans = await ScanStore.getMany({
      venueId: auth.venue.id,
      docPhotoId: {$in: docPhotos.map((i) => i.id)},
    })

    return {
      docPhotos: await Promise.all(
        docPhotos.map(async (facePhoto) => {
          const scan = scans.find((i) => i.docPhotoId === facePhoto.id)
          const photoUrl = await getSignedUrlOfBucketObject(
            facePhoto.s3FaceImage
          )
          return {...facePhoto, photoUrl, scan}
        })
      ),
    }
  },
})
