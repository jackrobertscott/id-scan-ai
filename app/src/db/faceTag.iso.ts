import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {s3ImageSchema} from "../utils/s3SchemaUtils"
import {strArr2Rec} from "../utils/strArr2Rec"
import {shortStrSchema, zodRefineEnum} from "../utils/zodSchema"
import {AccountDef} from "./account.iso"
import {ScanDef} from "./scan.iso"
import {VenueDef} from "./venue.iso"

export const TAG_CATEGORIES_ARRAY = ["NOTE", "FIGHTING", "DRUGS"] as const
export const TAG_CATEGORIES_OBJ = strArr2Rec(TAG_CATEGORIES_ARRAY)

export const TAG_TIME_LENGTH_UNITS_ARRAY = ["WEEK", "MONTH", "YEAR"] as const
export const TAG_TIME_LENGTH_UNITS_OBJ = strArr2Rec(TAG_TIME_LENGTH_UNITS_ARRAY)

export type FaceTagType = StoreValueType<typeof FaceTagDef>

export const FaceTagDef = createStoreDef("ftg", "faceTag", {
  venueId: VenueDef.schema.shape.id,
  createdByAccId: AccountDef.schema.shape.id,
  scanId: ScanDef.schema.shape.id,
  awsFaceIds: z.array(z.string().min(1)),
  s3FaceImages: z.array(s3ImageSchema()),
  category: shortStrSchema().refine(...zodRefineEnum(TAG_CATEGORIES_ARRAY)), // NOTE, VIOLENCE, VANDALISM, OTHER
  desc: z.string().min(1).max(1000),
  expiry: z.object({
    timeUnit: shortStrSchema().refine(
      ...zodRefineEnum(TAG_TIME_LENGTH_UNITS_ARRAY)
    ),
    timeAmount: z.number().int().gt(0).lt(100),
    date: z.coerce.date(),
  }),
})
