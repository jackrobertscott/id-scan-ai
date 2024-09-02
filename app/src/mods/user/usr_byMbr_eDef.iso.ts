import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {UserDef} from "./user_storeDef.iso"

export const usr_byMbr_eDef = createEdgeGroupDef("usr_byMbr", {
  select: {
    input: z.object({
      search: z.string().nullish(),
      selectedUserId: UserDef.schema.shape.id.nullish(),
    }),
    output: z.object({
      selectedUser: z.optional(
        UserDef.schema.pick({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdDate: true,
        })
      ),
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
})
