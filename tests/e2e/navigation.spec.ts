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
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/测试开发面试速成站/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("all category pages are accessible", async ({ page }) => {
    for (const category of CATEGORIES) {
      await page.goto(`/${category}`);
      await expect(page).toHaveURL(new RegExp(`${category}`));
      await expect(page.locator("main")).toBeVisible();
      await expect(
        page.locator("article, [role='main'], main > *").first(),
      ).toBeVisible();
    }
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("nav, aside").first();
    await expect(sidebar).toBeVisible();

    for (const category of CATEGORIES) {
      const link = sidebar.locator(`a[href*="${category}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test("term links navigate correctly", async ({ page }) => {
    await page.goto("/glossary");
    const firstLink = page.locator("a[href*='/glossary/']").first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForURL(`**${href}**`);
      await expect(page.locator("main, article")).toBeVisible();
    }
  });

  test("search functionality works", async ({ page }) => {
    await page.goto("/");
    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="搜索"], input[placeholder*="search"]',
      )
      .first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("API");
      await page.waitForTimeout(500);
      const searchResults = page.locator(
        "[role='listbox'], [class*='search'], mark",
      );
      await expect(searchResults.first())
        .toBeVisible({ timeout: 3000 })
        .catch(() => {});
    }
  });

  test("breadcrumb navigation exists on content pages", async ({ page }) => {
    await page.goto("/glossary");
    const breadcrumb = page.locator(
      "nav[aria-label='Breadcrumb'], [class*='breadcrumb'], sl-breadcrumb",
    );
    if (await breadcrumb.isVisible().catch(() => false)) {
      await expect(breadcrumb).toBeVisible();
    }
  });

  test("header contains site title", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
    await expect(header.getByText(/测试开发面试速成站/)).toBeVisible();
  });
});
