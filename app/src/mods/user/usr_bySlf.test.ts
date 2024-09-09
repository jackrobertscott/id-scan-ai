import test, {expect} from "@playwright/test"
import {TEST_AUTH_USER_FILE} from "../test/testGlobalSetup"

test.describe("User actions by self", async () => {
  test.use({storageState: TEST_AUTH_USER_FILE})

  test("a", async ({page}) => {
    await page.goto("/my-account")
    await expect(page.getByText("Your Account", {exact: true})).toBeVisible()
  })

  test("b", async ({page}) => {
    await page.goto("/my-sessions")
    await expect(page.getByText("Sessions", {exact: true})).toBeVisible()
  })

  test("c", async ({page}) => {
    await page.goto("/my-account")
    await expect(page.getByText("Your Account", {exact: true})).toBeVisible()
  })
})
