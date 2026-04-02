# 初学者体验增强 - 阶段3：面试冲刺

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让初学者能"快速串联知识点"并"模拟面试场景"，通过随机抽题、模拟面试、知识图谱帮助最后冲刺。

**Architecture:**
- 新增随机抽题页面和组件
- 新增模拟面试器页面和组件
- 新增全站知识图谱页面
- 增强面试冲刺仪表盘

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

## 文件结构

```
temp-site/src/
├── app/
│   └── (docs)/
│       └── quiz/
│           └── page.tsx                # 新增：随机抽题页面
│       └── interview-simulator/
│           └── page.tsx                # 新增：模拟面试页面
│       └── knowledge-map/
│           └── page.tsx                # 新增：知识图谱页面
├── components/
│   ├── client/
│   │   ├── random-quiz.tsx             # 新增：随机抽题组件
│   │   ├── interview-simulator.tsx     # 新增：模拟面试组件
│   │   ├── knowledge-map.tsx           # 新增：知识图谱组件
│   │   ├── interview-dashboard.tsx     # 新增：面试冲刺仪表盘
│   │   └── study-dashboard.tsx         # 修改：集成面试冲刺
│   └── docs/
│       └── docs-frame.tsx              # 修改：支持新页面
├── hooks/
│   └── use-quiz-history.ts             # 新增：抽题历史 hook
├── content/
│   ├── types.ts                        # 修改：添加追问链类型
│   └── interview-chains.ts             # 新增：预设追问链数据
└── lib/
    └── site-config.ts                  # 修改：添加新页面路由
```

---

### Task 1: 抽题历史 Hook

**Files:**
- Create: `temp-site/src/hooks/use-quiz-history.ts`

- [ ] **Step 1: 创建抽题历史 Hook**

```tsx
// temp-site/src/hooks/use-quiz-history.ts
"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

type QuizResult = {
  topicSlug: string;
  question: string;
  rating: "good" | "average" | "poor";
  timestamp: string;
};

type QuizSession = {
  id: string;
  scope: string;
  count: number;
  results: QuizResult[];
  completedAt: string;
};

const STORAGE_KEY = "testdev:quiz-history";

export function useQuizHistory() {
  const [sessions, setSessions] = useState<QuizSession[]>(() =>
    readStorage<QuizSession[]>(STORAGE_KEY, []),
  );

  const saveSession = useCallback((session: QuizSession) => {
    setSessions((current) => {
      const next = [session, ...current].slice(0, 50); // 保留最近50次
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getStats = useCallback(() => {
    const allResults = sessions.flatMap((s) => s.results);
    const good = allResults.filter((r) => r.rating === "good").length;
    const average = allResults.filter((r) => r.rating === "average").length;
    const poor = allResults.filter((r) => r.rating === "poor").length;
    const total = allResults.length;

    return {
      totalSessions: sessions.length,
      totalQuestions: total,
      good,
      average,
      poor,
      goodRate: total > 0 ? Math.round((good / total) * 100) : 0,
    };
  }, [sessions]);

  const clearHistory = useCallback(() => {
    setSessions([]);
    writeStorage(STORAGE_KEY, []);
  }, []);

  return {
    sessions,
    saveSession,
    getStats,
    clearHistory,
  };
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/hooks/use-quiz-history.ts
git commit -m "feat: add useQuizHistory hook for quiz session management"
```

---

### Task 2: 追问链类型和数据

**Files:**
- Modify: `temp-site/src/content/types.ts`
- Create: `temp-site/src/content/interview-chains.ts`

- [ ] **Step 1: 添加追问链类型**

在 `types.ts` 末尾添加：

```typescript
// 追问链类型
export type InterviewChainStep = {
  slug: string;
  question: string;
  followUpHint?: string;
};

export type InterviewChain = {
  id: string;
  title: string;
  description: string;
  category: TopicCategory;
  steps: InterviewChainStep[];
};
```

- [ ] **Step 2: 创建预设追问链数据**

