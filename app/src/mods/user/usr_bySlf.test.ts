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
    const dashBody = page.locator(".dashboard-layout-body")
    await expect(dashBody.locator(".title-bar-title")).toHaveText("My Account")
    await dashBody
      .locator("[data-name='first-name'] input")
      .fill(formData.firstName)
    await dashBody
      .locator("[data-name='last-name'] input")
      .fill(formData.lastName)
    await dashBody.getByRole("button", {name: "Save"}).click()
    const alert = page.locator(".alert-manager-alert")
    await expect(alert).toBeVisible()
    await expect(alert).toHaveText("Account updated")

    // Check the changes were saved
    await page.reload()
    await expect(dashBody.locator(".title-bar-title")).toHaveText("My Account")
    await expect(
      dashBody.locator("[data-name='first-name'] input")
    ).toHaveValue(formData.firstName)
    await expect(dashBody.locator("[data-name='last-name'] input")).toHaveValue(
      formData.lastName
    )
  })

  test("edit face login", async ({page}) => {
    await page.goto("/my-account")
    const dashBody = page.locator(".dashboard-layout-body")
    await expect(
      dashBody.getByText("Your Account", {exact: true})
    ).toBeVisible()
    // todo...
  })
})
