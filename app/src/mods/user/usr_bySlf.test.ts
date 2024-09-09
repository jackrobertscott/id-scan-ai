import test, {expect} from "@playwright/test"
import {TEST_AUTH_USER_FILE} from "../test/testGlobalSetup"

test.describe("User actions by self", async () => {
  test.use({storageState: TEST_AUTH_USER_FILE})

  test("edit my account", async ({page}) => {
    const formData = {
      firstName: "Fred",
      lastName: "Bloggs",
    }

    // Edit the account
    await page.goto("/my-account")
    await expect(page.getByText("Your Account", {exact: true})).toBeVisible()
    await page.fill("[data-name='first-name'] input", formData.firstName)
    await page.fill("[data-name='last-name'] input", formData.lastName)
    await page.getByRole("button", {name: "Save"}).click()
    const alert = page.locator(".alert-manager-alert")
    await expect(alert).toBeVisible()
    await expect(alert).toHaveText("Account updated")

    // Check the changes were saved
    await page.reload()
    await expect(page.getByText("Your Account", {exact: true})).toBeVisible()
    await expect(page.locator("[data-name='first-name'] input")).toHaveValue(
      formData.firstName
    )
    await expect(page.locator("[data-name='last-name'] input")).toHaveValue(
      formData.lastName
    )
  })

  test("edit face login", async ({page}) => {
    await page.goto("/my-account")
    await expect(page.getByText("Your Account", {exact: true})).toBeVisible()
    // todo...
  })
})
