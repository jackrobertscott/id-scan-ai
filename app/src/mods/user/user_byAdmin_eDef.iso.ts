import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {UserDef, getUserByAdminFormSchema} from "./user_storeDef.iso"

export const user_byAdmin_eDef = createEdgeGroupDef("user_byAdmin", {
  create: {
    input: UserDef.schema.pick({
      email: true,
      firstName: true,
      lastName: true,
    }),
    output: UserDef.schema.pick({
      id: true,
    }),
  },

  get: {
    input: z.object({
      userId: UserDef.schema.shape.id,
    }),
    output: z.object({
      user: z.object({
        ...UserDef.schema.pick({createdDate: true}).shape,
        ...getUserByAdminFormSchema().shape,
      }),
    }),
  },

  update: {
    input: z.object({
      userId: UserDef.schema.shape.id,
      ...getUserByAdminFormSchema().shape,
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      users: z.array(
        UserDef.schema.pick({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdDate: true,
        })
      ),
    }),
  },

  delete: {
    input: z.object({
      userId: UserDef.schema.shape.id,
    }),
  },
})
