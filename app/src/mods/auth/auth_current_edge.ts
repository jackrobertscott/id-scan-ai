import {createEdgeGroup} from "../../utils/server/createEdge"
import {InvalidAuthLogoutError} from "../../utils/server/errorClasses"
import {MemberStore} from "../member/member_store"
import {MemberType} from "../member/member_storeDef.iso"
import {SessionStore} from "../session/session_store"
import {VenueStore} from "../venue/venue_store"
import {VenueType} from "../venue/venue_storeDef.iso"
import {auth_current_eDef} from "./auth_current_eDef.iso"
import {createAuthToken, ensureUser} from "./auth_jwt"

export default createEdgeGroup(auth_current_eDef, {
  /**
   * Get the current user's auth payload.
   */
  get: async ({request}) => {
    const auth = await ensureUser(request, {isDeviceEnabled: true})

    let venue: VenueType | undefined | null
    let member: MemberType | undefined | null
    if (auth.venueId) {
      // Ensure the user has a valid member to the venue
      try {
        venue = await VenueStore.getOneById(auth.venueId)
        member = await MemberStore.maybeOne({
          userId: auth.user.id,
          venueId: venue.id,
        })
      } catch (e) {
        if (e instanceof Error) throw new InvalidAuthLogoutError(e.message)
      }
    } else {
      // If the auth has no venue, get the first venue they have a member to
      const members = await MemberStore.getMany({userId: auth.user.id})
      const memberIds = members.map((p) => p.venueId)
      venue = await VenueStore.maybeOne({id: {$in: memberIds}})
      member = members.find((p) => p.venueId === venue?.id)
      if (venue && !member) throw new Error("Failed to find member")
    }

    // Update the current token with the new venueId
    const payload = await createAuthToken({
      ...auth,
      venue,
      member,
    })

    return {payload}
  },

  /**
   * Logout the current user.
   */
  logout: async ({request}) => {
    const auth = await ensureUser(request, {isDeviceEnabled: true})

    // Deactivate the session to prevent future requests
    await SessionStore.updateOneById(auth.session.id, {
      endedDate: new Date(),
    })
  },
})
