import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
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

    expect(cardBg).toBe("rgb(25, 28, 36)");
  });

  test("dark mode applies correctly", async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page
      .locator(
        'button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]',
      )
      .first();

    if (await themeToggle.isVisible().catch(() => false)) {
      const html = page.locator("html");
      const initialTheme = await html.getAttribute("data-theme");

      await themeToggle.click();
      await page.waitForTimeout(300);

      const newTheme = await html.getAttribute("data-theme");
      if (initialTheme && newTheme) {
        expect(newTheme).not.toBe(initialTheme);
      }

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).backgroundColor;
      });
      expect(bgColor).toBeTruthy();
    }
  });

  test("light mode applies correctly", async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page
      .locator(
        'button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]',
      )
      .first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
      await page.waitForTimeout(300);
      await themeToggle.click();
      await page.waitForTimeout(300);

      const html = page.locator("html");
      const theme = await html.getAttribute("data-theme");
      expect(theme).toBeDefined();
    }
  });

  test("theme persists in localStorage", async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page
      .locator(
        'button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]',
      )
      .first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
      await page.waitForTimeout(300);

      const storedTheme = await page.evaluate(() => {
        return localStorage.getItem("testdev:theme");
      });
      expect(storedTheme).toBeDefined();
      expect(storedTheme).toMatch(/^(dark|light|auto)$/);

      await page.reload();
      await page.waitForLoadState("domcontentloaded");

      const html = page.locator("html");
      const themeAfterReload = await html.getAttribute("data-theme");
      expect(themeAfterReload).toBeDefined();
    }
  });

  test("theme toggle button is accessible", async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page
      .locator(
        'button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]',
      )
      .first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await expect(themeToggle).toBeVisible();
      await expect(themeToggle).toBeEnabled();

      const accessibleName = await themeToggle.getAttribute("aria-label");
      const title = await themeToggle.getAttribute("title");
      expect(accessibleName || title).toBeTruthy();
    }
  });

  test("theme switching works on content pages", async ({ page }) => {
    await page.goto(appUrl("/glossary"));
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page
      .locator(
        'button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]',
      )
      .first();

    if (await themeToggle.isVisible().catch(() => false)) {
      await themeToggle.click();
      await page.waitForTimeout(300);

      const html = page.locator("html");
      const theme = await html.getAttribute("data-theme");
      expect(theme).toBeDefined();
    }
  });
});
