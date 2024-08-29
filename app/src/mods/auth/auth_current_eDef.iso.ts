import {z} from "zod"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {AuthDataSchema} from "./auth_schemas"

export const auth_current_eDef = createEdgeDefGroup("auth_current", {
  getCurrent: {
    output: z.object({
      payload: z.optional(
        z.object({
          token: z.string().min(1),
          data: AuthDataSchema,
        })
      ),
    }),
  },

  logoutCurrent: {
    // empty
  },
})
