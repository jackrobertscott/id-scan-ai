import test, {expect} from "@playwright/test"
import {testUserBasic} from "../test/testGlobalUsers"

test.describe("Session by self", async () => {
  test.use({storageState: testUserBasic.fileStorePath})

  test("view all my sessions", async ({page}) => {
    await page.goto("/my-sessions")
    const $dashBody = page.locator(".dashboard-layout-body")
    const $titleBar = $dashBody.locator(".title-bar-root")
    await expect($titleBar.getByText("Sessions")).toBeVisible()
    const $simpleList = $dashBody.locator(".simple-list-root")
    const $items = $simpleList.locator(".list-item-root")
    await $items.first().waitFor({state: "attached"})
    expect(await $items.count()).toBeGreaterThanOrEqual(1)
  })

  test("show session modal on click", async ({page}) => {
    await page.goto("/my-sessions")
    const $dashBody = page.locator(".dashboard-layout-body")
    const $titleBar = $dashBody.locator(".title-bar-root")
    await expect($titleBar.getByText("Sessions")).toBeVisible()
    const $simpleList = $dashBody.locator(".simple-list-root")
    const $items = $simpleList.locator(".list-item-trigger")
    await $items.first().click()

    // Check modal is visible
    const modal = page.locator(".modal-root")
    await expect(modal).toBeVisible()
    await expect(modal.locator(".title-bar-title")).toHaveText("Session")

    // Check values exist
    await expect(modal.locator("[data-name='created-date']")).toBeVisible()
    await expect(modal.locator("[data-name='ended-date']")).toBeVisible()
    await expect(
      modal.getByRole("button", {name: "Deactivate Session"})
    ).toBeVisible()
  })
})
