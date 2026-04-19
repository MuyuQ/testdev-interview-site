import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("Content Rendering", () => {
  test("glossary pages render correctly", async ({ page }) => {
    await page.goto(appUrl("/glossary/api-assertion/"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "接口断言",
    );
    await expect(page.locator(".content-panel").last()).toBeVisible();
  });

  test("tech pages have code blocks", async ({ page }) => {
    await page.goto(appUrl("/tech/playwright/"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const codeBlocks = page.locator("pre, code, [class*='code']");
    const codeCount = await codeBlocks.count();
    expect(codeCount).toBeGreaterThan(0);
  });

  test("self-test quizzes are interactive", async ({ page }) => {
    await page.goto(appUrl("/coding/retry-mechanism/"));
    await expect(page.locator(".self-test-quiz")).toBeVisible();

    const quizElements = page.locator(
      "button, input[type='radio'], [class*='quiz'], [class*='test']",
    );
    const quizCount = await quizElements.count();
    expect(quizCount).toBeGreaterThan(0);
  });

  test("term cross-links work", async ({ page }) => {
    await page.goto(appUrl("/glossary/api-assertion/"));
    const links = page.locator("nav[aria-label='Main'] a[href*='/glossary/'], nav[aria-label='Main'] a[href*='/tech/']");
    const firstLink = links.first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForURL(`**${href?.replace(/^\//, "")}**`);
      await expect(page.locator("main, article")).toBeVisible();
    }
  });

  test("content pages have proper headings structure", async ({ page }) => {
    await page.goto(appUrl("/tech/pytest/"));
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();

    const headings = page.locator("h1, h2, h3");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(1);
  });

  test("scenario pages render Q&A format", async ({ page }) => {
    await page.goto(appUrl("/scenario/payment-callback/"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const content = page.locator("p, li, td");
    const contentCount = await content.count();
    expect(contentCount).toBeGreaterThan(0);
  });

  test("roadmap page displays structured content", async ({ page }) => {
    await page.goto(appUrl("/roadmap/3-day-interview-map/"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".content-panel").last()).toBeVisible();
  });

  test("AI learning guides render correctly", async ({ page }) => {
    await page.goto(appUrl("/ai-learning/testdev-ai-tools/"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".content-panel").last()).toBeVisible();
  });
});
