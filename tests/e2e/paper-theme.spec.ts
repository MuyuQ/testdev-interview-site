import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("paper theme tokens", () => {
  test("light theme uses warm paper colors on the homepage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const themeValues = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        bg: root.getPropertyValue("--sl-color-bg").trim(),
        card: root.getPropertyValue("--sl-color-bg-card").trim(),
        accent: root.getPropertyValue("--sl-color-accent").trim(),
        radius: root.getPropertyValue("--radius-md").trim(),
      };
    });

    expect(themeValues.bg).toBe("#f4efe6");
    expect(themeValues.card).toBe("#fbf7ef");
    expect(themeValues.accent).toBe("#315c85");
    expect(themeValues.radius).toBe("0px");
  });

  test("dark theme uses ink paper colors on a docs page", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "dark");
    });

    await page.goto(appUrl("/glossary/"));
    await page.waitForLoadState("domcontentloaded");

    const themeValues = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        bg: root.getPropertyValue("--sl-color-bg").trim(),
        card: root.getPropertyValue("--sl-color-bg-card").trim(),
        accent: root.getPropertyValue("--sl-color-accent").trim(),
      };
    });

    expect(themeValues.bg).toBe("#111318");
    expect(themeValues.card).toBe("#181b22");
    expect(themeValues.accent).toBe("#7ea1c4");
  });
});

test.describe("paper documentation shell", () => {
  test("docs pages use square panels and quiet borders", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
    });

    await page.goto(appUrl("/interview-chains/test-framework/"));
    await page.waitForLoadState("domcontentloaded");

    const shell = await page.evaluate(() => {
      const sidebarCurrent = document.querySelector(".sidebar-content a[aria-current='page']");
      const contentHeading = document.querySelector(".sl-markdown-content h2");
      const inlineCode = document.querySelector(".sl-markdown-content code:not(pre code)");

      return {
        sidebarRadius: sidebarCurrent ? getComputedStyle(sidebarCurrent).borderRadius : "",
        sidebarBorderLeft: sidebarCurrent ? getComputedStyle(sidebarCurrent).borderLeftWidth : "",
        headingBorder: contentHeading ? getComputedStyle(contentHeading).borderBottomWidth : "",
        inlineCodeRadius: inlineCode ? getComputedStyle(inlineCode).borderRadius : "",
      };
    });

    expect(shell.sidebarRadius).toBe("0px");
    expect(shell.sidebarBorderLeft).toBe("2px");
    expect(shell.headingBorder).toBe("1px");
    expect(shell.inlineCodeRadius).toBe("0px");
  });
});

test.describe("paper theme shared components", () => {
  test("interactive components use square edges and restrained hover states", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
    });

    await page.goto(appUrl("/interview-chains/test-framework/"));
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const shareRadius = await page.locator(".share-btn").first().evaluate((node) => getComputedStyle(node).borderRadius);
    expect(shareRadius).toBe("0px");

    const difficultyRadius = await page.evaluate(() => {
      const probeStyle = document.createElement("style");
      probeStyle.textContent = "button { border-radius: 999px; }";
      document.head.appendChild(probeStyle);

      const probeButton = document.createElement("button");
      probeButton.className = "difficulty-btn";
      probeButton.type = "button";
      probeButton.textContent = "全部";
      document.body.appendChild(probeButton);

      const borderRadius = getComputedStyle(probeButton).borderRadius;

      probeButton.remove();
      probeStyle.remove();

      return borderRadius;
    });

    expect(difficultyRadius).toBe("0px");

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const recentRadius = await page.locator(".recent-views").evaluate((node) => getComputedStyle(node).borderRadius);
    expect(recentRadius).toBe("0px");
  });
});
