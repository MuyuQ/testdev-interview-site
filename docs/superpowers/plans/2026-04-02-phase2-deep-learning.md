# 初学者体验增强 - 阶段2：深度学习

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让初学者能"学完有检验"，通过自测练习确认理解程度，同时完成剩余内容扩展。

**Architecture:**
- 新增自测题数据类型和存储
- 新增自测练习组件和状态管理
- 增强知识关联图和进度仪表盘

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

---

## 文件结构

```
temp-site/src/
├── components/
│   ├── client/
│   │   ├── self-test-panel.tsx         # 新增：自测练习面板
│   │   ├── tested-badge.tsx            # 新增：已测试徽章
│   │   ├── progress-bar.tsx            # 新增：进度条组件
│   │   ├── category-progress.tsx       # 新增：分类进度组件
│   │   └── study-dashboard.tsx         # 修改：增强仪表盘
│   └── docs/
│       └── related-topics-graph.tsx    # 修改：增强关联图
├── hooks/
│   └── use-selftest.ts                 # 新增：自测状态 hook
├── content/
│   ├── types.ts                        # 修改：添加自测题类型
│   ├── selftest-data.ts                # 新增：自测题数据
│   └── data.ts                         # 修改：内容扩展
└── app/
    └── (docs)/[category]/[slug]/
        └── page.tsx                    # 修改：添加自测面板
```

---

### Task 1: 自测题数据类型定义

**Files:**
- Modify: `temp-site/src/content/types.ts`

- [ ] **Step 1: 添加自测题类型定义**

在 `types.ts` 文件末尾添加：

```typescript
// 自测题类型
export type SelfTestQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TopicSelfTests = {
  topicSlug: string;
  questions: SelfTestQuestion[];
};

// 自测记录类型
export type SelfTestRecord = {
  topicSlug: string;
  score: number;
  total: number;
  completedAt: string;
};
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/content/types.ts
git commit -m "feat: add SelfTestQuestion and SelfTestRecord types"
```

---

### Task 2: 自测状态 Hook

**Files:**
- Create: `temp-site/src/hooks/use-selftest.ts`

- [ ] **Step 1: 创建自测状态 Hook**

```tsx
// temp-site/src/hooks/use-selftest.ts
"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";
import type { SelfTestRecord } from "@/content/types";

const STORAGE_KEY = "testdev:selftest-records";

export function useSelfTest() {
  const [records, setRecords] = useState<SelfTestRecord[]>(() =>
    readStorage<SelfTestRecord[]>(STORAGE_KEY, []),
  );

  const saveRecord = useCallback((topicSlug: string, score: number, total: number) => {
    setRecords((current) => {
      // 移除旧记录，添加新记录
      const filtered = current.filter((r) => r.topicSlug !== topicSlug);
      const newRecord: SelfTestRecord = {
        topicSlug,
        score,
        total,
        completedAt: new Date().toISOString(),
      };
      const next = [...filtered, newRecord];
      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const getRecord = useCallback(
    (topicSlug: string): SelfTestRecord | undefined => {
      return records.find((r) => r.topicSlug === topicSlug);
    },
    [records]
  );

  const clearRecords = useCallback(() => {
    setRecords([]);
    writeStorage(STORAGE_KEY, []);
  }, []);

  const getAverageScore = useCallback((): number => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => sum + r.score, 0);
    return Math.round((total / records.length) * 100) / 100;
  }, [records]);

  return {
    records,
    saveRecord,
    getRecord,
    clearRecords,
    getAverageScore,
    testedCount: records.length,
  };
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/hooks/use-selftest.ts
git commit -m "feat: add useSelfTest hook for self-test records management"
```

---

### Task 3: 已测试徽章组件

**Files:**
- Create: `temp-site/src/components/client/tested-badge.tsx`

- [ ] **Step 1: 创建已测试徽章组件**

```tsx
// temp-site/src/components/client/tested-badge.tsx
"use client";

import { useSelfTest } from "@/hooks/use-selftest";

type TestedBadgeProps = {
  topicSlug: string;
};

export function TestedBadge({ topicSlug }: TestedBadgeProps) {
  const { getRecord } = useSelfTest();
  const record = getRecord(topicSlug);

  if (!record) {
    return null;
  }

  const percentage = Math.round((record.score / record.total) * 100);
  const isGood = percentage >= 80;

  return (
    <span
      className={`tested-badge ${isGood ? "tested-good" : "tested-needs-work"}`}
      title={`上次得分: ${record.score}/${record.total} (${percentage}%)`}
    >
      {percentage}%
    </span>
  );
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/components/client/tested-badge.tsx
git commit -m "feat: add TestedBadge component showing last test score"
```

