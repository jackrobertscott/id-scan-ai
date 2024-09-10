import {srvConf} from "../../srvConf"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {upsertStripeCustomerOfVenue} from "../../utils/stripeCustomerUtils"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {ven_byMbr_eDef} from "./ven_byMbr_eDef.iso"
import {VenueStore} from "./venue_store"

export default createEdgeGroup(ven_byMbr_eDef, {
  get: async ({request}) => {
    const auth = await ensureMemberOfVenue(request)

    // const stripeCustomer = auth.venue.stripeCustomerId
    //   ? await stripeServer.customers.retrieve(auth.venue.stripeCustomerId)
    //   : undefined

    return {
      venue: auth.venue,
    }
  },

  update: async ({request, body: {...body}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.VENUE_UPDATE,
    ])

    const [venue] = await VenueStore.updateOneById(auth.venue.id, {
      ...body,
    })

    if (srvConf.STRIPE_ENABLED) {
      try {
        await upsertStripeCustomerOfVenue(venue)
      } catch (e) {
        console.error(e)
      }
    }

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: auth.venue.id,
    })
  },

  deleteCurrent: async ({request}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.VENUE_DELETE,
    ])

    await VenueStore.deleteOneById(auth.venue.id)

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: auth.venue.id,
    })
  },
})
