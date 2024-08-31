import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {AuthDataSchema} from "./auth_schemas"

export const auth_current_eDef = createEdgeGroupDef("auth_current", {
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
})