```typescript
// temp-site/src/content/interview-chains.ts
import type { InterviewChain } from "./types";

export const interviewChains: InterviewChain[] = [
  {
    id: "payment-scenario",
    title: "支付场景链",
    description: "从幂等概念开始，深入支付回调、接口断言和重试机制",
    category: "scenario",
    steps: [
      {
        slug: "idempotency",
        question: "支付回调为什么必须做幂等？怎么实现？",
        followUpHint: "可能追问：幂等键的选择、并发幂等怎么处理",
      },
      {
        slug: "payment-callback",
        question: "支付回调的测试重点有哪些？",
        followUpHint: "可能追问：回调超时、签名验证、重复回调",
      },
      {
        slug: "api-assertion",
        question: "支付接口的断言应该覆盖哪些层？",
        followUpHint: "可能追问：数据库断言、异步结果验证",
      },
      {
        slug: "retry-mechanism",
        question: "支付失败后的重试策略怎么设计？",
        followUpHint: "可能追问：重试间隔、最大重试次数、告警机制",
      },
    ],
  },
  {
    id: "test-framework",
    title: "测试框架链",
    description: "从 Pytest 入门，深入 Fixture、Mock 和测试数据策略",
    category: "scenario",
    steps: [
      {
        slug: "pytest",
        question: "Pytest 相比 unittest 有哪些优势？",
        followUpHint: "可能追问：参数化、Fixture 作用域",
      },
      {
        slug: "fixture",
        question: "Pytest Fixture 的作用域怎么选择？",
        followUpHint: "可能追问：Fixture 嵌套、teardown 处理",
      },
      {
        slug: "mock-stub",
        question: "什么时候用 Mock，什么时候用真实服务？",
        followUpHint: "可能追问：Mock 的边界、集成测试策略",
      },
      {
        slug: "test-data-strategy",
        question: "测试数据的准备策略有哪些？",
        followUpHint: "可能追问：数据隔离、数据清理",
      },
    ],
  },
  {
    id: "api-testing-chain",
    title: "接口测试链",
    description: "从接口测试基础，深入断言、质量门禁和 CI/CD",
    category: "scenario",
    steps: [
      {
        slug: "api-testing",
        question: "接口测试的核心流程是什么？",
        followUpHint: "可能追问：环境准备、数据构造、断言设计",
      },
      {
        slug: "api-assertion",
        question: "接口断言应该覆盖哪些维度？",
        followUpHint: "可能追问：业务断言、链路断言",
      },
      {
        slug: "quality-gate",
        question: "质量门禁怎么设计？哪些应该阻断发布？",
        followUpHint: "可能追问：门禁分级、前移策略",
      },
      {
        slug: "ci-cd",
        question: "接口自动化如何集成到 CI/CD？",
        followUpHint: "可能追问：触发时机、失败处理、报告输出",
      },
    ],
  },
  {
    id: "performance-testing-chain",
    title: "性能测试链",
    description: "从性能测试基础，深入指标分析、瓶颈定位和优化",
    category: "scenario",
    steps: [
      {
        slug: "performance-testing",
        question: "性能测试的主要类型有哪些？各自的目标是什么？",
        followUpHint: "可能追问：负载测试、压力测试、容量测试的区别",
      },
      {
        slug: "performance-metrics",
        question: "性能测试需要关注哪些核心指标？",
        followUpHint: "可能追问：响应时间、吞吐量、错误率的判断标准",
      },
      {
        slug: "performance-bottleneck",
        question: "发现性能瓶颈后怎么定位问题？",
        followUpHint: "可能追问：CPU、内存、IO、网络的排查方法",
      },
    ],
  },
  {
    id: "ui-automation-chain",
    title: "UI自动化链",
    description: "从 Playwright 入门，深入页面对象模式和稳定性保障",
    category: "scenario",
    steps: [
      {
        slug: "playwright",
        question: "Playwright 相比 Selenium 有什么优势？",
        followUpHint: "可能追问：自动等待、跨浏览器、录制功能",
      },
      {
        slug: "page-object-pattern",
        question: "页面对象模式的核心思想是什么？",
        followUpHint: "可能追问：页面分层、组件复用",
      },
      {
        slug: "ui-stability",
        question: "UI 自动化测试不稳定怎么解决？",
        followUpHint: "可能追问：等待策略、元素定位、重试机制",
      },
    ],
  },
];

export function getInterviewChain(id: string): InterviewChain | undefined {
  return interviewChains.find((chain) => chain.id === id);
}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/content/types.ts temp-site/src/content/interview-chains.ts
git commit -m "feat: add InterviewChain types and preset chains data"
```

---

### Task 3: 随机抽题组件

**Files:**
- Create: `temp-site/src/components/client/random-quiz.tsx`

- [ ] **Step 1: 创建随机抽题组件**

创建完整的随机抽题组件，支持：
- 范围选择（全站/按类别/按难度/按权重）
- 数量选择（5/10/20题）
- 逐题答题和自评
- 结果统计

（代码较长，见实际实现）

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 4: 随机抽题页面

**Files:**
- Create: `temp-site/src/app/(docs)/quiz/page.tsx`

- [ ] **Step 1: 创建抽题页面**

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 5: 模拟面试组件

**Files:**
- Create: `temp-site/src/components/client/interview-simulator.tsx`

- [ ] **Step 1: 创建模拟面试组件**

支持：
- 选择预设追问链
- 逐题显示和答案展示
- 自评和进度追踪
- 完成后复盘

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 6: 模拟面试页面

**Files:**
- Create: `temp-site/src/app/(docs)/interview-simulator/page.tsx`

- [ ] **Step 1: 创建模拟面试页面**

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 7: 知识图谱页面

**Files:**
- Create: `temp-site/src/app/(docs)/knowledge-map/page.tsx`
- Create: `temp-site/src/components/client/knowledge-map.tsx`

- [ ] **Step 1: 创建知识图谱组件**

使用 D3.js 或 Force Graph 实现力导向图

- [ ] **Step 2: 创建知识图谱页面**

- [ ] **Step 3: 验证构建通过**

- [ ] **Step 4: 提交**

---

### Task 8: 面试冲刺仪表盘

**Files:**
- Modify: `temp-site/src/components/client/study-dashboard.tsx`

- [ ] **Step 1: 增强仪表盘显示面试冲刺统计**

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 9: 添加页面样式

**Files:**
- Modify: `temp-site/src/app/globals.css`

- [ ] **Step 1: 添加抽题、面试、图谱样式**

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

### Task 10: 首页入口集成

**Files:**
- Modify: `temp-site/src/app/(home)/page.tsx`

- [ ] **Step 1: 在首页添加面试冲刺入口**

- [ ] **Step 2: 验证构建通过**

- [ ] **Step 3: 提交**

---

## 自审清单

**1. Spec 覆盖检查：**
- [x] 3.1 随机抽题器 → Task 3, 4
- [x] 3.2 模拟面试器 → Task 5, 6
- [x] 3.3 全站知识图谱 → Task 7
- [x] 3.4 面试冲刺仪表盘 → Task 8
- [x] localStorage 扩展 → Task 1（useQuizHistory）
- [x] 追问链数据 → Task 2

**2. 类型一致性：**
- QuizSession 和 InterviewChain 类型定义完整
- 与现有类型系统兼容