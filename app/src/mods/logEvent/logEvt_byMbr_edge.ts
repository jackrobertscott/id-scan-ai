import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {UserStore} from "../user/user_store"
import {LogEventStore} from "./logEvent_store"
import {LogEventType} from "./logEvent_storeDef.iso"
import {logEvt_byMbr_eDef} from "./logEvt_byMbr_eDef.iso"

export default createEdgeGroup(logEvt_byMbr_eDef, {
  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const query = createListSearchQuery<LogEventType>({
      ...body,
      searchKeys: ["desc"],
      filter: {
        venueId: auth.venue.id, // ensure only from user's venue
      },
    })

    if (body.userId) {
      query.$and.push({triggeredByUserId: body.userId})
    }

    const [total, loggedEvents] = await Promise.all([
      LogEventStore.count(query),
      LogEventStore.getMany(query, createListOptions(body)),
    ])

    const userIds = loggedEvents.map((loggedEvent) => {
      return loggedEvent.triggeredByUserId
    })
    const users = await UserStore.getMany({id: {$in: userIds}})

    return {
      total,
      loggedEvents: loggedEvents.map((loggedEvent) => {
        const triggeredByUser = users.find((user) => {
          return user.id === loggedEvent.triggeredByUserId
        })
        return {
          ...loggedEvent,
          triggeredByUser,
        }
      }),
    }
  },

  get: async ({request, body: {loggedEventId}}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the loggedEvent is from the user's venue
    const loggedEvent = await LogEventStore.getOne({
      id: loggedEventId,
      venueId: auth.venue.id,
    })

    const triggeredByUser = await UserStore.getOne({
      id: loggedEvent.triggeredByUserId,
    })

    return {
      loggedEvent: {
        ...loggedEvent,
        triggeredByUser,
      },
    }
  },
})
