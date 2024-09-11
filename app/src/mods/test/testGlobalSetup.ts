import base, {chromium, Page} from "@playwright/test"
import {promises as fs} from "node:fs"
import path from "node:path"
import {z} from "zod"
import {createAuthToken} from "../auth/auth_jwt"
import {MemberStore} from "../member/member_store"
import {MemberType} from "../member/member_storeDef.iso"
import {SessionStore} from "../session/session_store"
import {UserStore} from "../user/user_store"
import {VenueStore} from "../venue/venue_store"
import {VenueType} from "../venue/venue_storeDef.iso"
import {testUserBasic, testUsers} from "./testGlobalUsers"

export const extTest = base.extend<{otherPage: Page}>({
  otherPage: async ({page}, use) => {
    // Run for every test that uses this fixture
  },
})

// {
//   "cookies": [],
//   "origins": [
//     {
//       "origin": "http://localhost:3000",
//       "localStorage": [
//         {
//           "name": "auth",
//           "value": "{\"data\":{\"token\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3Jfd3d6YWVuaGtyemZuMTFwbG1tenEwZmw0Iiwic2Vzc2lvbklkIjoic3NuX2h1ZjM2bWZpYXFqMnp2cXZiaGs5cHpuMCIsInNlc3Npb25DcmVhdGVkRGF0ZSI6IjIwMjQtMDktMDlUMDg6MDM6MzIuNDE4WiIsImlhdCI6MTcyNTg2OTAxMiwiZXhwIjoxNzI2NDczODEyfQ.rQZQ5bEwpkyiPic3sqApRf04i7ZobEpK2b-Gnv7zdFQ\",\"data\":{\"userId\":\"usr_wwzaenhkrzfn11plmmzq0fl4\",\"sessionId\":\"ssn_huf36mfiaqj2zvqvbhk9pzn0\",\"sessionCreatedDate\":\"2024-09-09T08:03:32.418Z\"}}}"
//         }
//       ]
//     }
//   ]
// }

const storageFileSchema = () => {
  return z.object({
    cookies: z.array(z.object({name: z.string(), value: z.string()})),
    origins: z.array(
      z.object({
        origin: z.string().url(),
        localStorage: z.array(z.object({name: z.string(), value: z.string()})),
      })
    ),
  })
}

export default async function () {
  for (const user of testUsers) {
    await fs.mkdir(path.dirname(user.fileStorePath), {recursive: true})
    if (user.venue) {
      await createUserMember(user.email, user.fileStorePath, user.venue)
    } else {
      await createUserBasic(user.email, user.fileStorePath)
    }
  }
}

const createUserBasic = async (email: string, filePath: string) => {
  const user = await UserStore.upsertOneByEmail(email)
  const session = await SessionStore.createOne({userId: user.id})
  const data = await createAuthToken({session, user})
  const fileData = storageFileSchema().parse({
    cookies: [],
    origins: [
      {
        origin: "http://localhost:3000",
        localStorage: [{name: "auth", value: JSON.stringify({data})}],
      },
    ],
  })
  await fs.writeFile(filePath, JSON.stringify(fileData))
}

const createUserMember = async (
  email: string,
  filePath: string,
  options: Pick<VenueType, "name"> &
    Pick<MemberType, "fullAccess" | "permissions">
) => {
  const user = await UserStore.upsertOneByEmail(email)
  const venue = await VenueStore.createOne({
    name: options.name,
    createdByUserId: user.id,
  })
  const member = await MemberStore.createOne({
    userId: user.id,
    venueId: venue.id,
    ...options,
  })
  const session = await SessionStore.createOne({userId: user.id})
  const data = await createAuthToken({session, user, venue, member})
  const fileData = storageFileSchema().parse({
    cookies: [],
    origins: [
      {
        origin: "http://localhost:3000",
        localStorage: [{name: "auth", value: JSON.stringify({data})}],
      },
    ],
  })
  await fs.writeFile(filePath, JSON.stringify(fileData))
}

/**
 * const baseUrl = conf.projects[0].use.baseURL
 * if (!baseUrl) throw new Error("Missing base URL")
 * await legacyCreateUserBasic(baseUrl)
 */
const legacyCreateUserBasic = async (baseUrl: string) => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Go to login page
  const EMAIL = "userBasic@example.com"
  await page.goto(baseUrl + "/login-email")
  await page.fill('.field-root[data-name="email"] input', EMAIL)
  await page.getByRole("button", {name: "Login", exact: true}).click()

  // Get user code from db
  const user = await UserStore.getOne({email: EMAIL})
  const code = user.emailVerif?.code
  if (!code) throw new Error("User missing verification code")

  // Fill in code
  await page.fill('.field-root[data-name="code"] input', code)
  await page.getByRole("button", {name: "Submit"}).click()

  // Wait for redirect
  await page.waitForURL("**/select-venue")
  await page.context().storageState({path: testUserBasic.fileStorePath})

  // Close browser
  await browser.close()
}
