# TestDev Sprint Project Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Astro/Starlight Chinese interview-prep site to a more reliable, searchable, maintainable, and safely upgradable state.

**Architecture:** Keep the current Astro 4 + Starlight static-docs architecture. Make improvements through small, verifiable changes: first fix SEO/localization metadata, then complete localStorage-backed user features, then add content validation and stronger quality gates, then handle dependency upgrades in an isolated branch.

**Tech Stack:** Astro 4, `@astrojs/starlight`, TypeScript, Markdown content collections, Vitest, Playwright, ESLint, Prettier, GitHub Pages.

---

## Current Baseline

- `npm run check` passes locally.
- `npm run test:e2e` passes locally: 78 Playwright tests across Chromium, Firefox, and WebKit.
- `npm run format` fails because Prettier scans generated/local tool directories and some source files are not formatted.
- `npm audit` reports 16 vulnerabilities, including 3 high severity issues, mostly through the Astro/Starlight/Vite dependency chain.
- Built Starlight content pages currently render with `lang="en"`, Pagefind detects the site as `en`, and content page canonical tags point to the site root.
- `public/og-image.png` is referenced by metadata but does not exist.

## File Structure Plan

- `astro.config.mjs` - Starlight metadata, localization, canonical behavior, social metadata, font policy.
- `public/og-image.png` - Open Graph preview image used by social metadata.
- `src/components/HomePage.astro` - Homepage rendering and localStorage-backed progress display.
- `src/components/CustomContentPanel.astro` - Content-page wrapper, recent-view tracking, quiz/share mounting.
- `src/components/SidebarProgress.astro` - Reading progress tracking; either fix it or retire it if replaced by explicit completion controls.
- `src/components/CompletionBadge.astro` - Completion state display; wire it into content pages if retained.
- `src/components/BookmarkButton.astro` - Bookmark control; wire it into content pages if retained.
- `src/lib/progress-store.ts` - Shared localStorage progress helpers.
- `src/lib/bookmark-store.ts` - Shared localStorage bookmark helpers.
- `src/lib/home-page.ts` - Homepage link generation and category module data.
- `src/lib/site-config.ts` - Category metadata and recommended entry points.
- `src/content/config.ts` - Content metadata schema.
- `scripts/validate-content.ts` - New content validation script for references, slugs, quiz quality, and homepage recommendations.
- `tests/unit/` - Focused tests for validation helpers and localStorage behavior.
- `tests/e2e/` - Browser tests for metadata, homepage links, progress, bookmarks, sharing, and smoke navigation.
- `.github/workflows/deploy.yml` - CI quality gate and optional smoke E2E job.
- `.gitignore` and `.prettierignore` - Ignore generated output and local tool artifacts.
- `package.json` - Add validation/format scripts and wire them into `check`.

---

### Task 1: Fix Starlight Localization, Canonical URLs, and Social Metadata

**Files:**
- Modify: `astro.config.mjs`
- Create: `public/og-image.png`
- Test: `tests/e2e/metadata.spec.ts`

- [ ] **Step 1: Write metadata E2E tests**

Create `tests/e2e/metadata.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run the metadata tests and confirm failure**

Run:

```bash
npm run test:e2e -- tests/e2e/metadata.spec.ts --project=chromium
```

Expected before implementation:

- The content page language assertion fails because Starlight emits `lang="en"`.
- The canonical assertion fails because content pages point canonical to the site root.
- The image request fails because `public/og-image.png` does not exist.

- [ ] **Step 3: Update Starlight localization and remove fixed canonical**

In `astro.config.mjs`, update the Starlight config so the site language is explicit and no global canonical tag overrides per-page URLs.

Use this shape:

```js
starlight({
  title: "测试开发面试速成站",
  defaultLocale: "root",
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
    },
  },
  head: [
    {
      tag: "meta",
      attrs: {
        name: "robots",
        content:
          "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:site_name",
        content: "测试开发面试速成站",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:locale",
        content: "zh_CN",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:type",
        content: "website",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:image",
        content: "https://muyuq.github.io/testdev-interview-site/og-image.png",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:image:width",
        content: "1200",
      },
    },
    {
      tag: "meta",
      attrs: {
        property: "og:image:height",
        content: "630",
      },
    },
    {
      tag: "meta",
      attrs: {
        name: "twitter:card",
        content: "summary_large_image",
      },
    },
    {
      tag: "meta",
      attrs: {
        name: "twitter:title",
        content: "测试开发面试速成站",
      },
    },
    {
      tag: "meta",
      attrs: {
        name: "twitter:description",
        content: "结构化内容帮助你快速补齐测试开发知识框架",
      },
    },
    {
      tag: "meta",
      attrs: {
        name: "twitter:image",
        content: "https://muyuq.github.io/testdev-interview-site/og-image.png",
      },
    },
  ],
});
```

Important: do not keep a hard-coded `rel="canonical"` item inside `head`.

- [ ] **Step 4: Add the missing Open Graph image**

Create `public/og-image.png` as a 1200x630 PNG.

Recommended content:

- Background: restrained paper/dark editorial style matching the site.
- Primary text: `测试开发面试速成站`
- Secondary text: `结构化内容 · 高频面试 · 项目表达`
- Keep text large enough to read in social previews.

If generating via a design tool, export exactly to:

```text
public/og-image.png
```

- [ ] **Step 5: Re-run metadata tests**

Run:

```bash
npm run test:e2e -- tests/e2e/metadata.spec.ts --project=chromium
```

Expected: all metadata tests pass.

- [ ] **Step 6: Run the full quality gate**

Run:

```bash
npm run check
npm run test:e2e
```

Expected:

- `npm run check` passes.
- `npm run test:e2e` passes.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs public/og-image.png tests/e2e/metadata.spec.ts
git commit -m "fix: correct Chinese metadata and social preview"
```

