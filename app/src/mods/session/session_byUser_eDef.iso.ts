import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {SessionDef} from "./session_storeDef.iso"

export const session_byUser_eDef = createEdgeGroupDef("session_byUser", {
  get: {
    input: z.object({
      sessionId: SessionDef.schema.shape.id,
    }),
    output: z.object({
      session: SessionDef.schema,
    }),
  },

  deactivate: {
    input: z.object({
      sessionId: SessionDef.schema.shape.id,
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      sessions: z.array(
        SessionDef.schema.pick({
          id: true,
          userAgent: true,
          endedDate: true,
          createdDate: true,
        })
      ),
    }),
  },
})
