# 初学者体验增强设计

## 概述

**目标：** 为测试开发面试速成站增加初学者友好的功能，按用户旅程阶段分三阶段渐进增强。

**设计原则：**
- 分阶段渐进增强，每阶段交付完整可用
- 内容与功能配套交付，避免功能空转
- 均衡推进，每阶段包含内容+功能+可视化的组合改进

---

## 阶段1：快速入门

**目标：让初学者一进站就知道"从哪开始学"，并能快速获得入门级内容指引。**

### 1.1 入门级内容标识系统

**现状问题：** 所有内容都有 `difficulty` 字段（beginner/interview），但首页和列表页未有效利用，初学者难以快速定位入门级内容。

**改进方案：**
- 首页"准备重点分流"区域增加"我是新手"入口，点击后过滤显示所有 `difficulty: beginner` 内容
- 分类列表页增加难度筛选器（入门/面试），默认不筛选，可选只看入门
- 每个条目卡片增加视觉标记（入门：绿色徽章；面试：橙色徽章）
- 主题详情页 hero 区域已有难度显示，保持现状

**数据结构：** 无需修改，现有 `difficulty` 字段已足够。

**筛选逻辑：**
- 优先显示入门级别，面试级别可选显示（而非严格隐藏）
- 保证新手也能看到进阶内容的存在，建立学习预期

---

### 1.2 新手引导组件

**现状问题：** 首页内容丰富但缺乏"第一步"指引，新手容易被信息量淹没。

**改进方案：**
- 首页 hero 区域增加可关闭的引导横幅
- 引导内容："从这5个术语开始"，直接列出5个推荐条目链接
  - api-assertion（接口断言）
  - fixture（测试固件）
  - idempotency（幂等）
  - smoke-testing（冒烟测试）
  - regression-testing（回归测试）
- 引导状态存储在 localStorage，用户关闭后不再显示
- 提供"重新显示引导"入口（在设置或帮助区域）

**组件设计：**
```
<OnboardingBanner />
  - localStorage key: testdev:onboarding-dismissed
  - 内容：5个推荐条目链接 + 关闭按钮
  - 可通过首页底部"重新显示引导"链接恢复
```

---

### 1.3 类别推荐起点

**现状问题：** 每个类别缺少明确的"从哪条开始学"指引。

**改进方案：**
- 为每个类别手动配置推荐起点 slug（而非算法自动计算）
- 首页"模块导航"区域，每个类别卡片增加"推荐起点"链接
- 推荐起点逻辑：优先考虑内容基础性，而非 interviewWeight

**推荐起点配置：**
```typescript
const categoryEntryRecommendations: Record<TopicCategory, string> = {
  glossary: "api-assertion",
  tech: "pytest",
  project: "payment-callback",
  scenario: "payment-callback",
  coding: "retry-mechanism",
  roadmap: "3-day-interview-map",
  "ai-learning": "ai-test-generation",
  "practice-template": "project-story-template",
};
```

---

### 1.4 入门内容扩展批次

**现状问题：** 部分核心入门条目缺少完整的 sections 内容。

**改进方案：**
- 挑选 10 个最核心入门条目，确保它们有完整的 sections 内容
- 扩展模板沿用已有设计：基础入门、学习路径、实操案例、常见误区、面试问答

**入门扩展条目清单（已确认 slug 存在）：**
- api-assertion, fixture, idempotency, smoke-testing, regression-testing
- pytest, playwright, api-testing, ci-cd, quality-gate

---

### 1.5 知识关联可视化（条目页）

**现状问题：** 条目页底部"相关主题"为纯文字链接列表，初学者难以理解概念间关联。

**改进方案：**
- 条目详情页底部"相关主题"区域改为可视化小图
- 节点连线形式展示关联，而非纯文字列表
- 点击节点跳转到对应条目

**技术方案：** 轻量 SVG 实现，无需引入重量级图谱库。

---

### 1.6 移动端响应式确认