---

### Task 2: Complete Progress and Bookmark User Features

**Files:**
- Modify: `src/components/CustomContentPanel.astro`
- Modify: `src/components/HomePage.astro`
- Modify: `src/components/BookmarkButton.astro`
- Modify: `src/components/CompletionBadge.astro`
- Modify: `src/components/SidebarProgress.astro`
- Modify: `src/lib/progress-store.ts`
- Modify: `src/lib/bookmark-store.ts`
- Test: `tests/unit/progress-store.test.ts`
- Test: `tests/unit/bookmark-store.test.ts`
- Test: `tests/e2e/user-state.spec.ts`

- [ ] **Step 1: Decide explicit completion behavior**

Use explicit user action as the first implementation:

- Content pages show a "标记完成" button near the share section.
- Clicking it stores `{ slug, category, completedAt }` under `testdev:progress`.
- Clicking again can keep it completed; no uncomplete behavior is required in this task.
- Homepage reads progress on the client and renders `已完成 X / 110 个主题`.
- Bookmark button stores content pages under `testdev:bookmarks`.

This avoids hidden scroll-based completion and gives users predictable control.

- [ ] **Step 2: Extend progress-store tests**

In `tests/unit/progress-store.test.ts`, add a test for duplicate completion updates:

```ts
it("should not duplicate completed entries when marking the same topic twice", () => {
  markAsCompleted("pytest", "tech");
  markAsCompleted("pytest", "tech");

  const progress = getProgress();

  expect(progress.completed).toHaveLength(1);
  expect(progress.completed[0]).toMatchObject({
    slug: "pytest",
    category: "tech",
  });
});
```

- [ ] **Step 3: Run the unit test and confirm current behavior**

Run:

```bash
npm run test -- tests/unit/progress-store.test.ts
```

Expected: test passes if existing helper already deduplicates; if it fails, fix in the next step.

- [ ] **Step 4: Add a reusable client initializer for completion controls**

Create a new exported function in `src/lib/progress-store.ts`:

```ts
export function initializeCompletionControls(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLButtonElement>("[data-completion-button]")
    .forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      const slug = button.dataset.slug;
      const category = button.dataset.category;

      if (!slug || !category) {
        return;
      }

      const updateState = () => {
        const completed = isCompleted(slug, category);
        button.classList.toggle("completed", completed);
        button.setAttribute(
          "aria-pressed",
          completed ? "true" : "false",
        );
        button.textContent = completed ? "已完成" : "标记完成";
      };

      updateState();

      button.addEventListener("click", () => {
        markAsCompleted(slug, category);
        updateState();
      });

      button.dataset.bound = "true";
    });
}
```

- [ ] **Step 5: Render controls in content pages**

In `src/components/CustomContentPanel.astro`, compute slug/category from `entry` and render controls only in the content panel:

```astro
---
import type { Props } from "@astrojs/starlight/props";
import BookmarkButton from "./BookmarkButton.astro";
import SelfTestQuiz from "./SelfTestQuiz.astro";
import ShareButtons from "./ShareButtons.astro";

const { entry } = Astro.props as Props;
const selfTests = entry.data.selfTests ?? [];
const [category, slug] = entry.slug.split("/");
---

<div class="content-panel" role="main">
  <div class="sl-container">
    <slot />
    {selfTests.length > 0 && (
      <div class="quiz-content-only">
        <SelfTestQuiz questions={selfTests} />
      </div>
    )}
    <div class="content-actions" data-content-actions>
      <button
        class="completion-action"
        type="button"
        data-completion-button
        data-category={category}
        data-slug={slug}
        aria-pressed="false"
      >
        标记完成
      </button>
      <BookmarkButton slug={`${category}/${slug}`} />
    </div>
    <div class="share-section">
      <ShareButtons />
    </div>
  </div>
</div>
```

