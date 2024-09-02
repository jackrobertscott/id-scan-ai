import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {idSchema} from "../../utils/zodSchema"
import {UserDef} from "../user/user_storeDef.iso"
import {LogEventDef} from "./logEvent_storeDef.iso"

export const logEvt_byMbr_eDef = createEdgeGroupDef("logEvt_byMbr", {
  list: {
    input: listOptionsSchema().extend({
      userId: idSchema().nullish(),
    }),
    output: z.object({
      total: z.number(),
      loggedEvents: z.array(
        z.object({
          ...LogEventDef.schema.pick({
            id: true,
            table: true,
            category: true,
            desc: true,
            triggeredByUserId: true,
            createdDate: true,
          }).shape,
          triggeredByUser: UserDef.schema
            .pick({
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            })
            .optional(),
        })
      ),
    }),
  },

  get: {
    input: z.object({
      loggedEventId: idSchema(),
    }),
    output: z.object({
      loggedEvent: z.object({
        ...LogEventDef.schema.pick({
          id: true,
          table: true,
          dataId: true,
          category: true,
          desc: true,
          triggeredByUserId: true,
          createdDate: true,
        }).shape,
        triggeredByUser: UserDef.schema
          .pick({
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          })
          .optional(),
      }),
    }),
  },
})
