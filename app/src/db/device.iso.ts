import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {shortStrSchema} from "../utils/zodSchema"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export type DeviceType = StoreValueType<typeof DeviceDef>

export const DeviceDef = createStoreDef("dvc", "device", {
  venueId: VenueDef.schema.shape.id,
  createdByUserId: UserDef.schema.shape.id,
  name: shortStrSchema(),
  desc: z.string().max(1000).nullish(),
  isActive: z.boolean().nullish(),
  deviceKey: shortStrSchema(),
})
