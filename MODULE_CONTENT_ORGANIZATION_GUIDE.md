# Module Content Organization Guide

> 本文回答一个核心问题：站点里的每个模块，应该用什么方式组织内容，才能既适合初学者逐步学习，又能保留面试速成站的高密度价值。

---

## 1. 使用方式

这份文档是内容编辑和后续实现的主规范。它不替代
`BEGINNER_TEACHING_LAYER_ADJUSTMENT_PLAN.md`，而是为所有模块补充“怎么写、怎么排、怎么关联、怎么验收”的规则。

使用顺序建议如下：

1. 新增或重写内容前，先确认目标模块。
2. 查看本文对应模块的“模块定位”和“内容分层”。
3. 按对应“单篇内容结构”写正文。
4. 按“关联规则”补齐 `relatedSlugs` 或正文链接。
5. 按“验收标准”检查内容是否真的能被初学者读懂，是否能服务面试表达。

本文覆盖 10 个内容模块：

| 模块                | 状态     | 核心价值                               |
| ------------------- | -------- | -------------------------------------- |
| `beginner-course`   | 建议新增 | 为零基础和初级用户提供可完成的教学路线 |
| `glossary`          | 已有     | 建立共同语言，降低阅读其他模块的门槛   |
| `tech`              | 已有     | 解释测试开发技术，并连接项目落地       |
| `project`           | 已有     | 把技术能力包装成可讲述的项目经验       |
| `scenario`          | 已有     | 训练真实业务风险分析和测试设计         |
| `coding`            | 已有     | 训练小型工程能力和面试代码表达         |
| `roadmap`           | 已有     | 提供时间盒学习路线和复盘方法           |
| `ai-learning`       | 已有     | 解释 AI 时代测试开发的工具、边界和机会 |
| `practice-template` | 已有     | 提供可复用练习产物和面试素材模板       |
| `interview-chains`  | 已有     | 模拟连续追问，训练回答深度和抗压能力   |

---

## 2. 全站内容组织原则

### 2.1 先教学，再速成

站点可以保留“面试速成”的定位，但对初学者不能只给结论。每篇内容都应该至少回答：

- 这是什么。
- 为什么要学。
- 在测试开发中怎么用。
- 面试时怎么表达。
- 学完下一步做什么。

如果一篇内容只有答案，没有例子、练习和下一步，它更像速记卡，不适合作为教学内容。

### 2.2 每篇文章只承担一个主任务

单篇文章应该控制主任务：

- 术语页：解释一个概念或一组强相关概念。
- 技术页：掌握一个技术主题的核心用法。
- 项目页：讲清一个项目类型或项目模块。
- 场景页：解决一个业务测试场景。
- 编码页：完成一个小型可解释的代码能力。
- 追问链：围绕一个面试主题展开连续追问。

不要在一篇文章里同时承担“完整课程、完整项目、完整面试题库、完整代码仓库”四种任务。

### 2.3 每篇内容都要有出口

文章结尾必须给用户一个明确出口，出口优先级如下：

1. 同一学习路径的下一篇。
2. 能直接练手的模板或编码题。
3. 能扩展表达的项目页或追问链。
4. 能补基础的术语页或技术页。

不建议只写“继续学习更多内容”这类泛化提示。

### 2.4 初学者强度要可控

面向初学者的内容强度应满足：

- 一次只引入一个主概念。
- 示例代码不超过当前目标所需。
- 练习必须能在 10 到 30 分钟内完成。
- 每篇都解释常见错误，而不是只展示正确答案。
- 每篇都要把“会做”过渡到“会讲”。

面向面试冲刺的内容可以更密，但也要保留结构化回答骨架。

---

## 3. 全站内容层级

建议全站从“平铺资料库”调整为四层结构。

### 3.1 第一层：入门教学层

目标是让用户从不知道怎么开始，变成能完成一个最小测试开发练习。

包含模块：

- `beginner-course`
- `glossary`
- `tech` 中的基础主题，例如 `python`、`pytest`、`api-testing`

典型路径：

```text
beginner-course/start-here
-> beginner-course/python-testing-minimum
-> beginner-course/pytest-first-test
-> beginner-course/http-api-basics
-> beginner-course/pytest-api-first-case
-> beginner-course/mock-login-mini-project
-> beginner-course/interview-expression-for-first-project
```

### 3.2 第二层：能力实践层

目标是让用户把基础概念转化为真实可展示的能力。

包含模块：

- `coding`
- `practice-template`
- `tech` 中的工程化主题，例如 `ci-cd`、`mock-framework`、`test-data-management`

典型路径：

```text
tech/api-testing
-> coding/assertion-wrapper
-> practice-template/api-automation-template
-> scenario/login-auth
```

### 3.3 第三层：项目和场景层

目标是让用户把能力放进业务上下文，形成项目表达。

包含模块：

- `project`
- `scenario`
- `practice-template`

典型路径：

```text
project/payment-project
-> scenario/payment-callback
-> tech/api-document-contract
-> interview-chains/payment-scenario
```

### 3.4 第四层：面试表达层

目标是让用户能回答首问、追问、反问和项目深挖。

包含模块：

- `interview-chains`
- `roadmap`
- `ai-learning`
- `project`

典型路径：

```text
roadmap/self-introduction-template
-> project/ecommerce-project
-> interview-chains/ecommerce-order-chain
-> roadmap/mock-interview-process
```

---

## 4. 模块之间的职责边界

