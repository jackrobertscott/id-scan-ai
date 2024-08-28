import {
  AssociateFacesCommand,
  Attribute,
  CompareFacesCommand,
  CreateCollectionCommand,
  CreateUserCommand,
  DeleteFacesCommand,
  DetectFacesCommand,
  DetectTextCommand,
  IndexFacesCommand,
  ListCollectionsCommand,
  RekognitionClient,
  SearchFacesByImageCommand,
  SearchUsersByImageCommand,
} from "@aws-sdk/client-rekognition"
import {srvConf} from "../srvConf"

const rekogClient = new RekognitionClient({
  region: srvConf.AWS_DEFAULT_REGION,
})

export async function ensureCollectionsExists(names: string[]) {
  const existingCols = await rekogClient.send(new ListCollectionsCommand())
  const tasks = names.map(async (name) => {
    if (!existingCols.CollectionIds?.includes(name)) {
      await rekogClient.send(new CreateCollectionCommand({CollectionId: name}))
    }
  })
  await Promise.all(tasks)
}

export async function detectImageText(
  data: {bucket: string; key: string} | Buffer
) {
  return rekogClient.send(
    new DetectTextCommand({
      Image: Buffer.isBuffer(data)
        ? {Bytes: data}
        : {S3Object: {Bucket: data.bucket, Name: data.key}},
    })
  )
}

export async function detectImageFace(
  data: {bucket: string; key: string} | Buffer,
  attributes?: Attribute[]
) {
  return rekogClient.send(
    new DetectFacesCommand({
      Attributes: attributes, // ["ALL"]
      Image: Buffer.isBuffer(data)
        ? {Bytes: data}
        : {S3Object: {Bucket: data.bucket, Name: data.key}},
    })
  )
}

export type RekogAddFaceOptions = {
  maxFaces?: number
  groupFaceKey?: string
  attributes?: Attribute[]
}

export async function addFaceToCollection(
  data: {bucket: string; key: string} | Buffer,
  collectionName: string,
  options: RekogAddFaceOptions = {}
) {
  return rekogClient.send(
    new IndexFacesCommand({
      CollectionId: collectionName,
      DetectionAttributes: options.attributes ?? [],
      MaxFaces: options.maxFaces ?? 1,
      ExternalImageId: options.groupFaceKey,
      Image: Buffer.isBuffer(data)
        ? {Bytes: data}
        : {S3Object: {Bucket: data.bucket, Name: data.key}},
    })
  )
}

export async function compareFaces(
  source: {bucket: string; key: string} | Buffer,
  target: {bucket: string; key: string} | Buffer
) {
  return rekogClient.send(
    new CompareFacesCommand({
      SourceImage: Buffer.isBuffer(source)
        ? {Bytes: source}
        : {S3Object: {Bucket: source.bucket, Name: source.key}},
      TargetImage: Buffer.isBuffer(target)
        ? {Bytes: target}
        : {S3Object: {Bucket: target.bucket, Name: target.key}},
    })
  )
}

export async function deleteFacesFromCollection(
  faceIds: string[],
  collectionName: string
) {
  return rekogClient.send(
    new DeleteFacesCommand({
      CollectionId: collectionName,
      FaceIds: faceIds,
    })
  )
}

export async function searchFacesByImage(
  data: {bucket: string; key: string} | Buffer,
  collectionName: string
) {
  return rekogClient.send(
    new SearchFacesByImageCommand({
      CollectionId: collectionName,
      Image: Buffer.isBuffer(data)
        ? {Bytes: data}
        : {S3Object: {Bucket: data.bucket, Name: data.key}},
      FaceMatchThreshold: 90,
    })
  )
}

export async function createRekogUser(userId: string, collectionName: string) {
  return rekogClient.send(
    new CreateUserCommand({
      CollectionId: collectionName,
      UserId: userId,
    })
  )
}

export async function associateFacesToRekogUser(
  faceIds: string[],
  userId: string,
  collectionName: string
) {
  return rekogClient.send(
    new AssociateFacesCommand({
      CollectionId: collectionName,
      FaceIds: faceIds,
      UserId: userId,
      UserMatchThreshold: 90,
    })
  )
}

export async function searchRekogUsersByImage(
  data: {bucket: string; key: string} | Buffer,
  collectionName: string
) {
  return rekogClient.send(
    new SearchUsersByImageCommand({
      CollectionId: collectionName,
      Image: Buffer.isBuffer(data)
        ? {Bytes: data}
        : {S3Object: {Bucket: data.bucket, Name: data.key}},
    })
  )
}
