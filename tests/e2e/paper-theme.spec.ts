import { expect, test, type Page } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

async function forceTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((value) => {
    localStorage.setItem("starlight-theme", value);
  }, theme);
}

async function readStyle(page: Page, selector: string, property: string) {
  return page.locator(selector).first().evaluate((node, cssProperty) => {
    return getComputedStyle(node).getPropertyValue(cssProperty).trim();
  }, property);
}

test.describe("paper theme regressions", () => {
  test("light theme uses warm paper shell on homepage", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await readStyle(page, ".roadmap-card", "border-radius")).toBe("0px");
    expect(await readStyle(page, ".module-card", "background-color")).toBe("rgb(251, 247, 239)");
  });

  test("dark homepage keeps the ink-paper shell", async ({ page }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const home = await page.evaluate(() => {
      const roadmapCard = document.querySelector(".roadmap-card");
      const hero = document.querySelector(".hero");

      return {
        roadmapBg: roadmapCard ? getComputedStyle(roadmapCard).backgroundColor : "",
        heroBorder: hero ? getComputedStyle(hero).borderBottomColor : "",
      };
    });

    expect(home.roadmapBg).toBe("rgb(24, 27, 34)");
    expect(home.heroBorder).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("dark theme uses quiet docs chrome", async ({ page }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".sidebar-content a[aria-current='page']", "border-left-width")).toBe(
      "2px",
    );
    expect(await readStyle(page, ".pagination-link", "border-radius")).toBe("0px");
  });

  test("shared controls stay square", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".share-btn", "border-radius")).toBe("0px");

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".recent-views", "border-radius")).toBe("0px");
  });
});
