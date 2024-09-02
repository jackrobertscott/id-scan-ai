import {Filter} from "mongodb"
import {DocPhotoStore} from "../mods/docPhoto/docPhoto_store"
import {LivePhotoStore} from "../mods/livePhoto/livePhoto_store"
import {
  ScanLargeFilterFormValue,
  ScanType,
} from "../mods/scan/scan_storeDef.iso"
import {getSignedUrlOfBucketObject} from "./s3BucketUtils"

export const createScanFilterQuery = ({
  primaryEmotion,
  postCode,
  bornAfterDate,
  bornBeforeDate,
  gender,
  hasGlasses,
  hasSunglasses,
  hasBeard,
  hasMustache,
  hasSmile,
  hasFaceMismatch,
}: ScanLargeFilterFormValue) => {
  const query = {$and: [] as Filter<ScanType>[]}

  if (primaryEmotion) {
    query.$and.push({
      "patronFaceMeta.primaryEmotion": primaryEmotion,
    })
  }

  if (postCode) {
    query.$and.push({
      "documentMeta.postCode": postCode,
    })
  }

  if (bornAfterDate) {
    query.$and.push({
      "documentMeta.dobDate": {$gte: bornAfterDate},
    })
  }

  if (bornBeforeDate) {
    query.$and.push({
      "documentMeta.dobDate": {$lte: bornBeforeDate},
    })
  }

  if (gender) {
    query.$and.push({
      "patronFaceMeta.gender.value": gender.toUpperCase(),
    })
  }

  if (hasGlasses) {
    query.$and.push({
      "patronFaceMeta.eyeglasses.value": true,
    })
  }

  if (hasSunglasses) {
    query.$and.push({
      "patronFaceMeta.sunglasses.value": true,
    })
  }

  if (hasBeard) {
    query.$and.push({
      "patronFaceMeta.beard.value": true,
    })
  }

  if (hasMustache) {
    query.$and.push({
      "patronFaceMeta.mustache.value": true,
    })
  }

  if (hasSmile) {
    query.$and.push({
      "patronFaceMeta.smile.value": true,
    })
  }

  if (hasFaceMismatch) {
    query.$and.push({
      faceSimilarity: {$lt: 80},
    })
  }

  return query
}

export const populatePhotosOnScans = async (scans: ScanType[]) => {
  // Get the photo images from the scans
  const livePhotoIds = scans.map((scan) => scan.livePhotoId)
  const docPhotoIds = scans.map((scan) => scan.docPhotoId)
  const [livePhotos, docPhotos] = await Promise.all([
    LivePhotoStore.getMany({id: {$in: livePhotoIds}}),
    DocPhotoStore.getMany({id: {$in: docPhotoIds}}),
  ])

  // Get signed URLs for the photos
  return await Promise.all(
    scans.map(async (scan) => {
      const livePhoto = livePhotos.find((photo) => {
        return photo.id === scan.livePhotoId
      })
      const docPhoto = docPhotos.find((photo) => {
        return photo.id === scan.docPhotoId
      })
      const [livePhotoUrl, docPhotoUrl] = await Promise.all([
        getSignedUrlOfBucketObject(livePhoto!.s3FaceImage),
        getSignedUrlOfBucketObject(docPhoto!.s3FaceImage),
      ])
      return {...scan, livePhotoUrl, docPhotoUrl}
    })
  )
}
