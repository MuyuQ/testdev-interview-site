---
title: "Playwright"
description: "微软开源的现代浏览器自动化测试框架，支持多浏览器、多语言的端到端测试"
category: "tech"
stage: "practice"
estimatedMinutes: 20
difficulty: "interview"
interviewWeight: 3
tags: ["E2E测试", "浏览器自动化", "跨浏览器测试", "测试框架", "Web测试"]
prerequisites:
  - "glossary/page-object-pattern"
  - "glossary/test-pyramid"
  - "tech/ci-cd"
outcomes:
  - "能写出带自动等待的稳定端到端用例"
  - "能用 Page Object 模式组织页面与步骤"
  - "能把 Playwright 接入 CI 产出 HTML 报告"
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper"]
selfTests:
  - id: "playwright-q1"
    question: "Playwright相比Selenium的主要优势是什么？"
    options:
      [
        "自动等待和更快的执行速度",
        "只能测试Chrome浏览器",
        "不支持并行测试",
        "必须使用Java语言",
      ]
    correctIndex: 0
    explanation: "Playwright内置自动等待机制，执行速度更快，同时支持Chromium、Firefox和WebKit多浏览器。"
  - id: "playwright-q2"
    question: "Playwright中locator和element handle的主要区别是什么？"
    options:
      [
        "locator是惰性的，每次操作都重新查找元素",
        "element handle性能更好",
        "locator只能用于CSS选择器",
        "两者完全相同",
      ]
    correctIndex: 0
    explanation: "locator是惰性的（lazy），每次操作时都会重新查找元素，更稳定可靠；element handle是快照式引用，可能因DOM变化而失效。"
  - id: "playwright-q3"
    question: "E2E 用例规模增长后，以下哪项对缩短总执行时长最有效？"
    options:
      [
        "把超时时间调大避免失败",
        "用 storageState 复用登录态并开启并行分片",
        "每个用例前都完整走一遍登录",
        "只保留核心用例删掉其余",
      ]
    correctIndex: 1
    explanation: "登录是 E2E 最重的重复开销，用 globalSetup 生成 storageState 供所有用例复用，配合 fullyParallel 多 worker 和 shard 分片，总时长能从串行的几十分钟压到几分钟。调大超时只会让失败更慢暴露，删用例则牺牲覆盖率。"
---

## 解决什么问题

Playwright解决以下测试开发痛点：

1. **跨浏览器兼容性测试困难**：一套代码在Chromium、Firefox、WebKit上运行，无需维护多套测试脚本
2. **测试不稳定（Flaky Tests）**：传统工具需要手动添加等待，Playwright内置自动等待机制，大幅减少测试抖动
3. **测试执行速度慢**：相比Selenium，Playwright采用WebSocket通信，执行速度提升显著
4. **复杂交互难模拟**：文件上传、拖拽、多窗口、iframe等场景难以自动化
5. **调试体验差**：提供Trace Viewer、Codegen、Inspector等强大工具链

## 面试为什么问

Playwright是现代测试开发的核心技能，面试考察原因：

- **工具选型能力**：判断候选人是否了解主流测试框架的优劣
- **工程化思维**：E2E测试涉及CI/CD集成、测试架构设计
- **问题解决能力**：从测试不稳定的根因分析能力
- **技术前瞻性**：Playwright是微软开源的新一代工具，代表测试技术趋势

## 前置条件

学习Playwright前需要掌握：

| 技能                  | 重要程度 | 说明                    |
| --------------------- | -------- | ----------------------- |
| JavaScript/TypeScript | 必备     | Playwright主要使用JS/TS |
| 异步编程              | 必备     | async/await模式         |
| CSS选择器             | 重要     | 元素定位基础            |
| 测试基础概念          | 重要     | 测试金字塔、断言等      |
| Node.js环境           | 必备     | 运行环境                |

## 核心概念

### 1. Browser、Context、Page三层架构

```
Browser（浏览器实例）
  └── BrowserContext（隔离的浏览器上下文，类似隐身模式）
        └── Page（页面/标签页）
```