---

### Task 4: 自测练习面板组件

**Files:**
- Create: `temp-site/src/components/client/self-test-panel.tsx`

- [ ] **Step 1: 创建自测练习面板组件**

```tsx
// temp-site/src/components/client/self-test-panel.tsx
"use client";

import { useState, useMemo } from "react";
import { useSelfTest } from "@/hooks/use-selftest";
import type { SelfTestQuestion, TopicSelfTests } from "@/content/types";

type SelfTestPanelProps = {
  topicSlug: string;
  tests: TopicSelfTests;
};

export function SelfTestPanel({ topicSlug, tests }: SelfTestPanelProps) {
  const { saveRecord, getRecord } = useSelfTest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const currentQuestion = tests.questions[currentIndex];
  const totalQuestions = tests.questions.length;
  const lastRecord = getRecord(topicSlug);

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsComplete(false);
    setCorrectCount(0);
    setAnswers(new Array(totalQuestions).fill(null));
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // 完成
      const finalCorrect = answers.slice(0, currentIndex).filter((a, i) => a === tests.questions[i].correctIndex).length + (selectedOption === currentQuestion.correctIndex ? 1 : 0);
      setCorrectCount(finalCorrect);
      saveRecord(topicSlug, finalCorrect, totalQuestions);
      setIsComplete(true);
    }
  };

  // 初始状态：显示开始按钮
  if (currentIndex === 0 && !showResult && selectedOption === null && !isComplete) {
    return (
      <div className="self-test-panel">
        <div className="self-test-intro">
          <h3>自测练习</h3>
          <p>共 {totalQuestions} 题，检验你对本内容的理解程度。</p>
          {lastRecord && (
            <p className="last-score">
              上次得分：{lastRecord.score}/{lastRecord.total}
            </p>
          )}
          <button
            type="button"
            className="button-primary"
            onClick={handleStart}
          >
            开始自测
          </button>
        </div>
      </div>
    );
  }

  // 完成状态
  if (isComplete) {
    const score = correctCount;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="self-test-panel">
        <div className="self-test-complete">
          <h3>测试完成</h3>
          <div className="score-display">
            <span className="score-number">{score}/{totalQuestions}</span>
            <span className="score-percentage">{percentage}%</span>
          </div>
          <p className={percentage >= 80 ? "score-good" : "score-needs-work"}>
            {percentage >= 80 ? "掌握良好！" : "建议复习后再次测试。"}
          </p>
          <button
            type="button"
            className="button-secondary"
            onClick={handleStart}
          >
            重新测试
          </button>
        </div>
      </div>
    );
  }

  // 答题状态
  return (
    <div className="self-test-panel">
      <div className="self-test-header">
        <span className="question-progress">
          第 {currentIndex + 1} 题 / 共 {totalQuestions} 题
        </span>
      </div>

      <div className="self-test-question">
        <p className="question-text">{currentQuestion.question}</p>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            let optionClass = "option-item";
            if (showResult) {
              if (index === currentQuestion.correctIndex) {
                optionClass += " option-correct";
              } else if (index === selectedOption) {
                optionClass += " option-wrong";
              }
            } else if (index === selectedOption) {
              optionClass += " option-selected";
            }

            return (
              <button
                key={index}
                type="button"
                className={optionClass}
                onClick={() => handleSelectOption(index)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="result-section">
          <div className={selectedOption === currentQuestion.correctIndex ? "result-correct" : "result-wrong"}>
            {selectedOption === currentQuestion.correctIndex ? "✓ 回答正确" : "✗ 回答错误"}
          </div>
          <div className="explanation">
            <strong>解析：</strong>
            {currentQuestion.explanation}
          </div>
          <button
            type="button"
            className="button-primary"
            onClick={handleNext}
          >
            {currentIndex < totalQuestions - 1 ? "下一题" : "查看结果"}
          </button>
        </div>
      )}

      {!showResult && (
        <button
          type="button"
          className="button-primary"
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          提交答案
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/components/client/self-test-panel.tsx
git commit -m "feat: add SelfTestPanel component with quiz functionality"
```

---

### Task 5: 自测题数据文件

