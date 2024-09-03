import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {join} from "path"
import {Readable} from "stream"
import {srvConf} from "../srvConf"

const s3Client = new S3Client({
  region: srvConf.AWS_DEFAULT_REGION,
})

export async function uploadBucketObject({
  bucket,
  key,
  data,
}: {
  bucket: string
  key: string
  data: string | Uint8Array | Buffer | Readable
}) {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
    })
  )
}

export async function downloadBucketObject({
  bucket,
  key,
}: {
  bucket: string
  key: string
}): Promise<Uint8Array | Readable> {
  const response = await s3Client.send(
    new GetObjectCommand({Bucket: bucket, Key: key})
  )
  if (response.Body instanceof Readable || response.Body instanceof Uint8Array)
    return response.Body
  throw new Error("Unsupported S3 response body type.")
}

export async function getSignedUrlOfBucketObject({
  bucket,
  key,
  expirationSeconds,
}: {
  bucket: string
  key: string
  expirationSeconds?: number
}): Promise<string> {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({Bucket: bucket, Key: key}),
    {expiresIn: expirationSeconds}
  )
}

export async function copyBucketObject({
  source,
  destination,
}: {
  source: {bucket: string; key: string}
  destination: {bucket: string; key: string}
}): Promise<void> {
  await s3Client.send(
    new CopyObjectCommand({
      CopySource: join(source.bucket, source.key),
      Bucket: destination.bucket,
      Key: destination.key,
    })
  )
}

export async function deleteBucketObject({
  bucket,
  key,
}: {
  bucket: string
  key: string
}): Promise<void> {
  await s3Client.send(new DeleteObjectCommand({Bucket: bucket, Key: key}))
}

export async function listBucketObjects({bucket}: {bucket: string}) {
  return s3Client.send(new ListObjectsCommand({Bucket: bucket}))
}
