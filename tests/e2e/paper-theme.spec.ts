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
    await page.waitForFunction(() => document.querySelectorAll(".share-btn").length > 0);

    await page.evaluate(() => {
      if (!document.querySelector(".recent-views")) {
        const recentViews = document.createElement("div");
        recentViews.className = "recent-views";
        document.body.appendChild(recentViews);
      }

      if (!document.querySelector(".difficulty-btn")) {
        const difficultyButton = document.createElement("button");
        difficultyButton.className = "difficulty-btn";
        difficultyButton.type = "button";
        difficultyButton.textContent = "全部";
        document.body.appendChild(difficultyButton);
      }
    });

    const ui = await page.evaluate(() => {
      const shareButton = document.querySelector(".share-btn");
      const recentViews = document.querySelector(".recent-views");
      const difficultyButton = document.querySelector(".difficulty-btn");

      return {
        shareRadius: shareButton ? getComputedStyle(shareButton).borderRadius : "",
        recentRadius: recentViews ? getComputedStyle(recentViews).borderRadius : "",
        filterRadius: difficultyButton ? getComputedStyle(difficultyButton).borderRadius : "",
      };
    });

    expect(ui.shareRadius).toBe("0px");
    expect(ui.recentRadius).toBe("0px");
    expect(ui.filterRadius).toBe("0px");
  });
});
