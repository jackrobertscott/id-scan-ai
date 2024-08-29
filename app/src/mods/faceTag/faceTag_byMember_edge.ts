import {join} from "path"
import {AWS_REKOG_COLNAMES} from "../../consts/AWS_REKOG_COLNAMES"
import {BUCKET_FOLDERS} from "../../consts/BUCKET_FOLDERS"
import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createRandomString} from "../../utils/randomString"
import {RekogAddFaceOptions, addFaceToCollection} from "../../utils/rekogUtils"
import {
  copyBucketObject,
  getSignedUrlOfBucketObject,
} from "../../utils/s3BucketUtils"
import {s3ImageSchema} from "../../utils/s3SchemaUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/authUtils"
import {DocPhotoStore} from "../docPhoto/docPhoto_store"
import {LivePhotoStore} from "../livePhoto/livePhoto_store"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {ScanStore} from "../scan/scan_store"
import {faceTag_byMember_eDef} from "./faceTag_byMember_eDef.iso"
import {faceTag_calcExpiry} from "./faceTag_calcExpiry"
import {FaceTagStore} from "./faceTag_store"
import {FaceTagType} from "./faceTag_storeDef.iso"

export default createEdgeGroup(faceTag_byMember_eDef, {
  create: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.TAG_CREATE],
      {isDeviceEnabled: true}
    )

    // Get the awsFaceId from either the facePhoto or scan
    const scan = await ScanStore.getOne({
      id: body.scanId,
      venueId: auth.venue.id,
    })
    const [livePhoto, docPhoto] = await Promise.all([
      LivePhotoStore.getOne({
        id: scan.livePhotoId,
        venueId: auth.venue.id,
      }),
      DocPhotoStore.getOne({
        id: scan.docPhotoId,
        venueId: auth.venue.id,
      }),
    ])

    // Create new s3 face images for the tag
    const s3PatronFaceCopy = s3ImageSchema().parse({
      ...livePhoto.s3FaceImage,
      key: join(
        BUCKET_FOLDERS.TAGS_PATRONS_FACE,
        createRandomString(24).concat(".jpeg")
      ),
    })
    const s3DocumentFaceCopy = s3ImageSchema().parse({
      ...docPhoto.s3FaceImage,
      key: join(
        BUCKET_FOLDERS.TAGS_DOCUMENTS_FACE,
        createRandomString(24).concat(".jpeg")
      ),
    })

    // Copy the face photos to a new persistant location
    await Promise.all([
      copyBucketObject({
        source: livePhoto.s3FaceImage,
        destination: s3PatronFaceCopy,
      }),
      copyBucketObject({
        source: docPhoto.s3FaceImage,
        destination: s3DocumentFaceCopy,
      }),
    ])

    // Set a group face key if the face similarity is high enough
    const rekogFaceOption: RekogAddFaceOptions =
      scan.faceSimilarity >= 90 ? {groupFaceKey: scan.id} : {}

    // Add the faces to the AWS Rekognition collection
    const results = await Promise.all([
      addFaceToCollection(
        s3PatronFaceCopy,
        AWS_REKOG_COLNAMES.TAG,
        rekogFaceOption
      ),
      addFaceToCollection(
        s3DocumentFaceCopy,
        AWS_REKOG_COLNAMES.TAG,
        rekogFaceOption
      ),
    ])

    // Calculate the expiry date
    const expiryDate = faceTag_calcExpiry(
      new Date(),
      body.expiry.timeUnit,
      body.expiry.timeAmount
    )

    // Create the tag in the database
    const tag = await FaceTagStore.createOne({
      ...body,
      scanId: scan.id,
      createdByUserId: auth.user.id,
      s3FaceImages: [s3PatronFaceCopy, s3DocumentFaceCopy],
      awsFaceIds: results
        .map((result) => result.FaceRecords?.[0]?.Face?.FaceId)
        .filter(Boolean) as string[],
      venueId: auth.venue.id,
      expiry: {
        ...body.expiry,
        date: expiryDate,
      },
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.FACE_TAG,
      dataId: tag.id,
    })

    return tag
  },

  get: async ({request, body: {tagId}}) => {
    const auth = await ensureMemberOfVenue(request, [], {isDeviceEnabled: true})

    // Ensure the tag is from the user's venue
    const tag = await FaceTagStore.getOne({
      id: tagId,
      venueId: auth.venue.id,
    })

    const scan = await ScanStore.maybeOne({
      id: tag.scanId,
      venueId: auth.venue.id,
    })

    return {
      tag: {
        ...tag,
        livePhotoId: scan?.livePhotoId,
      },
    }
  },

  update: async ({request, body: {tagId, ...body}}) => {
    const auth = await ensureMemberOfVenue(
      request,
      [MEMBER_PERMISSIONS_OBJ.TAG_UPDATE],
      {isDeviceEnabled: true}
    )

    // Get the tag
    const tag = await FaceTagStore.getOne({
      venueId: auth.venue.id,
      id: tagId,
    })

    // Calculate the expiry date
    const expiryDate = faceTag_calcExpiry(
      tag.createdDate,
      body.expiry.timeUnit,
      body.expiry.timeAmount
    )

    // Ensure the tag is from the user's venue
    await FaceTagStore.updateOne(
      {
        id: tagId,
        venueId: auth.venue.id,
      },
      {
        ...body,
        expiry: {
          ...body.expiry,
          date: expiryDate,
        },
      }
    )

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.FACE_TAG,
      dataId: tagId,
    })
  },

  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [], {isDeviceEnabled: true})

    const query = createListSearchQuery<FaceTagType>({
      ...body,
      searchKeys: ["category", "desc"],
      filter: {
        venueId: auth.venue.id, // ensure only from user's venue
      },
    })

    if (body.category) {
      query.$and.push({category: body.category})
    }

    if (body.expiresAfterDate) {
      query.$and.push({createdDate: {$gte: body.expiresAfterDate}})
    }

    if (body.expiresBeforeDate) {
      query.$and.push({createdDate: {$lt: body.expiresBeforeDate}})
    }

    const [total, tags] = await Promise.all([
      FaceTagStore.count(query),
      FaceTagStore.getMany(query, createListOptions(body)),
    ])

    const tagsAndPhotos = await Promise.all(
      tags.map(async (tag) => {
        const photoUrl = tag.s3FaceImages[0]
          ? await getSignedUrlOfBucketObject(tag.s3FaceImages[0])
          : undefined
        return {...tag, photoUrl}
      })
    )

    return {
      total,
      tags: tagsAndPhotos,
    }
  },

  delete: async ({request, body: {tagId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.TAG_DELETE,
    ])

    // Ensure the tag is from the user's venue
    await FaceTagStore.deleteOne({
      id: tagId,
      venueId: auth.venue.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.FACE_TAG,
      dataId: tagId,
    })
  },
})
