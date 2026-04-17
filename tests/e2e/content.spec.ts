import { test, expect } from "@playwright/test";

test.describe("Content Rendering", () => {
  test("glossary pages render correctly", async ({ page }) => {
    await page.goto("/glossary");
    await expect(page.locator("main")).toBeVisible();

    const glossaryLinks = page.locator("a[href*='/glossary/']");
    const count = await glossaryLinks.count();
    expect(count).toBeGreaterThan(0);

    const firstGlossaryLink = glossaryLinks.first();
    await firstGlossaryLink.click();
    await page.waitForURL("**/glossary/**");
    await expect(
      page.locator("article, main h1, sl-markdown-view"),
    ).toBeVisible();
  });

  test("tech pages have code blocks", async ({ page }) => {
    await page.goto("/tech");
    await expect(page.locator("main")).toBeVisible();

    const techLinks = page.locator("a[href*='/tech/']");
    const firstTechLink = techLinks.first();
    if (await firstTechLink.isVisible()) {
      await firstTechLink.click();
      await page.waitForURL("**/tech/**");
      await expect(page.locator("main, article")).toBeVisible();

      const codeBlocks = page.locator("pre, code, [class*='code']");
      const codeCount = await codeBlocks.count();
      expect(codeCount).toBeGreaterThan(0);
    }
  });

  test("self-test quizzes are interactive", async ({ page }) => {
    await page.goto("/coding");
    await expect(page.locator("main")).toBeVisible();

    const codingLinks = page.locator("a[href*='/coding/']");
    const firstCodingLink = codingLinks.first();
    if (await firstCodingLink.isVisible()) {
      await firstCodingLink.click();
      await page.waitForURL("**/coding/**");
      await expect(page.locator("main, article")).toBeVisible();

      const quizElements = page.locator(
        "details, summary, button, input[type='radio'], input[type='checkbox'], [class*='quiz'], [class*='test']",
      );
      const quizCount = await quizElements.count();
      expect(quizCount).toBeGreaterThan(0);
    }
  });

  test("term cross-links work", async ({ page }) => {
    await page.goto("/glossary");
    const links = page.locator("a[href*='/glossary/'], a[href*='/tech/']");
    const firstLink = links.first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute("href");
      await firstLink.click();
      await page.waitForURL(`**${href?.replace(/^\//, "")}**`);
      await expect(page.locator("main, article")).toBeVisible();
    }
  });

  test("content pages have proper headings structure", async ({ page }) => {
    await page.goto("/tech");
    const techLinks = page.locator("a[href*='/tech/']");
    const firstTechLink = techLinks.first();
    if (await firstTechLink.isVisible()) {
      await firstTechLink.click();
      await page.waitForURL("**/tech/**");

      const h1 = page.locator("h1");
      await expect(h1.first()).toBeVisible();

      const headings = page.locator("h1, h2, h3");
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThan(1);
    }
  });

  test("scenario pages render Q&A format", async ({ page }) => {
    await page.goto("/scenario");
    await expect(page.locator("main")).toBeVisible();

    const scenarioLinks = page.locator("a[href*='/scenario/']");
    const firstLink = scenarioLinks.first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForURL("**/scenario/**");
      await expect(page.locator("main, article")).toBeVisible();

      const content = page.locator("p, li, td");
      const contentCount = await content.count();
      expect(contentCount).toBeGreaterThan(0);
    }
  });

  test("roadmap page displays structured content", async ({ page }) => {
    await page.goto("/roadmap");
    await expect(page.locator("main")).toBeVisible();

    const roadmapLinks = page.locator("a[href*='/roadmap/']");
    const firstLink = roadmapLinks.first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForURL("**/roadmap/**");
      await expect(page.locator("main, article")).toBeVisible();
    }
  });

  test("AI learning guides render correctly", async ({ page }) => {
    await page.goto("/ai-learning");
    await expect(page.locator("main")).toBeVisible();

    const aiLinks = page.locator("a[href*='/ai-learning/']");
    const firstLink = aiLinks.first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForURL("**/ai-learning/**");
      await expect(page.locator("main, article")).toBeVisible();
    }
  });
});
