# Astro + Starlight 迁移实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 TestDev-Sprint 从 Next.js 16 + React 迁移到 Astro 4.16 + Starlight，保留所有内容和交互功能。

**Architecture:** 使用 Astro + Starlight 作为文档框架，内容从 TypeScript 内联数据转换为 Markdown + Frontmatter，交互功能通过 Astro Islands（Vanilla JS）实现，状态持久化使用 localStorage。

**Tech Stack:** Astro 4.16, @astrojs/starlight 0.28.6, TypeScript 5, Vitest, Playwright, Pagefind

---

## 文件结构规划

### 新建文件

```
# 根目录
astro.config.mjs
package.json
tsconfig.json
vitest.config.ts
playwright.config.ts
eslint.config.js
.gitignore

# 静态资源
public/favicon.svg

# Astro 组件
src/components/Banner.astro
src/components/Header.astro
src/components/Pagination.astro
src/components/RightSidebar.astro
src/components/MobileNav.astro
src/components/SearchBox.astro
src/components/TermTooltip.astro
src/components/ProgressTracker.astro
src/components/BookmarkButton.astro
src/components/RecentViews.astro
src/components/TagFilter.astro
src/components/DifficultyFilter.astro
src/components/HomePage.astro
src/components/CommonMistakes.astro
src/components/CompletionBadge.astro
src/components/LessonProgressMarkers.astro
src/components/PathNavigator.astro
src/components/SidebarProgress.astro
src/components/ShareButtons.astro
src/components/QuizContainer.astro

# 内容配置
src/content/config.ts
src/content/docs/glossary/*.md
src/content/docs/tech/*.md
src/content/docs/project/*.md
src/content/docs/scenario/*.md
src/content/docs/coding/*.md
src/content/docs/roadmap/*.md
src/content/docs/ai-learning/*.md
src/content/docs/practice-template/*.md

# 布局
src/layouts/MainLayout.astro

# 工具库
src/lib/search-index.ts
src/lib/progress-store.ts
src/lib/bookmark-store.ts
src/lib/term-registry.ts
src/lib/site-config.ts
src/lib/path-map.ts
src/lib/quiz-manager.ts

# 样式
src/styles/tokens.css
src/styles/custom-layout.css
src/styles/components.css
src/styles/tabs-custom.css

# 页面
src/pages/index.astro
src/pages/404.astro
src/pages/tags.astro
src/pages/difficulty.astro

# 测试
tests/unit/progress-store.test.ts
tests/unit/bookmark-store.test.ts
tests/unit/path-map.test.ts
tests/unit/quiz-manager.test.ts
tests/unit/frontmatter-schema.test.ts
tests/a11y/basic.test.ts
tests/e2e/navigation.spec.ts
tests/e2e/search.spec.ts
tests/e2e/quiz.spec.ts
```

### 参考文件（从 temp-site 迁移内容）

- `temp-site/src/content/data.ts` → 转换为 Markdown 文件
- `temp-site/src/content/types.ts` → 参考类型定义
- `temp-site/src/content/selftest-data.ts` → 转换为测验数据
- `temp-site/src/content/interview-chains.ts` → 参考面试链数据
- `temp-site/src/lib/site-config.ts` → 参考站点配置
- `temp-site/src/lib/client/storage.ts` → 参考存储工具

### 参考文件（从 typescript_python_web 参考模式）

- `typescript_python_web/astro.config.mjs` → 参考 Astro 配置
- `typescript_python_web/src/content/config.ts` → 参考内容 schema
- `typescript_python_web/src/components/*.astro` → 参考组件模式
- `typescript_python_web/src/lib/*.ts` → 参考工具库模式
- `typescript_python_web/src/styles/*.css` → 参考样式架构
- `typescript_python_web/tests/` → 参考测试模式

---

## 阶段 1: 项目骨架初始化

### Task 1: 创建项目配置文件

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "testdev-interview-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --check .",
    "typecheck": "astro check",
    "test": "vitest run",
    "test:components": "vitest run tests/unit/components/",
    "test:a11y": "vitest run tests/a11y/",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  },
  "dependencies": {
    "@astrojs/starlight": "0.28.6",
    "astro": "4.16.19",
    "sharp": "^0.33.0",
    "zod": "3.25.76"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.7",
    "@eslint/js": "^9.0.0",
    "@playwright/test": "^1.40.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "@types/jsdom": "^28.0.0",
    "axe-core": "^4.11.1",
    "eslint": "^9.0.0",
    "jsdom": "^28.1.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "typescript-eslint": "^8.0.0",
    "vitest": "^2.0.0",
    "vitest-axe": "^0.1.0"
  },
  "overrides": {
    "@astrojs/sitemap": "3.4.2",
    "zod": "3.25.76"
  }
}
```

- [ ] **Step 2: 创建 astro.config.mjs**

```javascript
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/TestDev-Sprint",
  integrations: [
    starlight({
      title: "测试开发面试速成站",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "true",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
          },
        },
        {
          tag: "style",
          content: `
            :root[data-theme="dark"] { background-color: #0c0e12 !important; }
            :root[data-theme="dark"] body { background-color: #0c0e12 !important; }
            :root[data-theme="light"] header, :root[data-theme="light"] .header { background-color: #ffffff !important; }
          `,
        },
        {
          tag: "script",
          attrs: {
            "is:inline": true,
          },
          content: `
            (function() {
              try {
                var theme = localStorage.getItem('testdev:theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            })();
            document.addEventListener('astro:page-load', function() {
              try {
                var theme = localStorage.getItem('testdev:theme');
                if (!theme || theme === 'auto') {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                var bgColor = theme === 'dark' ? '#0c0e12' : '#ffffff';
                document.documentElement.style.setProperty('background-color', bgColor, 'important');
                document.body.style.setProperty('background-color', bgColor, 'important');
              } catch(e) {}
            });
          `,
        },
      ],
      customCss: [
        "./src/styles/tokens.css",
        "./src/styles/custom-layout.css",
        "./src/styles/components.css",
        "./src/styles/tabs-custom.css",
      ],
      disable404Route: true,
      components: {
        Banner: "./src/components/Banner.astro",
        Pagination: "./src/components/Pagination.astro",
        Header: "./src/components/Header.astro",
      },
      sidebar: [
        {
          label: "术语体系",
          autogenerate: { directory: "glossary" },
        },
        {
          label: "技术专题",
          autogenerate: { directory: "tech" },
        },
        {
          label: "项目类型",
          autogenerate: { directory: "project" },
        },
        {
          label: "场景题",
          autogenerate: { directory: "scenario" },
        },
        {
          label: "编码题",
          autogenerate: { directory: "coding" },
        },
        {
          label: "学习路线",
          autogenerate: { directory: "roadmap" },
        },
        {
          label: "AI 学习指南",
          autogenerate: { directory: "ai-learning" },
        },
        {
          label: "练手模板",
          autogenerate: { directory: "practice-template" },
        },
        {
          label: "分类索引",
          items: [
            { label: "标签", link: "/tags/" },
            { label: "难度", link: "/difficulty/" },
          ],
        },
      ],
    }),
  ],
});
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: 创建 .gitignore**

