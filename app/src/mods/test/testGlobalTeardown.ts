import {normalizeRegex} from "../../utils/regexUtils"
import {MemberStore} from "../member/member_store"
import {SessionStore} from "../session/session_store"
import {UserStore} from "../user/user_store"
import {VenueStore} from "../venue/venue_store"
import {testUsers} from "./testGlobalUsers"

export default async function () {
  await Promise.all(
    testUsers.map(async (userData) => {
      const user = await UserStore.getOne({
        email: normalizeRegex(userData.email),
      })
      const members = await MemberStore.getMany({userId: user.id})
      await Promise.all([
        SessionStore.deleteMany({userId: user.id}),
        VenueStore.deleteMany({id: {$in: members.map((m) => m.venueId)}}),
        MemberStore.deleteMany({userId: user.id}),
        UserStore.deleteOne({id: user.id}),
      ])
    })
  )
}
