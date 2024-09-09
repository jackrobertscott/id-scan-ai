import test, {expect} from "@playwright/test"
import {UserStore} from "../user/user_store"

test.beforeEach(async ({page}) => {
  // Load the page to bring localStorage into existance
  await page.goto("/")

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
  const title = page.locator(".poster-title")
  await expect(title).toBeVisible()
  await expect(title).toContainText("Select a Venue")
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
  await expect(errorAlert).toBeVisible()
  await expect(errorAlert).toContainText("Login code is invalid")
})