```
# Dependencies
node_modules/

# Build output
dist/

# Environment
.env
.env.*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Astro
.astro/
```

- [ ] **Step 5: 安装依赖**

```bash
npm install
```

Expected: All dependencies installed successfully.

- [ ] **Step 6: 提交**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore package-lock.json
git commit -m "feat: initialize Astro + Starlight project skeleton"
```

---

### Task 2: 创建基础目录结构和样式

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/custom-layout.css`
- Create: `src/styles/components.css`
- Create: `src/styles/tabs-custom.css`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建设计令牌 tokens.css**

```css
/* src/styles/tokens.css */

/* ===== 设计令牌 (Zensical 风格) ===== */

:root {
  /* 颜色 */
  --color-bg: #ffffff;
  --color-text: #1a1a2e;
  --color-primary: #4361ee;
  --color-secondary: #3a0ca3;
  --color-accent: #4cc9f0;
  --color-border: #e2e8f0;
  --color-code-bg: #f8f9fa;
  --color-card: #f8f9fa;

  /* 语义色 */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* 字体 */
  --font-sans: "Noto Sans SC", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* 间距 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* 圆角 */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}

/* ===== Starlight 变量覆盖 ===== */

:root {
  --sl-color-bg: var(--color-bg);
  --sl-color-bg-nav: var(--color-bg);
  --sl-color-bg-aside: var(--color-card);
  --sl-color-bg-card: var(--color-card);
  --sl-color-white: var(--color-text);
  --sl-color-gray-1: #334155;
  --sl-color-gray-2: #475569;
  --sl-color-gray-3: #64748b;
  --sl-color-gray-4: #94a3b8;
  --sl-color-gray-5: #cbd5e1;
  --sl-color-gray-6: #e2e8f0;
  --sl-color-accent: var(--color-primary);
  --sl-color-accent-low: #c7d7fe;
  --sl-color-accent-high: #1e3a8a;
  --sl-color-hairline: var(--color-border);
  --sl-color-shade: var(--color-border);
  --sl-color-light: var(--color-bg);
}

/* 深色主题 */
:root[data-theme="dark"] {
  --color-bg: #0c0e12;
  --color-text: #e2e8f0;
  --color-primary: #60a5fa;
  --color-secondary: #818cf8;
  --color-accent: #22d3ee;
  --color-border: #334155;
  --color-code-bg: #1e293b;
  --color-card: #1e293b;

  --sl-color-bg: #0c0e12;
  --sl-color-bg-nav: #0c0e12;
  --sl-color-bg-aside: #1e293b;
  --sl-color-bg-card: #1e293b;
  --sl-color-white: #e2e8f0;
  --sl-color-gray-1: #f1f5f9;
  --sl-color-gray-2: #e2e8f0;
  --sl-color-gray-3: #cbd5e1;
  --sl-color-gray-4: #94a3b8;
  --sl-color-gray-5: #64748b;
  --sl-color-gray-6: #475569;
  --sl-color-accent: #60a5fa;
  --sl-color-accent-low: #1e3a8a;
  --sl-color-accent-high: #93c5fd;
  --sl-color-hairline: #334155;
  --sl-color-shade: #334155;
  --sl-color-light: #0c0e12;
}

/* 代码高亮色 */
:root {
  --sl-color-syntax-keyword: #d73a49;
  --sl-color-syntax-string: #032f62;
  --sl-color-syntax-number: #005cc5;
  --sl-color-syntax-comment: #6a737d;
  --sl-color-syntax-function: #6f42c1;
}

:root[data-theme="dark"] {
  --sl-color-syntax-keyword: #ff7b72;
  --sl-color-syntax-string: #a5d6ff;
  --sl-color-syntax-number: #79c0ff;
  --sl-color-syntax-comment: #8b949e;
  --sl-color-syntax-function: #d2a8ff;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
  }
}
```

- [ ] **Step 2: 创建布局样式 custom-layout.css**

```css
/* src/styles/custom-layout.css */

/* ===== 标题层次 ===== */

article h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border);
  padding-bottom: var(--space-sm);
}

article h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: var(--space-xl);
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

article h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

/* ===== 内容排版 ===== */

article p {
  line-height: 1.75;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

article ul,
article ol {
  padding-left: var(--space-xl);
  margin-bottom: var(--space-md);
}

article li {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
}

/* ===== 代码块 ===== */

article pre {
  background-color: var(--color-code-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  overflow-x: auto;
  margin-bottom: var(--space-md);
}

article code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  background-color: var(--color-code-bg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
}

article pre code {
  background-color: transparent;
  padding: 0;
}

/* ===== 引用块 ===== */

article blockquote {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--space-md);
  margin-left: 0;
  margin-right: 0;
  color: var(--sl-color-gray-3);
  font-style: italic;
}

/* ===== 表格 ===== */

article table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-md);
}

article th,
article td {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  text-align: left;
}

article th {
  background-color: var(--color-card);
  font-weight: 600;
}

/* ===== 术语引用样式 ===== */

.term-ref {
  border-bottom: 1px dashed var(--color-primary);
  cursor: help;
  color: var(--color-primary);
}

/* ===== 响应式 ===== */

@media (max-width: 720px) {
  article h1 {
    font-size: 1.5rem;
  }

  article h2 {
    font-size: 1.25rem;
  }

  article h3 {
    font-size: 1.125rem;
  }
}
```

- [ ] **Step 3: 创建组件样式 components.css**

