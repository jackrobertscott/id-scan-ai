import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"

export const inv_byMbr_eDef = createEdgeGroupDef("inv_byMbr", {
  get: {
    input: z.object({
      invoiceId: z.string(),
    }),
    output: z.object({
      invoice: z.object({
        id: z.string().min(1),
        createdDate: z.coerce.date(),
        dueDate: z.coerce.date().nullable(),
        status: z.string().nullable(),
        customerEmail: z.string().email().nullable(),
        customerName: z.string().nullable(),
        amountDue: z.number(),
        amountPaid: z.number(),
        amountRemaining: z.number(),
        currency: z.string(),
        description: z.string().nullable(),
        invoicePdf: z.string().url().nullish(),
      }),
    }),
  },

  list: {
    output: z.object({
      invoices: z.array(
        z.object({
          id: z.string().min(1),
          createdDate: z.coerce.date(),
          dueDate: z.coerce.date().nullable(),
          status: z.string().nullable(),
          customerEmail: z.string().email().nullable(),
          customerName: z.string().nullable(),
          amountDue: z.number(),
          amountPaid: z.number(),
          amountRemaining: z.number(),
          currency: z.string(),
          description: z.string().nullable(),
          invoicePdf: z.string().url().nullish(),
        })
      ),
    }),
  },
})
