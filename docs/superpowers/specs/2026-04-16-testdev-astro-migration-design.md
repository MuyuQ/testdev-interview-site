# 测试开发面试速成站 - Astro + Starlight 改造设计

**日期**: 2026-04-16
**状态**: 待审核

---

## 1. 概述

将 TestDev-Sprint 项目从 Next.js 16 + React 19 + Tailwind CSS 4 技术栈迁移到 Astro 4.16 + Starlight 0.28.6，保留所有内容和交互功能，部署到 GitHub Pages。

### 1.1 目标

- 使用 Astro + Starlight 作为新框架
- 保留全部 8 个内容分类（术语、技术、项目、场景、编码、路线、AI学习、练习模板）
- 重新实现所有交互功能（搜索、进度追踪、术语悬浮、收藏、最近浏览）
- 部署到 GitHub Pages

### 1.2 参考项目

参考 `E:\git_repositories\typescript_python_web` 的项目结构和组件模式。

### 1.3 内容来源

当前内容位于 `temp-site/` 目录中（Next.js 项目结构）。内容数据包括：
- TypeScript 定义的内容类型（`src/content/types.ts`）
- 静态内容数据（`src/content/data.ts`）
- 各分类的具体内容文件

迁移时需要将这些内容转换为 Markdown + Frontmatter 格式。

### 1.4 Git 分支策略

- 主分支：`main`
- 开发分支：`feat/astro-migration`
- 每完成一个阶段立即提交到开发分支
- 全部完成后合并到 `main` 并部署

---

## 2. 技术架构

### 2.1 核心技术栈

```
Astro 4.16.19
├── @astrojs/starlight 0.28.6 (文档框架)
├── TypeScript 5.x
├── Vitest (单元测试)
├── Playwright (E2E 测试)
└── ESLint + Prettier (代码质量)
```

### 2.2 交互功能实现方式

Astro Islands 模式：
- **静态内容**: Astro 服务端渲染（SSR/SSG）
- **交互组件**: 使用 Vanilla JS 或轻量级框架（Preact）作为 Islands
- **状态持久化**: localStorage（保持现有模式 `testdev:{feature}`）

### 2.3 项目结构

```
TestDev-Sprint/
├── astro.config.mjs          # Astro 配置
├── package.json              # 依赖管理
├── tsconfig.json             # TypeScript 配置
├── vitest.config.ts          # 测试配置
├── playwright.config.ts      # E2E 测试配置
├── eslint.config.js          # ESLint 配置
├── public/                   # 静态资源
│   └── favicon.svg
├── src/
│   ├── components/           # Astro 组件
│   │   ├── Banner.astro
│   │   ├── Header.astro
│   │   ├── Pagination.astro
│   │   ├── RightSidebar.astro
│   │   ├── MobileNav.astro
│   │   ├── SearchBox.astro           # 新增：搜索组件
│   │   ├── TermTooltip.astro         # 新增：术语悬浮
│   │   ├── ProgressTracker.astro     # 新增：进度追踪
│   │   ├── BookmarkManager.astro     # 新增：收藏管理
│   │   └── RecentViews.astro         # 新增：最近浏览
│   ├── content/              # 内容数据
│   │   ├── config.ts         # Starlight 内容配置
│   │   └── docs/             # Markdown 内容
│   │       ├── glossary/     # 术语
│   │       ├── tech/         # 技术专题
│   │       ├── project/      # 项目类型
│   │       ├── scenario/     # 场景题
│   │       ├── coding/       # 编码题
│   │       ├── roadmap/      # 学习路线
│   │       ├── ai-learning/  # AI学习指南
│   │       └── practice-template/ # 练习模板
│   ├── layouts/              # 页面布局
│   │   └── MainLayout.astro
│   ├── lib/                  # 工具库
│   │   ├── search-index.ts   # 搜索索引
│   │   ├── progress-store.ts # 进度存储
│   │   ├── bookmark-store.ts # 收藏存储
│   │   ├── term-registry.ts  # 术语注册表
│   │   └── site-config.ts    # 站点配置
│   ├── pages/                # 页面路由
│   │   ├── index.astro       # 首页
│   │   └── 404.astro
│   └── styles/               # 样式
│       ├── tokens.css        # 设计令牌
│       ├── custom-layout.css # 布局样式
│       ├── components.css    # 组件样式
│       └── tabs-custom.css   # 标签页样式
└── tests/                    # 测试
    ├── unit/                 # 单元测试
    └── e2e/                  # E2E 测试
```

---

## 3. 内容迁移

### 3.1 内容模型映射

现有 TypeScript 类型 → Starlight Frontmatter：

```typescript
// 现有类型 (PROJECT_DOC.md)
type TopicMeta = {
  slug: string
  title: string
  summary: string
  category: "glossary" | "tech" | "project" | "scenario" | "coding" | "roadmap" | "ai-learning" | "practice-template"
  tags: string[]
  difficulty: "beginner" | "interview"
  interviewWeight: 1 | 2 | 3
}

// 转换为 Starlight frontmatter
---
title: "术语名称"
description: "简短描述"
tags: ["tag1", "tag2"]
difficulty: "beginner"  // 或 "interview"
weight: 1  // 面试权重 (1-3)
category: "glossary"
---
```