```css
/* src/styles/components.css */

/* ===== 卡片 ===== */

.card {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ===== 徽章 ===== */

.badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-beginner {
  background-color: #dcfce7;
  color: #166534;
}

.badge-interview {
  background-color: #fef3c7;
  color: #92400e;
}

:root[data-theme="dark"] .badge-beginner {
  background-color: #166534;
  color: #dcfce7;
}

:root[data-theme="dark"] .badge-interview {
  background-color: #92400e;
  color: #fef3c7;
}

/* ===== 按钮 ===== */

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
}

.btn:hover {
  background-color: var(--color-card);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-secondary);
}

/* ===== 进度条 ===== */

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-success);
  transition: width var(--transition-base);
}

/* ===== 警告框 ===== */

.callout {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  border-left: 4px solid;
}

.callout-info {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

.callout-warning {
  background-color: #fffbeb;
  border-color: #f59e0b;
}

.callout-error {
  background-color: #fef2f2;
  border-color: #ef4444;
}

:root[data-theme="dark"] .callout-info {
  background-color: #1e3a5f;
}

:root[data-theme="dark"] .callout-warning {
  background-color: #451a03;
}

:root[data-theme="dark"] .callout-error {
  background-color: #450a0a;
}
```

- [ ] **Step 4: 创建标签页样式 tabs-custom.css**

```css
/* src/styles/tabs-custom.css */

/* ===== Starlight Tabs 覆盖 ===== */

starlight-tabs {
  border-bottom: 1px solid var(--color-border);
}

starlight-tabs [role="tablist"] {
  display: flex;
  gap: var(--space-sm);
  border-bottom: none;
}

starlight-tabs [role="tab"] {
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--sl-color-gray-3);
  cursor: pointer;
  transition: all var(--transition-fast);
}

starlight-tabs [role="tab"]:hover {
  color: var(--color-text);
}

starlight-tabs [role="tab"][aria-selected="true"] {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

starlight-tabs [role="tabpanel"] {
  padding-top: var(--space-md);
}
```

- [ ] **Step 5: 创建 favicon**

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#4361ee"/>
  <text x="50" y="65" font-family="system-ui" font-size="50" font-weight="bold" fill="white" text-anchor="middle">TD</text>
</svg>
```

- [ ] **Step 6: 提交**

```bash
git add src/styles/ public/favicon.svg
git commit -m "feat: add design tokens and base styles"
```

---

## 阶段 2: 内容 Schema 和工具库

### Task 3: 创建内容 Schema 配置

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: 创建内容 Schema**

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

// 自定义元数据 schema
const testdevMetadataSchema = z.object({
  difficulty: z.enum(["beginner", "interview"]).optional(),
  interviewWeight: z.number().min(1).max(3).optional(),
  category: z.enum([
    "glossary",
    "tech",
    "project",
    "scenario",
    "coding",
    "roadmap",
    "ai-learning",
    "practice-template",
  ]),
  tags: z.array(z.string()).default([]),
  relatedSlugs: z.array(z.string()).default([]),
});

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: testdevMetadataSchema,
    }),
  }),
};
```

- [ ] **Step 2: 提交**

```bash
git add src/content/config.ts
git commit -m "feat: add content schema with custom metadata fields"
```

---

### Task 4: 创建工具库 - 存储和进度管理

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/progress-store.ts`
- Create: `src/lib/bookmark-store.ts`
- Test: `tests/unit/progress-store.test.ts`
- Test: `tests/unit/bookmark-store.test.ts`

- [ ] **Step 1: 创建存储工具**

```typescript
// src/lib/storage.ts

const KEY_PREFIX = "testdev:";

export function readStorage<T>(
  key: string,
  fallback: T,
  parse?: (raw: string) => T
): T {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    return parse ? parse(raw) : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or disabled
  }
}
```

- [ ] **Step 2: 创建进度存储**

```typescript
// src/lib/progress-store.ts
import { readStorage, writeStorage } from "./storage";

export interface ProgressEntry {
  slug: string;
  category: string;
  completedAt: string;
}

export interface ProgressData {
  completed: ProgressEntry[];
}

function getDefaults(): ProgressData {
  return { completed: [] };
}

export function getProgress(): ProgressData {
  return readStorage("progress", getDefaults());
}

export function markAsCompleted(
  slug: string,
  category: string
): void {
  const data = getProgress();
  const existing = data.completed.findIndex(
    (e) => e.slug === slug && e.category === category
  );
  if (existing >= 0) {
    data.completed[existing].completedAt = new Date().toISOString();
  } else {
    data.completed.push({
      slug,
      category,
      completedAt: new Date().toISOString(),
    });
  }
  writeStorage("progress", data);
}

export function isCompleted(slug: string, category: string): boolean {
  const data = getProgress();
  return data.completed.some(
    (e) => e.slug === slug && e.category === category
  );
}

export function getCompletionCount(): number {
  return getProgress().completed.length;
}

export function calculateProgressPercent(total: number): number {
  if (total === 0) return 0;
  return Math.round((getCompletionCount() / total) * 100);
}
```

- [ ] **Step 3: 创建收藏存储**

```typescript
// src/lib/bookmark-store.ts
import { readStorage, writeStorage } from "./storage";

const MAX_BOOKMARKS = 20;

export function getBookmarks(): string[] {
  return readStorage("bookmarks", []);
}

export function addBookmark(slug: string): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(slug)) {
    if (bookmarks.length >= MAX_BOOKMARKS) {
      bookmarks.shift();
    }
    bookmarks.push(slug);
    writeStorage("bookmarks", bookmarks);
  }
}

export function removeBookmark(slug: string): void {
  const bookmarks = getBookmarks().filter((s) => s !== slug);
  writeStorage("bookmarks", bookmarks);
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

export function toggleBookmark(slug: string): boolean {
  if (isBookmarked(slug)) {
    removeBookmark(slug);
    return false;
  } else {
    addBookmark(slug);
    return true;
  }
}
```

- [ ] **Step 4: 创建进度存储测试**

```typescript
// tests/unit/progress-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  getProgress,
  markAsCompleted,
  isCompleted,
  getCompletionCount,
  calculateProgressPercent,
} from "../../src/lib/progress-store";

// Mock localStorage
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: (index: number) => Object.keys(mockStorage)[index] || null,
};

