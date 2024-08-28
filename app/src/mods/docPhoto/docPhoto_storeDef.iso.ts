import {z} from "zod"
import {faceMetaSchema} from "../../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {s3ImageSchema} from "../../utils/s3SchemaUtils"
import {shortStrSchema} from "../../utils/zodSchema"
import {VenueDef} from "../venue/venue_storeDef.iso"
import {UserDef} from "../user/user_storeDef.iso"

export type DocPhotoType = StoreValueType<typeof DocPhotoDef>

export const DocPhotoDef = createStoreDef({
  prefix: "dph",
  colname: "docPhoto",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    s3FullImage: s3ImageSchema(),
    s3FaceImage: s3ImageSchema(),
    faceMeta: faceMetaSchema(),
    awsFaceId: shortStrSchema(),
    detectedText: z.string(),
  },
})
