---
title: "页面对象模式"
description: "将页面元素定位与操作逻辑封装成独立对象的UI自动化设计模式，实现测试代码与页面结构的解耦"
category: "glossary"
stage: "foundation"
estimatedMinutes: 12
difficulty: "interview"
interviewWeight: 3
tags: ["自动化模式", "UI测试", "设计模式", "Selenium", "Playwright", "Cypress"]
prerequisites:
  - "tech/playwright"
  - "glossary/test-pyramid"
outcomes:
  - "能把页面元素与操作封装成独立的页面对象类"
  - "能说明 UI 变化时只需改页面对象而用例不变"
  - "面试时能讲清页面对象模式解耦的好处"
relatedSlugs: ["tech/api-testing", "tech/playwright"]
selfTests:
  - id: "page-object-pattern-q1"
    question: "页面对象模式的核心目的是什么？"
    options:
      [
        "将页面元素与操作逻辑封装，实现测试代码与页面结构解耦",
        "提高测试执行速度",
        "减少测试用例数量",
        "替代所有手工测试",
      ]
    correctIndex: 0
    explanation: "页面对象模式的核心是将页面元素定位、操作逻辑封装成独立对象，使测试代码与页面结构解耦，提高可维护性。"
  - id: "page-object-pattern-q2"
    question: "当页面UI发生变化时，使用页面对象模式的优势是什么？"
    options:
      [
        "只需修改对应的页面对象类，无需修改测试用例",
        "测试用例需要全部重写",
        "不需要做任何修改",
        "自动适应UI变化",
      ]
    correctIndex: 0
    explanation: "页面对象模式将页面元素封装在独立的类中，UI变化时只需修改对应页面对象，测试用例保持不变，这是其核心优势。"
  - id: "page-object-pattern-q3"
    question: "以下哪个是页面对象模式的最佳实践？"
    options:
      [
        "页面对象类只暴露业务操作方法，不暴露内部元素细节",
        "将所有断言逻辑放在页面对象中",
        "一个页面对象对应多个页面",
        "在页面对象中直接写测试逻辑",
      ]
    correctIndex: 0
    explanation: "页面对象应该只暴露业务操作方法（如login、addToCart），隐藏内部元素细节。断言应该在测试用例中，不应在页面对象中。"
  - id: "page-object-pattern-q4"
    question: "登录后的导航栏在二十个页面都会出现，用页面对象模式怎么组织最合理？"
    options:
      [
        "在每个页面对象类里都复制一份导航栏定位器",
        "把导航栏封装成独立的组件对象，被各页面对象组合引用",
        "写一个通用页面对象，包含整个网站的所有元素",
        "在测试用例里直接操作导航栏元素",
      ]
    correctIndex: 1
    explanation: "跨页面复用的 UI 片段（导航栏、弹窗、页脚）应封装为组件对象（Component Object），由各页面对象组合引用。逐页复制会让一次导航栏改版变成二十处修改；全站通用大对象则破坏单一职责，是另一种维护灾难。"
---

## 一句话定义

页面对象模式（Page Object Pattern，简称POM）是一种UI自动化测试设计模式，将每个Web页面抽象为一个类，把页面元素定位、操作逻辑封装在类中，实现测试代码与页面结构的解耦。

## 为什么重要

1. **提高可维护性**：页面UI变化时，只需修改对应页面对象类，无需改动测试用例
2. **代码复用**：同一页面的操作可在多个测试用例中复用，减少重复代码
3. **增强可读性**：测试用例使用业务语义方法（如`loginPage.login()`），而非底层元素操作
4. **降低维护成本**：元素定位器集中管理，修改定位策略时一处改动全局生效
5. **团队协作友好**：不同测试人员可并行开发不同页面对象，互不干扰
6. **符合单一职责原则**：页面对象只负责页面操作，测试用例只负责验证逻辑

## 工作流位置

```
需求分析 → 测试用例设计 → 【页面对象设计】 → 测试脚本编写 → 执行与调试 → 维护与优化
                              ↑
                         关键设计环节
```

页面对象模式处于测试用例设计与测试脚本编写之间，是将测试用例转化为可执行代码的关键桥梁。良好的页面对象设计能让后续测试脚本的编写事半功倍。

## 最小例子

