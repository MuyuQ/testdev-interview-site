# Paper Theme Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将全站亮暗主题重构为“暖米白阅读纸 / 深墨纸页”的统一文档主题，并移除圆角卡片风格。

**Architecture:** 以 `src/styles/tokens.css` 重建亮暗主题变量，以 `src/styles/custom-layout.css` 收敛文档壳、正文排版和 Starlight 容器，以 `src/styles/components.css` 收敛控件和局部模块，再把首页从内联样式迁移到共享样式文件。视觉回归用 Playwright 断言真实页面的主题属性、背景层级、边框和圆角状态。

**Tech Stack:** Astro 4, Starlight, CSS variables, Playwright, Vitest, TypeScript

---

## File Structure

### Existing files to modify

- `src/styles/tokens.css`
  - 统一定义亮暗主题变量、边框、强调色、代码块和文档壳背景。
- `src/styles/custom-layout.css`
  - 收敛正文、侧栏、TOC、表格、引用、代码块、滚动条和标题层级。
- `src/styles/components.css`
  - 收敛按钮、卡片、过滤器、搜索框、分享按钮、分页、最近浏览等组件。
- `src/components/HomePage.astro`
  - 从内联样式切换到共享首页样式，只保留结构和脚本。
- `tests/e2e/theme.spec.ts`
  - 保留主题切换与持久化回归，补最小的“切换后依然可用”断言。

### New files to create

- `src/styles/home-page.css`
  - 首页专属的文档目录页样式，覆盖 hero、学习路线、模块入口、进度区和最近浏览区。
- `tests/e2e/paper-theme.spec.ts`
  - 纸质主题的视觉回归测试，断言亮暗主题下的背景、边框、圆角和首页模块状态。

---

### Task 1: Rebuild Theme Tokens

**Files:**
- Modify: `src/styles/tokens.css`
- Test: `tests/e2e/paper-theme.spec.ts`

- [ ] **Step 1: 写失败的主题变量回归测试**

```ts
import { test, expect } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("paper theme tokens", () => {
  test("light theme uses warm paper colors on the homepage", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
      document.documentElement.dataset.theme = "light";
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
      document.documentElement.dataset.theme = "dark";
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
```

- [ ] **Step 2: 运行新测试并确认它先失败**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme tokens"`

Expected: FAIL，提示亮色仍是白底、暗色仍是旧 slate 配色，且 `--radius-md` 不是 `0px`。

- [ ] **Step 3: 在 tokens 中重建亮暗主题变量**

```css
/* src/styles/tokens.css */
:root {
  --font-sans: "Noto Sans SC", "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-full: 0px;
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  --color-bg: #111318;
  --color-text: #d9ddd6;
  --color-primary: #7ea1c4;
  --color-secondary: #91b0cf;
  --color-accent: #7ea1c4;
  --color-border: rgba(217, 221, 214, 0.14);
  --color-code-bg: #171a20;
  --color-card: #181b22;

  --sl-color-bg: #111318;
  --sl-color-bg-nav: #15181f;
  --sl-color-bg-aside: #15181f;
  --sl-color-bg-card: #181b22;
  --sl-color-bg-inline-code: #171a20;
  --sl-color-white: #eef1ea;
  --sl-color-gray-1: #d9ddd6;
  --sl-color-gray-2: #aeb5af;
  --sl-color-gray-3: #848c88;
  --sl-color-gray-4: rgba(217, 221, 214, 0.18);
  --sl-color-gray-5: rgba(217, 221, 214, 0.08);
  --sl-color-gray-6: #15181f;
  --sl-color-accent: #7ea1c4;
  --sl-color-accent-low: rgba(126, 161, 196, 0.12);
  --sl-color-accent-high: rgba(126, 161, 196, 0.22);
  --sl-color-hairline: rgba(217, 221, 214, 0.14);
  --sl-color-hairline-shade: rgba(217, 221, 214, 0.08);
  --sl-color-hairline-light: #15181f;
}

[data-theme="light"] {
  --color-bg: #f4efe6;
  --color-text: #2f2a24;
  --color-primary: #315c85;
  --color-secondary: #4b6f90;
  --color-accent: #315c85;
  --color-border: #d8d0c2;
  --color-code-bg: #efe7da;
  --color-card: #fbf7ef;

  --sl-color-bg: #f4efe6;
  --sl-color-bg-nav: #f7f1e7;
  --sl-color-bg-aside: #f7f1e7;
  --sl-color-bg-card: #fbf7ef;
  --sl-color-bg-inline-code: #efe7da;
  --sl-color-white: #201b17;
  --sl-color-gray-1: #2f2a24;
  --sl-color-gray-2: #5d554d;
  --sl-color-gray-3: #877d73;
  --sl-color-gray-4: #d8d0c2;
  --sl-color-gray-5: #e9e1d5;
  --sl-color-gray-6: #f7f1e7;
  --sl-color-accent: #315c85;
  --sl-color-accent-low: rgba(49, 92, 133, 0.08);
  --sl-color-accent-high: rgba(49, 92, 133, 0.18);
  --sl-color-hairline: #d8d0c2;
  --sl-color-hairline-shade: #e9e1d5;
  --sl-color-hairline-light: #f7f1e7;
}
```