Keep the existing first-panel hiding rule or replace it with:

```css
.content-panel:not(:has(.sl-markdown-content)) .content-actions,
.content-panel:not(:has(.sl-markdown-content)) .self-test-quiz,
.content-panel:not(:has(.sl-markdown-content)) .share-section {
  display: none !important;
}
```

- [ ] **Step 6: Initialize controls after Astro page loads**

In the script block in `src/components/CustomContentPanel.astro`, import and call the initializer:

```ts
import { initializeCompletionControls } from "../lib/progress-store";

function initializeContentPage() {
  removeDuplicateQuizzes();
  trackView();
  initializeCompletionControls(document);
}

initializeContentPage();
document.addEventListener("astro:page-load", initializeContentPage);
```

Remove duplicate `trackView` listener registration so `trackView` is registered once.

- [ ] **Step 7: Update homepage progress client behavior**

In `src/components/HomePage.astro`, do not rely on server-side `getProgress()` for user state.

Render the progress section with a stable hidden default:

```astro
<section
  class="progress-overview"
  aria-label="学习进度"
  data-total-docs={totalDocsCount}
  hidden
>
  <h2>学习进度</h2>
  <p data-progress-text>已完成 0 / {totalDocsCount} 个主题</p>
  <div class="progress-bar">
    <div class="progress-bar-fill" data-progress-fill style="width: 0%"></div>
  </div>
</section>
```

In the page script, add:

```ts
function renderProgressOverview() {
  const section = document.querySelector<HTMLElement>(".progress-overview");
  if (!section) return;

  const total = Number.parseInt(section.dataset.totalDocs ?? "0", 10);
  const text = section.querySelector<HTMLElement>("[data-progress-text]");
  const fill = section.querySelector<HTMLElement>("[data-progress-fill]");

  try {
    const data = JSON.parse(
      localStorage.getItem("testdev:progress") ?? '{"completed":[]}',
    ) as { completed: unknown[] };
    const completed = Array.isArray(data.completed) ? data.completed.length : 0;
    const percent = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

    if (completed > 0) {
      section.hidden = false;
    }
    if (text) {
      text.textContent = `已完成 ${completed} / ${total} 个主题`;
    }
    if (fill) {
      fill.style.width = `${percent}%`;
    }
  } catch {
    section.hidden = true;
  }
}
```

Call `renderProgressOverview()` together with `renderRecentViews()`.

- [ ] **Step 8: Write E2E coverage for completion and bookmarks**

Create `tests/e2e/user-state.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("user state", () => {
  test("marks a content page complete and shows progress on homepage", async ({
    page,
  }) => {
    await page.goto(appUrl("/tech/pytest/"));

    const completeButton = page.getByRole("button", { name: "标记完成" });
    await expect(completeButton).toBeVisible();
    await completeButton.click();
    await expect(completeButton).toHaveText("已完成");

    await page.goto(appUrl("/"));
    await expect(page.getByText(/已完成 1 \/ 110 个主题/)).toBeVisible();
  });

  test("bookmarks a content page", async ({ page }) => {
    await page.goto(appUrl("/tech/pytest/"));

    const bookmarkButton = page.getByRole("button", { name: /收藏|取消收藏/ });
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.click();

    const bookmarks = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("testdev:bookmarks") ?? "[]"),
    );

    expect(bookmarks).toContain("tech/pytest");
  });
});
```

- [ ] **Step 9: Run targeted tests**

Run:

```bash
npm run test -- tests/unit/progress-store.test.ts tests/unit/bookmark-store.test.ts
npm run test:e2e -- tests/e2e/user-state.spec.ts --project=chromium
```

Expected: all targeted tests pass.

- [ ] **Step 10: Run full verification**

Run:

```bash
npm run check
npm run test:e2e
```

Expected: all checks pass.

- [ ] **Step 11: Commit**

```bash
git add src/components/CustomContentPanel.astro src/components/HomePage.astro src/components/BookmarkButton.astro src/components/CompletionBadge.astro src/components/SidebarProgress.astro src/lib/progress-store.ts src/lib/bookmark-store.ts tests/unit/progress-store.test.ts tests/unit/bookmark-store.test.ts tests/e2e/user-state.spec.ts
git commit -m "feat: wire content progress and bookmarks"
```

