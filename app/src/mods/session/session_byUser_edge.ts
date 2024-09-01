import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureUser} from "../auth/auth_jwt"
import {session_byUser_eDef} from "./session_byUser_eDef.iso"
import {SessionStore} from "./session_store"
import {SessionType} from "./session_storeDef.iso"

export default createEdgeGroup(session_byUser_eDef, {
  get: async ({request, body: {sessionId}}) => {
    const auth = await ensureUser(request)

    // Ensure the album is from the user's venue
    const session = await SessionStore.getOne({
      id: sessionId,
      userId: auth.user.id,
    })

    return {session}
  },

  deactivate: async ({request, body: {sessionId}}) => {
    const auth = await ensureUser(request)

    // Ensure the album is from the user's venue
    await SessionStore.updateOne(
      {
        id: sessionId,
        userId: auth.user.id,
      },
      {
        endedDate: new Date(),
      }
    )
  },

  list: async ({request, body}) => {
    const auth = await ensureUser(request)

    const query = createListSearchQuery<SessionType>({
      ...body,
      searchKeys: ["userAgent"],
      filter: {
        userId: auth.user.id, // ensure only from user
      },
    })

    const [total, sessions] = await Promise.all([
      SessionStore.count(query),
      SessionStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      sessions,
    }
  },
})