### 3.2 内容目录结构

每个分类对应 `src/content/docs/` 下的子目录：

| 分类 | 目录 | 说明 |
|------|------|------|
| glossary | `docs/glossary/` | 术语定义、易错点、混淆术语 |
| tech | `docs/tech/` | 技术专题（Python、Pytest、Selenium 等） |
| project | `docs/project/` | 项目类型（电商、支付、后台管理等） |
| scenario | `docs/scenario/` | 场景题（秒杀、支付回调等） |
| coding | `docs/coding/` | 编码题（请求重试、结果缓存等） |
| roadmap | `docs/roadmap/` | 学习路线与面试打法 |
| ai-learning | `docs/ai-learning/` | AI 时代成长指南 |
| practice-template | `docs/practice-template/` | 练手模板库 |

### 3.3 Starlight 自定义 Schema

Starlight 默认的 frontmatter schema 需要扩展以支持自定义字段。在 `src/content/config.ts` 中定义：

```typescript
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        difficulty: z.enum(['beginner', 'interview']).optional(),
        interviewWeight: z.number().min(1).max(3).optional(),
        category: z.enum([
          'glossary', 'tech', 'project', 'scenario',
          'coding', 'roadmap', 'ai-learning', 'practice-template'
        ]),
        tags: z.array(z.string()).default([]),
      }),
    }),
  }),
};
```

### 3.4 侧边栏配置

在 `astro.config.mjs` 中配置：

```javascript
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
]
```

---

## 4. 交互功能设计

### 4.1 全站搜索

**实现方式**: 
- 复用 Starlight 内置的 Pagefind 搜索
- 自定义搜索框 UI 作为 Astro Island 组件
- 通过 Pagefind 的 API 支持按标签、难度、分类筛选

**数据流**:
```
构建时 → Starlight 自动生成 Pagefind 索引
运行时 → 用户输入 → Pagefind 查询 → 显示结果
```

**注意**: 不需要自建 FlexSearch/MiniSearch 索引，直接使用 Starlight 集成的 Pagefind 即可。

### 4.2 学习进度追踪

**存储键**: `testdev:progress`

**功能**:
- 记录每个内容的完成状态
- 侧边栏显示进度标记
- 首页显示总体进度

**实现**: 参考 `typescript_python_web/src/lib/progress-store.ts`

### 4.3 术语悬浮解释

**桌面端**: hover 触发浮层
**移动端**: click 触发浮层

**浮层内容**:
- 一句话定义
- "查看详情" 链接到术语详情页

**实现方案**: 使用 Remark 插件在构建时处理

1. **术语引用语法**: 在 Markdown 中使用 `[[术语名]]` 语法
2. **Remark 插件**: 扫描所有 `[[term]]` 引用，替换为 `<span class="term-ref" data-term="slug">术语名</span>`
3. **术语注册表**: 构建时从 `docs/glossary/` 扫描所有术语，生成术语映射表
4. **客户端 JS**: 处理 hover/click 事件，显示悬浮浮层

**避免误匹配**:
- 仅匹配完整的 `[[...]]` 语法
- 术语 slug 唯一，避免同名冲突
- 代码块内的引用不处理

### 4.4 收藏与最近浏览

**存储键**: 
- `testdev:bookmarks`
- `testdev:recent`

**功能**:
- 收藏按钮添加到本地收藏
- 自动记录最近浏览的 10 个内容
- 收藏/最近浏览页面

### 4.5 测验功能（可选）

参考项目包含 `QuizContainer.astro`（73KB 大型组件），支持交互式测验。

**决策点**: 是否需要迁移测验功能？
- 如果需要：作为 Astro Island 实现，使用 Preact 或 Vanilla JS
- 如果不需要：可以在后续版本添加

---

## 5. 样式设计

### 5.1 设计令牌

参考 typescript_python_web 的 tokens.css，自定义为测试开发站点：

```css
:root {
  --sl-color-bg: #ffffff;
  --sl-color-bg-nav: #ffffff;
  --sl-color-text: #1a1a2e;
  --sl-color-text-accent: #4361ee;
  --sl-color-border: #e2e8f0;
}

:root[data-theme="dark"] {
  --sl-color-bg: #0c0e12;
  --sl-color-bg-nav: #0c0e12;
  --sl-color-text: #e2e8f0;
  --sl-color-text-accent: #60a5fa;
  --sl-color-border: #334155;
}
```

### 5.2 字体

```css
font-family: 'Inter', system-ui, sans-serif;
code font-family: 'JetBrains Mono', monospace;
```

### 5.3 布局

- **桌面端**: 三栏布局（左侧导航 + 中间内容 + 右侧目录）
- **移动端**: 汉堡菜单 + 单栏内容

Starlight 默认提供此布局，只需自定义样式。

