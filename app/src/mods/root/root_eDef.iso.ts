import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"

export const root_eDef = createEdgeGroupDef("root", {
  ping: {
    input: z.object({
      time: z.number(),
    }),
    output: z.object({
      timeAndOne: z.number(),
    }),
  },
})
