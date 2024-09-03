import {createEdgeGroup} from "../../utils/server/createEdge"
import {getStripeCustomerOfVenue} from "../../utils/stripeCustomerUtils"
import {stripeServer} from "../../utils/stripeServer"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {inv_byMbr_eDef} from "./inv_byMbr_eDef.iso"

export default createEdgeGroup(inv_byMbr_eDef, {
  get: async ({request, body: {invoiceId}}) => {
    const auth = await ensureMemberOfVenue(request)

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const invoice = await stripeServer.invoices.retrieve(invoiceId)

    if (invoice.customer !== stripeCustomer.id) {
      throw new Error("Invoice does not belong to this customer")
    }

    return {
      invoice: {
        id: invoice.id,
        createdDate: new Date(invoice.created * 1000),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        status: invoice.status,
        customerEmail: invoice.customer_email,
        customerName: invoice.customer_name,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        amountRemaining: invoice.amount_remaining,
        currency: invoice.currency,
        description: invoice.description,
        invoicePdf: invoice.invoice_pdf,
      },
    }
  },

  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const invoices = await stripeServer.invoices.list({
      customer: stripeCustomer.id,
    })

    return {
      invoices: invoices.data.map((invoice) => ({
        id: invoice.id,
        createdDate: new Date(invoice.created * 1000),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        status: invoice.status,
        customerEmail: invoice.customer_email,
        customerName: invoice.customer_name,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        amountRemaining: invoice.amount_remaining,
        currency: invoice.currency,
        description: invoice.description,
        invoicePdf: invoice.invoice_pdf,
      })),
    }
  },
})