**改进方案：**
- 确认所有新增组件（筛选器、引导横幅、徽章）在移动端的表现
- 简化移动端引导内容，或使用折叠式筛选器

---

### 1.7 阶段1交付物总结

| 交付物 | 说明 |
|--------|------|
| 入门难度筛选器 | 首页、分类页支持按入门难度筛选 |
| 难度视觉徽章 | 条目卡片显示入门/面试徽章 |
| 新手引导横幅 | 首页可关闭的5条推荐引导 |
| 类别推荐起点 | 每个类别手动配置推荐起点链接 |
| 入门内容扩展 | 10个核心入门条目 sections 扩展 |
| 知识关联小图 | 条目页底部相关主题可视化 |
| localStorage 状态 | 引导关闭状态、筛选偏好持久化 |

---

## 阶段2：深度学习

**目标：让初学者能"学完有检验"，通过自测练习确认理解程度，同时完成剩余内容扩展。**

### 2.1 内容扩展批次

**现状：** 约 40+ 条目已有 sections 扩展，剩余约 60+ 条目内容深度不够。

**扩展策略：**
- 分 3 个批次并行扩展，每批次 20-25 条目
- 扩展模板沿用已有设计：
  - **Glossary**: 基础入门、学习路径、实操案例、常见误区、面试问答
  - **Tech/Project/Roadmap/AI-Learning**: 概述、核心内容、实践要点、面试表达
- 每条目扩展后同步生成配套自测题（见 2.2）

**批次划分逻辑：**
- **批次1（优先）：** 面试权重 3 + 高频标签的核心条目
- **批次2：** 面试权重 2 + 常用标签条目
- **批次3：** 面试权重 1 + 补充性条目

---

### 2.2 自测练习系统

**现状：** 用户只能阅读内容，无法检验是否真正理解。

**设计方案：**

**自测题数据结构：**
```typescript
type SelfTestQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];  // 选项，单选题
  correctIndex: number;
  explanation: string;  // 答案解析
};

type TopicSelfTests = {
  topicSlug: string;
  questions: SelfTestQuestion[];
};
```

**每条目配套题数：**
- 入门级条目：2-3 题基础概念题
- 面试级条目：3-5 题，包含概念+场景判断题

**自测组件设计：**
```
<SelfTestPanel topicSlug="api-assertion" />
  - 显示"开始自测"按钮
  - 点击后展示题目，逐题作答
  - 作答后即时反馈正确/错误 + 解析
  - 完成后显示得分 + "重新测试"按钮
  - 得分记录存 localStorage
```

**入口位置：**
- 条目详情页底部，"相关主题"区域之后
- 条目卡片区域增加"已测试"徽章（显示上次得分）

**存储：**
- localStorage key: `testdev:selftest-records`
- 结构: `{ topicSlug: string; score: number; completedAt: string }[]`

---

### 2.3 知识关联强化

**阶段2增强：**
- 增加"关联强度"显示：relatedSlugs 数量越多，连线越粗
- 在图谱下方显示"为什么这些相关"简短说明
- 支持鼠标悬停显示关联详情

---

### 2.4 学习进度仪表盘增强

**现状：** 首页 StudyDashboard 显示完成数量、最近浏览、收藏，缺少自测统计和进度可视化。

**阶段2增强：**
- 完成进度增加"已自测"统计：显示已测试条目数 + 平均得分
- 增加进度条可视化：已完成/已自测/总数比例
- 分类维度进度：每个类别的完成百分比

**数据结构扩展：**
- localStorage 增加自测记录读取
- StudyDashboard 增加计算逻辑

---

### 2.5 阶段2交付物总结

| 交付物 | 说明 |
|--------|------|
| 60+ 条目内容扩展 | 3 批次并行扩展，每条目配套 sections |
| 自测题数据 | 每条目 2-5 题配套自测题 |
| 自测练习组件 | 条目页自测面板、得分反馈、解析展示 |
| 知识关联图增强 | 交互式小图、关联强度显示 |
| 学习进度仪表盘增强 | 自测统计、进度条、分类进度 |
| localStorage 扩展 | 自测记录存储 |

