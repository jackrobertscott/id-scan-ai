import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export type MembershipType = StoreValueType<typeof MembershipDef>

export const MembershipDef = createStoreDef("mbr", "membership", {
  user_id: UserDef.schema.shape.id,
  venue_id: VenueDef.schema.shape.id,
  role: z.enum(["owner", "manager", "member"]),
})