| 从哪里来            | 去哪里              | 关系说明                                      |
| ------------------- | ------------------- | --------------------------------------------- |
| `beginner-course`   | `glossary`          | 遇到概念时补定义，不在课程里展开百科解释      |
| `beginner-course`   | `tech`              | 学完最小例子后进入系统技术专题                |
| `beginner-course`   | `practice-template` | 学完课程后用模板做完整产物                    |
| `glossary`          | `tech`              | 术语页解释词，技术页解释怎么用                |
| `tech`              | `coding`            | 技术知识转成小型代码能力                      |
| `tech`              | `scenario`          | 技术知识放进业务场景验证                      |
| `project`           | `scenario`          | 项目页讲整体经验，场景页讲具体风险和测试设计  |
| `scenario`          | `interview-chains`  | 场景页提供回答材料，追问链训练连续追问        |
| `coding`            | `practice-template` | 编码题训练局部能力，模板沉淀完整产物          |
| `practice-template` | `project`           | 模板产物转成项目经历                          |
| `roadmap`           | 所有模块            | 路线页负责调度学习顺序，不承担大量知识讲解    |
| `ai-learning`       | `tech` / `scenario` | AI 主题要回到真实测试工作流，避免只讲工具清单 |
| `interview-chains`  | `glossary` / `tech` | 追问失败时回到概念和技术补洞                  |

---

## 5. Frontmatter 组织规则

现有 schema 已经支持标题、描述、标签、难度、自测题和关联内容。后续建议逐步扩展，但新增字段应先作为 optional 进入内容治理，不要一次性阻断所有旧内容。

### 5.1 必备字段

每篇内容都应该具备：

- `title`：标题要表达具体主题，避免只写宽泛名词。
- `description`：用一句话说明读完能解决什么问题。
- `tags`：控制在 3 到 6 个，覆盖技术、能力、场景或面试意图。
- `difficulty`：`beginner`、`intermediate`、`advanced` 之一。
- `quiz`：至少 1 道题，教学页建议 2 到 3 道题。
- `relatedSlugs`：按模块规则设置数量。

### 5.2 建议逐步增加的字段

这些字段可以先在新内容里使用，再通过校验脚本逐步推广：

- `estimatedMinutes`：预计阅读和练习时间。
- `prerequisites`：阅读前置条件。
- `outcomes`：读完可交付的结果。
- `nextSlugs`：严格意义上的下一步。
- `pathIds`：归属哪条路线，例如 `beginner-api-automation`。
- `stage`：`foundation`、`practice`、`project`、`interview`、`advanced`。
- `lastReviewed`：内容最近复核日期。

### 5.3 标签控制规则

标签应分为 5 类：

| 标签类型 | 用途                         | 示例                                             |
| -------- | ---------------------------- | ------------------------------------------------ |
| 能力     | 表示用户正在训练什么能力     | `断言设计`、`测试设计`、`项目表达`               |
| 技术     | 表示技术主题                 | `Python`、`Pytest`、`接口测试`、`CI/CD`          |
| 场景     | 表示业务或质量场景           | `登录鉴权`、`支付回调`、`异步任务`               |
| 项目     | 表示项目类型                 | `电商项目`、`支付项目`、`后台管理系统`           |
| 面试策略 | 表示回答、追问、简历相关训练 | `追问链`、`自我介绍`、`项目包装`、`高频面试问题` |

每篇文章不需要覆盖所有类型，但不能把标签当关键词堆砌。

---

## 6. 模块总览页组织规范

每个已有模块都建议补一个总览页。总览页不是普通文章，而是用户进入模块后的学习地图。

### 6.1 总览页固定结构

每个模块总览页建议使用以下结构：

1. 模块定位：这个模块解决什么学习问题。
2. 适合谁：初学者、冲刺面试者、项目包装者、进阶测试开发分别怎么用。
3. 推荐学习顺序：列出 5 到 12 个核心入口。
4. 内容分组：基础、实践、项目、面试、进阶。
5. 最小完成标准：完成多少内容才算掌握这个模块。
6. 常见误区：用户最容易错误使用这个模块的方式。
7. 下一步：跳向其他模块的推荐路径。

### 6.2 总览页不应该做的事

总览页不应该：

- 堆全部文章标题，缺少排序和解释。
- 写成长篇技术文章。
- 只介绍模块价值，不给具体入口。
- 每个模块都用完全相同文案。
- 只给高级内容，不给新手起点。

### 6.3 模块总览页路径建议

可以采用以下路径：

| 模块                | 总览页路径建议                                |
| ------------------- | --------------------------------------------- |
| `beginner-course`   | `src/content/docs/beginner-course/index.md`   |
| `glossary`          | `src/content/docs/glossary/index.md`          |
| `tech`              | `src/content/docs/tech/index.md`              |
| `project`           | `src/content/docs/project/index.md`           |
| `scenario`          | `src/content/docs/scenario/index.md`          |
| `coding`            | `src/content/docs/coding/index.md`            |
| `roadmap`           | `src/content/docs/roadmap/index.md`           |
| `ai-learning`       | `src/content/docs/ai-learning/index.md`       |
| `practice-template` | `src/content/docs/practice-template/index.md` |
| `interview-chains`  | `src/content/docs/interview-chains/index.md`  |

如果 Starlight 侧边栏或 slug 规则需要避免 `index.md` 冲突，也可以使用 `overview.md`，但全站必须统一一种方式。

---

## 7. 单篇内容的通用结构

不是每个模块都要完全相同，但所有文章都应该有稳定节奏。

### 7.1 推荐节奏

1. 开场：用 2 到 4 句话说明这篇解决什么问题。
2. 背景：说明为什么这个主题在测试开发里重要。
3. 核心内容：分层解释概念、流程或方法。
4. 示例：给一个最小例子，尽量贴近测试开发工作。
5. 练习：让用户做一个小任务。
6. 常见错误：说明初学者会怎么误解。
7. 面试表达：把学习内容转成可说出口的回答。
8. 下一步：明确推荐 1 到 3 个链接。

### 7.2 练习设计标准

好的练习应该满足：

