import test, {expect} from "@playwright/test"
import {testUserBasic} from "../test/testGlobalUsers"

test.describe("Venue by self", async () => {
  test.use({storageState: testUserBasic.fileStorePath})

  const formData = {
    name: "My Venue",
  }

  test("Create a venue", async ({page}) => {
    await page.goto("/select-venue")
    const $dashBody = page.locator(".dashboard-layout-body")

    await expect($dashBody.locator(".title-bar-title")).toHaveText("Venues")
    await $dashBody.locator(".title-bar-option").click()

    const $modal = page.locator(".modal-root")
    await expect($modal.locator(".title-bar-title")).toHaveText("New Venue")

    await $modal.locator("[data-name='venue-name'] input").fill(formData.name)
    await $modal.getByRole("button", {name: "Submit"}).click()

    const $alert = page.locator(".alert-manager-alert")
    await expect($alert).toBeVisible()
    await expect($alert).toHaveText("Venue created")

    await expect($modal).not.toBeVisible()
    expect(page.url()).toContain("/new-scan")
  })
})
