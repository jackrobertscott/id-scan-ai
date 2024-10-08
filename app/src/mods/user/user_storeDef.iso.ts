import {z} from "zod"
import {faceMetaSchema} from "../../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {s3ImageSchema} from "../../utils/s3SchemaUtils"
import {numberStringSchema} from "../../utils/zodSchema"

export const getUserFaceAuthSchema = () => {
  return z.object({
    s3FullImage: s3ImageSchema(),
    s3FaceImage: s3ImageSchema(),
    faceMeta: faceMetaSchema(),
    awsFaceId: z.string().min(1),
    passcode: numberStringSchema(6),
  })
}

export type UserType = StoreValueType<typeof UserDef>

export const UserDef = createStoreDef({
  prefix: "usr",
  colname: "user",
  indexes: ["id", "createdDate", "email"],
  schema: {
    isAdmin: z.boolean().nullish(),
    email: z.string().email(),
    firstName: z.string().min(1).nullish(),
    lastName: z.string().min(1).nullish(),
    verifFailedTimestamps: z.array(z.number()).nullish(),
    emailVerif: z
      .object({
        code: numberStringSchema(6),
        updatedDate: z.coerce.date(),
      })
      .nullish(),
    faceAuth: getUserFaceAuthSchema().nullish(),
  },
})

export type UserByAdminFormSchema = ReturnType<
  typeof getUserByAdminFormSchema
>["shape"]

export const getUserByAdminFormSchema = () =>
  UserDef.schema.pick({
    email: true,
    firstName: true,
    lastName: true,
  })
