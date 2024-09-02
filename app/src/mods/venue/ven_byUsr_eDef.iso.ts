import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {AuthDataSchema} from "../auth/auth_schemas"
import {VenueDef} from "./venue_storeDef.iso"

export const ven_byUsr_eDef = createEdgeGroupDef("ven_byUser", {
  create: {
    input: z.object({
      ...VenueDef.schema.pick({
        name: true,
      }).shape,
    }),
    output: VenueDef.schema.pick({
      id: true,
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      venues: z.array(
        VenueDef.schema.pick({
          id: true,
          name: true,
          createdDate: true,
        })
      ),
    }),
  },

  setCurrent: {
    input: z.object({
      venueId: VenueDef.schema.shape.id,
    }),
    output: z.object({
      payload: z.object({
        token: z.string().min(1),
        data: AuthDataSchema,
      }),
    }),
  },
})
