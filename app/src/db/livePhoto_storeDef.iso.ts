import {z} from "zod"
import {faceMetaSchema} from "../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {s3ImageSchema} from "../utils/s3SchemaUtils"
import {UserDef} from "./user_storeDef.iso"
import {VenueDef} from "./venue_storeDef.iso"

export type LivePhotoType = StoreValueType<typeof LivePhotoDef>

export const LivePhotoDef = createStoreDef({
  prefix: "lph",
  colname: "livePhoto",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    s3FullImage: s3ImageSchema(),
    s3FaceImage: s3ImageSchema(),
    faceMeta: faceMetaSchema(),
    awsFaceId: z.string().min(1),
  },
})