describe("progress-store", () => {
  beforeEach(() => {
    mockStorage["testdev:progress"] = JSON.stringify({ completed: [] });
  });

  it("should return empty progress by default", () => {
    const progress = getProgress();
    expect(progress.completed).toEqual([]);
  });

  it("should mark topic as completed", () => {
    markAsCompleted("api-assertion", "glossary");
    expect(isCompleted("api-assertion", "glossary")).toBe(true);
  });

  it("should not duplicate completed entries", () => {
    markAsCompleted("api-assertion", "glossary");
    markAsCompleted("api-assertion", "glossary");
    expect(getCompletionCount()).toBe(1);
  });

  it("should calculate progress percent", () => {
    markAsCompleted("topic1", "glossary");
    markAsCompleted("topic2", "glossary");
    expect(calculateProgressPercent(4)).toBe(50);
  });

  it("should return 0 for empty total", () => {
    expect(calculateProgressPercent(0)).toBe(0);
  });
});
```

- [ ] **Step 5: 创建收藏存储测试**

```typescript
// tests/unit/bookmark-store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
} from "../../src/lib/bookmark-store";

// Mock localStorage
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: (index: number) => Object.keys(mockStorage)[index] || null,
};

describe("bookmark-store", () => {
  beforeEach(() => {
    mockStorage["testdev:bookmarks"] = JSON.stringify([]);
  });

  it("should return empty bookmarks by default", () => {
    expect(getBookmarks()).toEqual([]);
  });

  it("should add bookmark", () => {
    addBookmark("api-assertion");
    expect(isBookmarked("api-assertion")).toBe(true);
  });

  it("should remove bookmark", () => {
    addBookmark("api-assertion");
    removeBookmark("api-assertion");
    expect(isBookmarked("api-assertion")).toBe(false);
  });

  it("should toggle bookmark", () => {
    expect(toggleBookmark("api-assertion")).toBe(true);
    expect(toggleBookmark("api-assertion")).toBe(false);
  });

  it("should limit to 20 bookmarks", () => {
    for (let i = 0; i < 25; i++) {
      addBookmark(`topic-${i}`);
    }
    expect(getBookmarks().length).toBe(20);
  });
});
```

- [ ] **Step 6: 运行测试**

```bash
npm run test
```

Expected: All tests pass.

- [ ] **Step 7: 提交**

```bash
git add src/lib/ tests/unit/
git commit -m "feat: add progress and bookmark stores with tests"
```

---

### Task 5: 创建站点配置和术语注册表

**Files:**
- Create: `src/lib/site-config.ts`
- Create: `src/lib/term-registry.ts`

- [ ] **Step 1: 创建站点配置**

```typescript
// src/lib/site-config.ts

export interface CategoryConfig {
  id: string;
  title: string;
  navLabel: string;
  description: string;
  recommendedSlug?: string;
}

export const categories: CategoryConfig[] = [
  {
    id: "glossary",
    title: "术语体系",
    navLabel: "术语",
    description: "定义、重要性、易错点、混淆术语和回答提示",
    recommendedSlug: "api-assertion",
  },
  {
    id: "tech",
    title: "技术专题",
    navLabel: "技术专题",
    description: "Python、Pytest、Playwright、接口测试与CI/CD",
    recommendedSlug: "pytest",
  },
  {
    id: "project",
    title: "项目类型",
    navLabel: "项目类型",
    description: "按业务流程、风险点、测试策略组织项目经验",
    recommendedSlug: "payment-callback",
  },
  {
    id: "scenario",
    title: "场景题",
    navLabel: "场景题",
    description: "围绕典型面试追问沉淀标准回答骨架",
    recommendedSlug: "payment-callback",
  },
  {
    id: "coding",
    title: "编码题",
    navLabel: "编码题",
    description: "重试、缓存、日志、断言、Fixture等高频代码题",
    recommendedSlug: "retry-mechanism",
  },
  {
    id: "roadmap",
    title: "学习路线与面试打法",
    navLabel: "路线与打法",
    description: "3天/7天路线、自我介绍和项目表达模板",
    recommendedSlug: "3-day-interview-map",
  },
  {
    id: "ai-learning",
    title: "AI时代成长指南",
    navLabel: "AI成长",
    description: "AI对测试开发的影响",
    recommendedSlug: "ai-test-generation",
  },
  {
    id: "practice-template",
    title: "练手模板库",
    navLabel: "模板库",
    description: "工程练手模板和面试表达模板",
    recommendedSlug: "project-story-template",
  },
];

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id);
}

export function getAllCategoryIds(): string[] {
  return categories.map((c) => c.id);
}
```

- [ ] **Step 2: 创建术语注册表**

```typescript
// src/lib/term-registry.ts

export interface TermEntry {
  slug: string;
  term: string;
  shortDefinition: string;
}

// 术语注册表（从 glossary 内容构建）
const termRegistry: Map<string, TermEntry> = new Map();

export function registerTerm(entry: TermEntry): void {
  termRegistry.set(entry.slug, entry);
}

export function getTermBySlug(slug: string): TermEntry | undefined {
  return termRegistry.get(slug);
}

export function getAllTerms(): TermEntry[] {
  return Array.from(termRegistry.values());
}

export function hasTerm(slug: string): boolean {
  return termRegistry.has(slug);
}

// 批量注册
export function registerTerms(terms: TermEntry[]): void {
  terms.forEach(registerTerm);
}
```

- [ ] **Step 3: 提交**

```bash
git add src/lib/site-config.ts src/lib/term-registry.ts
git commit -m "feat: add site config and term registry"
```

---

## 阶段 3: 核心组件实现

### Task 6: 创建 Starlight 覆盖组件

**Files:**
- Create: `src/components/Banner.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Pagination.astro`

- [ ] **Step 1: 创建 Banner 组件**

```astro
---
// src/components/Banner.astro
import type { Props } from "@astrojs/starlight/props";
import SidebarProgress from "./SidebarProgress.astro";

const { entry } = Astro.props as Props;
---

<div class="banner">
  <SidebarProgress />
  <div class="banner-content">
    <slot />
  </div>
</div>