---

## 6. 组件清单

### 6.1 复用 typescript_python_web 的组件

| 组件 | 来源 | 说明 |
|------|------|------|
| Banner.astro | 参考 | 顶部横幅 |
| Header.astro | 参考 | 顶部导航栏 |
| Pagination.astro | 参考 | 分页导航 |
| RightSidebar.astro | 参考 | 右侧目录 |
| MobileNav.astro | 参考 | 移动端导航 |
| LessonProgressMarkers.astro | 参考 | 进度标记 |
| BookmarkButton.astro | 参考 | 收藏按钮 |
| CommonMistakes.astro | 参考 | 易错点展示 |
| CompletionBadge.astro | 参考 | 完成徽章 |
| PathNavigator.astro | 参考 | 路径导航 |
| SidebarProgress.astro | 参考 | 侧边栏进度 |
| ShareButtons.astro | 参考 | 分享按钮 |

### 6.2 新增组件

| 组件 | 说明 |
|------|------|
| SearchBox.astro | 全站搜索框 |
| TermTooltip.astro | 术语悬浮提示 |
| TagFilter.astro | 标签筛选 |
| DifficultyFilter.astro | 难度筛选 |
| HomePage.astro | 首页（速成地图结构） |

### 6.3 工具库

| 模块 | 说明 |
|------|------|
| search-index.ts | 搜索索引生成和查询 |
| progress-store.ts | 学习进度 localStorage 操作 |
| bookmark-store.ts | 收藏 localStorage 操作 |
| term-registry.ts | 术语注册和引用解析 |
| site-config.ts | 站点配置（分类、标签等） |

---

## 7. 首页设计

首页采用"速成地图"结构，而非纯文档样式：

```
┌─────────────────────────────────────┐
│         价值主张 & 标题              │
├─────────────────────────────────────┤
│     3 天 / 7 天学习路线入口          │
├─────────────────────────────────────┤
│         高频问题总览                 │
├─────────────────────────────────────┤
│     各核心模块快速跳转卡片           │
│  [术语] [技术] [项目] [场景] ...    │
├─────────────────────────────────────┤
│       最近浏览 & 收藏入口            │
└─────────────────────────────────────┘
```

### 7.1 Starlight 自定义首页方案

Starlight 默认提供文档首页，但本项目需要自定义"速成地图"首页。

**实现方式**: 
- 创建 `src/pages/index.astro` 覆盖 Starlight 默认首页
- 使用 Starlight 的 `<StarlightPage>` 组件包裹自定义内容
- 保持 Starlight 的 Header/Footer 和主题切换功能

```astro
---
import { StarlightPage } from '@astrojs/starlight/components';
import HomePage from '../components/HomePage.astro';
---

<StarlightPage>
  <HomePage />
</StarlightPage>
```

---

## 8. 部署配置

### 8.1 GitHub Pages

```javascript
// astro.config.mjs
export default defineConfig({
  site: "https://muyuq.github.io",
  base: "/TestDev-Sprint",
  // ...
});
```

### 8.2 构建脚本

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 8.3 GitHub Actions

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./dist
```

---

## 9. 实施步骤

### 阶段 1: 项目骨架 (1-2 天)
- [ ] 初始化 Astro + Starlight 项目
- [ ] 配置基础结构和依赖
- [ ] 设置 GitHub Pages 部署

### 阶段 2: 内容迁移 (2-3 天)
- [ ] 转换内容模型为 Markdown + Frontmatter
- [ ] 创建 8 个分类目录
- [ ] 配置侧边栏导航

### 阶段 3: 样式定制 (1-2 天)
- [ ] 自定义设计令牌
- [ ] 实现深色主题
- [ ] 调整布局和排版

### 阶段 4: 交互功能 (3-4 天)
- [ ] 实现搜索功能
- [ ] 实现进度追踪
- [ ] 实现术语悬浮
- [ ] 实现收藏和最近浏览
- [ ] 实现标签/难度筛选

### 阶段 5: 首页和收尾 (1-2 天)
- [ ] 设计并实现首页
- [ ] 添加测试
- [ ] 部署和验收

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Astro Islands 性能 | 交互功能可能不如 React 流畅 | 使用 Preact 替代 Vanilla JS |
| 内容迁移工作量 | 大量内容需要转换 | 编写脚本批量转换 |
| Starlight 限制 | 某些自定义需求可能受限 | 使用 Starlight 的组件覆盖机制 |
| 术语悬浮实现 | 需要扫描正文并注入标记 | 构建时处理，使用 Remark 插件 |

---

## 11. 验收标准

- [ ] 所有 8 个分类内容可正常访问
- [ ] 术语页支持定义、易错、混淆、高频问题
- [ ] 深色/浅色主题切换正常
- [ ] 桌面端三栏布局正常
- [ ] 移动端导航可用
- [ ] 搜索功能正常
- [ ] 进度追踪正常
- [ ] 术语悬浮正常
- [ ] 收藏和最近浏览正常
- [ ] GitHub Pages 部署成功
