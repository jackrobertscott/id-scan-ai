import base, {chromium, FullConfig, Page} from "@playwright/test"
import path from "path"
import {fileURLToPath} from "url"
import {UserStore} from "../user/user_store"

// const user = await UserStore.upsertOneByEmail("fred@example.com")
// const session = await SessionStore.createOne({userId: user.id})
// const ap = await createAuthToken({session, user})

export const test = base.extend<{otherPage: Page}>({
  otherPage: async ({page}, use) => {
    // Run for every test that uses this fixture
  },
})

const THIS_DIR = fileURLToPath(new URL(".", import.meta.url))
export const TEST_AUTH_USER_FILE = path.resolve(
  THIS_DIR,
  "../../../playwright/.auth/user.json"
)

export default async function (conf: FullConfig) {
  const browser = await chromium.launch({headless: true})
  const page = await browser.newPage()

  // Go to login page
  const EMAIL = "fred@example.com"
  await page.goto(conf.projects[0].use.baseURL + "/login-email")
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
  await page.context().storageState({path: TEST_AUTH_USER_FILE})

  // Close browser
  await browser.close()
}
