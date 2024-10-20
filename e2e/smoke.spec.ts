import { test, expect } from "@playwright/test";

test("signals 🚥", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // React
  const reactApp = page.locator("#react");
  await reactApp.getByRole("button", { name: "Increment" }).click();
  await expect(reactApp.getByText("Value: 1")).toBeVisible();
  await expect(reactApp.getByText("Double Value: 2")).toBeVisible();

  // // Vanilla
  // const vanillaApp = page.locator("#vanilla");
  // await vanillaApp.getByRole("button", { name: "Increment" }).click();
  // await expect(vanillaApp.getByText("Value: 1")).toBeVisible();
  // await expect(vanillaApp.getByText("Double Value: 2")).toBeVisible();
});
