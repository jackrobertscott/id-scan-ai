import {z} from "zod"

export const getDeviceAuthSchema = () =>
  z.object({
    deviceId: z.string().min(1),
    name: z.string().min(1),
  })

export type DeviceAuthType = z.infer<ReturnType<typeof getDeviceAuthSchema>>
