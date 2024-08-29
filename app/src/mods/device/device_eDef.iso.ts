import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {idSchema} from "../../utils/zodSchema"
import {DeviceDef, getDeviceByMemberFormSchema} from "./device_storeDef.iso"

export const device_eDef = createEdgeDefGroup("device", {
  createByMember: {
    input: getDeviceByMemberFormSchema(),
    output: DeviceDef.schema.pick({
      id: true,
    }),
  },

  getDeviceByMember: {
    input: z.object({
      deviceId: idSchema(),
    }),
    output: z.object({
      device: z.object({
        ...DeviceDef.schema.pick({
          deviceKey: true,
          createdDate: true,
        }).shape,
        ...getDeviceByMemberFormSchema().shape,
      }),
    }),
  },

  updateDeviceByMember: {
    input: z.object({
      deviceId: idSchema(),
      ...getDeviceByMemberFormSchema().shape,
    }),
  },

  listDeviceByMember: {
    input: listOptionsSchema().extend({
      status: z.string().nullish(),
    }),
    output: z.object({
      total: z.number(),
      devices: z.array(
        DeviceDef.schema.pick({
          id: true,
          name: true,
          desc: true,
          createdDate: true,
        })
      ),
    }),
  },

  deleteDeviceByMember: {
    input: z.object({
      deviceId: idSchema(),
    }),
  },
})
