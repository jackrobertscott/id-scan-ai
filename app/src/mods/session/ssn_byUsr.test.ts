import test, {expect} from "@playwright/test"
import {TEST_AUTH_USER_FILE} from "../test/testGlobalSetup"

test.describe("User actions by self", async () => {
  test.use({storageState: TEST_AUTH_USER_FILE})

  test("view all my sessions", async ({page}) => {
    await page.goto("/my-sessions")
    const titleBar = page.locator(".title-bar-root")
    await expect(titleBar.getByText("Sessions")).toBeVisible()
    const simpleList = page.locator(".simple-list-root")
    const numItems = await simpleList.locator(".list-item-root").count()
    expect(numItems >= 1).toBeTruthy()
  })
})
