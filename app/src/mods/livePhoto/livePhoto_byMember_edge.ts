import {AWS_REKOG_COLNAMES} from "../../consts/AWS_REKOG_COLNAMES"
import {extractFaceIdsFromSearchResults} from "../../utils/rekogFaceUtils"
import {searchFacesByImage} from "../../utils/rekogUtils"
import {getSignedUrlOfBucketObject} from "../../utils/s3BucketUtils"
import {S3ImageSchema} from "../../utils/s3SchemaUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {serverFileSchema} from "../../utils/server/serverSchemas"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {ScanStore} from "../scan/scan_store"
import {livePhoto_byMember_eDef} from "./livePhoto_byMember_eDef.iso"
import {LivePhotoStore} from "./livePhoto_store"

export default createEdgeGroup(livePhoto_byMember_eDef, {
  listSimilar: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.SCAN_SEARCH],
      {isDeviceEnabled: true}
    )

    let searchPhoto: S3ImageSchema | Buffer

    if (body.livePhotoId) {
      // Get the patron face photo
      const livePhoto = await LivePhotoStore.getOne({
        venueId: auth.venue.id,
        id: body.livePhotoId,
      })
      searchPhoto = livePhoto.s3FaceImage
    } else {
      // Extract the photo buffer
      const fileData = serverFileSchema().parse(body.photoFile)
      searchPhoto = fileData.buffer
    }

    // Search for faces that match the patron face
    const searchResults = await searchFacesByImage(
      searchPhoto,
      AWS_REKOG_COLNAMES.LIVE
    )

    // Get the AWS face IDs
    const awsFaceIds = extractFaceIdsFromSearchResults(searchResults)
    if (!awsFaceIds.length) throw new Error("Failed to recognize face")

    // Get the document face photos
    const livePhotos = await LivePhotoStore.getMany({
      venueId: auth.venue.id,
      awsFaceId: {$in: awsFaceIds},
    })

    // Get the scans
    const scans = await ScanStore.getMany({
      venueId: auth.venue.id,
      livePhotoId: {$in: livePhotos.map((i) => i.id)},
    })

    return {
      livePhotos: await Promise.all(
        livePhotos.map(async (facePhoto) => {
          const scan = scans.find((i) => i.livePhotoId === facePhoto.id)
          const photoUrl = await getSignedUrlOfBucketObject(
            facePhoto.s3FaceImage
          )
          return {...facePhoto, photoUrl, scan}
        })
      ),
    }
  },
})