- 有明确输入和输出。
- 用户能知道自己是否完成。
- 不依赖大型环境。
- 可以转化为项目或面试表达。
- 难度略高于正文示例，但不跳级。

不合格练习包括：

- “自己多练练”。
- “写一个完整测试平台”。
- “阅读官方文档”但不给阅读目标。
- “实现类似功能”但没有验收条件。

### 7.3 面试表达设计标准

每篇文章的面试表达不要只给标准答案，还要给结构。

推荐结构：

```text
背景 -> 做法 -> 细节 -> 风险 -> 结果 -> 复盘
```

不同模块可以调整，但必须让用户知道为什么这么说。

---

## 8. `beginner-course` 内容组织规范

### 8.1 模块定位

`beginner-course` 是新增的教学入口，目标不是覆盖全部测试开发知识，而是让零基础或弱基础用户完成第一条闭环路线。

这个模块要解决：

- 不知道测试开发是什么。
- 不知道 Python、Pytest、HTTP、接口测试之间是什么关系。
- 不知道怎么从“看懂概念”走到“写出第一个测试”。
- 不知道怎么把小练习转成面试表达。

### 8.2 内容分层

`beginner-course` 建议分为 4 层：

| 层级       | 内容目标             | 示例篇目                                                            |
| ---------- | -------------------- | ------------------------------------------------------------------- |
| 起步认知   | 建立方向感           | `start-here`、`testdev-role-map`                                    |
| 最小技术栈 | 掌握最小可运行能力   | `python-testing-minimum`、`pytest-first-test`                       |
| 接口实战   | 完成第一个自动化练习 | `http-api-basics`、`pytest-api-first-case`                          |
| 项目表达   | 形成可讲述经历       | `mock-login-mini-project`、`interview-expression-for-first-project` |

### 8.3 总览页结构

`beginner-course` 总览页必须非常清楚，不要像知识库目录。

建议结构：

1. 你适不适合这条路线。
2. 7 天能学到什么。
3. 每天学哪一篇，做什么练习，交付什么产物。
4. 学完后的最小能力清单。
5. 如何进入技术专题、项目模板和追问链。

### 8.4 单篇内容结构

每篇 beginner lesson 固定采用：

1. 本节目标。
2. 你需要先知道什么。
3. 一个主概念。
4. 一个生活化或工作化类比。
5. 一个最小例子。
6. 跟着做练习。
7. 检查自己是否完成。
8. 常见错误。
9. 面试里怎么说。
10. 下一节。

### 8.5 强度规则

每篇 beginner lesson 应满足：

- 只讲一个主概念。
- 正文代码片段不超过 3 段。
- 每段代码都解释输入、输出和为什么这么写。
- 练习时间控制在 10 到 30 分钟。
- 文章结尾只推荐 1 个下一课，最多再补 2 个扩展链接。

### 8.6 自测题规则

每篇建议 2 到 3 道题：

- 第 1 题检查概念。
- 第 2 题检查使用场景。
- 第 3 题检查常见误区或面试表达。

### 8.7 关联规则

每篇 beginner lesson 至少关联：

- 1 个补基础的 `glossary` 或 `tech` 页面。
- 1 个后续练手的 `practice-template`、`coding` 或 `scenario` 页面。

课程内严格下一步优先使用 `nextSlugs` 或正文链接，不要只依赖 `relatedSlugs`。

### 8.8 验收标准

一篇 beginner lesson 合格的标准：

- 初学者不看其他资料也能理解本节主概念。
- 有一个能完成的小练习。
- 有完成检查标准。
- 有常见错误解释。
- 有一句能用于面试的表达。
- 有明确下一节链接。

---

## 9. `glossary` 内容组织规范

### 9.1 模块定位

`glossary` 是概念词典，但不应该只是定义集合。它要帮助用户读懂技术页、项目页和追问链。

这个模块要解决：

- 用户听过术语但说不清。
- 用户能背定义但不知道怎么用。
- 用户混淆相近概念。
- 用户面试时无法用测试开发语境表达概念。

### 9.2 内容分层

建议按概念家族组织：

| 概念家族   | 示例内容                                                                             |
| ---------- | ------------------------------------------------------------------------------------ |
| 测试基础   | `unit-testing`、`integration-testing`、`regression-testing`、`smoke-testing`         |
| 测试设计   | `equivalence-class-partition`、`boundary-value-analysis`、`state-transition-testing` |
| 工程质量   | `test-pyramid`、`quality-gate`、`ci-quality-gates`、`test-isolation`                 |
| 自动化模式 | `fixture`、`page-object-pattern`、`mock-stub`、`api-assertion`                       |
| 项目协作   | `bug-lifecycle`、`defect-management`、`agile-testing`                                |

### 9.3 总览页结构

`glossary` 总览页应按概念家族展示，不要按字母排序优先。

建议结构：

1. 新手必懂 10 个术语。
2. 写自动化前要懂的术语。
3. 做项目复盘要懂的术语。
4. 面试高频混淆概念。
5. 从术语进入技术专题的推荐路径。

### 9.4 单篇内容结构

每篇术语页建议采用：

1. 一句话定义。
2. 为什么测试开发要关心它。
3. 它在真实工作流中的位置。
4. 一个最小例子。
5. 面试怎么说。
6. 易错点。
7. 容易混淆的概念。
8. 自测题。
9. 关联内容。

### 9.5 关联规则

每篇术语页至少关联：

- 1 个同概念家族术语。
- 1 个会用到该术语的 `tech`、`scenario` 或 `project` 页面。

示例：

- `glossary/api-assertion` -> `tech/api-testing`
- `glossary/fixture` -> `tech/pytest`
- `glossary/test-pyramid` -> `tech/ci-cd`

### 9.6 验收标准

一篇术语页合格的标准：

- 用户能用自己的话复述定义。
- 用户知道这个术语在测试开发工作中出现在哪里。
- 用户知道至少一个相近概念的区别。
- 用户能给出一句面试表达。