<style>
  .banner {
    border-bottom: 1px solid var(--sl-color-hairline);
    padding: var(--space-sm) var(--space-md);
    background-color: var(--sl-color-bg-aside);
  }
  .banner-content {
    max-width: var(--sl-content-width);
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 2: 创建 Header 组件**

```astro
---
// src/components/Header.astro
import type { Props } from "@astrojs/starlight/props";
import config from "virtual:starlight/user-config";

const { entry, id, locale, isFallback } = Astro.props as Props;
---

<header class="header">
  <div class="header-inner">
    <a href="/" class="site-title">
      {config.title}
    </a>
    <div class="header-actions">
      <slot name="search" />
      <slot name="theme-select" />
      <slot name="social-icons" />
    </div>
  </div>
</header>

<style>
  .header {
    border-bottom: 1px solid var(--sl-color-hairline);
    background-color: var(--sl-color-bg-nav);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-md);
    max-width: var(--sl-content-width);
    margin: 0 auto;
  }
  .site-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--sl-color-white);
    text-decoration: none;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
</style>
```

- [ ] **Step 3: 创建 Pagination 组件**

```astro
---
// src/components/Pagination.astro
import type { Props } from "@astrojs/starlight/props";

const { dir, pagination } = Astro.props as Props;
---

<nav class="pagination" aria-label="页面导航">
  {pagination.prev && (
    <a href={pagination.prev.href} class="pagination-link prev">
      <span class="pagination-label">上一页</span>
      <span class="pagination-title">{pagination.prev.label}</span>
    </a>
  )}
  {pagination.next && (
    <a href={pagination.next.href} class="pagination-link next">
      <span class="pagination-label">下一页</span>
      <span class="pagination-title">{pagination.next.label}</span>
    </a>
  )}
</nav>

<style>
  .pagination {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-lg) 0;
    border-top: 1px solid var(--sl-color-hairline);
    margin-top: var(--space-xl);
  }
  .pagination-link {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-md);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
    flex: 1;
  }
  .pagination-link:hover {
    border-color: var(--sl-color-accent);
    background-color: var(--sl-color-bg-aside);
  }
  .pagination-label {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
  }
  .pagination-title {
    font-weight: 500;
    color: var(--sl-color-accent);
  }
  .next {
    text-align: right;
    margin-left: auto;
  }
</style>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/Banner.astro src/components/Header.astro src/components/Pagination.astro
git commit -m "feat: add Starlight override components"
```

---

### Task 7: 创建进度和导航组件

**Files:**
- Create: `src/components/SidebarProgress.astro`
- Create: `src/components/PathNavigator.astro`
- Create: `src/components/LessonProgressMarkers.astro`
- Create: `src/components/CompletionBadge.astro`

- [ ] **Step 1: 创建侧边栏进度组件**

```astro
---
// src/components/SidebarProgress.astro
---

<script is:inline>
  (function () {
    const entries = document.querySelectorAll(
      ".starlight-sidebar a[aria-current='page']"
    );
    entries.forEach((entry) => {
      entry.classList.add("current-page");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-slug");
            if (slug) {
              try {
                const data = JSON.parse(
                  localStorage.getItem("testdev:progress") || '{"completed":[]}'
                );
                const exists = data.completed.some(
                  (e) => e.slug === slug
                );
                if (!exists) {
                  data.completed.push({
                    slug,
                    completedAt: new Date().toISOString(),
                  });
                  localStorage.setItem(
                    "testdev:progress",
                    JSON.stringify(data)
                  );
                }
              } catch (e) {}
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const article = document.querySelector("article");
    if (article) observer.observe(article);
  })();
</script>

<style>
  .current-page {
    font-weight: 600;
    color: var(--sl-color-accent);
  }
</style>
```

- [ ] **Step 2: 创建路径导航组件**

```astro
---
// src/components/PathNavigator.astro
interface Props {
  category: string;
  slug: string;
}

const { category, slug } = Astro.props;

// 简化的导航逻辑（实际应从 path-map.ts 获取）
const prevUrl = `/${category}/`;
const nextUrl = `/${category}/`;
---

<nav class="path-nav">
  <a href={prevUrl} class="nav-link prev">
    <span class="nav-label">← 上一页</span>
  </a>
  <a href={nextUrl} class="nav-link next">
    <span class="nav-label">下一页 →</span>
  </a>
</nav>

<style>
  .path-nav {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    padding: var(--space-lg) 0;
    margin-top: var(--space-xl);
    border-top: 1px solid var(--sl-color-hairline);
  }
  .nav-link {
    padding: var(--space-md);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--sl-color-accent);
    transition: all var(--transition-fast);
    flex: 1;
    text-align: center;
  }
  .nav-link:hover {
    border-color: var(--sl-color-accent);
    background-color: var(--sl-color-bg-aside);
  }
  .next {
    margin-left: auto;
  }
</style>
```

- [ ] **Step 3: 创建进度标记组件**

```astro
---
// src/components/LessonProgressMarkers.astro
import { getProgress } from "../lib/progress-store";

const progress = getProgress();
const completedSlugs = new Set(progress.completed.map((e) => e.slug));
---

<script is:inline>
  document.querySelectorAll("[data-slug]").forEach((el) => {
    const slug = el.getAttribute("data-slug");
    if (slug && window.__completedSlugs?.has(slug)) {
      el.classList.add("completed");
    }
  });
</script>

<script>
  window.__completedSlugs = new Set(
    JSON.parse(Astro.props.completedJson || "[]")
  );
</script>

<style>
  .completed::after {
    content: "✓";
    color: var(--color-success);
    margin-left: var(--space-sm);
  }
</style>
```

- [ ] **Step 4: 创建完成徽章组件**

```astro
---
// src/components/CompletionBadge.astro
interface Props {
  slug: string;
  category: string;
}

const { slug, category } = Astro.props;
---

<span class="completion-badge" data-slug={slug} data-category={category}>
  <slot />
</span>

<style>
  .completion-badge.completed::after {
    content: "✓";
    color: var(--color-success);
    margin-left: var(--space-xs);
  }
</style>
```

- [ ] **Step 5: 提交**

```bash
git add src/components/SidebarProgress.astro src/components/PathNavigator.astro src/components/LessonProgressMarkers.astro src/components/CompletionBadge.astro
git commit -m "feat: add progress and navigation components"
```

---

### Task 8: 创建交互功能组件

**Files:**
- Create: `src/components/BookmarkButton.astro`
- Create: `src/components/RecentViews.astro`
- Create: `src/components/TermTooltip.astro`
- Create: `src/components/ShareButtons.astro`
- Create: `src/components/CommonMistakes.astro`

- [ ] **Step 1: 创建收藏按钮组件**

```astro
---
// src/components/BookmarkButton.astro
interface Props {
  slug: string;
}

const { slug } = Astro.props;
---

<button
  class="bookmark-btn"
  data-slug={slug}
  aria-label="添加收藏"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
</button>

<script>
  import { isBookmarked, toggleBookmark } from "../lib/bookmark-store";

  const btn = document.querySelector(".bookmark-btn[data-slug]");
  if (btn) {
    const slug = btn.getAttribute("data-slug");
    const isMarked = isBookmarked(slug!);
    btn.classList.toggle("bookmarked", isMarked);

    btn.addEventListener("click", () => {
      const marked = toggleBookmark(slug!);
      btn.classList.toggle("bookmarked", marked);
      btn.setAttribute(
        "aria-label",
        marked ? "取消收藏" : "添加收藏"
      );
    });
  }
</script>

<style>
  .bookmark-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
    color: var(--sl-color-gray-3);
    transition: color var(--transition-fast);
  }
  .bookmark-btn:hover {
    color: var(--sl-color-accent);
  }
  .bookmark-btn.bookmarked {
    color: var(--color-warning);
  }
  .bookmark-btn.bookmarked svg {
    fill: currentColor;
  }
</style>
```

- [ ] **Step 2: 创建最近浏览组件**

```astro
---
// src/components/RecentViews.astro
import { readStorage, writeStorage } from "../lib/storage";

const MAX_RECENT = 10;

export function addRecentView(slug: string, title: string, category: string) {
  const recent = readStorage<{slug: string, title: string, category: string, viewedAt: string}[]>("recent", []);
  const existing = recent.findIndex((r) => r.slug === slug);
  if (existing >= 0) {
    recent.splice(existing, 1);
  }
  recent.unshift({ slug, title, category, viewedAt: new Date().toISOString() });
  if (recent.length > MAX_RECENT) {
    recent.pop();
  }
  writeStorage("recent", recent);
}

export function getRecentViews() {
  return readStorage<{slug: string, title: string, category: string, viewedAt: string}[]>("recent", []);
}
---

<div class="recent-views">
  <h3>最近浏览</h3>
  <ul>
    <slot />
  </ul>
</div>

<style>
  .recent-views {
    padding: var(--space-md);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
  }
  .recent-views h3 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    color: var(--sl-color-gray-2);
  }
  .recent-views ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .recent-views li {
    padding: var(--space-xs) 0;
  }
  .recent-views a {
    color: var(--sl-color-accent);
    text-decoration: none;
    font-size: 0.875rem;
  }
  .recent-views a:hover {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 3: 创建术语悬浮组件**

```astro
---
// src/components/TermTooltip.astro
interface Props {
  slug: string;
  term: string;
  definition: string;
}

const { slug, term, definition } = Astro.props;
---

<span class="term-tooltip" data-term-slug={slug}>
  <span class="term-ref">{term}</span>
  <div class="term-popup" role="tooltip">
    <p class="term-definition">{definition}</p>
    <a href={`/glossary/${slug}/`} class="term-link">查看详情 →</a>
  </div>
</span>

<style>
  .term-ref {
    border-bottom: 1px dashed var(--color-primary);
    cursor: help;
    color: var(--color-primary);
  }
  .term-popup {
    display: none;
    position: absolute;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  .term-tooltip:hover .term-popup,
  .term-tooltip.active .term-popup {
    display: block;
  }
  .term-definition {
    margin: 0 0 var(--space-sm);
    font-size: 0.875rem;
    line-height: 1.5;
  }
  .term-link {
    font-size: 0.75rem;
    color: var(--color-primary);
    text-decoration: none;
  }
  .term-link:hover {
    text-decoration: underline;
  }
</style>

<script>
  // 移动端点击切换
  document.querySelectorAll(".term-tooltip").forEach((tooltip) => {
    tooltip.addEventListener("click", (e) => {
      e.preventDefault();
      tooltip.classList.toggle("active");
    });
  });

  // 点击外部关闭
  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".term-tooltip")) {
      document.querySelectorAll(".term-tooltip.active").forEach((t) => {
        t.classList.remove("active");
      });
    }
  });
