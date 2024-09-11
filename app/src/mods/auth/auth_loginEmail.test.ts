import test, {expect} from "@playwright/test"
import {SessionStore} from "../session/session_store"
import {testUserBasic} from "../test/testGlobalUsers"
import {UserStore} from "../user/user_store"
import {AuthDataSchema} from "./auth_schemas"

test.describe("Auth by email", async () => {
  test.beforeEach(async ({page}) => {
    // Load the page to bring localStorage into existance
    await page.goto("/")

    // Remove local storage
    await page.evaluate(() => localStorage.clear())
  })

  test("Login user", async ({page}) => {
    const email = `test_${Date.now()}@example.com`

    // Go to login page
    await page.goto("/login-email")
    await page.fill('.field-root[data-name="email"] input', email)
    await page.getByRole("button", {name: "Login", exact: true}).click()

    // Get user code from db
    const user = await UserStore.getOne({email})
    const code = user.emailVerif?.code
    if (!code) throw new Error("User missing verification code")

    // Fill in code
    await page.fill('.field-root[data-name="code"] input', code)
    await page.getByRole("button", {name: "Submit"}).click()

    // Wait for redirect
    await page.waitForURL("**/select-venue")
    const $title = page.locator(".poster-title")
    await expect($title).toBeVisible()
    await expect($title).toContainText("Select a Venue")
  })

  test("Invalid login code", async ({page}) => {
    const email = `test_${Date.now()}@example.com`

    // Go to login page
    await page.goto("/login-email")
    await page.fill('.field-root[data-name="email"] input', email)
    await page.getByRole("button", {name: "Login", exact: true}).click()

    // Fill in code
    await page.fill('.field-root[data-name="code"] input', "000000")
    await page.getByRole("button", {name: "Submit"}).click()

    // Count errors
    const $alert = page.locator(".alert-manager-alert")
    await expect($alert).toBeVisible()
    await expect($alert).toContainText("Login code is invalid")
  })
})

test.describe("Logout", () => {
  test.use({storageState: testUserBasic.fileStorePath})

  test("Logout", async ({page}) => {
    await page.goto("/my-account")
    const $dashBody = page.locator(".dashboard-layout-body")
    await expect($dashBody.locator(".title-bar-title")).toHaveText("My Account")

    const p1 = await page.evaluate(() => localStorage.getItem("auth"))
    expect(p1).not.toBeNull()
    const pd = AuthDataSchema.parse(JSON.parse(p1 as string).data.data)

    await page.getByRole("button", {name: "Logout"}).click()
    const $modal = page.locator(".modal-root")
    await expect($modal.locator(".poster-title")).toHaveText("Logout")
    await $modal.getByRole("button", {name: "Logout"}).click()

    await page.waitForTimeout(100)
    const p2 = await page.evaluate(() => localStorage.getItem("auth"))
    expect(typeof p2 === "string").toBeTruthy()
    expect(JSON.parse(p2 as string).data).toBeNull()

    // Revert the logout
    await SessionStore.updateOneById(pd.sessionId, {endedDate: null})
  })
})
