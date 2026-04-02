# 初学者体验增强 - 阶段1：快速入门

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让初学者一进站就知道"从哪开始学"，并能快速获得入门级内容指引。

**Architecture:**
- 新增客户端组件处理引导、徽章、推荐起点
- 扩展现有组件添加难度徽章显示
- 使用 localStorage 持久化引导状态

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

## 文件结构

```
temp-site/src/
├── components/
│   ├── client/
│   │   ├── difficulty-badge.tsx        # 新增：难度徽章组件
│   │   ├── onboarding-banner.tsx       # 新增：新手引导横幅
│   │   └── category-filter-panel.tsx   # 修改：添加徽章显示、URL参数支持
│   └── docs/
│       ├── topic-page.tsx              # 修改：添加知识关联图
│       └── related-topics-graph.tsx    # 新增：知识关联可视化
├── hooks/
│   └── use-onboarding.ts               # 新增：引导状态 hook
├── lib/
│   └── site-config.ts                  # 修改：添加推荐起点配置
├── app/
│   └── (home)/
│       └── page.tsx                    # 修改：添加引导横幅、"我是新手"入口
└── content/
    └── data.ts                         # 修改：扩展入门条目内容
```

---

### Task 2: 首页"我是新手"入口

**Files:**
- Modify: `temp-site/src/app/(home)/page.tsx`

- [ ] **Step 1: 在"准备重点分流"区域添加"我是新手"入口**

找到 quickStarts 数组（约第21-40行），在末尾添加一个新入口：

```tsx
const quickStarts = [
  {
    title: "先讲清核心概念",
    summary: "如果你一开口就容易卡在术语、接口测试分层或 Pytest/Playwright 基础，这里应该先补。",
    href: "/glossary",
    action: "进入术语与基础专题",
  },
  {
    title: "先收口项目表达",
    summary: "如果你做过项目但说不清亮点、指标和测试策略，应该先整理项目讲法和表达模板。",
    href: "/practice-template/project-story-template",
    action: "先看项目表达模板",
  },
  {
    title: "先练高频追问回答",
    summary: "如果你最怕面试官继续深挖支付回调、登录鉴权、重试和幂等，就先练场景题骨架。",
    href: "/scenario/payment-callback",
    action: "进入场景题模块",
  },
  {
    title: "我是新手",
    summary: "筛选所有入门级内容，从最基础的概念开始学起。",
    href: "/glossary?difficulty=beginner",
    action: "查看入门内容",
  },
];
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/app/\(home\)/page.tsx
git commit -m "feat: add beginner entry point to homepage quick start section"
```

---

### Task 3: 分类列表页支持 URL 难度筛选参数

**Files:**
- Modify: `temp-site/src/components/client/category-filter-panel.tsx`

- [ ] **Step 1: 添加 URL 参数读取**

在组件顶部添加 `useSearchParams` 导入和参数读取：

```tsx
"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ContentTopic, TopicCategory } from "@/content/types";
```

- [ ] **Step 2: 从 URL 读取初始难度值**

在组件内部，读取 URL 参数：

```tsx
const searchParams = useSearchParams();
const initialDifficulty = searchParams.get("difficulty") as "beginner" | "interview" | null;

const [query, setQuery] = useState("");
const [difficulty, setDifficulty] = useState<"all" | "beginner" | "interview">(
  initialDifficulty || "all"
);
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/components/client/category-filter-panel.tsx
git commit -m "feat: support URL difficulty parameter in category filter panel"
```

---

### Task 4: 难度徽章组件

**Files:**
- Create: `temp-site/src/components/client/difficulty-badge.tsx`

- [ ] **Step 1: 创建难度徽章组件**

```tsx
// temp-site/src/components/client/difficulty-badge.tsx
"use client";

type DifficultyBadgeProps = {
  difficulty: "beginner" | "interview";
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const isBeginner = difficulty === "beginner";

  return (
    <span
      className={`difficulty-badge ${isBeginner ? "difficulty-beginner" : "difficulty-interview"}`}
      title={isBeginner ? "入门级内容" : "面试级内容"}
    >
      {isBeginner ? "入门" : "面试"}
    </span>
  );
}
```

