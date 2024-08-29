import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {idSchema} from "../../utils/zodSchema"
import {DeviceDef, getDeviceByMemberFormSchema} from "./device_storeDef.iso"

export const device_eDef = createEdgeDefGroup("device", {
  create_byMember: {
    input: getDeviceByMemberFormSchema(),
    output: DeviceDef.schema.pick({
      id: true,
    }),
  },

  get_byMember: {
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

  update_byMember: {
    input: z.object({
      deviceId: idSchema(),
      ...getDeviceByMemberFormSchema().shape,
    }),
  },

  list_byMember: {
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

  delete_byMember: {
    input: z.object({
      deviceId: idSchema(),
    }),
  },
})
