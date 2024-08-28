import {z} from "zod"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"

export const root_eDef = createEdgeDefGroup("root", {
  ping: {
    input: z.object({
      time: z.number(),
    }),
    output: z.object({
      timeAndOne: z.number(),
    }),
  },
})