**Files:**
- Create: `temp-site/src/content/selftest-data.ts`

- [ ] **Step 1: 创建自测题数据文件**

创建初始自测题数据（包含5-10个核心条目的自测题）：

```typescript
// temp-site/src/content/selftest-data.ts
import type { TopicSelfTests } from "./types";

export const selfTestData: TopicSelfTests[] = [
  {
    topicSlug: "api-assertion",
    questions: [
      {
        id: "api-assertion-1",
        topicSlug: "api-assertion",
        question: "接口断言只校验 HTTP 状态码 200 是否足够？",
        options: [
          "足够，200 表示请求成功",
          "不够，还需要校验响应体字段和业务副作用",
          "足够，其他校验是多余的",
          "看情况，有时足够有时不够",
        ],
        correctIndex: 1,
        explanation: "HTTP 200 只表示请求到达服务器并返回成功，不代表业务逻辑正确。真正的断言要覆盖响应体字段、数据库状态、消息投递等多层副作用。",
      },
      {
        id: "api-assertion-2",
        topicSlug: "api-assertion",
        question: "断言分层设计中，'链路断言'主要校验什么？",
        options: [
          "HTTP 状态码和响应结构",
          "响应体字段值",
          "数据库状态、缓存、消息投递等副作用",
          "接口响应时间",
        ],
        correctIndex: 2,
        explanation: "链路断言校验数据库状态、缓存一致性、消息队列投递、外部调用记录等跨系统的副作用，是断言分层的第三层。",
      },
      {
        id: "api-assertion-3",
        topicSlug: "api-assertion",
        question: "遇到响应结构经常变化时，如何保证断言稳定？",
        options: [
          "每次变化都修改断言代码",
          "只断言关键业务字段，用字段路径访问",
          "不做断言，只检查状态码",
          "使用固定数组下标访问字段",
        ],
        correctIndex: 1,
        explanation: "只断言关键业务字段、使用字段路径（如 JSONPath）而非固定位置、用 schema 校验替代字段逐个断言，可以让断言与具体结构解耦。",
      },
    ],
  },
  {
    topicSlug: "idempotency",
    questions: [
      {
        id: "idempotency-1",
        topicSlug: "idempotency",
        question: "支付回调为什么必须做幂等？",
        options: [
          "为了提高性能",
          "防止网络重试导致重复扣款或发货",
          "满足审计要求",
          "简化代码逻辑",
        ],
        correctIndex: 1,
        explanation: "支付网关发送回调后，如果没收到确认响应会自动重试。如果回调不做幂等，重复回调会导致重复扣款、重复发货，造成资损。",
      },
      {
        id: "idempotency-2",
        topicSlug: "idempotency",
        question: "以下哪个最适合作为幂等键？",
        options: [
          "用户ID",
          "订单号或支付流水号",
          "当前时间戳",
          "随机字符串",
        ],
        correctIndex: 1,
        explanation: "幂等键需要具备业务唯一性和跨系统一致性。订单号、支付流水号是业务生成的全局唯一标识，天然适合做幂等键。",
      },
      {
        id: "idempotency-3",
        topicSlug: "idempotency",
        question: "消息重复消费的测试，主要验证什么？",
        options: [
          "消息能否被消费",
          "消息消费速度",
          "重复消费时数据不重复写入、状态不重复变更",
          "消息格式是否正确",
        ],
        correctIndex: 2,
        explanation: "消息幂等测试核心是验证重复消费时副作用是否可控：数据库记录不重复、状态不重复变更、外部调用只发生一次。",
      },
    ],
  },
  {
    topicSlug: "fixture",
    questions: [
      {
        id: "fixture-1",
        topicSlug: "fixture",
        question: "Pytest 中 session 级和 function 级 Fixture 的主要区别是什么？",
        options: [
          "session 级更快，function 级更慢",
          "session 级整个测试会话只初始化一次，function 级每个测试都初始化",
          "session 级只能用于数据库，function 级通用",
          "没有区别，只是名称不同",
        ],
        correctIndex: 1,
        explanation: "session 级 Fixture 整个测试会话只初始化一次，适合高成本的共享资源；function 级每个测试都重新初始化，适合需要隔离的测试数据。",
      },
      {
        id: "fixture-2",
        topicSlug: "fixture",
        question: "Fixture 嵌套过深会导致什么问题？",
        options: [
          "运行速度变快",
          "依赖关系难以追踪，阅读成本高",
          "测试结果更准确",
          "内存占用减少",
        ],
        correctIndex: 1,
        explanation: "Fixture 嵌套层级过多会让依赖关系难以追踪，代码阅读和维护成本高。建议控制嵌套深度在 2-3 层。",
      },
      {
        id: "fixture-3",
        topicSlug: "fixture",
        question: "Fixture 应该专注于什么？",
        options: [
          "复杂的业务逻辑处理",
          "环境准备和资源管理",
          "测试结果断言",
          "测试报告生成",
        ],
        correctIndex: 1,
        explanation: "Fixture 应专注于环境准备和资源管理（如登录态、数据库连接、浏览器实例），不混入业务逻辑，业务数据准备放在测试代码或 helper 函数中。",
      },
    ],
  },
  {
    topicSlug: "smoke-testing",
    questions: [
      {
        id: "smoke-1",
        topicSlug: "smoke-testing",
        question: "冒烟测试的主要目的是什么？",
        options: [
          "发现所有 Bug",
          "验证基本功能可用，快速判断版本是否可测",
          "测试性能指标",
          "测试安全性",
        ],
        correctIndex: 1,
        explanation: "冒烟测试的目的是快速验证基本功能是否可用，判断版本是否具备可测性，而不是发现所有 Bug。它是发布前的第一道门槛。",
      },
      {
        id: "smoke-2",
        topicSlug: "smoke-testing",
        question: "冒烟测试用例应该覆盖什么？",
        options: [
          "所有功能点",
          "核心业务主流程和关键路径",
          "边缘场景和异常情况",
          "UI 样式细节",
        ],
        correctIndex: 1,
        explanation: "冒烟测试用例应覆盖核心业务主流程和关键路径，如登录、下单、支付等主流程，不追求覆盖所有功能点。",
      },
    ],
  },
  {
    topicSlug: "regression-testing",
    questions: [
      {
        id: "regression-1",
        topicSlug: "regression-testing",
        question: "回归测试的主要目的是什么？",
        options: [
          "测试新功能",
          "验证修改后的代码没有影响原有功能",
          "测试性能",
          "测试用户体验",
        ],
        correctIndex: 1,
        explanation: "回归测试的目的是验证代码修改后，原有功能仍然正常工作，确保新改动没有引入新的问题（回归 Bug）。",
      },
      {
        id: "regression-2",
        topicSlug: "regression-testing",
        question: "如何提高回归测试的效率？",
        options: [
          "每次都执行全部测试用例",
          "只测试新功能",
          "自动化测试 + 按风险选择测试范围",
          "减少测试用例数量",
        ],
        correctIndex: 2,
        explanation: "提高回归效率的方法包括：自动化测试覆盖高频场景、按风险选择回归范围（关联功能优先）、分层回归（核心流程全量、其他抽样）。",
      },
    ],
  },
];

export function getSelfTestsForTopic(slug: string): TopicSelfTests | undefined {
  return selfTestData.find((t) => t.topicSlug === slug);
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/content/selftest-data.ts
git commit -m "feat: add self-test data for core topics"
```

