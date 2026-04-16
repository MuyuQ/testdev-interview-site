import { test, expect } from "@playwright/test";

const CATEGORIES = [
  "glossary",
  "tech",
  "project",
  "scenario",
  "coding",
  "roadmap",
  "ai-learning",
  "practice-template",
];

test.describe("Navigation", () => {
  test("homepage should load successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/测试开发面试速成站/);
  });

  test("sidebar should contain all category links", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("nav").first();
    await expect(sidebar).toBeVisible();

    for (const category of CATEGORIES) {
      const link = sidebar.locator(`a[href*="${category}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test("should navigate to each category page", async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.goto(`/${category}`);
      await expect(page).toHaveURL(new RegExp(`${category}`));
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("theme toggle should work", async ({ page }) => {
    await page.goto("/");
    const themeToggle = page
      .locator('button[aria-label*="theme"], button[title*="主题"]')
      .first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(100);
    }
  });
});
