import { expect, test } from "@playwright/test";

test("signals 🚥", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // React
  const reactApp = page.locator("#root");
  await reactApp.getByRole("button", { name: "Increment" }).click();
  await expect(reactApp.getByText("Value: 1")).toBeVisible();
  await expect(reactApp.getByText("Double Value: 2")).toBeVisible();
});
