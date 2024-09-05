import {expect, test} from "@playwright/test"
import {UserStore} from "../mods/user/user_store"

test.afterEach(async ({page}) => {
  // Remove local storage
  await page.evaluate(() => localStorage.clear())
})

test("login user", async ({page}) => {
  const email = "fred@example.com"

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
  expect(await page.getByText("Select a Venue").isVisible()).toBeTruthy()
})

test("login user with invalid code", async ({page}) => {
  const email = "fred@example.com"

  // Go to login page
  await page.goto("/login-email")
  await page.fill('.field-root[data-name="email"] input', email)
  await page.getByRole("button", {name: "Login", exact: true}).click()

  // Fill in code
  await page.fill('.field-root[data-name="code"] input', "000000")
  await page.getByRole("button", {name: "Submit"}).click()

  // Count errors
  const errorAlert = page.locator(".alert-manager-alert")
  expect(errorAlert).toBeVisible({timeout: 1000})
  expect(errorAlert).toContainText("Login code is invalid")
})
