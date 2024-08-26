import {z} from "zod"
import {faceMetaSchema} from "../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {s3ImageSchema} from "../utils/s3SchemaUtils"
import {shortStrSchema} from "../utils/zodSchema"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export type DocPhotoType = StoreValueType<typeof DocPhotoDef>

export const DocPhotoDef = createStoreDef("dph", "docPhoto", {
  venueId: VenueDef.schema.shape.id,
  createdByUserId: UserDef.schema.shape.id,
  s3FullImage: s3ImageSchema(),
  s3FaceImage: s3ImageSchema(),
  faceMeta: faceMetaSchema(),
  awsFaceId: shortStrSchema(),
  detectedText: z.string(),
})
