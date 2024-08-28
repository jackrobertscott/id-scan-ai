import {z} from "zod"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {strArr2Rec} from "../../utils/strArr2Rec"
import {enumStrSchema} from "../../utils/zodSchema"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"

export const MEMBER_PERMISSIONS_ARRAY = [
  "ALBUM_CREATE",
  "ALBUM_UPDATE",
  "ALBUM_DELETE",
  "DEVICE_CREATE",
  "DEVICE_UPDATE",
  "DEVICE_DELETE",
  "MEMBER_CREATE",
  "MEMBER_UPDATE",
  "MEMBER_DELETE",
  "STRIPE_CARD_CREATE",
  "STRIPE_CARD_UPDATE",
  "STRIPE_CARD_DELETE",
  "PDF_EXPORT_CREATE",
  "PDF_EXPORT_UPDATE",
  "PDF_EXPORT_DELETE",
  "TAG_CREATE",
  "TAG_UPDATE",
  "TAG_DELETE",
  "SCAN_SEARCH",
  "SCAN_CREATE",
  "SCAN_DELETE",
  "VENUE_UPDATE",
  "VENUE_DELETE",
] as const
export const MEMBER_PERMISSIONS_OBJ = strArr2Rec(MEMBER_PERMISSIONS_ARRAY)

export type MembershipType = StoreValueType<typeof MembershipDef>

export const MembershipDef = createStoreDef({
  prefix: "mbr",
  colname: "membership",
  indexes: ["id", "createdDate", "userId", "venueId"],
  schema: {
    userId: UserDef.schema.shape.id,
    venueId: VenueDef.schema.shape.id,
    fullAccess: z.boolean().nullish(),
    permissions: z.array(enumStrSchema(MEMBER_PERMISSIONS_ARRAY)),
  },
})