---

## 10. `tech` 内容组织规范

### 10.1 模块定位

`tech` 是技术专题模块，负责把测试开发需要的技术讲成可理解、可练习、可面试表达的内容。

这个模块要解决：

- 技术是什么。
- 技术在测试开发里解决什么问题。
- 最小使用方式是什么。
- 项目中怎么落地。
- 面试会怎么追问。

### 10.2 内容分层

建议分成 5 组：

| 分组                 | 示例内容                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------- |
| 编程与测试框架       | `python`、`pytest`                                                                        |
| 接口与服务测试       | `api-testing`、`api-document-contract`、`mock-framework`                                  |
| 前端与端到端测试     | `playwright`                                                                              |
| 工程化与协作         | `ci-cd`、`git-collaboration`、`docker-testing`、`linux-testing`                           |
| 数据、性能和可观测性 | `database-testing`、`redis-testing`、`performance-testing-intro`、`logging-observability` |

### 10.3 总览页结构

`tech` 总览页建议按学习先后组织：

1. 最小技术栈：Python、Pytest、接口测试。
2. 自动化工程能力：数据驱动、Mock、CI/CD、Docker。
3. 场景扩展：数据库、Redis、消息队列、异步接口。
4. 进阶质量能力：性能、可观测性、报告设计。
5. 面试深挖路径：每组对应追问链和项目页。

### 10.4 单篇内容结构

每篇技术页建议采用：

1. 这项技术解决什么问题。
2. 面试为什么会问。
3. 学习前置条件。
4. 核心概念拆解。
5. 最小可运行例子或伪代码。
6. 在项目中怎么落地。
7. 常见坑和排查方法。
8. 面试追问与回答骨架。
9. 练习任务。
10. 关联内容。

### 10.5 练习规则

技术页练习应尽量让用户产出小东西：

- `python`：写一个判断响应是否成功的函数。
- `pytest`：写一个通过和一个失败的测试。
- `api-testing`：为登录接口设计 3 条断言。
- `ci-cd`：画出一次自动化测试在流水线中的执行位置。
- `mock-framework`：说明什么时候应该 Mock，什么时候不应该 Mock。

### 10.6 关联规则

每篇技术页至少关联：

- 1 个补概念的 `glossary` 页面。
- 1 个练习型 `coding` 或 `practice-template` 页面。
- 1 个应用型 `scenario`、`project` 或 `interview-chains` 页面。

示例：

- `tech/api-testing` -> `glossary/api-assertion` -> `coding/assertion-wrapper` -> `scenario/login-auth`
- `tech/pytest` -> `glossary/fixture` -> `coding/fixture-strategy` -> `practice-template/api-automation-template`
- `tech/ci-cd` -> `glossary/ci-quality-gates` -> `project/microservice-architecture-project`

### 10.7 验收标准

一篇技术页合格的标准：

- 用户知道该技术解决的问题边界。
- 用户能完成一个最小练习。
- 用户知道该技术在项目中的应用位置。
- 用户能回答至少 2 个面试追问。

---

## 11. `project` 内容组织规范

### 11.1 模块定位

`project` 是项目经验模块，负责把技术和场景组织成“能在面试里讲出来”的项目故事。

这个模块要解决：

- 没有项目经验的人不知道怎么组织素材。
- 有项目经历的人讲得像流水账。
- 用户不知道项目里哪些内容能体现测试开发能力。
- 用户不知道面试官会从项目里追问什么。

### 11.2 内容分层

建议按项目类型和能力点双轴组织：

| 项目类型   | 示例内容                                                            |
| ---------- | ------------------------------------------------------------------- |
| 交易链路   | `ecommerce-project`、`payment-project`                              |
| 管理后台   | `admin-platform`、`saas-platform-project`                           |
| 数据与平台 | `data-platform-project`、`microservice-architecture-project`        |
| 移动与内容 | `mobile-app-project`、`social-content-project`                      |
| 复杂协作   | `third-party-integration-project`、`legacy-system-refactor-project` |

### 11.3 总览页结构

`project` 总览页建议强调“选项目”和“讲项目”：

1. 如何选择一个适合自己的项目故事。
2. 不同项目类型适合展示什么能力。
3. 推荐项目学习顺序。
4. 项目表达通用框架。
5. 项目和场景题、追问链的连接。

### 11.4 单篇内容结构

每篇项目页建议采用：

1. 项目背景：业务目标、用户、核心链路。
2. 测试开发角色：你负责什么，不负责什么。
3. 业务流程：用步骤说明主流程。
4. 质量风险：列出高风险节点。
5. 测试策略：功能、接口、数据、回归、自动化怎么组合。
6. 自动化落地：框架、数据、断言、报告、流水线。
7. 环境和数据：测试环境、Mock、测试数据构造。
8. 故障和复盘：发生过什么问题，如何定位和改进。
9. 2 分钟项目表达。
10. 可能追问。
11. 关联场景和技术。

### 11.5 项目表达标准

每篇项目页必须给出一段可迁移的表达结构：

```text
这个项目解决什么业务问题
-> 我负责的质量目标是什么
-> 我如何设计测试策略
-> 我做了哪些自动化或工程化动作
-> 结果如何衡量
-> 后续怎么改进
```

### 11.6 关联规则

每篇项目页至少关联：

- 2 个 `scenario` 页面。
- 1 个 `tech` 页面。
- 1 个 `interview-chains` 页面。
- 1 个 `practice-template` 页面。

示例：

- `project/payment-project` -> `scenario/payment-callback` -> `tech/api-document-contract` -> `interview-chains/payment-scenario`
- `project/ecommerce-project` -> `scenario/flash-sale` -> `scenario/search-function` -> `interview-chains/ecommerce-order-chain`

