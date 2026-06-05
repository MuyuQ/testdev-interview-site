---
title: "Playwright"
description: "微软开源的现代浏览器自动化测试框架，支持多浏览器、多语言的端到端测试"
category: "tech"
difficulty: "interview"
interviewWeight: 3
tags: ["E2E测试", "浏览器自动化", "跨浏览器测试", "测试框架", "Web测试"]
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper"]
selfTests:
  - id: "playwright-q1"
    question: "Playwright相比Selenium的主要优势是什么？"
    options: ["自动等待和更快的执行速度", "只能测试Chrome浏览器", "不支持并行测试", "必须使用Java语言"]
    correctIndex: 0
    explanation: "Playwright内置自动等待机制，执行速度更快，同时支持Chromium、Firefox和WebKit多浏览器。"
  - id: "playwright-q2"
    question: "Playwright中locator和element handle的主要区别是什么？"
    options: ["locator是惰性的，每次操作都重新查找元素", "element handle性能更好", "locator只能用于CSS选择器", "两者完全相同"]
    correctIndex: 0
    explanation: "locator是惰性的（lazy），每次操作时都会重新查找元素，更稳定可靠；element handle是快照式引用，可能因DOM变化而失效。"
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

| 技能 | 重要程度 | 说明 |
|------|----------|------|
| JavaScript/TypeScript | 必备 | Playwright主要使用JS/TS |
| 异步编程 | 必备 | async/await模式 |
| CSS选择器 | 重要 | 元素定位基础 |
| 测试基础概念 | 重要 | 测试金字塔、断言等 |
| Node.js环境 | 必备 | 运行环境 |

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
const button = page.locator('button.submit');

// 不推荐 - ElementHandle是快照，可能过期
const button = await page.$('button.submit');
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
await expect(page.locator('.status')).toHaveText('Success');

// 手动断言，无重试
expect(await page.locator('.count').textContent()).toBe('5');
```

## 最小例子

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('用户登录流程', async ({ page }) => {
  // 导航到登录页
  await page.goto('https://example.com/login');

  // 填写表单
  await page.locator('#username').fill('testuser');
  await page.locator('#password').fill('password123');

  // 点击登录按钮
  await page.locator('button[type="submit"]').click();

  // 验证登录成功 - 自动等待和重试
  await expect(page.locator('.welcome-message')).toContainText('欢迎');
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
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  reporter: [['html'], ['junit', { outputFile: 'results.xml' }]],
});
```

### Page Object模式

```typescript
// tests/pom/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.locator('#username').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('button[type="submit"]').click();
  }
}
```

## 常见坑

### 1. 硬编码等待

```typescript
// 错误做法 - 硬编码等待，不稳定且慢
await page.waitForTimeout(3000);
await page.locator('.result').click();

// 正确做法 - 使用自动等待或显式等待条件
await page.locator('.result').waitFor({ state: 'visible' });
await page.locator('.result').click();
```

### 2. 选择器不稳定

```typescript
// 错误 - 依赖不稳定的结构
await page.locator('div > div:nth-child(3) > button').click();

// 正确 - 使用语义化选择器
await page.locator('[data-testid="submit-btn"]').click();
await page.getByRole('button', { name: '提交' }).click();
```

### 3. 忘记await

```typescript
// 错误 - 缺少await，操作未完成就执行下一个
page.locator('#username').fill('test');  // 没有 await
await page.locator('#password').fill('pass');

// 正确
await page.locator('#username').fill('test');
await page.locator('#password').fill('pass');
```

### 4. 测试间状态污染

```typescript
// 错误 - 测试间共享状态
let sharedPage: Page;
test.beforeAll(async ({ browser }) => {
  sharedPage = await browser.newPage();  // 所有测试共享
});

// 正确 - 每个测试独立上下文
test('独立测试', async ({ page }) => {  // page是每个测试独立的
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

## 练习

1. **基础练习**：编写一个完整的登录流程测试，包含成功和失败场景
2. **进阶练习**：使用Page Object模式重构登录测试，支持多个页面复用
3. **实战练习**：配置多浏览器并行测试，并生成HTML报告
4. **挑战练习**：实现一个文件上传场景，并验证上传成功

## 关联

- [API断言最佳实践](/docs/tech/glossary/api-assertion) - API测试断言技巧
- [断言封装设计](/docs/coding/assertion-wrapper) - 如何设计可复用的断言层
- [测试金字塔理论](/docs/theory/testing-pyramid) - E2E测试在测试体系中的定位
- [CI/CD集成指南](/docs/ops/cicd-integration) - 将Playwright集成到流水线