- [ ] **Step 4: 重新运行 token 测试**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme tokens"`

Expected: PASS，两个测试都能拿到新的亮暗主题变量和值。

- [ ] **Step 5: 提交 token 改动**

```bash
git add src/styles/tokens.css tests/e2e/paper-theme.spec.ts
git commit -m "feat: add paper theme tokens"
```

### Task 2: Restyle the Global Documentation Shell

**Files:**
- Modify: `src/styles/custom-layout.css`
- Test: `tests/e2e/paper-theme.spec.ts`

- [ ] **Step 1: 为文档壳写失败测试**

```ts
test.describe("paper documentation shell", () => {
  test("docs pages use square panels and quiet borders", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
      document.documentElement.dataset.theme = "light";
    });

    await page.goto(appUrl("/glossary/"));
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
```

- [ ] **Step 2: 运行壳层测试并确认它失败**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper documentation shell"`

Expected: FAIL，当前页仍有圆角导航态、代码块圆角或不够明确的文档分隔。

- [ ] **Step 3: 改造全局布局样式**

```css
/* src/styles/custom-layout.css */
.sl-page-title h1 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin-bottom: 1rem;
  color: var(--sl-color-white);
}

.sl-markdown-content h2 {
  font-size: 1.45rem;
  font-weight: 600;
  margin-top: 2.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  color: var(--sl-color-white);
  border-bottom: 1px solid var(--sl-color-hairline);
}

.sidebar-content a[aria-current="page"] {
  background: var(--sl-color-accent-low);
  color: var(--sl-color-accent);
  font-weight: 600;
  border-radius: 0;
  border-left: 2px solid var(--sl-color-accent);
}

.sidebar-content a:hover:not([aria-current="page"]) {
  background: var(--sl-color-gray-6);
  border-radius: 0;
}

.sl-markdown-content pre,
.sl-markdown-content code:not(pre code),
.sl-markdown-content blockquote,
.sl-markdown-content table,
.sl-markdown-content th,
.sl-markdown-content td {
  border-radius: 0;
}

.sl-markdown-content blockquote {
  border-left: 2px solid var(--sl-color-accent);
  background: var(--sl-color-accent-low);
  color: var(--sl-color-gray-2);
}

::-webkit-scrollbar-thumb {
  border-radius: 0;
}
```

- [ ] **Step 4: 重新运行文档壳测试**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper documentation shell"`

Expected: PASS，当前项、标题分隔、inline code 和文档块全部变成直角纸页语言。

- [ ] **Step 5: 提交壳层样式改动**

```bash
git add src/styles/custom-layout.css tests/e2e/paper-theme.spec.ts
git commit -m "feat: restyle documentation shell"
```

### Task 3: Unify Shared Components Around the Paper Theme

**Files:**
- Modify: `src/styles/components.css`
- Test: `tests/e2e/paper-theme.spec.ts`

- [ ] **Step 1: 为按钮、卡片和控件写失败测试**

```ts
test.describe("paper theme shared components", () => {
  test("interactive components use square edges and restrained hover states", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
      document.documentElement.dataset.theme = "light";
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

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
```

- [ ] **Step 2: 运行共享组件测试并确认它失败**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme shared components"`

