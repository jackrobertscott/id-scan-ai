import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureAdmin} from "../auth/authUtils"
import {user_byAdmin_eDef} from "./user_byAdmin_eDef.iso"
import {UserStore} from "./user_store"
import {UserType} from "./user_storeDef.iso"

export default createEdgeGroup(user_byAdmin_eDef, {
  create: async ({request, body}) => {
    await ensureAdmin(request)

    const user = await UserStore.safeCreateOne({
      ...body,
      emailVerif: UserStore.createVerification(),
    })

    return user
  },

  get: async ({request, body: {userId}}) => {
    await ensureAdmin(request)
    const user = await UserStore.getOneById(userId)
    return {user}
  },

  update: async ({request, body: {userId, ...body}}) => {
    await ensureAdmin(request)

    await UserStore.updateOneById(userId, {
      ...body,
    })
  },

  list: async ({request, body}) => {
    await ensureAdmin(request)

    const query = createListSearchQuery<UserType>({
      ...body,
      searchKeys: ["firstName", "lastName", "email"],
    })

    const [total, users] = await Promise.all([
      UserStore.count(query),
      UserStore.getMany(query, createListOptions(body)),
    ])

    return {
      total,
      users,
    }
  },

  delete: async ({request, body: {userId}}) => {
    await ensureAdmin(request)

    await UserStore.deleteOneById(userId)
  },
})
