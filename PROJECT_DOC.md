# 测试开发面试速成站项目文档

## 项目目标

构建一个面向测试开发岗位面试准备的中文内容站，帮助用户在较短时间内建立可用于面试表达的知识骨架。首版目标是可上线使用，不追求百科全覆盖，而是聚焦高频、可复述、可上场面试的内容组织。

站点核心覆盖：

- 术语体系
- 技术专题
- 项目类型
- 场景题
- 编码题
- 学习路线
- 面试打法
- AI 时代成长指南
- 练手模板库

## 产品定位

- 面向对象：测试开发初学者、转岗用户、准备中大厂测试开发面试的候选人
- 产品类型：测试开发面试速记站
- 价值主张：用结构化内容帮助用户快速补齐知识框架，并能在面试中说清楚概念、项目和方案

## 设计方向

整体视觉参考 Zensical 文档站的阅读体验与信息架构，但不复刻其品牌。页面风格应强调：

- 文档型清晰层级
- 克制配色
- 强导航感
- 高可读性
- 轻边框、弱装饰、少卡片

首页不做纯文档样式，而是采用“速成地图”结构，突出高频入口和学习路径。内容页采用更强的文档壳层，包括顶部栏、左侧导航、右侧页内目录和正文锚点。

## 信息架构

### 首页

- 价值主张
- 3 天 / 7 天学习路线入口
- 高频问题总览
- 各核心模块快速跳转

### 术语页

术语页必须支持：

- 定义
- 为什么重要
- 易错点
- 易混淆术语
- 高频问题
- 回答提示
- 相关术语

### 技术专题

首版聚焦：

- Python
- Pytest
- Selenium
- Playwright
- JMeter
- SQL
- Linux
- CI/CD
- 接口测试

每个专题应包含：

- 是什么
- 面试怎么问
- 项目里怎么用
- 容易答错什么

### 项目类型

首版聚焦：

- 电商
- 支付
- 内容平台
- 后台管理
- 移动端 App
- 数据平台
- IM/社交

每类项目给出：

- 业务流程
- 风险点
- 测试策略
- 可讲成果

### 场景题

围绕典型面试题组织标准化答题框架，例如：

- 秒杀场景
- 支付回调
- 登录鉴权
- 消息队列
- 推荐系统
- 兼容性测试
- 自动化平台搭建

### 编码题

聚焦测试开发常见代码题：

- 请求重试
- 结果缓存
- 日志封装
- 断言封装
- 数据驱动
- Fixture 设计

### 学习路线与面试打法

- 3 天速记版路线
- 7 天面试版路线
- 自我介绍模板
- 项目描述模板
- 场景题回答骨架

### AI 时代成长指南

该模块用于解决“测试开发工程师在 AI 时代应该怎么学、学什么、怎么落地”的问题，首版应包含：

- 如何快速学习新技术
- 如何判断一个新技术是否值得投入
- AI 工具如何辅助测试开发工作
- 新技术在自动化、接口、性能、测试平台中的典型应用
- 如何把 AI 和新技术写进项目经历与面试回答

每个专题应包含：

- 学习目标
- 推荐学习路径
- 上手顺序
- 常见误区
- 在真实项目中的落地方式

建议首版主题：

- AI 辅助接口测试
- AI 辅助自动化脚本生成与维护
- Playwright 相比 Selenium 的新一代实践
- LLM 在测试用例生成、日志分析、缺陷归因中的应用边界
- CI/CD 与质量门禁自动化
- 测试开发如何学习云原生、容器化和可观测性

### 练手模板库

该模块用于给用户提供可直接照着做的练手项目模板和答题模板，降低“知道该学什么但不会下手”的门槛。

模板应分为两类：

- 工程练手模板
- 面试表达模板

工程练手模板首版建议包括：

- Python + Pytest 接口自动化项目模板
- Playwright Web 自动化项目模板
- JMeter 或 k6 性能测试项目模板
- API 重试、缓存、日志、断言封装模板
- 简易测试平台或测试工具页模板

面试表达模板首版建议包括：