### 11.7 验收标准

一篇项目页合格的标准：

- 用户能复述项目背景和主链路。
- 用户能说出至少 3 个质量风险。
- 用户能说明自己的测试开发贡献。
- 用户能应对至少 5 个项目追问。
- 用户能把项目连接到具体技术和场景。

---

## 12. `scenario` 内容组织规范

### 12.1 模块定位

`scenario` 是场景题模块，负责训练“看到一个业务问题，怎么拆风险、设计用例、落自动化、讲清取舍”。

这个模块要解决：

- 用户只会罗列测试点。
- 用户不知道如何按风险优先级组织回答。
- 用户无法把功能测试、接口测试、数据测试、异常测试串起来。
- 用户面试时回答散，缺少结构。

### 12.2 内容分层

建议按场景复杂度分组：

| 分组           | 示例内容                                                         |
| -------------- | ---------------------------------------------------------------- |
| 账号与权限     | `login-auth`、`permission-change`                                |
| 交易和支付     | `payment-callback`、`flash-sale`                                 |
| 数据和配置     | `data-migration`、`config-change`                                |
| 异步和外部依赖 | `async-task`、`third-party-failure`                              |
| 查询和展示     | `search-function`、`report-export`、`recommendation-system-test` |
| 多端和兼容     | `multi-device-sync`、`compatibility-testing`                     |

### 12.3 总览页结构

`scenario` 总览页建议按照面试常见业务域组织：

1. 新手先练的 5 个场景。
2. 高频交易类场景。
3. 数据一致性和异步类场景。
4. 复杂系统类场景。
5. 每个场景对应项目和追问链。

### 12.4 单篇内容结构

每篇场景页建议采用：

1. 场景题原问。
2. 先确认问题边界。
3. 风险分析。
4. 测试维度。
5. 核心用例设计。
6. 异常、边界和兼容情况。
7. 自动化策略。
8. 数据准备和环境依赖。
9. 监控、告警和回滚。
10. 面试回答骨架。
11. 面试官可能追问。
12. 关联内容。

### 12.5 回答组织标准

场景题回答推荐使用：

```text
先确认范围 -> 再拆风险 -> 再给测试维度 -> 再讲重点用例 -> 再讲自动化和保障 -> 最后补充取舍
```

不要一上来就背用例列表。

### 12.6 关联规则

每篇场景页至少关联：

- 1 个 `project` 页面。
- 1 个 `tech` 页面。
- 1 个 `interview-chains` 页面。
- 1 个补概念的 `glossary` 页面。

示例：

- `scenario/payment-callback` -> `project/payment-project` -> `tech/api-document-contract` -> `interview-chains/payment-scenario`
- `scenario/login-auth` -> `tech/api-testing` -> `practice-template/api-automation-template`
- `scenario/async-task` -> `tech/async-api-testing` -> `tech/message-queue-testing`

### 12.7 验收标准

一篇场景页合格的标准：

- 用户能用结构化方式回答场景题。
- 用户能区分核心链路、异常链路和边界链路。
- 用户能说明自动化适合覆盖哪些部分。
- 用户能解释监控、回滚或兜底策略。
- 用户能进入至少一个相关追问链。

---

## 13. `coding` 内容组织规范

### 13.1 模块定位

`coding` 是编码题模块，但它不应该变成算法题库。测试开发编码题更关注工程小能力：断言封装、重试、配置读取、测试数据生成、日志、报告、Mock 工具、Fixture 策略等。

这个模块要解决：

- 用户不会把测试思路写成可复用代码。
- 用户只会复制框架，不理解封装边界。
- 用户面试时无法解释代码取舍。
- 用户缺少边界条件和测试意识。

### 13.2 内容分层

建议按工程能力组织：

| 能力         | 示例内容                                                    |
| ------------ | ----------------------------------------------------------- |
| 稳定性       | `retry-mechanism`、`async-wait-wrapper`                     |
| 断言和数据   | `assertion-wrapper`、`test-data-generator`、`data-cleaning` |
| 配置和日志   | `config-reader`、`logging-wrapper`                          |
| 测试框架能力 | `fixture-strategy`、`mock-tool-wrapper`                     |
| 输出和报告   | `report-generator`                                          |

### 13.3 总览页结构

`coding` 总览页建议按“从能写到能封装”的顺序：

1. 先写简单工具函数。
2. 再处理输入、配置和错误。
3. 再加入测试和边界条件。
4. 最后解释可扩展性和项目使用方式。

### 13.4 单篇内容结构

每篇编码题建议采用：

1. 题目描述。
2. 考察点。
3. 输入输出。
4. 约束和边界。
5. 设计思路。
6. 最小实现。
7. 测试用例。
8. 可扩展点。
9. 面试讲解方式。
10. 常见追问。
11. 关联技术和场景。

### 13.5 代码内容标准

编码页的代码应满足：

- 代码片段短小，能解释。
- 至少覆盖一个正常路径和一个异常路径。
- 说明为什么这样封装。
- 说明什么时候不应该过度封装。
- 如果提供测试代码，要说明断言目标。

### 13.6 关联规则

每篇编码页至少关联：

- 1 个 `tech` 页面。
- 1 个 `practice-template` 或 `scenario` 页面。
- 1 个 `interview-chains` 页面或 `roadmap` 面试表达页面。

示例：

- `coding/assertion-wrapper` -> `tech/api-testing` -> `practice-template/api-automation-template`
- `coding/fixture-strategy` -> `tech/pytest` -> `glossary/fixture`
- `coding/retry-mechanism` -> `scenario/third-party-failure` -> `tech/async-api-testing`

### 13.7 验收标准

一篇编码页合格的标准：

- 用户知道题目考察什么能力。
- 用户能看懂最小实现。
- 用户能说出至少 2 个边界条件。
- 用户能解释代码在测试项目中的使用位置。
- 用户能回答至少 2 个代码追问。