Expected: FAIL，当前共享控件仍然继承旧的圆角和悬浮卡片行为。

- [ ] **Step 3: 改造共享组件样式**

```css
/* src/styles/components.css */
.card,
.btn,
.share-btn,
.nav-link,
.pagination-link,
.recent-views,
.difficulty-btn,
.tag-btn,
.search-input,
.term-popup,
.progress-bar,
.progress-bar-fill {
  border-radius: 0;
}

.card,
.recent-views,
.nav-link,
.pagination-link {
  background: var(--sl-color-bg-card);
  border: 1px solid var(--sl-color-hairline);
  box-shadow: none;
}

.card:hover,
.nav-link:hover,
.pagination-link:hover {
  border-color: var(--sl-color-accent);
  box-shadow: none;
  transform: translateY(-1px);
}

.btn,
.share-btn,
.difficulty-btn,
.tag-btn,
.search-input {
  background: var(--sl-color-bg);
  border: 1px solid var(--sl-color-hairline);
  color: var(--sl-color-gray-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--sl-color-accent);
  box-shadow: 0 0 0 2px var(--sl-color-accent-low);
}
```

- [ ] **Step 4: 重新运行共享组件测试**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme shared components"`

Expected: PASS，控件边缘变直，hover 反馈收敛为细边框和轻位移。

- [ ] **Step 5: 提交共享组件改动**

```bash
git add src/styles/components.css tests/e2e/paper-theme.spec.ts
git commit -m "feat: restyle shared components for paper theme"
```

### Task 4: Convert the Homepage Into a Documentation Index

**Files:**
- Create: `src/styles/home-page.css`
- Modify: `src/components/HomePage.astro`
- Test: `tests/e2e/paper-theme.spec.ts`

- [ ] **Step 1: 为首页目录页样式写失败测试**

```ts
test.describe("paper theme homepage", () => {
  test("homepage uses documentation-index styling in both themes", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("starlight-theme", "light");
      document.documentElement.dataset.theme = "light";
    });

    await page.goto(appUrl("/"));
    await page.waitForLoadState("domcontentloaded");

    const home = await page.evaluate(() => {
      const hero = document.querySelector(".hero");
      const roadmapCard = document.querySelector(".roadmap-card");
      const moduleCard = document.querySelector(".module-card");

      return {
        heroBorder: hero ? getComputedStyle(hero).borderBottomWidth : "",
        roadmapRadius: roadmapCard ? getComputedStyle(roadmapCard).borderRadius : "",
        moduleBg: moduleCard ? getComputedStyle(moduleCard).backgroundColor : "",
      };
    });

    expect(home.heroBorder).toBe("1px");
    expect(home.roadmapRadius).toBe("0px");
    expect(home.moduleBg).toBe("rgb(251, 247, 239)");
  });
});
```

- [ ] **Step 2: 运行首页测试并确认它失败**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme homepage"`

Expected: FAIL，首页仍然使用内联圆角卡片和更偏 marketing 的阴影布局。

- [ ] **Step 3: 创建首页共享样式并移除内联样式块**

```astro
---
import { getHomePageData } from "../lib/home-page";
import { getProgress } from "../lib/progress-store";
import RecentViews from "./RecentViews.astro";
import "../styles/home-page.css";

const progress = getProgress();
const completedCount = progress.completed.length;
const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const { roadmapLinks, moduleLinks } = getHomePageData(base);
---
```

```css
/* src/styles/home-page.css */
.home-page {
  max-width: min(1120px, calc(100% - 3rem));
  margin: 0 auto;
  padding: 2.5rem 0 4rem;
}

.hero {
  padding: 0 0 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--sl-color-hairline);
}

.roadmap-cards,
.module-grid {
  display: grid;
  gap: 1px;
  background: var(--sl-color-hairline);
  border: 1px solid var(--sl-color-hairline);
}

.roadmap-card,
.module-card,
.progress-overview {
  display: block;
  padding: 1.25rem;
  background: var(--sl-color-bg-card);
  border: 0;
  border-radius: 0;
  box-shadow: none;
  text-decoration: none;
  color: inherit;
}

.roadmap-card:hover,
.module-card:hover {
  background: var(--sl-color-accent-low);
  transform: translateY(-1px);
}
```

