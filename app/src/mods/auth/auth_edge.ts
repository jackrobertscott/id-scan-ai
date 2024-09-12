import {AWS_REKOG_COLNAMES} from "../../consts/AWS_REKOG_COLNAMES"
import {
  TIMING_VERIFICATION_CODE_EXPIRY,
  TIMING_VERIFICATION_CODE_LOCKOUT,
} from "../../consts/TIMING"
import {srvConf} from "../../srvConf"
import {extractFaceIdsFromSearchResults} from "../../utils/rekogFaceUtils"
import {searchFacesByImage} from "../../utils/rekogUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {InvalidAuthLogoutError} from "../../utils/server/errorClasses"
import {serverFileSchema} from "../../utils/server/serverSchemas"
import {sendTextEmail} from "../../utils/sesEmailUtils"
import {DeviceStore} from "../device/device_store"
import {LogEventStore} from "../logEvent/logEvent_store"
import {
  LOG_EVENT_CATEGORY_OBJ,
  LOG_EVENT_TABLES_OBJ,
} from "../logEvent/logEvent_storeDef.iso"
import {MemberStore} from "../member/member_store"
import {MemberType} from "../member/member_storeDef.iso"
import {SessionStore} from "../session/session_store"
import {UserStore} from "../user/user_store"
import {VenueStore} from "../venue/venue_store"
import {VenueType} from "../venue/venue_storeDef.iso"
import {createDeviceAuthToken, digestDeviceAuthToken} from "./auth_device.srv"
import {auth_eDef} from "./auth_eDef.iso"
import {createAuthToken, ensureUser} from "./auth_jwt"

console.log(auth_eDef.sendAuthCode.slug)

export default createEdgeGroup(auth_eDef, {
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
    if (vftsArr.length >= 10) {
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
      MemberStore.getMany({userId: user.id}),

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

  deviceLogin: async ({body}) => {
    const device = await DeviceStore.getOne({
      deviceKey: body.deviceKey,
      // passcode: body.passcode,
    })

    return createDeviceAuthToken(device)
  },

  deviceFaceLogin: async ({body}) => {
    // Get the device
    const {deviceId} = await digestDeviceAuthToken(body.deviceToken)
    const device = await DeviceStore.getOneById(deviceId)
    const venue = await VenueStore.getOne({id: device.venueId})

    // Search for faces that match the patron face
    const fileData = serverFileSchema().parse(body.photoFile)
    const searchResults = await searchFacesByImage(
      fileData.buffer,
      AWS_REKOG_COLNAMES.USER
    )

    // Get the AWS face IDs
    const [awsFaceId] = extractFaceIdsFromSearchResults(searchResults)
    if (!awsFaceId) throw new Error("Failed to recognize face")

    // Get the user
    const user = await UserStore.maybeOne({"faceLogin.awsFaceId": awsFaceId})
    if (!user) throw new Error("Failed to find user by face")

    // Verify user's passcode
    if (user.faceAuth?.passcode !== body.passcode)
      throw new Error("Invalid passcode")

    // Get the member
    const member = await MemberStore.getOne({
      userId: user.id,
      venueId: venue.id,
    })

    // Create a new session
    const session = await SessionStore.createOne({
      userId: user.id,
      userAgent: body.userAgent,
      deviceId: device.id,
    })

    // Create the auth token
    const payload = await createAuthToken({
      session,
      user,
      venue,
      member,
      device,
    })

    LogEventStore.createOne({
      venueId: venue.id,
      triggeredByUserId: user.id,
      category: LOG_EVENT_CATEGORY_OBJ.AUTH,
      table: LOG_EVENT_TABLES_OBJ.USER,
      dataId: user.id,
      desc: "User authenticated by face",
    })

    return {payload}
  },
})
