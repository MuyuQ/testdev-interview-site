---
title: "Playwright Web 自动化项目模板"
description: "适合练习页面对象、稳定定位、trace 和并发执行。"
category: "practice-template"
difficulty: "interview"
interviewWeight: 2
tags: ["模板", "Playwright", "Web 自动化"]
templateType: "engineering"
targetScenario: "围绕登录、搜索、提交流程搭一个可持续维护的 Web 自动化骨架。"
includes:
  - "测试分层、选择器策略和上下文复用。"
  - "trace、截图和失败录像。"
  - "并发执行和环境参数切换。"
howToUse:
  - "先只覆盖 2 到 3 条关键业务流。"
  - "把页面动作和业务断言分开，控制维护成本。"
  - "在 CI 环境验证 Headless 稳定性。"
extensionIdeas:
  - "加入 mock、网络拦截和权限账号矩阵。"
  - "设计简单的回归任务入口页。"
---

## 模板使用说明

这个模板用于练习搭建一个基于 Playwright 的 Web 自动化测试项目。Web 自动化相比接口自动化更复杂：涉及页面交互、元素定位、等待策略、浏览器兼容性等问题。通过这个项目练习，你可以掌握 Web 自动化的核心技能，并理解如何设计一个可持续维护的自动化框架。

## 项目骨架

### 目录结构

```
web_automation/
├── config/              # 环境配置
│   ├── base.yaml
│   └── environments/
├── pages/               # 页面对象（POM）
│   ├── base_page.py     # 页面基类
│   ├── login_page.py    # 登录页
│   └── order_page.py    # 订单页
├── tests/               # 测试用例
│   ├── conftest.py      # 全局 Fixture
│   ├── test_login.py
│   └── test_order.py
├── utils/               # 工具函数
│   ├── locators.py      # 元素定位器
│   └── helpers.py       # 辅助函数
├── test-results/        # 测试结果
├── playwright-report/   # Playwright 报告
└── playwright.config.ts # Playwright 配置
```

### 第一步：页面对象模型（POM）

**目标**：将页面元素和操作封装为对象，降低维护成本。

**关键实现**：

- **页面基类**：封装通用操作（点击、输入、等待、截图），所有页面继承基类。
- **页面类**：每个页面对应一个类，包含元素定位器和页面操作。如 `LoginPage` 包含 username_input、password_input、login_button 的定位器，以及 login() 方法。
- **元素定位器**：使用 `locators.py` 集中管理定位器，避免散落在代码中。优先使用 data-testid 属性，其次使用 role/text，最后使用 CSS/XPath。
- **操作与断言分离**：页面类只负责页面操作（点击、输入、导航），断言写在测试用例中。这样页面类可复用，断言可灵活组合。

### 第二步：稳定定位与等待策略

**目标**：减少 flaky test，提高测试稳定性。

**关键实现**：

- **定位器优先级**：data-testid > role > text > CSS > XPath。data-testid 最稳定，不受样式和布局变化影响。
- **自动等待**：Playwright 内置自动等待机制，元素可见且可操作时才执行点击。避免手动 sleep。
- **显式等待**：对于特殊场景（如动画完成后元素才出现），使用 `locator.wait_for()` 显式等待条件满足。
- **重试机制**：测试失败时自动重试 1-2 次，排除偶发性问题。但要注意重试可能掩盖真正的问题，需配合 trace 分析。

### 第三步：Trace 与失败诊断

**目标**：测试失败时提供完整的诊断信息。

**关键实现**：

- **Trace 录制**：Playwright 配置中开启 trace 录制，测试失败时自动保存 trace 文件。Trace 包含每一步操作、截图、网络请求、控制台日志。
- **失败截图**：每个测试用例失败时自动截图，截图名包含用例名和时间戳，方便关联。
- **视频录制**：关键测试用例开启视频录制，完整记录测试过程。视频文件较大，建议只对核心流程开启。
- **Trace 查看**：使用 `playwright show-trace` 命令查看 trace 文件，可回放每一步操作，快速定位失败原因。

### 第四步：并发执行与环境切换

**目标**：提高测试执行效率，支持多环境测试。

**关键实现**：

- **并发执行**：Playwright 支持多浏览器实例并行执行测试。配置 `fullyParallel: true` 开启并发。注意测试之间要数据隔离，避免并发冲突。
- **环境切换**：通过环境变量或命令行参数切换测试环境（dev/test/staging）。配置文件中定义各环境的 base_url 和测试账号。
- **浏览器配置**：支持 Chromium、Firefox、WebKit 多浏览器测试。CI 中优先使用 Chromium Headless，本地调试可使用 headed 模式。
- **CI 集成**：GitHub Actions / Jenkins 中配置 Playwright 执行环境，安装浏览器依赖，执行测试后上传报告和 trace。

## 练习建议

1. **选简单目标练习**：如登录 + 搜索 + 提交表单，覆盖核心交互。
2. **先写手动测试步骤**：明确每一步操作和预期结果，再转化为自动化代码。
3. **优先覆盖关键流程**：不要追求 100% 覆盖，先覆盖最重要的 2-3 条业务流。
4. **定期维护定位器**：页面变更后及时更新定位器，避免测试批量失败。

## 面试高频问题

- 「UI 自动化怎么减少 flaky test？」→ 稳定定位器 + 自动等待 + 数据隔离 + 失败重试 + trace 分析。
- 「POM 模式的优势？」→ 页面变化时只需修改页面类，测试用例不受影响。操作复用，减少重复代码。
- 「UI 自动化和接口自动化怎么选？」→ 接口自动化覆盖业务逻辑，效率高。UI 自动化覆盖用户视角，验证端到端流程。按测试金字塔比例投入。
- 「Playwright 和 Selenium 的区别？」→ Playwright 内置自动等待、支持多标签页、原生支持 API 拦截、执行速度更快。Selenium 生态更成熟、浏览器支持更广。
