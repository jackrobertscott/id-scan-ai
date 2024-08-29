import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {idSchema} from "../../utils/zodSchema"
import {DeviceDef, getDeviceByMemberFormSchema} from "./device_storeDef.iso"

export const device_byMember_eDef = createEdgeGroupDef("device_byMember", {
  create: {
    input: getDeviceByMemberFormSchema(),
    output: DeviceDef.schema.pick({
      id: true,
    }),
  },

  get: {
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

  update: {
    input: z.object({
      deviceId: idSchema(),
      ...getDeviceByMemberFormSchema().shape,
    }),
  },

  list: {
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

  delete: {
    input: z.object({
      deviceId: idSchema(),
    }),
  },
})
