import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {shortStrSchema} from "../../utils/zodSchema"

export const payCard_byMember_eDef = createEdgeGroupDef("payCard", {
  create: {
    input: z.object({
      stripeToken: z.string(),
      nameOnCard: shortStrSchema(),
    }),
    output: z.object({
      id: z.string(),
    }),
  },

  get: {
    input: z.object({
      payCardId: z.string(),
    }),
    output: z.object({
      payCard: z.object({
        id: z.string(),
        brand: z.string(),
        last4: z.string(),
        expMonth: z.number(),
        expYear: z.number(),
        isDefault: z.boolean(),
      }),
    }),
  },

  setDefault: {
    input: z.object({
      payCardId: z.string(),
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      payCards: z.array(
        z.object({
          id: z.string(),
          brand: z.string(),
          last4: z.string(),
          expMonth: z.number(),
          expYear: z.number(),
          isDefault: z.boolean(),
        })
      ),
    }),
  },

  delete: {
    input: z.object({
      payCardId: z.string(),
    }),
  },
})
