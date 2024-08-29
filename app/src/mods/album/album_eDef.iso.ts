import {z} from "zod"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"

export const album_eDef = createEdgeDefGroup("album", {
  example: {
    input: z.object({
      hello: z.string().min(1),
    }),
  },
})
