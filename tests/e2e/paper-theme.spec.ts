import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("paper theme tokens", () => {
  test("light theme uses warm paper colors on the homepage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
      document.documentElement.dataset.theme = "light";
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const themeValues = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        bg: root.getPropertyValue("--sl-color-bg").trim(),
        card: root.getPropertyValue("--sl-color-bg-card").trim(),
        accent: root.getPropertyValue("--sl-color-accent").trim(),
        radius: root.getPropertyValue("--radius-md").trim(),
      };
    });

    expect(themeValues.bg).toBe("#f4efe6");
    expect(themeValues.card).toBe("#fbf7ef");
    expect(themeValues.accent).toBe("#315c85");
    expect(themeValues.radius).toBe("0px");
  });

  test("dark theme uses ink paper colors on a docs page", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });

    await page.goto(appUrl("/glossary/"));
    await page.waitForLoadState("domcontentloaded");

    const themeValues = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        bg: root.getPropertyValue("--sl-color-bg").trim(),
        card: root.getPropertyValue("--sl-color-bg-card").trim(),
        accent: root.getPropertyValue("--sl-color-accent").trim(),
      };
    });

    expect(themeValues.bg).toBe("#111318");
    expect(themeValues.card).toBe("#181b22");
    expect(themeValues.accent).toBe("#7ea1c4");
  });
});
