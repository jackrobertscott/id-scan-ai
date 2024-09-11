import path from "path"
import {fileURLToPath} from "url"
import {MemberType} from "../member/member_storeDef.iso"
import {VenueType} from "../venue/venue_storeDef.iso"

const THIS_DIR = fileURLToPath(new URL(".", import.meta.url))
const createFilePath = (name: string) =>
  path.resolve(THIS_DIR, "../../../playwright/.auth/", name)

export type TestGlobalUserType = {
  email: string
  fileStorePath: string
  venue?: Pick<VenueType, "name"> &
    Pick<MemberType, "fullAccess" | "permissions">
}

export const testUserBasic: TestGlobalUserType = {
  email: "user_basic@faceoffidscan.com",
  fileStorePath: createFilePath("user_basic.json"),
}

export const testUserMemberAdmin: TestGlobalUserType = {
  email: "user_member_admin@faceoffidscan.com",
  fileStorePath: createFilePath("user_member_admin.json"),
  venue: {
    name: "Example Venue",
    fullAccess: true, // admin
    permissions: [],
  },
}

export const testUserMemberNoob: TestGlobalUserType = {
  email: "user_member_noob@faceoffidscan.com",
  fileStorePath: createFilePath("user_member_noob.json"),
  venue: {
    name: "Example Venue",
    fullAccess: false, // nothing
    permissions: [],
  },
}
