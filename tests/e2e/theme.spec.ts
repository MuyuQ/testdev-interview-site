import { test, expect, type Locator, type Page } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

function getThemeSelect(page: Page): Locator {
  return page.getByRole("combobox", { name: /theme|主题/i }).first();
}

async function expectStoredTheme(page: Page, theme: "light" | "dark") {
  await expect
    .poll(async () => {
      return page.evaluate(() => localStorage.getItem("starlight-theme"));
    })
    .toBe(theme);
}

test.describe("Theme Switching", () => {
  test("homepage defaults to dark theme for first-time visitors", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("starlight-theme");
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: query === "(prefers-color-scheme: light)",
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const cardBg = await page.locator(".roadmap-card").first().evaluate((node) => {
      return getComputedStyle(node).backgroundColor;
    });

    expect(cardBg).toBe("rgb(24, 27, 34)");
  });

  test("dark mode applies correctly", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "dark");
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const cardBg = await page.locator(".roadmap-card").first().evaluate((node) => {
      return getComputedStyle(node).backgroundColor;
    });

    expect(cardBg).toBe("rgb(24, 27, 34)");
  });

  test("light mode applies correctly", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const shellColor = await page.locator(".roadmap-card").first().evaluate((node) => {
      return getComputedStyle(node).backgroundColor;
    });

    expect(shellColor).toBe("rgb(251, 247, 239)");
  });

  test("theme persists in localStorage", async ({ page }) => {
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    const themeSelect = getThemeSelect(page);

    await expect(themeSelect).toBeVisible();
    await themeSelect.selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectStoredTheme(page, "light");

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("theme toggle button is accessible", async ({ page }) => {
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    const themeSelect = getThemeSelect(page);

    await expect(themeSelect).toBeVisible();
    await expect(themeSelect).toBeEnabled();
    await expect(themeSelect).toHaveAccessibleName(/theme|主题/i);
  });

  test("theme switching works on content pages", async ({ page }) => {
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    const themeSelect = getThemeSelect(page);

    await expect(themeSelect).toBeVisible();
    await themeSelect.selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectStoredTheme(page, "light");
  });
});