- [ ] **Step 2: 验证组件构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/components/client/difficulty-badge.tsx
git commit -m "feat: add DifficultyBadge component for beginner/interview visual indicator"
```

---

### Task 5: 在分类列表页添加难度徽章

**Files:**
- Modify: `temp-site/src/components/client/category-filter-panel.tsx`

- [ ] **Step 1: 导入难度徽章组件**

在文件顶部添加导入：

```tsx
import { DifficultyBadge } from "./difficulty-badge";
```

- [ ] **Step 2: 在术语列表项添加徽章**

找到术语体系的渲染部分（约第68-85行），修改 topic-list-item：

```tsx
<Link key={topic.slug} href={`/${category}/${topic.slug}`} className="topic-list-item">
  <div>
    <div className="topic-list-head">
      <strong>{topic.title}</strong>
      <DifficultyBadge difficulty={topic.difficulty} />
    </div>
    <p>{topic.summary}</p>
  </div>
  <div className="topic-list-tags">
    {topic.tags.slice(0, 4).map((item) => (
      <span key={item}>{item}</span>
    ))}
  </div>
</Link>
```

- [ ] **Step 3: 在非术语列表项添加徽章**

找到非术语体系的渲染部分（约第132-147行），修改 topic-list-item：

```tsx
<Link key={topic.slug} href={`/${category}/${topic.slug}`} className="topic-list-item">
  <div>
    <div className="topic-list-head">
      <strong>{topic.title}</strong>
      <DifficultyBadge difficulty={topic.difficulty} />
      <span className="eyebrow">权重 {topic.interviewWeight}</span>
    </div>
    <p>{topic.summary}</p>
  </div>
  <div className="topic-list-tags">
    {topic.tags.slice(0, 4).map((item) => (
      <span key={item}>{item}</span>
    ))}
  </div>
</Link>
```

- [ ] **Step 4: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 5: 提交**

```bash
git add temp-site/src/components/client/category-filter-panel.tsx
git commit -m "feat: display difficulty badge in category filter panel"
```

---

### Task 6: 新手引导状态 Hook

**Files:**
- Create: `temp-site/src/hooks/use-onboarding.ts`

- [ ] **Step 1: 创建引导状态 Hook**

```tsx
// temp-site/src/hooks/use-onboarding.ts
"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

const STORAGE_KEY = "testdev:onboarding-dismissed";

export function useOnboarding() {
  const [isDismissed, setIsDismissed] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEY, false),
  );

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    writeStorage(STORAGE_KEY, true);
  }, []);

  const reset = useCallback(() => {
    setIsDismissed(false);
    writeStorage(STORAGE_KEY, false);
  }, []);

  return {
    isDismissed,
    dismiss,
    reset,
  };
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/hooks/use-onboarding.ts
git commit -m "feat: add useOnboarding hook for onboarding banner state"
```

---

### Task 7: 新手引导横幅组件

**Files:**
- Create: `temp-site/src/components/client/onboarding-banner.tsx`

- [ ] **Step 1: 创建引导横幅组件**

```tsx
// temp-site/src/components/client/onboarding-banner.tsx
"use client";

import Link from "next/link";
import { useOnboarding } from "@/hooks/use-onboarding";

const recommendedTopics = [
  { slug: "api-assertion", title: "接口断言", category: "glossary" },
  { slug: "fixture", title: "Fixture", category: "glossary" },
  { slug: "idempotency", title: "幂等", category: "glossary" },
  { slug: "smoke-testing", title: "冒烟测试", category: "glossary" },
  { slug: "regression-testing", title: "回归测试", category: "glossary" },
];

