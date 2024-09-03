import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {numberStringSchema} from "../../utils/zodSchema"
import {DeviceDef} from "../device/device_storeDef.iso"
import {getDeviceAuthSchema} from "./auth_device.iso"
import {AuthDataSchema} from "./auth_schemas"

export const auth_eDef = createEdgeGroupDef("auth", {
  get: {
    output: z.object({
      payload: z.optional(
        z.object({
          token: z.string().min(1),
          data: AuthDataSchema,
        })
      ),
    }),
  },

  logout: {
    // empty
  },

  sendAuthCode: {
    input: z.object({
      email: z.string().email(),
    }),
    output: z.object({
      email: z.string().email(),
    }),
  },

  verifyAuthCode: {
    input: z.object({
      email: z.string().email(),
      authCode: z.string().min(1),
      userAgent: z.string().nullish(),
    }),
    output: z.object({
      payload: z.object({
        token: z.string().min(1),
        data: AuthDataSchema,
      }),
    }),
  },

  deviceLogin: {
    input: DeviceDef.schema.pick({
      deviceKey: true,
    }),
    output: z.object({
      token: z.string().min(1),
      payload: getDeviceAuthSchema(),
    }),
  },

  deviceFaceLogin: {
    input: z.object({
      deviceToken: z.string().min(1),
      userAgent: z.string().nullish(),
      photoFile: z.any(),
      passcode: numberStringSchema(6),
    }),
    output: z.object({
      payload: z.object({
        token: z.string().min(1),
        data: AuthDataSchema,
      }),
    }),
  },
})
