import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {shortStrSchema} from "../../utils/zodSchema"

export const payCard_eDef = createEdgeDefGroup("payCard", {
  create_byMember: {
    input: z.object({
      stripeToken: z.string(),
      nameOnCard: shortStrSchema(),
    }),
    output: z.object({
      id: z.string(),
    }),
  },

  get_byMember: {
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

  setDefault_byMember: {
    input: z.object({
      payCardId: z.string(),
    }),
  },

  list_byMember: {
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

  delete_byMember: {
    input: z.object({
      payCardId: z.string(),
    }),
  },
})
