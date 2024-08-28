import { z } from "zod"
import { StoreValueType, createStoreDef } from "../../utils/mongo/baseStore"
import { shortStrSchema } from "../../utils/zodSchema"
import { UserDef } from "../user/user_storeDef.iso"
import { VenueDef } from "../venue/venue_storeDef.iso"

export type DeviceType = StoreValueType<typeof DeviceDef>

export const DeviceDef = createStoreDef({
  prefix: "dvc",
  colname: "device",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    name: shortStrSchema(),
    desc: z.string().max(1000).nullish(),
    isActive: z.boolean().nullish(),
    deviceKey: shortStrSchema(),
  },
})