---

## 14. `roadmap` 内容组织规范

### 14.1 模块定位

`roadmap` 是学习路线和面试打法模块，负责安排学习顺序、时间盒、复盘和面试准备。它不是普通知识文章，也不应该重复大量技术讲解。

这个模块要解决：

- 用户不知道先学什么后学什么。
- 用户学习时间有限，需要冲刺策略。
- 用户学了很多内容但不会复盘。
- 用户无法把内容转成简历、自我介绍和模拟面试表现。

### 14.2 内容分层

建议分为 4 组：

| 分组       | 示例内容                                                                      |
| ---------- | ----------------------------------------------------------------------------- |
| 时间盒路线 | `3-day-interview-map`、`7-day-interview-plan`                                 |
| 面试材料   | `self-introduction-template`、`resume-key-points`                             |
| 训练方法   | `interview-expression-training`、`interview-review-method`                    |
| 模拟面试   | `mock-interview-process`、`common-follow-up-questions`、`interview-checklist` |

### 14.3 总览页结构

`roadmap` 总览页应该先问用户目标：

1. 我是零基础，想 7 天入门。
2. 我有测试经验，想 7 天冲刺测试开发面试。
3. 我已经有项目，想包装表达。
4. 我快面试了，想做模拟追问。

每个目标给一条明确路线，不要只列文章。

### 14.4 单篇内容结构

每篇路线页建议采用：

1. 适合谁。
2. 不适合谁。
3. 使用前提。
4. 时间安排。
5. 每一步要读什么、练什么、产出什么。
6. 每天或每阶段验收标准。
7. 遇到卡点怎么调整。
8. 结束后进入哪个模块。

### 14.5 路线强度规则

路线页要避免“计划看起来很完整，用户根本做不完”。

建议：

- 3 天路线每天最多 3 个主要任务。
- 7 天路线每天最多 4 个主要任务。
- 每天必须有一个可见产物，例如一段项目表达、一组用例、一段代码、一次模拟回答。
- 每条路线都要区分必做和加练。

### 14.6 关联规则

每篇路线页至少关联：

- 2 个核心模块入口。
- 1 个可交付模板。
- 1 个追问链或模拟面试页面。

示例：

- `roadmap/7-day-interview-plan` -> `tech/api-testing` -> `project/ecommerce-project` -> `interview-chains/api-testing-chain`
- `roadmap/self-introduction-template` -> `practice-template/project-story-template` -> `project/payment-project`

### 14.7 验收标准

一篇路线页合格的标准：

- 用户知道自己是否适合这条路线。
- 用户知道每天做什么。
- 用户知道每天产出什么。
- 用户知道跳过或加练的条件。
- 用户能从路线进入具体内容页。

---

## 15. `ai-learning` 内容组织规范

### 15.1 模块定位

`ai-learning` 是 AI 时代测试开发成长模块，重点不是追逐工具，而是解释 AI 如何改变测试设计、数据构造、代码审查、文档生成、接口测试和质量协作。

这个模块要解决：

- 用户只会把 AI 当搜索引擎。
- 用户不知道 AI 在测试工作里的边界。
- 用户不会把 AI 输出纳入质量流程。
- 用户面试时无法回答“AI 对测试开发有什么影响”。

### 15.2 内容分层

建议分为 4 组：

| 分组     | 示例内容                                                               |
| -------- | ---------------------------------------------------------------------- |
| 工具认知 | `testdev-ai-tools`、`llm-boundaries`                                   |
| 测试设计 | `ai-testcase-design`、`ai-test-data`                                   |
| 工程协作 | `ai-code-review`、`ai-doc-generation`                                  |
| 场景扩展 | `ai-api-testing`、`ai-performance-testing`、`cloud-native-for-testdev` |

### 15.3 总览页结构

`ai-learning` 总览页建议回答：

1. 测试开发为什么需要理解 AI。
2. AI 能帮哪些工作。
3. AI 不能替代哪些判断。
4. 初学者应该先学哪些能力。
5. 面试中如何表达 AI 工具使用经验。

### 15.4 单篇内容结构

每篇 AI 学习页建议采用：

1. 这个 AI 场景解决什么问题。
2. 传统做法是什么。
3. AI 可以提升哪一段效率。
4. 使用流程。
5. 示例 Prompt 或工作流。
6. 输出如何校验。
7. 风险和边界。
8. 在项目中怎么说。
9. 面试追问。
10. 关联内容。

### 15.5 风险表达规则

AI 内容必须包含边界说明：

- 不能直接信任生成结果。
- 不能把敏感数据直接输入外部工具。
- 需要人工复核测试结论。
- 需要结合业务规则和历史缺陷。
- 需要说明质量责任仍在人。

### 15.6 关联规则

每篇 AI 学习页至少关联：

- 1 个传统测试能力页面，例如 `tech/api-testing`、`tech/test-data-management`。
- 1 个场景页或项目页。
- 1 个面试表达或追问链页面。

示例：

- `ai-learning/ai-testcase-design` -> `glossary/test-design` -> `scenario/payment-callback`
- `ai-learning/ai-api-testing` -> `tech/api-testing` -> `interview-chains/ai-testing-chain`

### 15.7 验收标准

一篇 AI 学习页合格的标准：

- 用户知道 AI 在该场景中提升哪一段工作。
- 用户知道输出怎么校验。
- 用户知道风险边界。
- 用户能在面试中说出一个具体应用场景。

---

## 16. `practice-template` 内容组织规范

### 16.1 模块定位

`practice-template` 是练手模板库，负责把知识转化为可交付产物。它应该比文章更像任务说明和产物规范。

这个模块要解决：