- **Browser**：浏览器进程，一个测试通常只创建一个
- **BrowserContext**：隔离的会话，不共享cookies/storage，适合并行测试
- **Page**：单个页面，所有操作都在Page上执行

### 2. Locator定位器

Locator是Playwright的核心抽象，特点是惰性求值：

```typescript
// 推荐方式 - 惰性定位，自动重试
const button = page.locator("button.submit");

// 不推荐 - ElementHandle是快照，可能过期
const button = await page.$("button.submit");
```

### 3. 自动等待机制

Playwright在执行操作前自动等待：

- 元素可见（visible）
- 元素稳定（stable）
- 元素可接收事件（receives events）
- 元素启用（enabled）

### 4. 断言（Assertions）

```typescript
// Web-First断言，内置重试
await expect(page.locator(".status")).toHaveText("Success");

// 手动断言，无重试
expect(await page.locator(".count").textContent()).toBe("5");
```

### 5. 定位器策略与推荐写法

Playwright 提供多种定位方式，稳定性和可维护性差异很大。优先级从高到低：

| 定位方式   | 写法示例                                     | 适用场景                 |
| ---------- | -------------------------------------------- | ------------------------ |
| 角色定位   | `page.getByRole('button', { name: '提交' })` | 基于可访问性文本，最稳定 |
| 测试 ID    | `page.getByTestId('submit-btn')`             | 与样式解耦，推荐日常使用 |
| 文本定位   | `page.getByText('欢迎回来')`                 | 校验用户可见文案         |
| CSS 选择器 | `page.locator('.card .title')`               | 无更好标识时的兜底方案   |

**推荐**：优先用 `getByRole` / `getByTestId`，避免依赖 CSS 结构和文本样式。当产品改版调整样式时，这类用例最不容易断裂。

### 6. 工具链：Codegen、Trace Viewer、Inspector

光会写用例不够，排查与起手效率同样关键：

- **Codegen**：`npx playwright codegen <url>` 边操作边生成脚本，适合快速起手
- **Trace Viewer**：`--trace on` 记录操作时间线、DOM 快照、网络请求，是失败定位神器
- **Inspector**：`PWDEBUG=1` 单步调试，实时查看 locator 实际匹配到哪些元素

```bash
# 录制并生成脚本
npx playwright codegen --browser chromium https://example.com

# 运行并保留 trace 供失败排查
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## 最小例子

```typescript
// tests/login.spec.ts
import { test, expect } from "@playwright/test";

test("用户登录流程", async ({ page }) => {
  // 导航到登录页
  await page.goto("https://example.com/login");

  // 填写表单
  await page.locator("#username").fill("testuser");
  await page.locator("#password").fill("password123");

  // 点击登录按钮
  await page.locator('button[type="submit"]').click();

  // 验证登录成功 - 自动等待和重试
  await expect(page.locator(".welcome-message")).toContainText("欢迎");
  await expect(page).toHaveURL(/dashboard/);
});
```

## 项目落地

### 目录结构

```
playwright/
├── tests/
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   └── checkout.spec.ts
│   ├── fixtures/
│   │   └── test.fixture.ts
│   └── pom/
│       ├── LoginPage.ts
│       └── HomePage.ts
├── playwright.config.ts
└── package.json
```

### 配置文件

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: [["html"], ["junit", { outputFile: "results.xml" }]],
});
```

### Page Object模式

```typescript
// tests/pom/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.locator("#username").fill(username);
    await this.page.locator("#password").fill(password);
    await this.page.locator('button[type="submit"]').click();
  }
}
```

### 测试执行与报告

```bash
# 运行指定文件
npx playwright test tests/e2e/login.spec.ts

# 生成并查看 HTML 报告
npx playwright test --reporter=html
npx playwright show-report

# 失败重试 + 并行执行
npx playwright test --retries=2 --workers=4
```

**登录态复用**：每个测试都走一遍登录既慢又易错。用 `storageState` 在全局保存登录态，避免重复登录：

```typescript
// playwright.config.ts
use: {
  storageState: './auth/user.json',  // 预置的登录态文件
}
```

登录态文件可在 `globalSetup` 中通过一次登录生成，显著缩短整体执行时间，也是 CI 中稳定登录的前提。