---

### Task 6: 在条目详情页添加自测面板

**Files:**
- Modify: `temp-site/src/components/docs/topic-page.tsx`

- [ ] **Step 1: 导入自测组件和函数**

```tsx
import { SelfTestPanel } from "@/components/client/self-test-panel";
import { getSelfTestsForTopic } from "@/content/selftest-data";
```

- [ ] **Step 2: 在相关主题之后添加自测面板**

在组件中获取自测数据并渲染：

```tsx
// 在组件内部，relatedTopics 定义之后
const selfTests = getSelfTestsForTopic(topic.slug);

// 在相关主题 section 之后添加
{selfTests && (
  <section className="content-block">
    <div className="content-block-head">
      <h2>自测练习</h2>
      <p>检验你对本内容的理解程度。</p>
    </div>
    <div className="content-block-body">
      <SelfTestPanel topicSlug={topic.slug} tests={selfTests} />
    </div>
  </section>
)}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/components/docs/topic-page.tsx
git commit -m "feat: integrate SelfTestPanel into topic detail page"
```

---

### Task 7: 添加自测面板样式

**Files:**
- Modify: `temp-site/src/app/globals.css`

- [ ] **Step 1: 添加自测面板样式**

```css
/* 自测面板 */
.self-test-panel {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.self-test-intro,
.self-test-complete {
  text-align: center;
  padding: 1.5rem;
}

.self-test-intro h3,
.self-test-complete h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
}

.last-score {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.score-display {
  margin: 1rem 0;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.score-percentage {
  font-size: 1.5rem;
  color: #0284c7;
  margin-left: 0.5rem;
}

.score-good {
  color: #166534;
}

.score-needs-work {
  color: #92400e;
}

.self-test-header {
  margin-bottom: 1rem;
}

.question-progress {
  font-size: 0.875rem;
  color: #6b7280;
}

.question-text {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover:not(:disabled) {
  border-color: #0284c7;
  background: #f0f9ff;
}

.option-item.option-selected {
  border-color: #0284c7;
  background: #e0f2fe;
}

.option-item.option-correct {
  border-color: #166534;
  background: #dcfce7;
}

.option-item.option-wrong {
  border-color: #dc2626;
  background: #fee2e2;
}

.option-item:disabled {
  cursor: default;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.option-selected .option-letter {
  background: #0284c7;
  color: white;
}

.option-correct .option-letter {
  background: #166534;
  color: white;
}

.option-wrong .option-letter {
  background: #dc2626;
  color: white;
}

.option-text {
  flex: 1;
}

.result-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.result-correct {
  color: #166534;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.result-wrong {
  color: #dc2626;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.explanation {
  background: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #374151;
}

/* 已测试徽章 */
.tested-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.tested-good {
  background: #dcfce7;
  color: #166534;
}

.tested-needs-work {
  background: #fef3c7;
  color: #92400e;
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/app/globals.css
git commit -m "style: add CSS styles for self-test panel and tested badge"
```

