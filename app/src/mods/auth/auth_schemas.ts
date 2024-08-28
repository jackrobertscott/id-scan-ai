import {z} from "zod"
import {DeviceDef} from "../device/device_storeDef.iso"
import {MembershipDef} from "../membership/membership_storeDef.iso"
import {SessionDef} from "../session/session_storeDef.iso"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"

export type AuthDataType = z.infer<typeof AuthDataSchema>

export const AuthDataSchema = z.object({
  userId: UserDef.schema.shape.id,
  sessionId: SessionDef.schema.shape.id,
  venueId: VenueDef.schema.shape.id.nullish(),
  deviceId: DeviceDef.schema.shape.id.nullish(),

  // public data
  isAdmin: UserDef.schema.shape.isAdmin,
  sessionCreatedDate: SessionDef.schema.shape.createdDate,
  fullAccess: MembershipDef.schema.shape.fullAccess.nullish(),
  permissions: MembershipDef.schema.shape.permissions.nullish(),
})