---

### Task 3: Add Content Integrity Validation

**Files:**
- Create: `scripts/validate-content.ts`
- Modify: `package.json`
- Modify: `src/lib/site-config.ts`
- Test: `tests/unit/content-validation.test.ts`

- [ ] **Step 1: Define validation rules**

The script must fail when:

- A Markdown file's frontmatter `category` does not match its directory.
- A `relatedSlugs` entry does not resolve to an existing content item.
- A bare related slug resolves to more than one content item.
- A homepage recommended slug in `src/lib/site-config.ts` does not exist in that category.
- A `selfTests` item has `correctIndex` outside the options array.
- A `selfTests` item ID is duplicated across the content corpus.

The script should warn, not fail, when:

- A page has no `selfTests`.
- A page body is shorter than 1500 characters.

- [ ] **Step 2: Create reusable validator functions**

Create `scripts/validate-content.ts`:

```ts
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import matter from "gray-matter";
import { categories } from "../src/lib/site-config";

interface SelfTest {
  id: string;
  options: string[];
  correctIndex: number;
}

interface Frontmatter {
  title?: string;
  category?: string;
  relatedSlugs?: string[];
  selfTests?: SelfTest[];
}

interface DocInfo {
  file: string;
  rel: string;
  category: string;
  slug: string;
  fullSlug: string;
  data: Frontmatter;
  bodyLength: number;
}

function walkMarkdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
    return [];
  });
}

export function loadDocs(root = resolve("src/content/docs")): DocInfo[] {
  return walkMarkdownFiles(root).map((file) => {
    const raw = readFileSync(file, "utf8");
    const parsed = matter(raw);
    const rel = relative(root, file).replaceAll("\\", "/");
    const [category, filename] = rel.split("/");
    const slug = filename.replace(/\.md$/, "");

    return {
      file,
      rel,
      category,
      slug,
      fullSlug: `${category}/${slug}`,
      data: parsed.data as Frontmatter,
      bodyLength: parsed.content.trim().length,
    };
  });
}

export function validateDocs(docs: DocInfo[]): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const bySlug = new Map<string, DocInfo[]>();
  const byFullSlug = new Map<string, DocInfo>();
  const selfTestIds = new Map<string, string>();

  for (const doc of docs) {
    byFullSlug.set(doc.fullSlug, doc);
    bySlug.set(doc.slug, [...(bySlug.get(doc.slug) ?? []), doc]);
  }

  for (const doc of docs) {
    if (doc.data.category !== doc.category) {
      errors.push(`${doc.rel}: category must be "${doc.category}"`);
    }

    for (const related of doc.data.relatedSlugs ?? []) {
      const matches = related.includes("/")
        ? byFullSlug.has(related)
          ? [byFullSlug.get(related)!]
          : []
        : bySlug.get(related) ?? [];

      if (matches.length === 0) {
        errors.push(`${doc.rel}: relatedSlugs entry "${related}" does not exist`);
      }

      if (matches.length > 1) {
        errors.push(
          `${doc.rel}: relatedSlugs entry "${related}" is ambiguous (${matches
            .map((match) => match.fullSlug)
            .join(", ")})`,
        );
      }
    }

    if (!doc.data.selfTests || doc.data.selfTests.length === 0) {
      warnings.push(`${doc.rel}: no selfTests`);
    }

    if (doc.bodyLength < 1500) {
      warnings.push(`${doc.rel}: short body (${doc.bodyLength} chars)`);
    }

    for (const selfTest of doc.data.selfTests ?? []) {
      if (
        !Array.isArray(selfTest.options) ||
        selfTest.correctIndex < 0 ||
        selfTest.correctIndex >= selfTest.options.length
      ) {
        errors.push(`${doc.rel}: selfTests "${selfTest.id}" has invalid correctIndex`);
      }

      const previousFile = selfTestIds.get(selfTest.id);
      if (previousFile) {
        errors.push(
          `${doc.rel}: selfTests id "${selfTest.id}" duplicates ${previousFile}`,
        );
      } else {
        selfTestIds.set(selfTest.id, doc.rel);
      }
    }
  }

  for (const category of categories) {
    if (!category.recommendedSlug) continue;
    const expected = resolve(
      "src/content/docs",
      category.id,
      `${category.recommendedSlug}.md`,
    );
    if (!existsSync(expected)) {
      errors.push(
        `site-config: ${category.id}.recommendedSlug "${category.recommendedSlug}" does not exist`,
      );
    }
  }

  return { errors, warnings };
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}`) {
  const result = validateDocs(loadDocs());

  for (const warning of result.warnings) {
    console.warn(`WARN ${warning}`);
  }

  for (const error of result.errors) {
    console.error(`ERROR ${error}`);
  }

  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}
