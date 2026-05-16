import { expect, test } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("search", () => {
  test("finds Chinese content by Chinese query", async ({ page }) => {
    await page.goto(appUrl("/tech/pytest/"));

    await page.getByRole("button", { name: /搜索|search/i }).click();
    const searchBox = page.getByRole("textbox", { name: "搜索" });
    await searchBox.fill("接口断言");

    await expect(page.getByText("接口断言").first()).toBeVisible({
      timeout: 5000,
    });
  });
});