以登录页面为例，展示页面对象模式的基本结构：

```typescript
// pages/LoginPage.ts - 页面对象类
class LoginPage {
  // 元素定位器（私有，对外隐藏）
  private selectors = {
    usernameInput: "#username",
    passwordInput: "#password",
    loginButton: '[data-testid="login-btn"]',
    errorMessage: ".error-message",
  };

  // 业务操作方法（公开，对外暴露）
  async navigate() {
    await page.goto("/login");
  }

  async login(username: string, password: string) {
    await page.fill(this.selectors.usernameInput, username);
    await page.fill(this.selectors.passwordInput, password);
    await page.click(this.selectors.loginButton);
  }

  async getErrorMessage() {
    return await page.textContent(this.selectors.errorMessage);
  }
}

// tests/login.spec.ts - 测试用例
test("登录失败时显示错误提示", async () => {
  const loginPage = new LoginPage();
  await loginPage.navigate();
  await loginPage.login("wrong_user", "wrong_pass");

  const error = await loginPage.getErrorMessage();
  expect(error).toContain("用户名或密码错误");
});
```

测试用例中只关注业务流程和验证逻辑，不涉及元素定位细节，代码清晰易读。

### 进阶结构：BasePage 与组件对象

真实项目里页面对象不会孤立存在，通常分三层组织：

```typescript
// base/BasePage.ts - 公共能力上提
abstract class BasePage {
  constructor(protected page: Page) {}
  protected el(selector: string) {
    return this.page.locator(selector);
  }
  async waitForReady() {
    // 页面就绪的统一等待策略，所有页面类复用
    await this.page.waitForLoadState("networkidle");
  }
}

// components/NavBar.ts - 组件对象：跨页面复用的 UI 片段
class NavBar {
  constructor(private page: Page) {}
  async openCart() {
    await this.page.click('[data-testid="nav-cart"]');
    return new CartPage(this.page);
  }
}

// pages/ProductPage.ts - 页面对象组合组件对象
class ProductPage extends BasePage {
  private nav = new NavBar(this.page);

  async addFirstProductToCart() {
    await this.waitForReady();
    await this.el('[data-testid="product-item"]').first().click();
    await this.el("#add-cart").click();
    return this.nav.openCart(); // 返回下一个页面对象，支持链式流转
  }
}
```

分层后的判断标准：**一个逻辑页面一个 Page 类，一个跨页面复用的 UI 片段一个 Component 类，公共行为上提到 BasePage**。导航栏改版只改 `NavBar` 一个文件，这是复用；页面跳转方法返回下一个页面对象，用例里 `productPage.addFirstProductToCart()` 一路读下去就是业务流程，这是可读性。

## 面试怎么说

"页面对象模式是我在UI自动化测试中必用的设计模式。简单来说，就是为每个页面创建一个类，把元素定位和操作方法封装在里面。

在实际项目中，比如电商系统，我会创建LoginPage、ProductPage、CartPage、CheckoutPage等页面对象。这样做有几个好处：

第一，维护成本低。当开发改了登录按钮的定位器，我只需要改LoginPage这一个文件，几十个登录相关的测试用例都不用动。

第二，代码复用性高。登录操作可能被上百个测试用例用到，封装成方法后，一行代码就能完成登录。

第三，测试用例可读性强。看测试代码就像看业务流程，`loginPage.login()`比`page.fill('#username', 'xxx')`更易理解。

我认为页面对象模式的核心原则是：页面对象只暴露业务方法，不暴露元素细节；断言放在测试用例中，不放在页面对象中。"

## 易错点

1. **在页面对象中写断言**：断言属于验证逻辑，应放在测试用例中，页面对象只负责操作

2. **暴露过多内部元素**：将所有元素选择器public暴露，破坏封装性，应保持private并提供操作方法

3. **一个页面对象对应多个页面**：每个页面对象应只对应一个逻辑页面，职责要单一

4. **过度封装**：将复杂业务流程放在页面对象中，应保持方法粒度适中，复杂流程可封装为业务流程类

5. **忽略页面状态管理**：页面操作后未验证页面状态，导致后续操作在错误页面执行

6. **硬编码等待时间**：在页面对象中使用`sleep()`，应使用显式等待

