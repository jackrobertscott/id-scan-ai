import test from "@playwright/test"
import {TEST_AUTH_USER_FILE} from "../test/testGlobalSetup"

test.describe("Venue by self", async () => {
  test.use({storageState: TEST_AUTH_USER_FILE})

  const formData = {
    name: "My Venue",
  }

  test("create a venue", async ({page}) => {
    await page.goto("/select-venue")
    const dashBody = page.locator(".dashboard-layout-body")
  })
})