---

### Task 8: 进度条组件

**Files:**
- Create: `temp-site/src/components/client/progress-bar.tsx`

- [ ] **Step 1: 创建进度条组件**

```tsx
// temp-site/src/components/client/progress-bar.tsx
"use client";

type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
  color?: "blue" | "green" | "yellow";
};

export function ProgressBar({
  current,
  total,
  label,
  color = "blue",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-bar-container">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span className="progress-bar-value">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill progress-bar-${color}`}
          style={{ width: `${percentage}%` }}
        />
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
git add temp-site/src/components/client/progress-bar.tsx
git commit -m "feat: add ProgressBar component"
```

---

### Task 9: 增强学习进度仪表盘

**Files:**
- Modify: `temp-site/src/components/client/study-dashboard.tsx`

- [ ] **Step 1: 导入新组件和 hooks**

```tsx
import { useSelfTest } from "@/hooks/use-selftest";
import { ProgressBar } from "./progress-bar";
import { getAllTopics } from "@/content";
```

- [ ] **Step 2: 添加自测统计和进度条**

在组件中增强显示：

```tsx
"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/use-favorites";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { useRecentViews } from "@/hooks/use-recent-views";
import { useSelfTest } from "@/hooks/use-selftest";
import { ProgressBar } from "./progress-bar";
import { getAllTopics } from "@/content";
import { orderedCategories } from "@/lib/site-config";