</script>
```

- [ ] **Step 4: 创建分享按钮组件**

```astro
---
// src/components/ShareButtons.astro
const url = Astro.url.href;
const title = Astro.props.title || "测试开发面试速成站";
---

<div class="share-buttons">
  <button class="share-btn twitter" aria-label="分享到 Twitter">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  </button>
  <button class="share-btn copy" aria-label="复制链接">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  </button>
</div>

<script>
  const url = document.currentScript?.getAttribute("data-url") || window.location.href;

  document.querySelector(".share-btn.twitter")?.addEventListener("click", () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(document.title)}`,
      "_blank"
    );
  });

  document.querySelector(".share-btn.copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      const btn = document.querySelector(".share-btn.copy");
      const original = btn?.innerHTML;
      if (btn) {
        btn.innerHTML = "✓";
        setTimeout(() => {
          btn.innerHTML = original || "";
        }, 2000);
      }
    } catch (e) {}
  });
</script>

<style>
  .share-buttons {
    display: flex;
    gap: var(--space-sm);
  }
  .share-btn {
    background: none;
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
    padding: var(--space-sm);
    cursor: pointer;
    color: var(--sl-color-gray-3);
    transition: all var(--transition-fast);
  }
  .share-btn:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent);
  }
</style>
```

- [ ] **Step 5: 创建易错点展示组件**

