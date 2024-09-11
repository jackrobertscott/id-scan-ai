import test, {expect} from "@playwright/test"
import {testUserBasic} from "../test/testGlobalUsers"

test.describe("Ablum by member", async () => {
  test.use({storageState: testUserBasic.fileStorePath})

  test("Create a venue", async ({page}) => {
    const formData = {
      name: "Police Album " + Date.now(),
      emails: ["fred@example.com"],
      isActive: true,
    }

    await page.goto("/shared-albums")
    const $dashBody = page.locator(".dashboard-layout-body")

    await expect($dashBody.locator(".title-bar-title")).toHaveText("Albums")
    await $dashBody.locator(".title-bar-option").click()

    const $modal = page.locator(".modal-root")
    await expect($modal.locator(".title-bar-title")).toHaveText("New Album")

    // Fill out the form
    await $modal.locator("[data-name='album-name'] input").fill(formData.name)
    const $emailsField = $modal.locator("[data-name='emails']")
    await $emailsField.locator("input").fill(formData.emails[0])
    await $emailsField.locator("button").click()
    await $modal.locator("[data-name='is-active'] .input-toggle-root").click()

    // Days
    let [start, end] = [new Date(), new Date()]
    start.setDate(10)
    end.setDate(15)
    let [s, e] = [start, end].map((d) => d.toISOString().split("T")[0])

    // Set start date
    const $afterField = $modal.locator("[data-name='created-after']")
    await $afterField.locator(".input-date-trigger").click()
    await page.locator(`.date-cell-root[data-day='${s}']`).click()
    await page.getByRole("button", {name: "Done"}).click()

    // Set end date
    const $beforeField = $modal.locator("[data-name='created-before']")
    await $beforeField.locator(".input-date-trigger").click()
    await page.locator(`.date-cell-root[data-day='${e}']`).click()
    await page.getByRole("button", {name: "Done"}).click()

    // Submit
    await $modal.getByRole("button", {name: "Create Album"}).click()

    const $alert = page.locator(".alert-manager-alert")
    await expect($alert).toBeVisible()
    await expect($alert).toHaveText("Album created")

    await expect($modal.locator("[data-name='share-link']")).toBeVisible()

    // Close modal
    await $modal.locator(".title-bar-option:has-text('Close')").click()

    const $list = $dashBody.locator(".simple-list-root")
    await expect($list.getByText(formData.name)).toBeVisible()
  })
})
