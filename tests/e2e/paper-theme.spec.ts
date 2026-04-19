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

async function readRootTokens(page: Page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      bg: root.getPropertyValue("--sl-color-bg").trim(),
      card: root.getPropertyValue("--sl-color-bg-card").trim(),
      accent: root.getPropertyValue("--sl-color-accent").trim(),
    };
  });
}

test.describe("paper theme regressions", () => {
  test("light theme uses warm paper shell on homepage", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await readRootTokens(page)).toEqual({
      bg: "#f4efe6",
      card: "#fbf7ef",
      accent: "#315c85",
    });
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
        heroBorderWidth: hero ? getComputedStyle(hero).borderBottomWidth : "",
      };
    });

    expect(home.roadmapBg).toBe("rgb(24, 27, 34)");
    expect(home.heroBorder).toBe("rgba(217, 221, 214, 0.14)");
    expect(home.heroBorderWidth).toBe("1px");
  });

  test("dark theme uses quiet docs chrome", async ({ page }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".sidebar-content a[aria-current='page']", "border-left-width")).toBe(
      "2px",
    );
    expect(await readStyle(page, ".pagination-link", "border-radius")).toBe("0px");
    expect(
      await page.evaluate(() => {
        const link = document.querySelector(".sl-markdown-content a");
        if (!(link instanceof HTMLElement)) {
          return null;
        }

        const probe = document.createElement("span");
        probe.style.color = "var(--sl-color-accent)";
        document.body.appendChild(probe);

        const result = {
          linkColor: getComputedStyle(link).color,
          accentColor: getComputedStyle(probe).color,
        };

        probe.remove();
        return result;
      }),
    ).toEqual({
      linkColor: "rgb(126, 161, 196)",
      accentColor: "rgb(126, 161, 196)",
    });
  });

  test("light docs header keeps the paper title bar", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/scenario/payment-callback/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, "header.header", "background-color")).toBe("rgb(247, 241, 231)");
    expect(await readStyle(page, ".site-title", "color")).toBe("rgb(49, 92, 133)");
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