```

- [ ] **Step 3: Add package script**

Modify `package.json`:

```json
{
  "scripts": {
    "validate:content": "tsx scripts/validate-content.ts",
    "check": "npm run lint && npm run typecheck && npm run validate:content && npm run test && npm run build"
  }
}
```

- [ ] **Step 4: Write unit tests for validator behavior**

Create `tests/unit/content-validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateDocs } from "../../scripts/validate-content";

describe("content validation", () => {
  it("reports missing and ambiguous related slugs", () => {
    const result = validateDocs([
      {
        file: "a",
        rel: "glossary/a.md",
        category: "glossary",
        slug: "a",
        fullSlug: "glossary/a",
        data: { category: "glossary", relatedSlugs: ["shared", "missing"] },
        bodyLength: 2000,
      },
      {
        file: "b",
        rel: "glossary/shared.md",
        category: "glossary",
        slug: "shared",
        fullSlug: "glossary/shared",
        data: { category: "glossary" },
        bodyLength: 2000,
      },
      {
        file: "c",
        rel: "tech/shared.md",
        category: "tech",
        slug: "shared",
        fullSlug: "tech/shared",
        data: { category: "tech" },
        bodyLength: 2000,
      },
    ]);

    expect(result.errors).toContain(
      "glossary/a.md: relatedSlugs entry \"missing\" does not exist",
    );
    expect(result.errors.join("\n")).toContain(
      "relatedSlugs entry \"shared\" is ambiguous",
    );
  });
});
```

- [ ] **Step 5: Run validator and capture current content failures**

Run:

```bash
npm run validate:content
```

Expected initial failures include:

- Missing references such as `canary-release`, `test-design`, `quality-metrics`, `unit-testing`.
- Ambiguous references to `data-driven-testing`.

- [ ] **Step 6: Fix missing and ambiguous `relatedSlugs`**

For each missing reference:

- If a matching page exists under a different slug, update the `relatedSlugs` entry.
- If no page exists and the concept is important, create a focused glossary page.
- If no page exists and the concept is not central, remove the reference.

For ambiguous references:

Use full slugs:

```yaml
relatedSlugs: ["tech/data-driven-testing"]
```

or:

```yaml
relatedSlugs: ["glossary/data-driven-testing"]
```

- [ ] **Step 7: Run content validation until clean**

Run:

```bash
npm run validate:content
```

Expected:

- No `ERROR` lines.
- Warnings are acceptable for this task and should be reviewed as future content work.

- [ ] **Step 8: Run full quality gate**

Run:

```bash
npm run check
```

Expected: all checks pass.

- [ ] **Step 9: Commit**

```bash
git add package.json scripts/validate-content.ts tests/unit/content-validation.test.ts src/content/docs src/lib/site-config.ts
git commit -m "test: validate content references"
```

---

### Task 4: Add Homepage Coverage for All Nine Categories

**Files:**
- Modify: `src/lib/site-config.ts`
- Modify: `tests/unit/home-page.test.ts`
- Test: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Write a unit test that homepage module data includes every category**

Add to `tests/unit/home-page.test.ts`:

```ts
import { categories } from "../../src/lib/site-config";

