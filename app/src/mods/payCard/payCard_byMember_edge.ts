import Stripe from "stripe"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {getStripeCustomerOfVenue} from "../../utils/stripeCustomerUtils"
import {stripeServer} from "../../utils/stripeServer"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {payCard_byMember_eDef} from "./payCard_byMember_eDef.iso"

export default createEdgeGroup(payCard_byMember_eDef, {
  create: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.STRIPE_CARD_CREATE,
    ])

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const payCard = await stripeServer.customers.createSource(
      stripeCustomer.id,
      {source: body.stripeToken}
    )

    stripeServer.customers.updateSource(stripeCustomer.id, payCard.id, {
      name: body.nameOnCard,
    })

    await LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.STRIPE_CARD,
      meta: {stripeCardId: payCard.id},
    })

    return {
      id: payCard.id,
    }
  },

  get: async ({request, body: {payCardId}}) => {
    const auth = await ensureMemberOfVenue(request)

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const card = (await stripeServer.customers.retrieveSource(
      stripeCustomer.id,
      payCardId
    )) as Stripe.Card

    return {
      payCard: {
        id: card.id,
        brand: card.brand,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        isDefault: card.id === stripeCustomer.default_source,
      },
    }
  },

  setDefault: async ({request, body: {payCardId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.STRIPE_CARD_UPDATE,
    ])

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const card = (await stripeServer.customers.retrieveSource(
      stripeCustomer.id,
      payCardId
    )) as Stripe.Card

    await stripeServer.customers.update(stripeCustomer.id, {
      default_source: card.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.STRIPE_CARD,
      meta: {stripeCardId: card.id},
      description: "Set as default",
    })
  },

  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    // const query = createListSearchQuery<PayCardSchema>({
    //   ...body,
    //   // keys: [],
    //   filter: {
    //     venueId: auth.venue.id, // ensure only from user's venue
    //   },
    // })
    // const [total, payCards] = await Promise.all([
    //   payCardStore.count(query),
    //   payCardStore.getMany(query, createListOptions(body)),
    // ])

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const cards = (await stripeServer.customers.listSources(stripeCustomer.id, {
      object: "card",
    })) as Stripe.Response<Stripe.ApiList<Stripe.Card>>

    const payCards = cards.data.map((card) => ({
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      expMonth: card.exp_month,
      expYear: card.exp_year,
      isDefault: card.id === stripeCustomer.default_source,
    }))

    return {
      payCards,
    }
  },

  delete: async ({request, body: {payCardId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.STRIPE_CARD_DELETE,
    ])

    const stripeCustomer = await getStripeCustomerOfVenue(auth.venue)

    const deletedCard = (await stripeServer.customers.deleteSource(
      stripeCustomer.id,
      payCardId
    )) as Stripe.DeletedCard

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.STRIPE_CARD,
      meta: {stripeCardId: deletedCard.id},
    })
  },
})