---

## 阶段3：面试冲刺

**目标：让初学者能"快速串联知识点"并"模拟面试场景"，通过随机抽题、模拟面试、知识图谱帮助最后冲刺。**

### 3.1 随机抽题器

**现状：** 用户只能按固定顺序浏览，面试时需要随机应对提问。

**设计方案：**

**抽题范围选项：**
- 全站随机：从所有条目中随机抽取
- 按类别随机：指定某一类别（如 glossary）随机抽取
- 按难度随机：只抽入门级或只抽面试级
- 按权重随机：优先抽取高面试权重条目

**抽题数量选项：**
- 快速模式：5 题
- 标准模式：10 题
- 深度模式：20 题

**随机抽题组件：**
```
<RandomQuizLauncher />
  - 首页入口或专用页面 /quiz
  - 选择范围、数量后开始
  - 逐题显示条目标题 + 高频追问之一
  - 用户思考后点击"显示答案参考"
  - 答案参考展示 answerHint 内容
  - 用户自评"答得好/一般/不好"
  - 完成后显示统计：各评分比例
```

**存储：**
- localStorage key: `testdev:quiz-history`
- 记录每次抽题结果，用于后续复盘

---

### 3.2 模拟面试器

**现状：** 用户可以看高频追问和答案提示，但缺少"模拟被追问"的场景体验。

**设计方案：**

**面试模式：**
- **连续追问模式：** 从一个条目开始，连续追问 3-5 个相关问题，模拟真实面试追问链
- **跨类别跳转模式：** 从术语跳到技术专题，再跳到项目实战，模拟面试官切换话题
- **限时回答模式：** 每题限时 2 分钟思考，强制模拟真实压力（可选）

**追问链数据结构：**
```typescript
type InterviewChain = {
  startSlug: string;
  chain: Array<{
    slug: string;
    question: string;  // 从 frequentQuestions 中选取
    followUpHint?: string;  // 面试官可能继续追问的方向提示
  }>;
};
```

**预设追问链：**
- 支付场景链：idempotency → payment-callback → api-assertion → retry-mechanism
- 测试框架链：pytest → fixture → mock-stub → test-data-strategy
- 接口测试链：api-testing → api-assertion → quality-gate → ci-cd

**模拟面试组件：**
```
<InterviewSimulator />
  - 选择预设场景链或自定义起点
  - 显示第一题（条目标题 + 高频追问）
  - 用户点击"我准备好了"显示答案参考
  - 用户自评后进入下一题
  - 完成后显示整体评估 + 追问链复盘
```

---

### 3.3 全站知识图谱

**现状：** 阶段1/2 只做了条目页底部的关联小图，缺少全站级别的知识结构可视化。

**设计方案：**

**图谱页面：** `/knowledge-map`

**图谱功能：**
- 全站条目节点可视化
- 按类别分色显示
- 连线基于 relatedSlugs 和 usedInSlugs
- 支持缩放、拖拽、节点搜索
- 点击节点跳转到对应条目详情页

**图谱技术方案：**
- 使用 D3.js 或 Force Graph 库实现力导向图
- 节点数据从现有 content/data.ts 提取，无需新增数据

**筛选与聚焦：**
- 支持按类别筛选只显示某一类节点
- 支持聚焦某节点，只显示其关联节点（1-2 层）
- 支持按难度筛选入门/面试节点

---

### 3.4 面试冲刺仪表盘

**现状：** StudyDashboard 显示学习进度，缺少面试冲刺专项统计。

**设计方案：**

新增"面试冲刺"区域，显示：
- 已完成模拟面试次数 + 平均自评得分
- 随机抽题历史统计（各范围、各评分比例）
- 高权重条目完成率（interviewWeight: 3 的条目完成百分比）
- 推荐"还没练的高频题"列表（未完成的权重3条目）

**入口：**
- 首页 StudyDashboard 新增 tab 或 section
- 或独立页面 `/interview-dashboard`