it("should expose one homepage module link for each recommended category", () => {
  const { moduleLinks } = getHomePageData("/testdev-interview-site/");
  const recommendedCategories = categories.filter(
    (category) => typeof category.recommendedSlug === "string",
  );

  expect(moduleLinks.map((link) => link.category).sort()).toEqual(
    recommendedCategories.map((category) => category.id).sort(),
  );
});
```

- [ ] **Step 2: Add interview chains to site config**

Modify `src/lib/site-config.ts`:

```ts
{
  id: "interview-chains",
  title: "面试追问链",
  navLabel: "追问链",
  description: "把单点知识延展成连续追问，贴近真实面试节奏",
  recommendedSlug: "api-testing-chain",
}
```

- [ ] **Step 3: Run homepage unit tests**

Run:

```bash
npm run test -- tests/unit/home-page.test.ts
```

Expected: all homepage tests pass.

- [ ] **Step 4: Strengthen navigation E2E**

In `tests/e2e/navigation.spec.ts`, add an assertion on the homepage:

```ts
await expect(
  page.getByRole("link", { name: /追问链/ }),
).toHaveAttribute("href", /\/interview-chains\/api-testing-chain\//);
```

- [ ] **Step 5: Run targeted E2E**

Run:

```bash
npm run test:e2e -- tests/e2e/navigation.spec.ts --project=chromium
```

Expected: navigation tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/site-config.ts tests/unit/home-page.test.ts tests/e2e/navigation.spec.ts
git commit -m "feat: expose interview chains on homepage"
```

---

### Task 5: Clean Formatting and Generated Artifact Hygiene

**Files:**
- Create: `.prettierignore`
- Modify: `.gitignore`
- Modify: `package.json`
- Formatting: source files reported by `npm run format`

- [ ] **Step 1: Add Prettier ignore file**

Create `.prettierignore`:

```gitignore
node_modules/
dist/
.astro/
.git/
.playwright-cli/
playwright-report/
test-results/
.superpowers/
.worktrees/
temp-site/
.next/
output/
coverage/
package-lock.json
```

- [ ] **Step 2: Update `.gitignore` for generated Playwright output**

Add these lines to `.gitignore`:

```gitignore
# Playwright output
playwright-report/
test-results/
```

- [ ] **Step 3: Add a write-format script**

Modify `package.json`:

```json
{
  "scripts": {
    "format": "prettier --check .",
    "format:write": "prettier --write ."
  }
}
```

- [ ] **Step 4: Run Prettier write**

Run:

```bash
npm run format:write
```

Expected:

- Prettier formats tracked source/docs files.
- It does not touch ignored generated directories.

- [ ] **Step 5: Verify formatting**

Run:

```bash
npm run format
```

Expected: `All matched files use Prettier code style!`

- [ ] **Step 6: Run normal quality checks**

Run:

```bash
npm run check
```

Expected: all checks pass after formatting.

- [ ] **Step 7: Commit**

```bash
git add .gitignore .prettierignore package.json src tests docs astro.config.mjs playwright.config.ts vitest.config.ts eslint.config.js
git commit -m "chore: enforce formatting hygiene"
```

---

### Task 6: Strengthen CI with Content Validation, Format Check, and Smoke E2E

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `package.json`
- Test: local command dry run

- [ ] **Step 1: Decide CI tiers**

Use two tiers:

- Required deploy gate: lint, typecheck, content validation, unit tests, build.
- Smoke browser gate: install Chromium only and run a small Playwright project on main pages.

- [ ] **Step 2: Add smoke Playwright script**

Modify `package.json`:

```json
{
  "scripts": {
    "test:e2e:smoke": "playwright test tests/e2e/navigation.spec.ts tests/e2e/content.spec.ts --project=chromium"
  }
}
```

- [ ] **Step 3: Update GitHub Actions**

Modify `.github/workflows/deploy.yml` build job steps:

```yaml
      - name: Format
        run: npm run format

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Content validation
        run: npm run validate:content

      - name: Unit tests
        run: npm run test

      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium

      - name: Smoke E2E
        run: npm run test:e2e:smoke

      - name: Build
        run: npm run build
```

- [ ] **Step 4: Validate local smoke command**

Run:

```bash
npm run test:e2e:smoke
```

Expected: Chromium smoke tests pass.

- [ ] **Step 5: Run full local gate**

Run:

```bash
npm run format
npm run check
npm run test:e2e:smoke
```

Expected: all commands pass.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml package.json
git commit -m "ci: add content validation and smoke e2e"
```

---

### Task 7: Improve Real-Page Accessibility Coverage

**Files:**
- Modify: `tests/a11y/basic.test.ts`
- Create: `tests/e2e/a11y.spec.ts`
- Modify: `package.json`

- [ ] **Step 1: Keep lightweight unit a11y test but stop treating it as page coverage**

Rename the current `tests/a11y/basic.test.ts` describe block to make its purpose explicit:

```ts
describe("static accessibility smoke", () => {
  // existing tests remain here
});
```

- [ ] **Step 2: Add real-page axe checks**

Create `tests/e2e/a11y.spec.ts`:

```ts
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
```

- [ ] **Step 3: Install missing package if needed**

If `@axe-core/playwright` is not installed, run:

```bash
npm install -D @axe-core/playwright
```

- [ ] **Step 4: Add script**

Modify `package.json`:

```json
{
  "scripts": {
    "test:a11y:e2e": "playwright test tests/e2e/a11y.spec.ts --project=chromium"
  }
}
```

- [ ] **Step 5: Run a11y tests**

Run:

```bash
npm run test:a11y
npm run test:a11y:e2e
```

Expected:

- Unit a11y smoke passes.
- Real-page axe tests pass or reveal actionable violations to fix in CSS/components.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tests/a11y/basic.test.ts tests/e2e/a11y.spec.ts
git commit -m "test: add real page accessibility checks"
```

---

### Task 8: Plan and Execute Dependency Security Upgrade in Isolation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Potentially modify: `astro.config.mjs`
- Potentially modify: Starlight component overrides in `src/components/`
- Test: full local gate plus visual spot checks

- [ ] **Step 1: Create isolated branch**

Run:

```bash
git switch -c codex/upgrade-astro-starlight-security
```

Expected: new branch created from the current clean baseline.

- [ ] **Step 2: Capture current audit state**

Run:

```bash
npm audit
npm outdated --long
```

Expected:

- Audit currently reports Astro/Starlight/Vite chain vulnerabilities.
- Outdated output shows latest Astro/Starlight versions.

- [ ] **Step 3: Try non-breaking audit fix first**

Run:

```bash
npm audit fix
```

Expected:

- Safe transitive updates are applied if available.
- Astro/Starlight major upgrades are not forced.

- [ ] **Step 4: Run quality gate**

Run:

```bash
npm run check
npm run test:e2e:smoke
npm audit
```

Expected:

- If audit is clean enough, commit and stop here.
- If Astro vulnerabilities remain, proceed to major framework upgrade.

- [ ] **Step 5: Upgrade Astro and Starlight deliberately**

Run:

```bash
npm install astro@latest @astrojs/starlight@latest @astrojs/check@latest
```

Expected:

- `package.json` and `package-lock.json` update to current versions.
- Some config or component override changes may be required.

- [ ] **Step 6: Fix migration issues**

Run:

```bash
npm run typecheck
```

If it fails, fix only migration-related errors.

Common areas to inspect:

- `astro.config.mjs` for Starlight option changes.
- `src/components/Header.astro`
- `src/components/CustomContentPanel.astro`
- `src/components/Pagination.astro`
- `src/components/ThemeProvider.astro`

- [ ] **Step 7: Run full verification**

Run:

```bash
npm run format
npm run check
npm run test:e2e
npm audit
```

Expected:

- Formatting passes.
- Full check passes.
- Full E2E passes.
- Audit has no high severity runtime issues, or remaining issues are documented with rationale.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src tests
git commit -m "chore: upgrade Astro and Starlight"
```

---

### Task 9: Improve Chinese Search Quality

**Files:**
- Modify: `astro.config.mjs`
- Modify: content metadata if needed
- Test: `tests/e2e/search.spec.ts`

- [ ] **Step 1: Write search E2E test with Chinese query**

Create `tests/e2e/search.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const BASE_PATH = "/testdev-interview-site";

function appUrl(path: string): string {
  return path === "/" ? `${BASE_PATH}/` : `${BASE_PATH}${path}`;
}

test.describe("search", () => {
  test("finds Chinese content by Chinese query", async ({ page }) => {
    await page.goto(appUrl("/tech/pytest/"));

    await page.getByRole("button", { name: /搜索|search/i }).click();
    const searchBox = page.getByRole("searchbox");
    await searchBox.fill("接口断言");

    await expect(page.getByText("接口断言").first()).toBeVisible({
      timeout: 5000,
    });
  });
});
```

- [ ] **Step 2: Run the search test**

Run:

```bash
npm run test:e2e -- tests/e2e/search.spec.ts --project=chromium
```

Expected:

- If search works, keep the test as regression coverage.
- If it fails, continue to language/search configuration fixes.

- [ ] **Step 3: Verify Pagefind language after localization fix**

Run:

```bash
npm run build
```

Expected:

- Build output should no longer say only `Discovered 1 language: en`.
- If it still does, inspect Starlight/Pagefind language configuration for Astro 4/Starlight 0.28.

- [ ] **Step 4: Add search-specific metadata if needed**

If Chinese query recall remains weak, add focused keywords into page descriptions/tags rather than hidden keyword stuffing.

Example frontmatter improvement:

```yaml
description: "接口断言关注状态码、响应字段、业务副作用、数据库状态和消息投递，是接口自动化通过判断的核心。"
tags: ["接口测试", "断言", "自动化", "响应校验", "业务副作用"]
```

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/content/docs tests/e2e/search.spec.ts
git commit -m "test: cover Chinese search behavior"
```

---

### Task 10: Content Depth Pass for Short and Quiz-Missing Pages

**Files:**
- Modify: `src/content/docs/**/*.md`
- Use output from: `npm run validate:content`

- [ ] **Step 1: Generate content worklist**

Run:

```bash
npm run validate:content
```

Expected:

- Warnings identify pages with no `selfTests`.
- Warnings identify pages shorter than 1500 characters.

- [ ] **Step 2: Prioritize pages**

Use this order:

1. Pages linked from homepage.
2. High `interviewWeight: 3` pages.
3. Short scenario/project pages under 500 body characters.
4. Pages without self-tests.

- [ ] **Step 3: Expand one page at a time**

For each short page, add these sections:

```md
## 标准回答框架

## 风险点拆解

## 测试策略

## 面试追问

## 容易答错什么
```

For scenario pages, include a concise answer skeleton:

```md
面试回答可以按四段来讲：先讲业务目标，再讲风险点，然后讲测试策略，最后讲监控和回滚。
```

- [ ] **Step 4: Add self-tests to each completed page**

Use three questions per page:

```yaml
selfTests:
  - id: "config-change-1"
    question: "配置变更测试首先要确认什么？"
    options:
      - "只看页面是否能打开"
      - "变更目标、影响范围和回滚方式"
      - "只验证线上环境"
      - "只检查日志是否存在"
    correctIndex: 1
    explanation: "配置变更测试要先明确变更目标、影响范围和回滚方式，再验证配置是否正确生效。"
```

Ensure each `id` is globally unique.

- [ ] **Step 5: Validate content after each batch**

Run:

```bash
npm run validate:content
npm run build
```

Expected:

- No content validation errors.
- Build succeeds.

- [ ] **Step 6: Commit each content batch**

```bash
git add src/content/docs
git commit -m "docs: expand scenario answer coverage"
```

Use a more specific commit message for each batch, such as:

```bash
git commit -m "docs: add Redis testing self checks"
```

---

### Task 11: Retire or Wire Unused Components

**Files:**
- Inspect: `src/components/BookmarkButton.astro`
- Inspect: `src/components/CommonMistakes.astro`
- Inspect: `src/components/CompletionBadge.astro`
- Inspect: `src/components/LessonProgressMarkers.astro`
- Inspect: `src/components/PathNavigator.astro`
- Inspect: `src/components/TermTooltip.astro`
- Modify or delete unused components after decision
- Test: `npm run check`

- [ ] **Step 1: Confirm unused components**

Run:

```bash
rg -n "BookmarkButton|CommonMistakes|CompletionBadge|LessonProgressMarkers|PathNavigator|TermTooltip" src tests astro.config.mjs
```

Expected:

- Some components are not imported anywhere except their own file.

- [ ] **Step 2: Classify each component**

Use this decision table:

```text
BookmarkButton: wire into content page actions.
CompletionBadge: wire only if completion state needs inline display; otherwise delete.
CommonMistakes: keep only if Markdown pages will import it through MDX; otherwise delete.
LessonProgressMarkers: delete if explicit completion replaces marker-based progress.
PathNavigator: delete if Starlight sidebar and pagination already cover navigation.
TermTooltip: keep only if term tooltip rendering is planned; otherwise delete.
```

- [ ] **Step 3: Delete components that are not part of the product direction**

For each deleted component:

```bash
git rm src/components/ComponentName.astro
```

- [ ] **Step 4: Run checks**

Run:

```bash
npm run check
```

Expected: no missing import or type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "chore: remove unused component leftovers"
```

---

## Recommended Execution Order

1. Task 1: Metadata and localization.
2. Task 3: Content validation.
3. Task 4: Homepage category coverage.
4. Task 5: Formatting hygiene.
5. Task 6: CI gate.
6. Task 2: Progress and bookmark features.
7. Task 7: Real-page accessibility.
8. Task 9: Chinese search behavior.
9. Task 10: Content depth pass.
10. Task 11: Unused component cleanup.
11. Task 8: Dependency security upgrade in a dedicated branch.

## Verification Matrix

Run these commands before merging any task:

```bash
npm run format
npm run check
```

Run these commands before merging user-facing UI or routing changes:

```bash
npm run test:e2e
```

Run this command before merging dependency changes:

```bash
npm audit
```

Expected final state:

- `npm run format` passes.
- `npm run check` passes.
- `npm run test:e2e` passes.
- `npm audit` has no unresolved high severity runtime issues.
- Content validation has no errors.
- Homepage exposes all intended modules.
- Content pages have correct Chinese language metadata and page-specific canonical URLs.
- Progress, bookmarks, recent views, quizzes, and sharing work in real browser tests.

## Self-Review Notes

- Spec coverage: This plan covers SEO/localization, OG image, progress/bookmark behavior, content validation, homepage information architecture, formatting hygiene, CI, accessibility, dependency security, Chinese search, content depth, and unused component cleanup.
- Placeholder scan: No task relies on unresolved placeholders or unspecified implementation details. Each code-changing task includes concrete file paths, commands, and expected outcomes.
- Type consistency: All referenced functions and script names are either existing in the current project or explicitly introduced in the relevant task before use.
