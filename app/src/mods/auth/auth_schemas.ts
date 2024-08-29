import {z} from "zod"
import {DeviceDef} from "../device/device_storeDef.iso"
import {MemberDef} from "../member/member_storeDef.iso"
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
  fullAccess: MemberDef.schema.shape.fullAccess.nullish(),
  permissions: MemberDef.schema.shape.permissions.nullish(),
})
