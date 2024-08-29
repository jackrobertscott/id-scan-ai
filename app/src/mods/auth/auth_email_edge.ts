import {
  TIMING_VERIFICATION_CODE_EXPIRY,
  TIMING_VERIFICATION_CODE_LOCKOUT,
} from "../../consts/TIMING"
import {srvConf} from "../../srvConf"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {sendTextEmail} from "../../utils/sesEmailUtils"
import {MembershipStore} from "../membership/membership_store"
import {SessionStore} from "../session/session_store"
import {UserStore} from "../user/user_store"
import {VenueStore} from "../venue/venue_store"
import {auth_email_eDef} from "./auth_email_eDef.iso"
import {createAuthToken} from "./authUtils"

export default createEdgeGroup(auth_email_eDef, {
  /**
   * Create a new user (or update an existing one) and send them an email with
   * a login code. This is the most secure method of authentication given that
   * it prevents people from trying to brute force a "password".
   */
  sendAuthCode: async ({body}) => {
    const user = await UserStore.upsertOneByEmail(body.email)
    console.log(user.emailVerif?.code)
    if (!srvConf.IS_DEV) {
      await sendTextEmail({
        to: [user.email],
        subject: "Login Code",
        text: [
          "You login code is: " + user.emailVerif?.code,
          "The code will expire in 10 minutes.",
        ].join("\n"),
      })
    }
    return {email: user.email}
  },

  /**
   * Verify the auth code and create a new session for the user.
   */
  verifyAuthCode: async ({body}) => {
    const user = await UserStore.maybeOneByEmail(body.email)
    if (!user) throw new Error("Failed to find user")

    // Protect against brute force attacks
    const vftsArr = user.verifFailedTimestamps || []
    if (vftsArr.length >= 5) {
      const timeSinceFirstFail = Date.now() - vftsArr.slice(-1)[0]
      if (timeSinceFirstFail > TIMING_VERIFICATION_CODE_LOCKOUT) {
        await UserStore.updateOneById(user.id, {
          verifFailedTimestamps: [],
        })
      } else {
        throw new Error("Too many failed attempts, try again later")
      }
    }

    // Check the verification code
    if (!user.emailVerif?.code) throw new Error("Login code not set on user")
    const verificationExpiry =
      user.emailVerif.updatedDate.valueOf() + TIMING_VERIFICATION_CODE_EXPIRY
    if (new Date().valueOf() > verificationExpiry) {
      throw new Error("Login code has expired")
    }
    if (user.emailVerif.code !== body.authCode) {
      await UserStore.updateOneById(user.id, {
        verifFailedTimestamps: [...vftsArr, Date.now()],
      })
      throw new Error("Login code is invalid")
    }

    const [session, members] = await Promise.all([
      // Create a new session
      SessionStore.createOne({
        userId: user.id,
        userAgent: body.userAgent,
      }),

      // Get the members of the user
      MembershipStore.getMany({userId: user.id}),

      // Clear the verification code
      UserStore.updateOneById(user.id, {
        emailVerif: null,
      }),
    ])

    // Get the venue
    const memberIds = members.map((p) => p.venueId)
    const venue = await VenueStore.maybeOne({id: {$in: memberIds}})
    const member = members.find((p) => p.venueId === venue?.id)
    if (venue && !member) throw new Error("Failed to find member")

    // Create the auth token
    const payload = await createAuthToken({
      session,
      user,
      venue,
      member,
    })

    return {payload}
  },
})
