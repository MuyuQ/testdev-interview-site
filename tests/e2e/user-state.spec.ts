import { expect, test } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("User state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(appUrl("/"));
    await page.evaluate(() => localStorage.clear());
  });

  test("marks a content page complete and shows progress on homepage", async ({
    page,
  }) => {
    await page.goto(appUrl("/tech/pytest/"));

    const completeButton = page.locator(
      ".content-panel:has(.sl-markdown-content) [data-completion-button]",
    );
    await expect(completeButton).toBeVisible();
    await expect(completeButton).toHaveText("标记完成");
    await completeButton.click();
    await expect(completeButton).toHaveText("已完成");
    await expect(completeButton).toHaveAttribute("aria-pressed", "true");

    await page.goto(appUrl("/"));
    await expect(page.getByText(/已完成 1 \/ \d+ 个主题/)).toBeVisible();
  });

  test("bookmarks a content page", async ({ page }) => {
    await page.goto(appUrl("/tech/pytest/"));

    const bookmarkButton = page.getByRole("button", { name: /收藏/ });
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveAttribute("aria-pressed", "true");

    const bookmarks = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("testdev:bookmarks") ?? "[]"),
    );

    expect(bookmarks).toContain("tech/pytest");
  });

  test("keeps same-slug recent views from different categories", async ({
    page,
  }) => {
    await page.goto(appUrl("/glossary/data-driven-testing/"));
    await page.goto(appUrl("/tech/data-driven-testing/"));

    const recent = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("testdev:recent") ?? "[]"),
    );

    expect(
      recent.map(
        (item: { category: string; slug: string }) =>
          `${item.category}/${item.slug}`,
      ),
    ).toEqual(["tech/data-driven-testing", "glossary/data-driven-testing"]);

    await page.goto(appUrl("/"));
    await expect(page.locator("#recent-views-list .recent-item")).toHaveCount(
      2,
    );
    await expect(page.locator("#recent-views-list")).toContainText("技术专题");
    await expect(page.locator("#recent-views-list")).toContainText("术语体系");
  });
});
