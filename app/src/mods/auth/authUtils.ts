import {IncomingMessage} from "http"
import {TIMING_DEVICE_MAX_SESSION_SERVER} from "../../consts/TIMING"
import {toSpacedCase} from "../../utils/changeCase"
import {jwtCreate, jwtVerify} from "../../utils/jwtUtils"
import {normalizeRegex} from "../../utils/regexUtils"
import {
  InsufficientPermissionError,
  InvalidAuthLogoutError,
} from "../../utils/server/errorClasses"
import {AlbumStore} from "../album/album_store"
import {AlbumDef} from "../album/album_storeDef.iso"
import {DeviceStore} from "../device/device_store"
import {DeviceType} from "../device/device_storeDef.iso"
import {MembershipStore} from "../membership/membership_store"
import {MembershipType} from "../membership/membership_storeDef.iso"
import {SessionStore} from "../session/session_store"
import {SessionType} from "../session/session_storeDef.iso"
import {UserStore} from "../user/user_store"
import {UserType} from "../user/user_storeDef.iso"
import {VenueStore} from "../venue/venue_store"
import {VenueType} from "../venue/venue_storeDef.iso"
import {AuthDataSchema} from "./auth_schemas"

export type AuthOptions = {
  isDeviceEnabled?: boolean // device auth must be opted into
}

export async function createAuthToken({
  session,
  user,
  venue,
  member,
  device,
}: {
  session: SessionType
  user: UserType
  venue?: VenueType | null
  member?: MembershipType | null
  device?: DeviceType | null
}) {
  if (member && member.userId !== user.id) {
    throw new Error("Member and user mismatch")
  }

  if (venue && venue.id !== member?.venueId) {
    throw new Error("Member and venue mismatch")
  }

  if (device && device.venueId !== venue?.id) {
    throw new Error("Device and venue mismatch")
  }

  if (session.deviceId && session.deviceId !== device?.id) {
    throw new Error("Session and device mismatch")
  }

  const data = AuthDataSchema.parse({
    userId: user.id,
    sessionId: session.id,
    venueId: venue?.id,
    deviceId: device?.id,

    // public data
    isAdmin: user.isAdmin,
    fullAccess: member?.fullAccess,
    permissions: member?.permissions,
    sessionCreatedDate: session.createdDate,
  })

  return {
    token: await jwtCreate(data),
    data,
  }
}

export async function digestRequestAuthHeader(request: IncomingMessage) {
  try {
    const authHeader = request.headers["authorization"]
    if (typeof authHeader !== "string")
      throw new Error("No Authorization header")
    const token = authHeader.substring(7)
    const raw = await jwtVerify(token)
    return {
      token,
      ...AuthDataSchema.parse(raw),
    }
  } catch (error) {
    if (error instanceof Error) console.log(error.message)
    throw new InvalidAuthLogoutError("Failed to parse authentication header")
  }
}

export async function ensureUser(
  request: IncomingMessage,
  options: AuthOptions = {}
) {
  const authData = await digestRequestAuthHeader(request)

  const [user, session, device] = await Promise.all([
    UserStore.maybeOne({id: authData.userId}),
    SessionStore.maybeOne({id: authData.sessionId}),
    authData.deviceId ? DeviceStore.maybeOne({id: authData.deviceId}) : null,
  ])

  if (!user) throw new InvalidAuthLogoutError("User not found")
  if (!session) throw new InvalidAuthLogoutError("User not found")
  if (user.id !== session.userId)
    throw new InvalidAuthLogoutError("Auth payload mismatch")
  if (session.endedDate) throw new InvalidAuthLogoutError("Session has ended")

  if (session.deviceId || authData.deviceId) {
    if (!device) throw new InvalidAuthLogoutError("Device not found")
    if (session.deviceId !== device.id)
      throw new InvalidAuthLogoutError("Session device mismatch")
    if (device.venueId !== authData.venueId)
      throw new InvalidAuthLogoutError("Device and venue mismatch")
    if (!device.isActive)
      throw new InsufficientPermissionError("Device is not active")
    if (!options.isDeviceEnabled)
      throw new InsufficientPermissionError(
        "Feature not enabled for venue devices"
      )
    const sessionExpiry =
      session.createdDate.valueOf() + TIMING_DEVICE_MAX_SESSION_SERVER
    if (sessionExpiry < Date.now())
      throw new InvalidAuthLogoutError("Session has expired")
  }

  return {...authData, user, session, device}
}

export async function ensureUserOfAlbum(
  request: IncomingMessage,
  albumId: string
) {
  const authData = await ensureUser(request)

  // Validate albumId
  AlbumDef.schema.shape.id.parse(albumId)

  // Get the album
  const album = await AlbumStore.getOne({
    id: albumId,
    emails: normalizeRegex(authData.user.email),
  })

  // Ensure the album is active
  if (!album.isActive) {
    throw new Error("Album is not active")
  }

  return {...authData, album}
}

export async function ensureMemberOfVenue(
  request: IncomingMessage,
  requiredPermissions: string[] = [],
  options: AuthOptions = {}
) {
  const authData = await ensureUser(request, options)

  // Ensure user is associated with a venue
  if (!authData.venueId)
    throw new InvalidAuthLogoutError("User is not associated with a venue")
  const venue = await VenueStore.maybeOne({id: authData.venueId})
  if (!venue) throw new InvalidAuthLogoutError("Venue not found")

  // Ensure user has a member for the venue
  const member = await MembershipStore.maybeOne({
    userId: authData.user.id,
    venueId: venue.id,
  })
  if (!member)
    throw new InvalidAuthLogoutError(
      "User does not have a member for this venue"
    )

  // Ensure device is associated with the venue
  if (authData.device && authData.device.venueId !== venue.id)
    throw new InvalidAuthLogoutError("Device and venue mismatch")

  // Ensure user has required permissions
  if (requiredPermissions) {
    validatePermissions(member, requiredPermissions)
  }

  return {...authData, venue, member}
}

export async function ensureAdmin(request: IncomingMessage) {
  const authData = await ensureUser(request)

  if (!authData.user.isAdmin)
    throw new InsufficientPermissionError("User is not an admin")

  return authData
}

export function validatePermissions(
  member: MembershipType,
  requiredPermissions: string[]
) {
  if (!member.fullAccess) {
    for (const permission of requiredPermissions) {
      if (!member.permissions.includes(permission)) {
        // Not auth error, don't want to log them out
        throw new InsufficientPermissionError(
          "User does not have permission to perform a " +
            toSpacedCase(permission)
        )
      }
    }
  }
}
