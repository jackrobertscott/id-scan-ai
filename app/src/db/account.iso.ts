import {z} from "zod"
import {faceMetaSchema} from "../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {s3ImageSchema} from "../utils/s3SchemaUtils"
import {numberStringSchema} from "../utils/zodSchema"

export type AccountType = StoreValueType<typeof AccountDef>

export const AccountDef = createStoreDef("acc", "account", {
  isAdmin: z.boolean().nullish(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  emailVerif: z
    .object({
      code: numberStringSchema(6),
      updatedDate: z.coerce.date(),
    })
    .nullish(),
  faceAuth: z
    .object({
      s3FullImage: s3ImageSchema(),
      s3FaceImage: s3ImageSchema(),
      faceMeta: faceMetaSchema(),
      awsFaceId: z.string().min(1),
      passcode: numberStringSchema(6),
    })
    .nullish(),
})