- 用户读了很多内容但没有作品。
- 用户不知道练习应该做到什么程度。
- 用户不知道怎么把练习包装成项目表达。
- 用户缺少可复用的检查清单。

### 16.2 内容分层

建议按产物类型组织：

| 产物类型        | 示例内容                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------- |
| 自动化项目      | `api-automation-template`、`playwright-template`                                              |
| 测试数据和 Mock | `test-data-factory-template`、`mock-service-template`                                         |
| 性能与报告      | `performance-test-template`                                                                   |
| 面试表达        | `project-story-template`、`interview-answer-skeleton-template`、`project-difficulty-template` |

### 16.3 总览页结构

`practice-template` 总览页应按“我想产出什么”组织：

1. 我想做第一个接口自动化项目。
2. 我想做 UI 自动化练习。
3. 我想练测试数据和 Mock。
4. 我想把项目讲成面试故事。
5. 我想补充项目难点。

### 16.4 单篇内容结构

每篇模板页建议采用：

1. 模板目标。
2. 适用场景。
3. 使用前提。
4. 最终产物长什么样。
5. 文件结构或内容结构。
6. 分步骤完成方式。
7. 验收清单。
8. 加练任务。
9. 如何转成简历或面试表达。
10. 关联内容。

### 16.5 产物验收标准

模板必须给用户明确产物标准，例如：

- 代码模板：目录结构、运行命令、核心文件职责、测试通过标准。
- 面试模板：回答时长、必须覆盖的信息、不能出现的表达。
- 项目难点模板：难点背景、技术方案、取舍、结果、复盘。

### 16.6 关联规则

每篇模板页至少关联：

- 1 个 `tech` 页面。
- 1 个 `project` 或 `scenario` 页面。
- 1 个 `roadmap` 或 `interview-chains` 页面。

示例：

- `practice-template/api-automation-template` -> `tech/api-testing` -> `scenario/login-auth` -> `project/ecommerce-project`
- `practice-template/project-story-template` -> `roadmap/self-introduction-template` -> `project/payment-project`

### 16.7 验收标准

一篇模板页合格的标准：

- 用户知道要交付什么。
- 用户知道按什么步骤完成。
- 用户知道完成后如何检查。
- 用户知道如何把产物转成项目或面试表达。

---

## 17. `interview-chains` 内容组织规范

### 17.1 模块定位

`interview-chains` 是追问链模块，负责模拟真实面试中从一个首问延伸到多个追问的过程。它不是普通问答列表，而是训练用户在压力下保持结构。

这个模块要解决：

- 用户只能回答第一问。
- 用户遇到追问就失去方向。
- 用户不知道面试官每个追问在考察什么。
- 用户不会从错误回答中补知识。

### 17.2 内容分层

建议按面试主题组织：

| 主题       | 示例内容                                                                |
| ---------- | ----------------------------------------------------------------------- |
| 接口测试   | `api-testing-chain`                                                     |
| 项目链路   | `ecommerce-order-chain`、`payment-scenario`                             |
| 自动化框架 | `test-framework`、`ui-automation-chain`                                 |
| 编码能力   | `coding-practice-chain`                                                 |
| 进阶能力   | `performance-testing-chain`、`senior-testdev-chain`、`ai-testing-chain` |

### 17.3 总览页结构

`interview-chains` 总览页建议按照面试准备阶段组织：

1. 第一轮先练基础追问链。
2. 第二轮练项目追问链。
3. 第三轮练进阶追问链。
4. 每条链对应需要补的技术页和项目页。
5. 如何使用追问链做模拟面试。

### 17.4 单篇内容结构

每篇追问链建议采用：

1. 首问。
2. 面试官想看什么。
3. 推荐回答结构。
4. 追问 1：考察点、强回答、弱回答、补救方式。
5. 追问 2：考察点、强回答、弱回答、补救方式。
6. 追问 3：考察点、强回答、弱回答、补救方式。
7. 更深一层追问。
8. 知识补洞链接。
9. 自我演练方法。

### 17.5 回答深度标准

追问链必须区分回答层级：

- 初级回答：说清概念和基本做法。
- 中级回答：能结合项目和风险。
- 高级回答：能讲取舍、边界、指标和复盘。

不要只给“标准答案”，要说明为什么这是强回答。

### 17.6 关联规则

每条追问链至少关联：

- 1 个 `tech` 页面。
- 1 个 `project` 或 `scenario` 页面。
- 1 个 `glossary` 页面。
- 1 个 `roadmap` 或 `practice-template` 页面。

示例：

- `interview-chains/api-testing-chain` -> `tech/api-testing` -> `glossary/api-assertion` -> `practice-template/api-automation-template`
- `interview-chains/payment-scenario` -> `project/payment-project` -> `scenario/payment-callback`

### 17.7 验收标准

一篇追问链合格的标准：

- 至少有 4 个连续追问层级。
- 每个追问都说明考察点。
- 每个追问都给强回答和弱回答差异。
- 每个弱点都有补洞链接。
- 用户能用它完成一次 10 分钟模拟面试。

---

## 18. 跨模块路径样板

下面是建议优先建设的跨模块样板路径。这些路径能同时改善学习流、关联推荐和首页任务入口。

### 18.1 新手接口自动化路径

```text
beginner-course/start-here
-> beginner-course/python-testing-minimum
-> beginner-course/pytest-first-test
-> beginner-course/http-api-basics
-> beginner-course/pytest-api-first-case
-> beginner-course/mock-login-mini-project
-> practice-template/api-automation-template
-> interview-chains/api-testing-chain
```

### 18.2 支付项目面试路径

```text
project/payment-project
-> scenario/payment-callback
-> tech/api-document-contract
-> tech/test-data-management
-> interview-chains/payment-scenario
-> practice-template/project-story-template
```

### 18.3 电商项目综合路径

