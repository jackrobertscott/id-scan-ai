import {formatFullName} from "../../utils/formatStrings"
import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/authUtils"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {UserStore} from "../user/user_store"
import {member_eDef} from "./member_eDef.iso"
import {MemberStore} from "./member_store"
import {MEMBER_PERMISSIONS_OBJ, MemberType} from "./member_storeDef.iso"

export default createEdgeGroup(member_eDef, {
  create_byMember: async ({request, body: {userEmail, ...body}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.MEMBER_CREATE,
    ])

    // Get or create user by email
    const user = await UserStore.upsertOneByEmail(userEmail)

    // Create member
    const member = await MemberStore.createOne({
      ...body,
      venueId: auth.venue.id,
      userId: user.id,
      createdByUserId: auth.user.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.CREATE,
      table: LOG_EVENT_TABLES_OBJ.MEMBER,
      dataId: member.id,
    })

    return member
  },

  get_byMember: async ({request, body: {memberId}}) => {
    const auth = await ensureMemberOfVenue(request)

    // Ensure the member is from the user's venue
    const member = await MemberStore.getOne({
      id: memberId,
      venueId: auth.venue.id,
    })

    // Get the user of member
    const user = await UserStore.getOneById(member.userId)

    return {
      member: {
        ...member,
        userFullName: formatFullName(user),
        userEmail: user.email,
      },
    }
  },

  update_byMember: async ({request, body: {memberId, ...body}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.MEMBER_UPDATE,
    ])

    if (
      auth.member.id === memberId &&
      auth.member.fullAccess &&
      !body.fullAccess
    ) {
      throw new Error("Cannot remove full access from yourself")
    }

    // Ensure the member is from the user's venue
    await MemberStore.updateOne(
      {
        id: memberId,
        venueId: auth.venue.id,
      },
      {...body}
    )

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.UPDATE,
      table: LOG_EVENT_TABLES_OBJ.MEMBER,
      dataId: memberId,
    })
  },

  list_byMember: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request)

    const query = createListSearchQuery<MemberType>({
      ...body,
      searchKeys: ["permissions"],
      filter: {
        venueId: auth.venue.id, // ensure only from user's venue
      },
    })

    switch (body.fullAccess) {
      case "has":
        query.$and.push({fullAccess: true})
        break
      case "hasNot":
        query.$and.push({fullAccess: {$ne: true}})
        break
    }

    if (body.hasPermission) {
      query.$and.push({permissions: body.hasPermission})
    }

    const [total, members] = await Promise.all([
      MemberStore.count(query),
      MemberStore.getMany(query, createListOptions(body)),
    ])

    // Get all users for members
    const users = await UserStore.getMany({
      id: {$in: members.map((p) => p.userId)},
    })

    return {
      total,
      members: members.map((member) => {
        const user = users.find((u) => u.id === member.userId)
        return {
          ...member,
          userEmail: user ? user.email : "[email]",
          userFullName: user ? formatFullName(user) : "[name]",
        }
      }),
    }
  },

  delete_byMember: async ({request, body: {memberId}}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.MEMBER_DELETE,
    ])

    const fullAccessMemberCount = await MemberStore.count({
      id: {$ne: memberId},
      venueId: auth.venue.id,
      fullAccess: true,
    })
    if (fullAccessMemberCount <= 0) {
      throw new Error("You can not delete the last full access member")
    }

    // Ensure the member is from the user's venue
    await MemberStore.deleteOne({
      id: memberId,
      venueId: auth.venue.id,
    })

    LogEventStore.createOne({
      venueId: auth.venue.id,
      triggeredByUserId: auth.user.id,
      category: LOG_EVENT_CATEGORY_OBJ.DELETE,
      table: LOG_EVENT_TABLES_OBJ.MEMBER,
      dataId: memberId,
    })
  },
})
