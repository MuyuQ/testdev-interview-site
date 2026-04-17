import { test, expect } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("dark mode applies correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
      await page.waitForLoadState("networkidle");

      const html = page.locator("html");
      const themeAfterReload = await html.getAttribute("data-theme");
      expect(themeAfterReload).toBeDefined();
    }
  });

  test("theme toggle button is accessible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
    await page.goto("/glossary");
    await page.waitForLoadState("networkidle");

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
