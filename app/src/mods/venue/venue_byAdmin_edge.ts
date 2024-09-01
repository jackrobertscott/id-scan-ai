import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {upsertStripeCustomerOfVenue} from "../../utils/stripeCustomerUtils"
import {ensureAdmin} from "../auth/auth_jwt"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MemberStore} from "../member/member_store"
import {UserStore} from "../user/user_store"
import {venue_byAdmin_eDef} from "./venue_byAdmin_eDef.iso"
import {VenueStore} from "./venue_store"
import {VenueType} from "./venue_storeDef.iso"

export default createEdgeGroup(venue_byAdmin_eDef, {
  create: async ({request, body: {ownerUserId, ...body}}) => {
    const auth = await ensureAdmin(request)

    const [ownerUser, venue] = await Promise.all([
      UserStore.getOneById(ownerUserId),
      VenueStore.createOne({
        ...body,
        createdByUserId: auth.user.id,
      }),
    ])

    await MemberStore.createOne({
      userId: ownerUser.id,
      venueId: venue.id,
      createdByUserId: auth.user.id,
      fullAccess: true,
      permissions: [],
    })

    LogEventStore.createOne({
      byAdmin: true,
      venueId: venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: venue.id,
    })

    return venue
  },

  get: async ({request, body: {venueId}}) => {
    await ensureAdmin(request)

    const venue = await VenueStore.getOneById(venueId)

    return {venue}
  },

  update: async ({request, body: {venueId, ...body}}) => {
    const auth = await ensureAdmin(request)

    const [venue] = await VenueStore.updateOneById(venueId, {
      ...body,
    })

    await upsertStripeCustomerOfVenue(venue)

    LogEventStore.createOne({
      byAdmin: true,
      venueId,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: venueId,
    })
  },

  list: async ({request, body}) => {
    await ensureAdmin(request)

    const query = createListSearchQuery<VenueType>({
      ...body,
      searchKeys: ["name"], // "address.line1", "address.line2", "address.suburb"],
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

  delete: async ({request, body: {venueId}}) => {
    const auth = await ensureAdmin(request)

    await VenueStore.deleteOneById(venueId)

    LogEventStore.createOne({
      venueId,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.VENUE,
      dataId: venueId,
    })
  },
})
