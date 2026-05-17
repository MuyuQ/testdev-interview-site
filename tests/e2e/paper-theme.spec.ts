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
  return page
    .locator(selector)
    .first()
    .evaluate((node, cssProperty) => {
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

test.describe("v3 theme regressions", () => {
  test("light theme uses the V3 neutral shell on homepage", async ({
    page,
  }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await readRootTokens(page)).toEqual({
      bg: "#fafaf9",
      card: "#ffffff",
      accent: "#7c3aed",
    });
    expect(await readStyle(page, ".roadmap-card", "border-radius")).toBe(
      "24px",
    );
    expect(await readStyle(page, ".module-card", "background-color")).toBe(
      "rgb(255, 255, 255)",
    );
  });

  test("dark homepage keeps the V3 elevated gradient shell", async ({
    page,
  }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const home = await page.evaluate(() => {
      const roadmapCard = document.querySelector(".roadmap-card");
      const hero = document.querySelector(".hero");

      return {
        roadmapBg: roadmapCard
          ? getComputedStyle(roadmapCard).backgroundColor
          : "",
        roadmapImage: roadmapCard
          ? getComputedStyle(roadmapCard).backgroundImage
          : "",
        roadmapRadius: roadmapCard
          ? getComputedStyle(roadmapCard).borderRadius
          : "",
        heroBorder: hero ? getComputedStyle(hero).borderBottomColor : "",
        heroBorderWidth: hero ? getComputedStyle(hero).borderBottomWidth : "",
      };
    });

    expect(home.roadmapBg).toBe("rgba(0, 0, 0, 0)");
    expect(home.roadmapImage).toContain("rgb(37, 34, 47)");
    expect(home.roadmapRadius).toBe("24px");
    expect(home.heroBorder).toBe("rgb(245, 245, 244)");
    expect(home.heroBorderWidth).toBe("0px");
  });

  test("dark theme uses V3 docs chrome", async ({ page }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    expect(
      await readStyle(
        page,
        ".sidebar-content a[aria-current='page']",
        "border-left-width",
      ),
    ).toBe("3px");
    expect(await readStyle(page, ".pagination-link", "border-radius")).toBe(
      "16px",
    );
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
      linkColor: "rgb(167, 139, 250)",
      accentColor: "rgb(167, 139, 250)",
    });
  });

  test("light docs header uses V3 title bar", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/scenario/payment-callback/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, "header.header", "background-color")).toBe(
      "rgb(255, 255, 255)",
    );
    expect(await readStyle(page, ".site-title", "color")).toBe(
      "rgb(124, 58, 237)",
    );
  });

  test("shared controls use V3 radii", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/coding/assertion-wrapper/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".share-btn", "border-radius")).toBe("8px");

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    expect(await readStyle(page, ".recent-card", "border-radius")).toBe("16px");
  });
});
