import {srvConf} from "../../srvConf"
import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {upsertStripeCustomerOfVenue} from "../../utils/stripeCustomerUtils"
import {createAuthToken, ensureUser} from "../auth/auth_jwt"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MemberStore} from "../member/member_store"
import {ven_byUsr_eDef} from "./ven_byUsr_eDef.iso"
import {VenueStore} from "./venue_store"
import {VenueType} from "./venue_storeDef.iso"

export default createEdgeGroup(ven_byUsr_eDef, {
  setCurrent: async ({request, body}) => {
    const auth = await ensureUser(request)

    // Ensure the user has a valid member to the venue
    const venue = await VenueStore.getOneById(body.venueId)
    const member = await MemberStore.getOne({
      userId: auth.user.id,
      venueId: venue.id,
    })

    // Update the current token with the new venueId
    const payload = await createAuthToken({
      ...auth,
      venue,
      member,
    })

    return {payload}
  },

  create: async ({request, body}) => {
    const auth = await ensureUser(request)

    const venue = await VenueStore.createOne({
      ...body,
      createdByUserId: auth.user.id,
    })

    if (srvConf.STRIPE_ENABLED) {
      try {
        // Create the stripe customer
        await upsertStripeCustomerOfVenue(venue)
      } catch (e) {
        await VenueStore.deleteOneById(venue.id)
        throw e
      }
    }

    // The user is the owner so give full access
    await MemberStore.createOne({
      userId: auth.user.id,
      venueId: venue.id,
      createdByUserId: auth.user.id,
      fullAccess: true,
      permissions: [],
    })

    LogEventStore.createOne({
      venueId: venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: venue.id,
    })

    return venue
  },

  list: async ({request, body}) => {
    const auth = await ensureUser(request)

    // Get all members for the current user
    const members = await MemberStore.getMany({
      userId: auth.user.id,
    })

    // Return only the venues that the user has access to
    const query = createListSearchQuery<VenueType>({
      ...body,
      searchKeys: ["name"],
      filter: {
        id: {$in: members.map((p) => p.venueId)},
      },
    })

    const [total, venues] = await Promise.all([
      VenueStore.count(query),
      VenueStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      venues,
    }
  },
})