```text
project/ecommerce-project
-> scenario/flash-sale
-> scenario/search-function
-> tech/redis-testing
-> tech/performance-testing-intro
-> interview-chains/ecommerce-order-chain
```

### 18.4 自动化框架路径

```text
tech/pytest
-> glossary/fixture
-> coding/fixture-strategy
-> coding/report-generator
-> practice-template/api-automation-template
-> interview-chains/test-framework
```

### 18.5 AI 测试能力路径

```text
ai-learning/testdev-ai-tools
-> ai-learning/llm-boundaries
-> ai-learning/ai-testcase-design
-> ai-learning/ai-api-testing
-> interview-chains/ai-testing-chain
```

---

## 19. 内容难度和强度控制

### 19.1 难度定义

| 难度           | 用户状态               | 内容要求                                     |
| -------------- | ---------------------- | -------------------------------------------- |
| `beginner`     | 刚接触主题             | 一次只讲一个主概念，必须有例子和练习         |
| `intermediate` | 有基础，正在练项目     | 可以组合多个概念，必须有场景和取舍           |
| `advanced`     | 准备高级岗位或深度追问 | 可以讲架构、指标、边界、复盘和复杂 trade-off |

### 19.2 初学者内容不合格信号

如果一篇标记为 `beginner` 的内容出现以下情况，需要重写或拆分：

- 第一屏出现大量术语但没有解释。
- 需要用户提前理解多个未关联的技术。
- 练习没有明确完成标准。
- 示例直接进入复杂项目结构。
- 文章只讲面试答案，不教用户怎么得到答案。
- 结尾没有下一步。

### 19.3 面试内容不合格信号

如果一篇面试向内容出现以下情况，需要补强：

- 只有背诵答案，没有回答结构。
- 没有追问。
- 没有项目或场景连接。
- 没有说明回答中的风险和取舍。
- 没有告诉用户弱回答为什么弱。

---

## 20. 内容验收清单

新增或重写任何内容前后，都按这份清单检查。

### 20.1 单篇文章验收

- 标题表达具体主题。
- 描述说明读完能解决的问题。
- 难度和正文强度一致。
- 正文有清晰结构。
- 至少有一个例子或场景。
- 至少有一个练习或演练任务。
- 有常见错误或误区。
- 有面试表达或回答骨架。
- 有自测题。
- 有跨模块关联。
- 结尾有明确下一步。

### 20.2 模块验收

- 模块有总览页。
- 总览页说明适合谁。
- 总览页给推荐学习顺序。
- 模块内内容按基础、实践、项目、面试或进阶分组。
- 模块内至少有 1 条跨模块样板路径。
- 模块内没有大量孤立文章。

### 20.3 路径验收

- 路径有明确起点。
- 路径每一步难度递进。
- 每一步都有产出。
- 路径终点能转入项目表达或模拟面试。
- 路径中遇到前置概念时有补洞链接。

---

## 21. 分阶段落地建议

### 21.1 第一阶段：先补组织，不急着扩内容

目标：让已有内容更容易被使用。

建议动作：

1. 新增 9 个已有模块总览页。
2. 首页模块卡片从推荐单篇改为优先进入模块总览页。
3. 为 `tech/api-testing`、`project/payment-project`、`scenario/payment-callback`、`interview-chains/api-testing-chain` 建立第一条跨模块路径。
4. 内容校验脚本对非 `glossary` 模块缺少 `relatedSlugs` 给 warning。

### 21.2 第二阶段：补入门教学层

目标：让初学者有一条低门槛路线。

建议动作：

1. 新增 `beginner-course` 分类配置。
2. 新增 8 篇 MVP beginner lessons。
3. 首页增加“我是新手，从这里开始”入口。
4. 让 beginner lessons 连接到现有 `tech`、`practice-template`、`scenario` 和 `interview-chains`。

### 21.3 第三阶段：内容重写和强度校准

目标：把旧内容从“知识点文章”升级为“学习任务”。

建议动作：

1. 优先重写 `tech/python`、`tech/pytest`、`tech/api-testing`。
2. 优先重写 `practice-template/api-automation-template` 和 `project-story-template`。
3. 为所有 `scenario` 页面补面试回答骨架和追问。
4. 为所有 `project` 页面补 2 分钟项目表达。

### 21.4 第四阶段：把规范写进校验

目标：让内容质量变成可持续机制。

建议动作：

1. 校验 `relatedSlugs` 数量。
2. 校验 `quiz` 数量。
3. 校验 `description` 长度和空泛描述。
4. 校验 beginner lessons 是否含练习和下一步。
5. 校验模块总览页是否存在。

---

## 22. 编辑反模式

后续补内容时要避免这些反模式：

- 把模块当文件夹，而不是学习阶段。
- 用大而全文章替代小步教学。
- 初学者内容直接堆面试话术。
- 技术页只讲概念，不讲项目使用。
- 项目页只讲业务，不讲测试开发贡献。
- 场景页只列用例，不讲风险优先级。
- 编码页只贴代码，不讲边界和测试。
- 模板页只给目录，不给验收清单。
- 追问链只堆问答，不讲考察点。
- AI 内容只列工具，不讲校验和责任边界。
- 文章结尾没有下一步。
- `relatedSlugs` 只在 `glossary` 模块里存在。

---

## 23. 最终判断标准

一次内容补充是否成功，不应该只看新增了多少篇文章，而要看：

- 新手是否知道从哪里开始。
- 用户是否能按路径完成一个可见产物。
- 每个模块是否承担不同职责。
- 每篇文章是否有教学、练习、表达和下一步。
- 首页、总览页、内容页、追问链之间是否形成闭环。
- 面试速成是否建立在真实理解和练习之上。

如果这些条件成立，站点就会从“测试开发面试资料库”升级成“初学者可进入、进阶者可训练、面试者可冲刺”的完整学习产品。