### 分片与失败排查配置

用例数量增长后，并行分片和失败现场留存要写进配置：

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0, // 只在 CI 重试，本地暴露问题
  reporter: [["html"], ["junit", { outputFile: "results.xml" }]],
  use: {
    trace: "retain-on-failure", // 只保留失败用例的 trace，控制产物体积
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
```

```bash
# 分片运行：4 个 runner 各跑约 1/4 用例，总时长近似降为 1/4
npx playwright test --shard=1/4
npx playwright test --shard=2/4
```

要点：`retries` 只在 CI 开启——本地重试会掩盖 flaky；trace 与 video 用 `retain-on-failure` 而不是 `on`，全量保留会把 CI 制品撑爆，排查时反而难定位最新一次失败。

## 常见坑

### 1. 硬编码等待

```typescript
// 错误做法 - 硬编码等待，不稳定且慢
await page.waitForTimeout(3000);
await page.locator(".result").click();

// 正确做法 - 使用自动等待或显式等待条件
await page.locator(".result").waitFor({ state: "visible" });
await page.locator(".result").click();
```

### 2. 选择器不稳定

```typescript
// 错误 - 依赖不稳定的结构
await page.locator("div > div:nth-child(3) > button").click();

// 正确 - 使用语义化选择器
await page.locator('[data-testid="submit-btn"]').click();
await page.getByRole("button", { name: "提交" }).click();
```

### 3. 忘记await

```typescript
// 错误 - 缺少await，操作未完成就执行下一个
page.locator("#username").fill("test"); // 没有 await
await page.locator("#password").fill("pass");

// 正确
await page.locator("#username").fill("test");
await page.locator("#password").fill("pass");
```

### 4. 测试间状态污染

```typescript
// 错误 - 测试间共享状态
let sharedPage: Page;
test.beforeAll(async ({ browser }) => {
  sharedPage = await browser.newPage(); // 所有测试共享
});

// 正确 - 每个测试独立上下文
test("独立测试", async ({ page }) => {
  // page是每个测试独立的
  // ...
});
```

## 追问骨架

面试时可按以下方向深入追问：

```
Q1: Playwright和Selenium/Cypress有什么区别？
  └─ 追问: 性能差异的根本原因是什么？（WebSocket vs HTTP）

Q2: 如何处理动态加载的元素？
  └─ 追问: 自动等待的配置有哪些？timeout如何设置？

Q3: 如何设计可维护的测试架构？
  └─ 追问: Page Object模式的优缺点？何时需要抽象？

Q4: 测试报告如何生成和分析？
  └─ 追问: Trace Viewer能分析哪些问题？

Q5: 如何集成到CI/CD流程？
  └─ 追问: 并行测试如何配置？如何处理测试失败？
```

### 参考回答精选

**问：Playwright 自动等待的原理是什么？**

回答骨架：

> 每次 locator 操作前，Playwright 会轮询检查元素的四个条件——可见、位置稳定（不在动画中）、未被遮挡可接收事件、enabled，全部满足才执行动作，超时（默认 30 秒）报 TimeoutError。断言同理，`expect(locator).toHaveText()` 自带重试轮询。所以硬编码 sleep 在 Playwright 里既是反模式也基本没必要，真正需要显式等待的只有非元素条件，比如 `waitForURL`、`waitForResponse`。

**问：Trace Viewer 能定位哪些问题？**

回答骨架：

> 一条 trace 包含每个动作前后的 DOM 快照、网络请求、console 日志和时间线，能定位四类问题：元素没找到（看快照确认页面当时状态）、断言失败（看当时的实际文案）、网络阻塞（看请求瀑布流）、时序问题（看动作间隔）。CI 里失败用例自动留 trace 后，大部分失败不用本地复现就能定位。

## 练习

1. **基础练习**：编写一个完整的登录流程测试，包含成功和失败场景
2. **进阶练习**：使用Page Object模式重构登录测试，支持多个页面复用
3. **实战练习**：配置多浏览器并行测试，并生成HTML报告
4. **挑战练习**：实现一个文件上传场景，并验证上传成功

## 性能与规模化

E2E 用例天然又慢又脆，规模化时要靠结构而不是硬件：

1. **砍掉不必要的 UI 步骤**：造数、登录这类前置操作尽量走 API（UI 只验证页面交互本身），一条用例从 30 秒压到 8 秒是常态；"用 UI 流程造测试数据"是 E2E 变慢的头号原因
2. **登录态复用**：globalSetup 一次性登录生成 storageState（见"项目落地"），几百条用例共享，省下的时间以小时计
3. **并行与分片**：`fullyParallel` + 多 worker 进程内并行，再配合 `--shard` 分到多台 CI 节点，两层叠加；注意并行时用例不能共享账号写同一份数据
4. **flaky 治理**：重试只是止痛药。按"失败 → 看 trace → 分类"建清单：环境抖动类补等待条件、数据竞争类改隔离、真实 bug 类提单修复；连续多轮全绿的用例移出观察名单
5. **产物控制**：trace/video 只留失败用例，报告归档按流水线保留 7 天，避免 CI 存储被 E2E 产物吃满

一个合理的体感参考：500 条中等复杂度 E2E 用例，串行要 2 小时以上，做完"API 造数 + 登录态复用 + 4 分片"后通常能压进 15 分钟内；压不进去时先找 Top 10 慢用例，而不是加机器。

## 版本与生态：与 Selenium/Cypress 的取舍

选型是 E2E 面试必考题，三家工具的边界要能一句话说清：

| 维度               | Playwright                | Selenium               | Cypress                             |
| ------------------ | ------------------------- | ---------------------- | ----------------------------------- |
| 通信方式           | WebSocket 直连浏览器      | HTTP + WebDriver 协议  | 浏览器内运行                        |
| 语言支持           | TS/JS、Python、Java、.NET | 几乎所有主流语言       | 仅 JS/TS                            |
| 多浏览器           | Chromium/Firefox/WebKit   | 生态最广（含 IE 模式） | Chromium 系 + 实验性 Firefox/WebKit |
| 自动等待           | 内置                      | 需手动显式等待         | 内置                                |
| 多 tab/iframe/多域 | 原生支持                  | 支持但繁琐             | 受同源架构限制                      |
| 速度与稳定性       | 快、抖动少                | 慢、易抖动             | 快                                  |
| 调试工具链         | Trace Viewer、Codegen     | 第三方为主             | 实时重载体验好                      |

选型建议：

- **新项目、追求执行效率和开发体验**：Playwright 是当前默认答案
- **存量 Selenium 资产多、需要覆盖老旧浏览器**：继续用 Selenium，混合期用 Page Object 隔离差异
- **前端团队自测、单页应用**：Cypress 开发体验好，但多域跳转类场景有硬伤

面试表达时不要贬低任何一家，按"团队现状 + 场景约束"给结论更有说服力。

## 关联

- [API断言最佳实践](/testdev-interview-site/glossary/api-assertion/) - API测试断言技巧
- [断言封装设计](/testdev-interview-site/coding/assertion-wrapper/) - 如何设计可复用的断言层
- [测试金字塔理论](/testdev-interview-site/glossary/test-pyramid/) - E2E测试在测试体系中的定位
- [CI/CD集成指南](/testdev-interview-site/tech/ci-cd/) - 将Playwright集成到流水线

## 下一步

掌握 Playwright 基础后，建议按以下路径深入：

1. **测试架构**：把 Page Object 与 fixture 结合，抽离通用页面与数据工厂，参考 [page-object-pattern](/testdev-interview-site/glossary/page-object-pattern/)
2. **结合接口层**：UI 前置数据用 [接口测试](/testdev-interview-site/tech/api-testing/) 准备，避免在 E2E 内部慢慢造数
3. **接入流水线**：把 Playwright 跑进 [CI/CD](/testdev-interview-site/tech/ci-cd/)，用 HTML 报告 + Trace 做失败分析
4. **综合实战**：前往 [登录认证场景](/testdev-interview-site/scenario/login-auth/) 或 [UI 自动化项目](/testdev-interview-site/project/) 落地一套完整方案

面试冲刺重点复盘三个追问：自动等待的原理、为什么 locator 优于 element handle、测试隔离怎么做。