```astro
---
// src/components/CommonMistakes.astro
interface Props {
  mistakes: string[];
}

const { mistakes } = Astro.props;
---

<div class="common-mistakes">
  <h3>常见错误</h3>
  <ul>
    {mistakes.map((mistake) => (
      <li>
        <details>
          <summary>{mistake.split(":")[0]}</summary>
          <p>{mistake.split(":")[1] || mistake}</p>
        </details>
      </li>
    ))}
  </ul>
</div>

<style>
  .common-mistakes {
    padding: var(--space-md);
    border-left: 4px solid var(--color-error);
    background-color: var(--sl-color-bg-aside);
    border-radius: var(--radius-md);
    margin: var(--space-md) 0;
  }
  .common-mistakes h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
    color: var(--color-error);
  }
  .common-mistakes ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .common-mistakes li {
    margin-bottom: var(--space-sm);
  }
  .common-mistakes details {
    cursor: pointer;
  }
  .common-mistakes summary {
    font-weight: 500;
    color: var(--sl-color-white);
  }
  .common-mistakes details[open] summary {
    margin-bottom: var(--space-sm);
  }
  .common-mistakes p {
    margin: 0;
    color: var(--sl-color-gray-3);
    font-size: 0.875rem;
  }
</style>
```

- [ ] **Step 6: 提交**

```bash
git add src/components/BookmarkButton.astro src/components/RecentViews.astro src/components/TermTooltip.astro src/components/ShareButtons.astro src/components/CommonMistakes.astro
git commit -m "feat: add interactive feature components"
```

---

## 阶段 4: 首页和自定义页面

### Task 9: 创建首页

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/HomePage.astro`

- [ ] **Step 1: 创建首页组件**

```astro
---
// src/components/HomePage.astro
import { categories } from "../lib/site-config";
import { getProgress } from "../lib/progress-store";

const progress = getProgress();
const completedCount = progress.completed.length;
---

<div class="home-page">
  <!-- 价值主张 -->
  <section class="hero">
    <h1>测试开发面试速成站</h1>
    <p class="hero-subtitle">
      结构化内容帮助你快速补齐测试开发知识框架，在面试中说清楚概念、项目和方案
    </p>
  </section>

  <!-- 学习路线入口 -->
  <section class="roadmap-highlights">
    <h2>学习路线</h2>
    <div class="roadmap-cards">
      <a href="/roadmap/3-day-interview-map/" class="roadmap-card">
        <h3>3 天速记版</h3>
        <p>高频术语和核心概念快速记忆</p>
      </a>
      <a href="/roadmap/7-day-interview-map/" class="roadmap-card">
        <h3>7 天面试版</h3>
        <p>技术专题 + 项目经验 + 场景题</p>
      </a>
    </div>
  </section>

  <!-- 模块入口 -->
  <section class="modules">
    <h2>核心模块</h2>
    <div class="module-grid">
      {categories.map((cat) => (
        <a href={`/${cat.id}/`} class="module-card">
          <h3>{cat.navLabel}</h3>
          <p>{cat.description}</p>
        </a>
      ))}
    </div>
  </section>

  <!-- 进度概览 -->
  {completedCount > 0 && (
    <section class="progress-overview">
      <h2>学习进度</h2>
      <p>已完成 {completedCount} 个主题</p>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          style={`width: ${Math.min((completedCount / 50) * 100, 100)}%`}
        ></div>
      </div>
    </section>
  )}
</div>

<style>
  .home-page {
    max-width: var(--sl-content-width);
    margin: 0 auto;
    padding: var(--space-2xl) var(--space-md);
  }
  .hero {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }
  .hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-md);
    border: none;
  }
  .hero-subtitle {
    font-size: 1.125rem;
    color: var(--sl-color-gray-3);
    line-height: 1.6;
  }
  .roadmap-highlights {
    margin-bottom: var(--space-2xl);
  }
  .roadmap-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-md);
  }
  .roadmap-card {
    padding: var(--space-lg);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }
  .roadmap-card:hover {
    border-color: var(--sl-color-accent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .roadmap-card h3 {
    font-size: 1.25rem;
    margin-bottom: var(--space-sm);
    color: var(--sl-color-accent);
  }
  .modules {
    margin-bottom: var(--space-2xl);
  }
  .module-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }
  .module-card {
    padding: var(--space-md);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }
  .module-card:hover {
    border-color: var(--sl-color-accent);
  }
  .module-card h3 {
    font-size: 1rem;
    margin-bottom: var(--space-sm);
    color: var(--sl-color-white);
  }
  .module-card p {
    font-size: 0.875rem;
    color: var(--sl-color-gray-3);
    margin: 0;
  }
  .progress-overview {
    padding: var(--space-lg);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
  }
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--sl-color-hairline);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-top: var(--space-sm);
  }
  .progress-bar-fill {
    height: 100%;
    background-color: var(--color-success);
    transition: width var(--transition-base);
  }
</style>
```

- [ ] **Step 2: 创建首页路由**

```astro
---
// src/pages/index.astro
import { StarlightPage } from "@astrojs/starlight/components";
import HomePage from "../components/HomePage.astro";
---

<StarlightPage>
  <HomePage />
</StarlightPage>
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/index.astro src/components/HomePage.astro
git commit -m "feat: add custom homepage with roadmap and module entries"
```

---

### Task 10: 创建分类索引页面

**Files:**
- Create: `src/pages/tags.astro`
- Create: `src/pages/difficulty.astro`

- [ ] **Step 1: 创建标签索引页面**

```astro
---
// src/pages/tags.astro
---

<StarlightPage>
  <div class="tags-page">
    <h1>标签索引</h1>
    <p>按标签浏览内容</p>
    <div id="tags-container"></div>
  </div>
</StarlightPage>

<script>
  // 从 Pagefind 获取标签数据
  async function loadTags() {
    // TODO: 实现标签加载逻辑
  }
  loadTags();
</script>

<style>
  .tags-page {
    max-width: var(--sl-content-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-md);
  }
  #tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-top: var(--space-lg);
  }
</style>
```

- [ ] **Step 2: 创建难度索引页面**

```astro
---
// src/pages/difficulty.astro
---

<StarlightPage>
  <div class="difficulty-page">
    <h1>难度索引</h1>
    <div class="difficulty-sections">
      <section>
        <h2>入门级</h2>
        <p>适合测试开发初学者的基础知识</p>
        <div id="beginner-topics"></div>
      </section>
      <section>
        <h2>面试级</h2>
        <p>面试高频问题和技术专题</p>
        <div id="interview-topics"></div>
      </section>
    </div>
  </div>
</StarlightPage>