- 项目介绍模板
- 场景题回答模板
- 技术选型比较模板
- 性能测试分析模板
- 自动化建设成果表达模板

## 内容模型

内容应以结构化数据管理，方便搜索、导航和术语联动。建议的核心类型如下：

```ts
type TopicMeta = {
  slug: string
  title: string
  summary: string
  category:
    | "glossary"
    | "tech"
    | "project"
    | "scenario"
    | "coding"
    | "roadmap"
    | "ai-learning"
    | "practice-template"
  tags: string[]
  difficulty: "beginner" | "interview"
  interviewWeight: 1 | 2 | 3
}

type MixedTerm = {
  slug: string
  term: string
  difference: string
}

type GlossaryTerm = TopicMeta & {
  term: string
  shortDefinition: string
  definition: string
  whyItMatters: string
  commonMistakes: string[]
  confusingTerms: MixedTerm[]
  frequentQuestions: string[]
  answerHints: string[]
  aliases?: string[]
  relatedSlugs: string[]
  usedInSlugs?: string[]
}

type RichTextToken =
  | { type: "text"; content: string }
  | { type: "term"; slug: string; label: string }

type AILearningGuide = TopicMeta & {
  learningGoal: string
  whyNow: string
  learningSteps: string[]
  practicalUseCases: string[]
  commonMistakes: string[]
  interviewTalkingPoints: string[]
}

type PracticeTemplate = TopicMeta & {
  templateType: "engineering" | "interview"
  targetScenario: string
  includes: string[]
  howToUse: string[]
  extensionIdeas: string[]
}
```

## 关键交互

### 术语悬浮解释

- 正文中命中的术语需要以下划线样式标识
- 桌面端通过 hover 弹出解释浮层
- 移动端通过点击打开浮层
- 浮层只展示一句定义和“查看详情”
- 详细内容统一保留在术语详情页

### 搜索与筛选

- 支持全站搜索
- 支持术语和内容页按标签筛选
- 支持按分类和面试权重查看内容

### 学习进度

- 使用本地存储记录学习完成状态
- 记录最近浏览内容
- 不引入账号系统

### 模板复用与收藏

- 练手模板支持快速复制阅读结构和任务清单
- 面试表达模板支持按模块折叠展开
- 支持把高频模板加入本地收藏或最近查看

## 技术方案

- 框架：Next.js App Router
- 语言：TypeScript
- 样式：Tailwind CSS
- 内容管理：仓库内结构化内容文件
- 搜索：本地搜索索引
- 状态持久化：localStorage

## 模块实施顺序

1. 项目骨架模块
2. 文档壳层模块
3. 内容模型模块
4. 术语模块
5. 技术专题模块
6. 项目类型模块
7. 场景题与编码题模块
8. 学习路线与面试打法模块
9. 搜索与学习进度模块
10. 验收与收尾模块

说明：

- `AI 时代成长指南` 并入学习路线与技术专题模块实现
- `练手模板库` 并入编码题与面试打法模块实现，后续可独立拆页

## Git 规则

- 分支名：`codex/testdev-interview-site`
- 每完成一个模块立即提交到本地 Git
- 如果某模块后续被实质修改，应针对该模块再单独提交一次
- 不把多个模块的变更混在一个提交里

推荐提交信息格式：

- `feat(shell): add docs-style layout and navigation`
- `feat(glossary): add glossary pages and term detail blocks`
- `feat(tech-stack): add core interview topic pages`
- `feat(search): add local search and progress persistence`

## 首版验收标准

- 术语页完整支持定义、易错、混淆和高频问题
- 技术页、项目页、场景题页能正确关联术语
- AI 时代成长指南至少包含学习方法、技术应用和面试表达三个维度
- 练手模板库至少包含工程练手模板和面试表达模板两类内容
- 桌面端具备三栏文档布局
- 移动端导航和术语浮层可用
- 首页具备清晰的学习路径和模块入口
- 搜索、筛选、学习进度与最近浏览可用

## 当前说明

本文件用于保存项目规划和产品约束，放置于仓库根目录，后续实现和扩展均应以此为基础推进。