- [ ] **Step 4: 重新运行首页样式测试**

Run: `npx playwright test tests/e2e/paper-theme.spec.ts --project=chromium --grep "paper theme homepage"`

Expected: PASS，首页 hero 具备文档分隔线，入口块变成直角目录块，亮色模块背景进入纸面色阶。

- [ ] **Step 5: 提交首页收敛改动**

```bash
git add src/components/HomePage.astro src/styles/home-page.css tests/e2e/paper-theme.spec.ts
git commit -m "feat: turn homepage into documentation index"
```

### Task 5: Lock In Theme Regression Coverage

**Files:**
- Modify: `tests/e2e/paper-theme.spec.ts`
- Modify: `tests/e2e/theme.spec.ts`

- [ ] **Step 1: 为主题切换和持久化补充最终回归断言**

```ts
// tests/e2e/theme.spec.ts
test("light mode applies correctly", async ({ page }) => {
  await page.goto(appUrl("/"));
  await page.waitForLoadState("domcontentloaded");

  const themeToggle = page
    .locator('button[aria-label*="theme"], button[title*="主题"], [class*="theme-toggle"]')
    .first();

  await expect(themeToggle).toBeVisible();
  await themeToggle.click();
  await page.waitForTimeout(300);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const shellColor = await page.locator(".roadmap-card").first().evaluate((node) => {
    return getComputedStyle(node).backgroundColor;
  });

  expect(shellColor).toBe("rgb(251, 247, 239)");
});
```

```ts
// tests/e2e/paper-theme.spec.ts
test("dark homepage keeps the ink-paper shell", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("starlight-theme", "dark");
    document.documentElement.dataset.theme = "dark";
  });

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
```

- [ ] **Step 2: 运行新增回归并确认当前断言能失败 / 暴露遗漏**

Run: `npx playwright test tests/e2e/theme.spec.ts tests/e2e/paper-theme.spec.ts --project=chromium`

Expected: 若前四个任务有遗漏，至少一条断言失败；全部完成后应变为 PASS。

- [ ] **Step 3: 对齐遗漏并保持测试文件简洁**

```ts
// tests/e2e/paper-theme.spec.ts
async function forceTheme(page: import("@playwright/test").Page, theme: "light" | "dark") {
  await page.addInitScript((value) => {
    localStorage.setItem("starlight-theme", value);
    document.documentElement.dataset.theme = value;
  }, theme);
}

async function readStyle(page: import("@playwright/test").Page, selector: string, property: keyof CSSStyleDeclaration) {
  return page.locator(selector).first().evaluate((node, cssProperty) => {
    return getComputedStyle(node).getPropertyValue(cssProperty).trim();
  }, property as string);
}

test.describe("paper theme regressions", () => {
  test("light theme uses warm paper shell on homepage", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/"));
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(readStyle(page, ".roadmap-card", "border-radius")).resolves.toBe("0px");
    await expect(readStyle(page, ".module-card", "background-color")).resolves.toBe("rgb(251, 247, 239)");
  });

  test("dark theme uses ink paper shell on docs page", async ({ page }) => {
    await forceTheme(page, "dark");
    await page.goto(appUrl("/glossary/"));
    await expect(readStyle(page, ".sidebar-content a[aria-current='page']", "border-left-width")).resolves.toBe("2px");
    await expect(readStyle(page, ".sl-markdown-content pre", "border-radius")).resolves.toBe("0px");
  });

  test("shared controls stay square", async ({ page }) => {
    await forceTheme(page, "light");
    await page.goto(appUrl("/"));
    await expect(readStyle(page, ".share-btn", "border-radius")).resolves.toBe("0px");
    await expect(readStyle(page, ".recent-views", "border-radius")).resolves.toBe("0px");
  });
});
```

- [ ] **Step 4: 运行完整验证**

Run: `npm run check`
Expected: PASS

Run: `npm run test:e2e`
Expected: PASS，Chromium / Firefox / WebKit 都通过主题与导航回归。

- [ ] **Step 5: 提交最终回归与验证结果**

```bash
git add tests/e2e/theme.spec.ts tests/e2e/paper-theme.spec.ts
git commit -m "test: add paper theme regressions"
```