export function OnboardingBanner() {
  const { isDismissed, dismiss } = useOnboarding();

  if (isDismissed) {
    return null;
  }

  return (
    <section className="onboarding-banner">
      <div className="onboarding-content">
        <h2>新手入门推荐</h2>
        <p>从这 5 个核心术语开始，建立测试开发知识骨架：</p>
        <div className="onboarding-links">
          {recommendedTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.category}/${topic.slug}`}
              className="onboarding-link"
            >
              {topic.title}
            </Link>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="onboarding-dismiss button-reset"
        onClick={dismiss}
        aria-label="关闭引导"
      >
        ×
      </button>
    </section>
  );
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/components/client/onboarding-banner.tsx
git commit -m "feat: add OnboardingBanner component with 5 recommended topics"
```

---

### Task 8: 在首页添加引导横幅

**Files:**
- Modify: `temp-site/src/app/(home)/page.tsx`

- [ ] **Step 1: 导入引导横幅组件**

在文件顶部添加导入：

```tsx
import { OnboardingBanner } from "@/components/client/onboarding-banner";
```

- [ ] **Step 2: 在 hero 区域后添加引导横幅**

找到 `<section className="hero-band">` 结束位置（约第77行 `</section>` 后），添加：

```tsx
      </section>

      <OnboardingBanner />

      <section className="home-section">
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/app/\(home\)/page.tsx
git commit -m "feat: add OnboardingBanner to homepage hero section"
```

---

### Task 9: 类别推荐起点配置

**Files:**
- Modify: `temp-site/src/lib/site-config.ts`

- [ ] **Step 1: 添加推荐起点配置**

在文件末尾 `isTopicCategory` 函数后添加：

```tsx
export const categoryEntryRecommendations: Record<TopicCategory, string> = {
  glossary: "api-assertion",
  tech: "pytest",
  project: "payment-callback",
  scenario: "payment-callback",
  coding: "retry-mechanism",
  roadmap: "3-day-interview-map",
  "ai-learning": "ai-test-generation",
  "practice-template": "project-story-template",
};

export function getRecommendedEntry(category: TopicCategory): string {
  return categoryEntryRecommendations[category];
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/lib/site-config.ts
git commit -m "feat: add category entry recommendations configuration"
```

---

### Task 10: 在首页模块导航添加推荐起点链接

**Files:**
- Modify: `temp-site/src/app/(home)/page.tsx`

- [ ] **Step 1: 导入推荐起点函数**

添加导入：

```tsx
import { categoryConfig, orderedCategories, getRecommendedEntry } from "@/lib/site-config";
```

- [ ] **Step 2: 导入 getAllTopics**

确保导入 `getAllTopics`（如果未导入）：

```tsx
import { getAllTopics, getHomeQuestionGuides, getRoadmapHighlights } from "@/content";
```

- [ ] **Step 3: 在模块导航区域添加推荐起点**

找到模块导航渲染部分（约第149-169行），修改每个类别的渲染：

```tsx
{orderedCategories.map((category) => {
  const items = allTopics.filter((topic) => topic.category === category).slice(0, 2);
  const recommendedSlug = getRecommendedEntry(category);
  const recommendedTopic = allTopics.find((topic) => topic.slug === recommendedSlug);

  return (
    <section key={category} className="module-row">
      <div className="module-meta">
        <p className="module-kicker">{categoryConfig[category].navLabel}</p>
        <h3>{categoryConfig[category].title}</h3>
        <p>{categoryConfig[category].description}</p>
        <Link href={categoryConfig[category].href}>进入模块</Link>
        {recommendedTopic && (
          <Link
            href={`/${category}/${recommendedSlug}`}
            className="recommended-entry"
          >
            推荐起点：{recommendedTopic.title}
          </Link>
        )}
      </div>
      <div className="module-links">
        {items.map((item) => (
          <Link key={item.slug} href={`/${item.category}/${item.slug}`} className="module-link">
            <strong>{item.title}</strong>
            <span>{item.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  );
})}
```

- [ ] **Step 4: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 5: 提交**

```bash
git add temp-site/src/app/\(home\)/page.tsx
git commit -m "feat: add recommended entry link to each category in module navigation"
```

---

### Task 11: 知识关联可视化组件

**Files:**
- Create: `temp-site/src/components/docs/related-topics-graph.tsx`

- [ ] **Step 1: 创建知识关联图组件**

```tsx
// temp-site/src/components/docs/related-topics-graph.tsx
"use client";

import Link from "next/link";
import type { ContentTopic } from "@/content/types";

type RelatedTopicsGraphProps = {
  currentSlug: string;
  relatedTopics: ContentTopic[];
};

export function RelatedTopicsGraph({
  currentSlug,
  relatedTopics,
}: RelatedTopicsGraphProps) {
  if (relatedTopics.length === 0) {
    return null;
  }

  // 计算布局：当前节点在中心，相关节点围绕
  const centerX = 150;
  const centerY = 100;
  const radius = 80;

  return (
    <div className="related-topics-graph">
      <svg
        viewBox="0 0 300 200"
        className="related-topics-svg"
        aria-label="知识关联图"
      >
        {/* 连线 */}
        {relatedTopics.map((topic, index) => {
          const angle = (index / relatedTopics.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <line
              key={`line-${topic.slug}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              className="graph-line"
            />
          );
        })}

        {/* 当前节点（中心） */}
        <circle
          cx={centerX}
          cy={centerY}
          r={20}
          className="graph-node graph-node-current"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="graph-label graph-label-current"
        >
          当前
        </text>

        {/* 相关节点 */}
        {relatedTopics.map((topic, index) => {
          const angle = (index / relatedTopics.length) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <Link
              key={`node-${topic.slug}`}
              href={`/${topic.category}/${topic.slug}`}
            >
              <circle
                cx={x}
                cy={y}
                r={18}
                className="graph-node graph-node-related"
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="graph-label"
              >
                {topic.title.length > 4 ? topic.title.slice(0, 4) : topic.title}
              </text>
            </Link>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="graph-legend">
        {relatedTopics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${topic.category}/${topic.slug}`}
            className="graph-legend-item"
          >
            <span className="graph-legend-dot" />
            {topic.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/components/docs/related-topics-graph.tsx
git commit -m "feat: add RelatedTopicsGraph SVG visualization component"
```

---

### Task 12: 在条目详情页集成知识关联图

**Files:**
- Modify: `temp-site/src/components/docs/topic-page.tsx`

- [ ] **Step 1: 导入知识关联图组件**

在文件顶部添加导入：

```tsx
import { RelatedTopicsGraph } from "./related-topics-graph";
```

- [ ] **Step 2: 替换相关主题区域**

找到"相关主题"部分（约第123-139行），替换为：

```tsx
{relatedTopics.length ? (
  <section className="content-block">
    <div className="content-block-head">
      <h2>相关主题</h2>
      <p>继续顺着知识链阅读，避免只记住孤立概念。</p>
    </div>
    <div className="content-block-body">
      <RelatedTopicsGraph
        currentSlug={topic.slug}
        relatedTopics={relatedTopics}
      />
    </div>
  </section>
) : null}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/components/docs/topic-page.tsx
git commit -m "feat: integrate RelatedTopicsGraph into topic detail page"
```

---

### Task 13: 添加引导横幅样式

**Files:**
- 需要找到现有样式文件位置

- [ ] **Step 1: 查找样式文件**

Run: `find E:/git_repositories/TestDev-Sprint/temp-site/src -name "*.css" -o -name "globals.css"`

- [ ] **Step 2: 添加引导横幅样式**

在全局样式文件中添加：

```css
/* 新手引导横幅 */
.onboarding-banner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  margin: 1rem auto;
  max-width: var(--content-width, 1200px);
  background: linear-gradient(135deg, var(--color-primary-light, #e0f2fe), var(--color-secondary-light, #f0f9ff));
  border-radius: 0.75rem;
  border: 1px solid var(--color-border, #e5e7eb);
}

.onboarding-content h2 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.onboarding-content p {
  margin: 0 0 1rem;
  color: var(--color-text-secondary, #6b7280);
}

.onboarding-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.onboarding-link {
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--color-primary, #0284c7);
  border: 1px solid var(--color-border, #e5e7eb);
  transition: all 0.2s;
}

.onboarding-link:hover {
  background: var(--color-primary, #0284c7);
  color: white;
}

.onboarding-dismiss {
  padding: 0.25rem 0.5rem;
  font-size: 1.25rem;
  color: var(--color-text-secondary, #6b7280);
  cursor: pointer;
}

.onboarding-dismiss:hover {
  color: var(--color-text, #111827);
}

/* 难度徽章 */
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.difficulty-beginner {
  background: #dcfce7;
  color: #166534;
}

.difficulty-interview {
  background: #fef3c7;
  color: #92400e;
}

/* 推荐起点 */
.recommended-entry {
  display: inline-flex;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: var(--color-primary, #0284c7);
  text-decoration: none;
  border-radius: 0.25rem;
  background: var(--color-primary-light, #e0f2fe);
}

.recommended-entry:hover {
  text-decoration: underline;
}

/* 知识关联图 */
.related-topics-graph {
  padding: 1rem;
  background: var(--color-surface, #f9fafb);
  border-radius: 0.5rem;
}

.related-topics-svg {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
}

.graph-node {
  fill: white;
  stroke: var(--color-border, #e5e7eb);
  stroke-width: 2;
  cursor: pointer;
  transition: fill 0.2s;
}

.graph-node-current {
  fill: var(--color-primary, #0284c7);
  stroke: var(--color-primary-dark, #0369a1);
}

.graph-node-related:hover {
  fill: var(--color-primary-light, #e0f2fe);
  stroke: var(--color-primary, #0284c7);
}

.graph-line {
  stroke: var(--color-border, #e5e7eb);
  stroke-width: 1;
}

.graph-label {
  font-size: 10px;
  fill: var(--color-text, #111827);
  pointer-events: none;
}

.graph-label-current {
  fill: white;
  font-weight: 600;
}

.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.graph-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text, #111827);
  text-decoration: none;
}

.graph-legend-item:hover {
  text-decoration: underline;
}

.graph-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary, #0284c7);
}

/* 响应式 */
@media (max-width: 640px) {
  .onboarding-banner {
    flex-direction: column;
    padding: 1rem;
  }

  .onboarding-links {
    flex-direction: column;
  }

  .onboarding-link {
    text-align: center;
  }
}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add <样式文件路径>
git commit -m "style: add CSS styles for onboarding banner, difficulty badge, and knowledge graph"
```

---

### Task 14: 入门内容扩展（10条）

**Files:**
- Modify: `temp-site/src/content/data.ts`

**说明：** 此任务涉及大量内容扩展，建议使用 Agent 工具并行处理。以下列出需要扩展的条目：

1. api-assertion（已有 sections，检查是否完整）
2. fixture（已有 sections，检查是否完整）
3. idempotency（已有 sections，检查是否完整）
4. smoke-testing（已有 sections，检查是否完整）
5. regression-testing（已有 sections，检查是否完整）
6. pytest
7. playwright
8. api-testing
9. ci-cd
10. quality-gate

- [ ] **Step 1: 检查已有扩展条目**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site/src/content && grep -A5 "slug: \"api-assertion\"" data.ts | head -20`

- [ ] **Step 2: 确认扩展模板**

Glossary 扩展模板包含以下 sections：
- 基础入门
- 学习路径
- 实操案例
- 常见误区
- 面试问答

- [ ] **Step 3: 使用 Agent 并行扩展缺少 sections 的条目**

（此步骤需要实际运行 Agent 执行内容扩展）

- [ ] **Step 4: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 5: 提交**

```bash
git add temp-site/src/content/data.ts
git commit -m "feat(content): expand 10 core beginner topics with detailed sections"
```

---

### Task 15: 验证移动端响应式

- [ ] **Step 1: 启动开发服务器**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run dev`

- [ ] **Step 2: 检查以下组件在移动端的表现**

- 引导横幅（折叠/布局）
- 难度徽章（大小/位置）
- 知识关联图（缩放）
- 推荐起点链接（换行）

- [ ] **Step 3: 如有问题，调整样式**

根据检查结果调整 CSS。

- [ ] **Step 4: 最终构建验证**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

---

## 自审清单

**1. Spec 覆盖检查：**
- [x] 1.1 入门级内容标识系统 → Task 1, 2, 3, 4, 5（难度徽章、"我是新手"入口、URL筛选参数）
- [x] 1.2 新手引导组件 → Task 6, 7, 8（引导横幅）
- [x] 1.3 类别推荐起点 → Task 9, 10（推荐入口配置）
- [x] 1.4 入门内容扩展 → Task 14（10条扩展）
- [x] 1.5 知识关联可视化 → Task 11, 12（关联图组件）
- [x] 1.6 移动端响应式 → Task 15（验证）
- [x] localStorage 状态 → Task 6（useOnboarding hook）

**2. 占位符扫描：**
- 无 TBD/TODO/待实现内容
- 样式文件路径需要确认（Task 13）

**3. 类型一致性：**
- DifficultyBadge 使用 "beginner" | "interview" 类型
- useOnboarding 返回 boolean 类型状态
- RelatedTopicsGraph 使用 ContentTopic[] 类型