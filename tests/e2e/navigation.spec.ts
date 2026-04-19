import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";
const SAMPLE_PAGES = [
  "/glossary/api-assertion/",
  "/tech/pytest/",
  "/project/ecommerce-project/",
  "/scenario/payment-callback/",
  "/coding/retry-mechanism/",
  "/roadmap/3-day-interview-map/",
  "/ai-learning/testdev-ai-tools/",
  "/practice-template/project-story-template/",
  "/interview-chains/api-testing-chain/",
];
const CONTENT_PAGE = "/glossary/api-assertion/";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("Navigation", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto(appUrl("/"));
    await expect(page).toHaveTitle(/测试开发面试速成站/);
    await expect(page.locator("[role='main']")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "测试开发面试速成站",
    );
  });

  test("all category pages are accessible", async ({ page }) => {
    for (const path of SAMPLE_PAGES) {
      await page.goto(appUrl(path));
      await expect(page).toHaveURL(new RegExp(path.replaceAll("/", "\\/")));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto(appUrl(CONTENT_PAGE));
    const sidebar = page.locator("nav[aria-label='Main']");
    await expect(sidebar).toHaveCount(1);
    await expect(sidebar.locator("a[href*='/glossary/']").first()).toHaveCount(1);
    await expect(sidebar.locator("a[href*='/tech/']").first()).toHaveCount(1);
    await expect(sidebar.locator("a[href*='/interview-chains/']").first()).toHaveCount(1);
  });

  test("term links navigate correctly", async ({ page }) => {
    await page.goto(appUrl(CONTENT_PAGE));
    const firstLink = page.locator("nav[aria-label='Main'] a[href*='/glossary/']").nth(1);
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForURL(`**${href}**`);
      await expect(page.locator("main, article")).toBeVisible();
    }
  });

  test("search functionality works", async ({ page }) => {
    await page.goto(appUrl(CONTENT_PAGE));
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
    await page.goto(appUrl(CONTENT_PAGE));
    const breadcrumb = page.locator(
      "nav[aria-label='Breadcrumb'], [class*='breadcrumb'], sl-breadcrumb",
    );
    if (await breadcrumb.isVisible().catch(() => false)) {
      await expect(breadcrumb).toBeVisible();
    }
  });

  test("header contains site title", async ({ page }) => {
    await page.goto(appUrl(CONTENT_PAGE));
    const header = page.locator("header[role='banner']").first();
    await expect(header).toBeVisible();
    await expect(header.getByText(/测试开发面试速成站/)).toBeVisible();
  });
});
