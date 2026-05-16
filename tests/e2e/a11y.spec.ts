import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

const pages = [
  "/",
  "/tags/",
  "/difficulty/",
  "/tech/pytest/",
  "/coding/retry-mechanism/",
];

test.describe("accessibility", () => {
  for (const path of pages) {
    test(`has no serious axe violations: ${path}`, async ({ page }) => {
      await page.goto(appUrl(path));

      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const serious = result.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );

      expect(serious).toEqual([]);
    });
  }
});
