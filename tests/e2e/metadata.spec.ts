import { expect, test } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("metadata", () => {
  test("content pages use Chinese language metadata and canonical page URL", async ({
    page,
  }) => {
    await page.goto(appUrl("/tech/pytest/"));

    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://muyuq.github.io/testdev-interview-site/tech/pytest/",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://muyuq.github.io/testdev-interview-site/tech/pytest/",
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "zh_CN",
    );
  });

  test("social preview image exists and is referenced consistently", async ({
    page,
    request,
  }) => {
    await page.goto(appUrl("/"));

    const imageUrl = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    expect(imageUrl).toBe(
      "https://muyuq.github.io/testdev-interview-site/og-image.png",
    );

    const response = await request.get(appUrl("/og-image.png"));
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