export function StudyDashboard() {
  const { favorites } = useFavorites();
  const { progress } = useLearningProgress();
  const { recentViews } = useRecentViews();
  const { records, getAverageScore, testedCount } = useSelfTest();

  const allTopics = getAllTopics();
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalTopics = allTopics.length;
  const averageScore = getAverageScore();

  return (
    <section className="home-section">
      <div className="section-head">
        <p className="eyebrow">本地学习进度</p>
        <h2>收藏、完成状态和最近浏览都会保留在当前设备。</h2>
        <p>不需要账号系统，适合临近面试前快速回看。</p>
      </div>

      <div className="study-grid">
        <article className="content-block">
          <div className="content-block-head">
            <h2>学习进度</h2>
          </div>
          <div className="content-block-body">
            <ProgressBar
              current={completedCount}
              total={totalTopics}
              label="已完成"
              color="green"
            />
            <ProgressBar
              current={testedCount}
              total={totalTopics}
              label="已自测"
              color="blue"
            />
            {testedCount > 0 && (
              <div className="average-score">
                <span>平均得分：</span>
                <strong>{averageScore.toFixed(1)}</strong>
              </div>
            )}
          </div>
        </article>

        <article className="content-block">
          <div className="content-block-head">
            <h2>最近浏览</h2>
            <p>继续从你刚刚看到的主题接着学。</p>
          </div>
          <div className="content-block-body">
            <div className="recent-list">
              {recentViews.length ? (
                recentViews.map((item) => (
                  <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`}>
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="eyebrow">还没有浏览记录。</p>
              )}
            </div>
          </div>
        </article>

        <article className="content-block">
          <div className="content-block-head">
            <h2>已收藏</h2>
            <p>把高频模板和重点专题先收藏起来。</p>
          </div>
          <div className="content-block-body">
            <div className="recent-list">
              {favorites.length ? (
                favorites.map((item) => (
                  <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}`}>
                    {item.title}
                  </Link>
                ))
              ) : (
                <p className="eyebrow">还没有收藏内容。</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/components/client/study-dashboard.tsx
git commit -m "feat: enhance StudyDashboard with self-test stats and progress bars"
```

---

### Task 10: 添加进度条样式

**Files:**
- Modify: `temp-site/src/app/globals.css`

- [ ] **Step 1: 添加进度条样式**

```css
/* 进度条 */
.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.progress-bar-value {
  color: #6b7280;
}

.progress-bar-track {
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.progress-bar-blue {
  background: #0284c7;
}

.progress-bar-green {
  background: #16a34a;
}

.progress-bar-yellow {
  background: #ca8a04;
}

.average-score {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #374151;
}

.average-score strong {
  font-size: 1rem;
  color: #0284c7;
}
```

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/app/globals.css
git commit -m "style: add CSS styles for progress bar component"
```

---

### Task 11: 增强知识关联图（关联强度）

**Files:**
- Modify: `temp-site/src/components/docs/related-topics-graph.tsx`

- [ ] **Step 1: 添加关联强度显示**

修改组件，使连线粗细根据关联数量变化：

```tsx
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

  const centerX = 150;
  const centerY = 100;
  const radius = 80;

  // 根据关联数量计算连线粗细
  const getStrokeWidth = (topic: ContentTopic): number => {
    const count = topic.relatedSlugs?.length || 0;
    return Math.min(1 + count * 0.5, 4);
  };

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
          const strokeWidth = getStrokeWidth(topic);

          return (
            <line
              key={`line-${topic.slug}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              className="graph-line"
              strokeWidth={strokeWidth}
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
            {topic.relatedSlugs && topic.relatedSlugs.length > 0 && (
              <span className="relation-count">({topic.relatedSlugs.length})</span>
            )}
          </Link>
        ))}
      </div>

      {/* 说明 */}
      <p className="graph-hint">连线越粗表示关联内容越多</p>
    </div>
  );
}
```

- [ ] **Step 2: 添加样式**

在 globals.css 中添加：

```css
.relation-count {
  color: #6b7280;
  font-size: 0.75rem;
}

.graph-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}
```

- [ ] **Step 3: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 4: 提交**

```bash
git add temp-site/src/components/docs/related-topics-graph.tsx temp-site/src/app/globals.css
git commit -m "feat: enhance RelatedTopicsGraph with relation strength display"
```

---

### Task 12: 内容扩展（按优先级批次）

**Files:**
- Modify: `temp-site/src/content/data.ts`

**说明：** 此任务需要扩展剩余约 60+ 条目。建议使用 Agent 并行处理 3 个批次：
- 批次1：面试权重 3 的条目
- 批次2：面试权重 2 的条目
- 批次3：面试权重 1 的条目

- [ ] **Step 1: 使用 Agent 并行扩展内容**

（此步骤需要实际运行多个 Agent 执行内容扩展）

- [ ] **Step 2: 验证构建通过**

Run: `cd E:/git_repositories/TestDev-Sprint/temp-site && npm run build`
Expected: Build succeeds

- [ ] **Step 3: 提交**

```bash
git add temp-site/src/content/data.ts
git commit -m "feat(content): expand remaining topics with detailed sections"
```

---

## 自审清单

**1. Spec 覆盖检查：**
- [x] 2.1 内容扩展批次 → Task 12
- [x] 2.2 自测练习系统 → Task 1-7（类型、Hook、组件、数据）
- [x] 2.3 知识关联强化 → Task 11（关联强度）
- [x] 2.4 学习进度仪表盘增强 → Task 8-10（进度条、增强仪表盘）

**2. 占位符扫描：**
- 无 TBD/TODO/待实现内容

**3. 类型一致性：**
- SelfTestQuestion 和 SelfTestRecord 类型定义完整
- useSelfTest hook 返回正确的类型