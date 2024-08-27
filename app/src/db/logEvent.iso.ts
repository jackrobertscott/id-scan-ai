import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {strArr2Rec} from "../utils/strArr2Rec"
import {enumStrSchema, idSchema} from "../utils/zodSchema"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export const LOGGED_EVENT_CATEGORY_ARRAY = [
  "AUTH",
  "CREATE",
  "UPDATE",
  "DELETE",
  "OTHER", // try to avoid using other
] as const
export const LOGGED_EVENT_CATEGORY_OBJ = strArr2Rec(LOGGED_EVENT_CATEGORY_ARRAY)

export const LOGGED_EVENT_TABLE_ARRAY = [
  "ALBUM",
  "DEVICE",
  "DOC_PHOTO",
  "FACE_TAG",
  "LIVE_PHOTO",
  "MEMBERSHIP",
  "PDF_EXPORT",
  "SCAN",
  "SESSION",
  "USER",
  "VENUE",
  "STRIPE_CARD",
  "OTHER", // try to avoid using other
] as const
export const LOGGED_EVENT_MODELS_OBJ = strArr2Rec(LOGGED_EVENT_TABLE_ARRAY)

export type LogEventType = StoreValueType<typeof LogEventDef>

export const LogEventDef = createStoreDef({
  prefix: "lev",
  colname: "logEvent",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    byAdmin: z.boolean().nullish(),
    category: enumStrSchema(LOGGED_EVENT_CATEGORY_ARRAY),
    table: enumStrSchema(LOGGED_EVENT_TABLE_ARRAY),
    dataId: idSchema().nullish(), // id of model effected
    description: z.string().min(1).nullish(),
    meta: z.record(z.unknown()).nullish(),
  },
})
