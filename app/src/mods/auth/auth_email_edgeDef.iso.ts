import {z} from "zod"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"

export const auth_email_edgeDef = createEdgeDefGroup("auth/email", {
  ping: {
    input: z.object({
      time: z.number(),
    }),
    output: z.object({
      timeAndOne: z.number(),
    }),
  },
})
