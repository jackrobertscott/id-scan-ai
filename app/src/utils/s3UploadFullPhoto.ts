import {loadImage} from "canvas"
import {join} from "path"
import {srvConf} from "../srvConf"
import {
  createBufferFromImageData,
  createImageDataFromBuffer,
  shrinkImage,
} from "./nodeCanvasUtils"
import {createRandomString} from "./randomString"
import {uploadBucketObject} from "./s3BucketUtils"
import {s3ImageSchema} from "./s3SchemaUtils"

export async function s3UploadFullPhoto(bodyBuffer: Buffer, folder: string) {
  // Shrink the full image
  let bodyImage = await createImageDataFromBuffer(bodyBuffer)
  bodyImage = shrinkImage(bodyImage, 1280)
  const fullBuffer = createBufferFromImageData(bodyImage)
  const fullImage = await loadImage(fullBuffer)
  const s3FullImage = s3ImageSchema().parse({
    region: srvConf.AWS_DEFAULT_REGION,
    bucket: srvConf.AWS_S3_BUCKET,
    key: join(folder, createRandomString(24).concat(".jpeg")),
    bytes: fullBuffer.length,
    width: fullImage.width,
    height: fullImage.height,
  })

  // upload the full image to the bucket
  await uploadBucketObject({
    ...s3FullImage,
    data: fullBuffer,
  })

  return {
    s3FullImage,
    fullImage,
  }
}
