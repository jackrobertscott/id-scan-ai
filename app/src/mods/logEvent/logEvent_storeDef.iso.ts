import {z} from "zod"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {strArr2Rec} from "../../utils/strArr2Rec"
import {enumStrSchema, idSchema} from "../../utils/zodSchema"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"

export const LOG_EVENT_CATEGORY_ARRAY = [
  "AUTH",
  "CREATE",
  "UPDATE",
  "DELETE",
  "OTHER", // try to avoid using other
] as const
export const LOG_EVENT_CATEGORY_OBJ = strArr2Rec(LOG_EVENT_CATEGORY_ARRAY)

export const LOG_EVENT_TABLE_ARRAY = [
  "ALBUM",
  "DEVICE",
  "DOC_PHOTO",
  "FACE_TAG",
  "LIVE_PHOTO",
  "MEMBER",
  "PDF_EXPORT",
  "SCAN",
  "SESSION",
  "USER",
  "VENUE",
  "STRIPE_CARD",
  "OTHER", // try to avoid using other
] as const
export const LOG_EVENT_TABLES_OBJ = strArr2Rec(LOG_EVENT_TABLE_ARRAY)

export type LogEventType = StoreValueType<typeof LogEventDef>

export const LogEventDef = createStoreDef({
  prefix: "lev",
  colname: "logEvent",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    triggeredByUserId: UserDef.schema.shape.id,
    byAdmin: z.boolean().nullish(),
    category: enumStrSchema(LOG_EVENT_CATEGORY_ARRAY),
    table: enumStrSchema(LOG_EVENT_TABLE_ARRAY),
    dataId: idSchema().nullish(), // id of model effected
    description: z.string().min(1).nullish(),
    meta: z.record(z.unknown()).nullish(),
  },
})
