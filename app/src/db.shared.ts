import {z} from "zod"
import {createStoreDef, StoreValueType} from "./utils/mongo/baseStore"

export type AccountType = StoreValueType<typeof AccountDef>
export const AccountDef = createStoreDef("acc", "account", {
  is_admin: z.boolean().nullish(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
})

export type VenueType = StoreValueType<typeof VenueDef>
export const VenueDef = createStoreDef("ven", "venue", {
  name: z.string().min(1),
})

export type MembershipType = StoreValueType<typeof MembershipDef>
export const MembershipDef = createStoreDef("mbr", "membership", {
  account_id: AccountDef.schema.shape.id,
  venue_id: VenueDef.schema.shape.id,
  role: z.enum(["owner", "manager", "member"]),
})