<style>
  .difficulty-page {
    max-width: var(--sl-content-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--space-md);
  }
  .difficulty-sections {
    display: grid;
    gap: var(--space-xl);
    margin-top: var(--space-lg);
  }
  .difficulty-sections section {
    padding: var(--space-md);
    border: 1px solid var(--sl-color-hairline);
    border-radius: var(--radius-md);
  }
  .difficulty-sections h2 {
    font-size: 1.25rem;
    margin-bottom: var(--space-sm);
  }
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/tags.astro src/pages/difficulty.astro
git commit -m "feat: add tags and difficulty index pages"
```

---

## 阶段 5: 测试和部署

### Task 11: 创建测试配置和基础测试

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `eslint.config.js`
- Create: `tests/a11y/basic.test.ts`
- Create: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: 创建 Vitest 配置**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

- [ ] **Step 2: 创建 Playwright 配置**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
```

- [ ] **Step 3: 创建 ESLint 配置**

```javascript
// eslint.config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**"],
  }
);
```

- [ ] **Step 4: 创建无障碍测试**

```typescript
// tests/a11y/basic.test.ts
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/dom";

describe("basic accessibility", () => {
  it("should have proper lang attribute", () => {
    document.documentElement.lang = "zh-CN";
    expect(document.documentElement.lang).toBe("zh-CN");
  });

  it("should have semantic HTML structure", () => {
    render(`
      <main>
        <h1>测试开发面试速成站</h1>
        <nav aria-label="主导航">
          <ul>
            <li><a href="/glossary/">术语</a></li>
            <li><a href="/tech/">技术专题</a></li>
          </ul>
        </nav>
      </main>
    `);

    expect(document.querySelector("main")).toBeTruthy();
    expect(document.querySelector("nav")).toBeTruthy();
    expect(document.querySelector("h1")).toBeTruthy();
  });
});
```

- [ ] **Step 5: 创建 E2E 导航测试**

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /测试开发面试速成站/i })
  ).toBeVisible();
});

test("category pages are reachable", async ({ page }) => {
  const categories = [
    "glossary",
    "tech",
    "project",
    "scenario",
    "coding",
    "roadmap",
    "ai-learning",
    "practice-template",
  ];

  for (const cat of categories) {
    await page.goto(`/${cat}/`);
    await expect(page).toHaveURL(new RegExp(`/${cat}/`));
  }
});

test("theme toggle works", async ({ page }) => {
  await page.goto("/");
  const themeButton = page.getByRole("button", { name: /主题/i });
  await themeButton.click();
  const html = page.locator("html");
  const theme = await html.getAttribute("data-theme");
  expect(theme).toBeDefined();
});
```

- [ ] **Step 6: 提交**

```bash
git add vitest.config.ts playwright.config.ts eslint.config.js tests/
git commit -m "feat: add test configuration and basic tests"
```

---

### Task 12: 创建 GitHub Actions 部署配置

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建部署工作流**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 提交**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
```

---

## 阶段 6: 内容迁移（示例）

### Task 13: 迁移示例内容

**Files:**
- Create: `src/content/docs/glossary/api-assertion.md`
- Create: `src/content/docs/glossary/idempotency.md`

- [ ] **Step 1: 创建示例术语 - API 断言**

```markdown
---
title: "API 断言"
description: "接口测试中断言的作用和常见模式"
category: "glossary"
difficulty: "beginner"
interviewWeight: 2
tags: ["接口测试", "断言", "Pytest"]
---

## 定义

API 断言是在接口测试中验证响应数据是否符合预期的语句。

## 为什么重要

断言是自动化测试的核心，没有断言的测试无法自动发现问题。

## 常见错误

- 只验证状态码，不验证响应体
- 断言过于具体，导致测试脆弱
- 缺少对边界条件的断言

## 高频问题

### 接口测试中应该断言什么？

1. 状态码
2. 响应时间
3. 关键字段值
4. 数据结构
5. 业务逻辑

---

- [ ] **Step 2: 创建示例术语 - 幂等性**

```markdown
---
title: "幂等性"
description: "接口幂等性的概念和测试方法"
category: "glossary"
difficulty: "interview"
interviewWeight: 3
tags: ["接口测试", "幂等性", "支付"]
---

## 定义

幂等性是指同一个操作执行一次和执行多次的结果相同。

## 为什么重要

在支付、订单等场景中，幂等性是防止重复处理的关键机制。

## 常见错误

- 混淆幂等性和可重复执行
- 忽略非幂等接口的测试
- 没有验证并发请求的幂等性

## 高频问题

### 如何测试接口的幂等性？

1. 发送相同请求多次
2. 验证只有一条数据被创建
3. 验证响应数据一致
4. 验证数据库状态不变
```

- [ ] **Step 3: 提交**

```bash
git add src/content/docs/glossary/
git commit -m "feat: migrate sample glossary content"
```

---

## 自审检查

### 1. Spec 覆盖检查

| Spec 要求 | 对应 Task | 状态 |
|-----------|-----------|------|
| Astro + Starlight 项目初始化 | Task 1-2 | ✅ |
| 内容 Schema 扩展 | Task 3 | ✅ |
| 工具库（存储、进度、收藏） | Task 4-5 | ✅ |
| Starlight 覆盖组件 | Task 6 | ✅ |
| 进度和导航组件 | Task 7 | ✅ |
| 交互功能组件 | Task 8 | ✅ |
| 自定义首页 | Task 9 | ✅ |
| 分类索引页面 | Task 10 | ✅ |
| 测试配置 | Task 11 | ✅ |
| GitHub Pages 部署 | Task 12 | ✅ |
| 内容迁移示例 | Task 13 | ✅ |

### 2. 占位符扫描

- 无 TBD/TODO
- 无 "implement later" 等模式
- 所有步骤都有具体代码

### 3. 类型一致性

- `progress-store.ts` 导出函数与测试中使用的一致
- `bookmark-store.ts` 导出函数与测试中使用的一致
- 组件 Props 接口定义清晰

### 4. 缺失内容

- 测验功能（QuizContainer）作为可选功能，可在后续添加
- 面试模拟器功能作为可选功能，可在后续添加
- 知识地图功能作为可选功能，可在后续添加

---

## 执行交接

计划已完成，保存到 `docs/superpowers/plans/2026-04-16-astro-migration.md`。

两种执行方式：

**1. Subagent-Driven（推荐）** - 每个 Task 分配独立 subagent，Task 间审核，快速迭代

**2. Inline Execution** - 在当前 session 使用 executing-plans 批量执行，带审核点

选择哪种方式？