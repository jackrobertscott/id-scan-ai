import {Image} from "canvas"
import {join} from "path"
import {z} from "zod"
import {serverConfig} from "../serverConfig"
import {getCroppedFaceImage} from "./faceUtils"
import {createRandomString} from "./randomString"
import {remapRekogFace} from "./rekogFaceUtils"
import {addFaceToCollection} from "./rekogUtils"
import {uploadBucketObject} from "./s3BucketUtils"
import {s3ImageSchema} from "./s3SchemaUtils"

export async function s3CropAndUploadFacePhoto(
  fullImage: Image,
  s3FullImage: z.infer<ReturnType<typeof s3ImageSchema>>,
  folder: string,
  rekogCollection: string
) {
  // Detect facial features and position in photo
  const rawFaceMeta = await addFaceToCollection(s3FullImage, rekogCollection, {
    attributes: ["ALL"],
  })
  const rawFace = rawFaceMeta.FaceRecords?.[0]
  const awsFaceId = rawFace?.Face?.FaceId
  if (!rawFace?.FaceDetail || !awsFaceId)
    throw new Error("No face detected in image")
  const faceMeta = remapRekogFace(rawFace.FaceDetail)

  if (faceMeta.faceOccluded?.value) {
    throw new Error("Face is not clear in image, please try again")
  }

  // Extract the face from the photo
  const [faceBuffer, faceImage] = await getCroppedFaceImage(fullImage, faceMeta)
  const s3FaceImage = s3ImageSchema().parse({
    region: serverConfig.AWS_DEFAULT_REGION,
    bucket: serverConfig.AWS_S3_BUCKET,
    key: join(folder, createRandomString(24).concat(".jpeg")),
    bytes: faceBuffer.length,
    width: faceImage.width,
    height: faceImage.height,
  })

  // Upload the face image to the bucket
  await uploadBucketObject({
    ...s3FaceImage,
    data: faceBuffer,
  })

  return {
    s3FaceImage,
    awsFaceId,
    faceMeta,
  }
}