7. **返回void的操作方法**：操作方法应返回页面对象实例（链式调用）或新页面对象，便于测试流转

8. **简历误用："我用 POM 管理了几百个页面"**
   - 面试官会追问"页面对象里放没放断言""组件怎么复用""等待策略怎么统一"，答不出分层细节就是背概念
   - 常见翻车现场：把 `sleep(3)` 封装进每个方法、页面对象里写 `expect` 断言，被问"为什么改一个文案十几个用例一起挂"就暴露了封装失效
   - 加分表述：能讲清 Page / Component / BasePage 三层各自放什么，以及"断言只在用例层、等待收敛在页面对象层"这两条红线

## 混淆概念

| 概念                          | 区别                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| **页面对象 vs 组件对象**      | 页面对象对应整个页面，组件对象对应可复用的UI组件（如导航栏、弹窗）     |
| **页面对象 vs 测试数据**      | 页面对象封装操作逻辑，测试数据应单独管理（如使用Builder模式或Fixture） |
| **页面对象 vs 业务流程对象**  | 页面对象处理单页面操作，业务流程对象编排多个页面对象完成端到端流程     |
| **POM vs Screenplay Pattern** | POM以页面为中心，Screenplay以用户任务为中心，是不同的设计理念          |
| **POM vs BDD**                | POM是代码层面的设计模式，BDD是测试用例编写方法，两者可结合使用         |

## 自测题

1. **基础题**：页面对象应该暴露什么？隐藏什么？

2. **应用题**：如果一个登录流程包含输入用户名、密码、点击登录、处理验证码、处理安全问答，这些逻辑应该如何分层？

3. **设计题**：一个购物车页面同时有商品列表和结算按钮，是否需要拆分为多个对象？为什么？

4. **优化题**：以下代码有什么问题？如何改进？

```typescript
class LoginPage {
  async login(user, pass) {
    await page.fill("#user", user);
    await page.fill("#pass", pass);
    await page.click("#login");
    expect(await page.url()).toContain("dashboard");
  }
}
```

## 面试官追问

**追问 1：「等待逻辑应该放在页面对象里还是用例里？」**

> 参考回答：放页面对象里，且统一收敛。用例不应该知道页面加载的技术细节——`login()` 这个方法返回时，页面就该处于"可以开始断言"的状态，比如已跳转 URL 或关键元素可见。实现上优先用 Playwright 的自动等待和 `expect(...).toBeVisible()` 这类条件等待，并直接在 lint 规则里禁用 `sleep`。只有等待本身是被测行为时才上提到用例层，比如"验证轮播图 5 秒后自动切第二帧"。

**追问 2：「页面对象类越来越臃肿、方法几十个，怎么治理？」**

> 参考回答：三个手段。一是拆组件对象：表单、表格、分页器、弹窗拆出去，页面类只保留页面级编排；二是按业务域分组操作方法：商品页拆成"浏览""加购""收藏"几组，用例按需组合；三是审查方法粒度：一个方法对应一个用户意图（`search(keyword)`），而不是一个元素动作（`clickSearchButton()`）。臃肿的本质是把"页面上所有可能的操作"都堆进去，正确思路是"被用例用到的操作才进对象"——没人用的方法进对象，就是纯维护负债。

**追问 3：「录制回放工具直接生成脚本，还需要手写 POM 吗？」**

> 参考回答：两者解决不同问题。录制工具解决"从 0 到 1 快速生成"，产出元素定位和动作序列，适合探索场景、快速拿初稿定位器；POM 解决"从 1 到 100 的维护性"，是代码组织策略。落地姿势是"录制生成初稿 → 重构成页面对象 → 语义化命名、等待收敛、组件抽取"。直接把录制产物当长期资产，一次 UI 改版挂几十个脚本，这正是很多团队"自动化做起来了又荒废"的真实原因——工具效率再高，也替代不了结构设计。

## 关联

- **测试自动化策略**：页面对象模式是UI测试自动化的基础设施
- **设计模式**：封装、单一职责原则的实践应用
- **Selenium/Playwright/Cypress**：主流UI测试框架都推荐使用页面对象模式
- **关键字驱动测试**：页面对象可作为关键字驱动测试的底层实现
- **测试金字塔**：页面对象模式主要用于UI层测试，可与API层测试结合构建完整测试体系
