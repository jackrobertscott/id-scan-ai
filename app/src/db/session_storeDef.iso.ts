import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {DeviceDef} from "./device_storeDef.iso"
import {UserDef} from "./user_storeDef.iso"

export type SessionType = StoreValueType<typeof SessionDef>

export const SessionDef = createStoreDef({
  prefix: "ssn",
  colname: "Session",
  indexes: ["id", "createdDate", "userId"],
  schema: {
    userId: UserDef.schema.shape.id,
    deviceId: DeviceDef.schema.shape.id.nullish(),
    endedDate: z.coerce.date().nullish(),
    userAgent: z.string().nullish(),
    browser: z.string().nullish(),
    browserVersion: z.string().nullish(),
    os: z.string().nullish(),
    osVersion: z.string().nullish(),
    device: z.string().nullish(),
    deviceModel: z.string().nullish(),
    cpuArchitecture: z.string().nullish(),
    engine: z.string().nullish(),
    engineVersion: z.string().nullish(),
  },
})