---

### 3.5 阶段3交付物总结

| 交付物 | 说明 |
|--------|------|
| 随机抽题器 | 范围选择、数量选择、自评统计 |
| 模拟面试器 | 预设追问链、跨类别跳转、自评复盘 |
| 全站知识图谱 | 独立页面、交互式力导向图、筛选聚焦 |
| 面试冲刺仪表盘 | 模拟面试统计、抽题历史、高频题推荐 |
| localStorage 扩展 | 抽题历史、面试记录存储 |
| 追问链数据 | 预设 3-5 条典型面试追问链 |

---

## 实施顺序

```
阶段1: 快速入门（2-3周）
  ├── 入门难度筛选器
  ├── 难度视觉徽章
  ├── 新手引导横幅
  ├── 类别推荐起点
  ├── 入门内容扩展（10条）
  ├── 知识关联小图
  └── 移动端响应式确认

阶段2: 深度学习（3-4周）
  ├── 内容扩展批次（60+条）
  ├── 自测题数据生成
  ├── 自测练习组件
  ├── 知识关联图增强
  └── 学习进度仪表盘增强

阶段3: 面试冲刺（2-3周）
  ├── 随机抽题器
  ├── 模拟面试器
  ├── 全站知识图谱
  ├── 预设追问链数据
  └── 面试冲刺仪表盘
```

---

## 数据结构变更汇总

### 新增数据结构

**自测题数据：**
```typescript
type SelfTestQuestion = {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
```

**追问链数据：**
```typescript
type InterviewChain = {
  startSlug: string;
  chain: Array<{
    slug: string;
    question: string;
    followUpHint?: string;
  }>;
};
```

**类别推荐起点：**
```typescript
const categoryEntryRecommendations: Record<TopicCategory, string> = {
  glossary: "api-assertion",
  tech: "pytest",
  project: "payment-callback",
  scenario: "payment-callback",
  coding: "retry-mechanism",
  roadmap: "3-day-interview-map",
  "ai-learning": "ai-test-generation",
  "practice-template": "project-story-template",
};
```

### localStorage 新增 keys

| Key | 说明 |
|-----|------|
| `testdev:onboarding-dismissed` | 引导横幅关闭状态 |
| `testdev:difficulty-filter` | 难度筛选偏好 |
| `testdev:selftest-records` | 自测记录 |
| `testdev:quiz-history` | 抽题历史 |
| `testdev:interview-history` | 模拟面试记录 |

---

## 组件新增汇总

| 组件 | 位置 | 阶段 |
|------|------|------|
| `<DifficultyFilter />` | 首页、分类列表页 | 阶段1 |
| `<DifficultyBadge />` | 条目卡片 | 阶段1 |
| `<OnboardingBanner />` | 首页 hero 区域 | 阶段1 |
| `<EntryRecommendation />` | 首页模块导航区域 | 阶段1 |
| `<RelatedTopicsGraph />` | 条目详情页底部 | 阶段1 |
| `<SelfTestPanel />` | 条目详情页底部 | 阶段2 |
| `<TestedBadge />` | 条目卡片 | 阶段2 |
| `<ProgressBar />` | StudyDashboard | 阶段2 |
| `<CategoryProgress />` | StudyDashboard | 阶段2 |
| `<RandomQuizLauncher />` | 首页或 /quiz | 阶段3 |
| `<InterviewSimulator />` | /interview-simulator | 阶段3 |
| `<KnowledgeMap />` | /knowledge-map | 阶段3 |
| `<InterviewDashboard />` | StudyDashboard 或独立页 | 阶段3 |

---

## 页面新增汇总

| 页面路径 | 说明 | 阶段 |
|----------|------|------|
| `/quiz` | 随机抽题页面 | 阶段3 |
| `/interview-simulator` | 模拟面试页面 | 阶段3 |
| `/knowledge-map` | 全站知识图谱页面 | 阶段3 |
| `/interview-dashboard` | 面试冲刺仪表盘（可选独立） | 阶段3 |