---
title: "Python + Pytest 接口自动化项目模板"
description: "适合练手接口框架结构、断言层、数据驱动和报告输出。"
category: "practice-template"
difficulty: "beginner"
interviewWeight: 3
tags: ["模板", "Pytest", "接口自动化"]
templateType: "engineering"
targetScenario: "用一个最小可运行项目把登录态、业务接口、断言、报告和 CI 串起来。"
includes:
  - "配置管理、请求客户端、鉴权封装。"
  - "分层断言与测试数据组织。"
  - "Pytest Fixture、mark 与报告集成。"
howToUse:
  - "先选一个公开 API 或自建 mock 服务作为练习目标。"
  - "按登录态、业务能力和断言层逐步补功能。"
  - "最后接入 CI，把 smoke 用例跑起来。"
extensionIdeas:
  - "补缓存、重试、签名和异步回调验证。"
  - "加入失败截图或日志聚合能力。"
termLinks:
  - slug: "data-driven-testing"
    term: "数据驱动测试"
  - slug: "fixture"
    term: "Fixture"
  - slug: "api-assertion"
    term: "接口断言"
  - slug: "mock-stub"
    term: "Mock 与 Stub"
---

## 模板使用说明

这个模板用于练习搭建一个完整的 Python + Pytest 接口自动化项目。接口自动化是测试开发的核心技能，这个模板帮你从零开始构建一个结构清晰、可维护、可扩展的接口测试框架。通过实际搭建，你可以深入理解框架设计的各个维度。

## 项目骨架

### 目录结构

```
api_automation/
├── config/              # 配置管理
│   ├── base.yaml        # 基础配置
│   ├── dev.yaml         # 开发环境配置
│   └── test.yaml        # 测试环境配置
├── core/                # 核心封装
│   ├── client.py        # HTTP 请求客户端
│   ├── auth.py          # 鉴权封装（Token 管理）
│   └── assertions.py    # 分层断言
├── data/                # 测试数据
│   ├── test_cases.yaml  # 用例数据
│   └── fixtures/        # 预置数据
├── tests/               # 测试用例
│   ├── conftest.py      # 全局 Fixture
│   ├── test_login.py    # 登录相关用例
│   └── test_order.py    # 订单相关用例
├── reports/             # 测试报告
└── pytest.ini           # Pytest 配置
```

### 第一步：配置管理

**目标**：支持多环境配置切换，敏感信息保护。

**关键实现**：

- 使用 YAML 文件管理配置，按环境拆分（dev/test/staging）。
- 配置加载器读取基础配置后，用环境配置覆盖。
- 敏感配置（密码、密钥）通过环境变量注入，不写在配置文件中。
- 配置加载时校验必填项，缺失时明确报错。

### 第二步：请求客户端与鉴权

**目标**：封装 HTTP 请求，自动处理鉴权。

**关键实现**：

- 基于 requests 库封装请求客户端，统一处理 base_url、headers、timeout。
- 鉴权模块管理 Token 生命周期：获取 Token → 缓存 Token → Token 过期自动刷新。
- 请求客户端自动注入 Token 到请求头，测试用例无需关心鉴权细节。
- 支持请求/响应日志记录，失败时自动打印完整上下文。

### 第三步：分层断言

**目标**：设计清晰的断言层级，失败信息完整。

**关键实现**：

- **协议层断言**：状态码、响应头、响应体 schema 结构。通用性强，可跨项目复用。
- **业务层断言**：订单状态、金额计算、业务规则。根据业务定制，但接口统一。
- **断言失败信息**：包含预期值、实际值、字段路径、请求上下文。让排查者无需重新复现。
- 支持软断言（收集所有失败后统一报告）和硬断言（失败立即停止）。

### 第四步：数据驱动与 Fixture

**目标**：用数据驱动减少重复代码，用 Fixture 管理前后置。

**关键实现**：

- 测试数据从 YAML/JSON 文件读取，与测试代码分离。
- 使用 `@pytest.mark.parametrize` 实现数据驱动，一组代码覆盖多组数据。
- Fixture 按作用域组织：session 级（环境配置、数据库连接）、module 级（登录态）、function 级（测试数据）。
- Fixture 依赖链清晰：登录态依赖环境配置，测试数据依赖登录态。

### 第五步：报告与 CI 集成

**目标**：生成可读报告，接入 CI 流水线。

**关键实现**：

- 使用 `pytest-html` 或 `allure-pytest` 生成报告。
- 报告包含：用例执行状态、耗时、失败详情、请求/响应数据。
- CI 配置（GitHub Actions / Jenkins）：拉取代码 → 安装依赖 → 执行测试 → 生成报告 → 通知结果。
- 质量门禁：通过率低于阈值时标记构建失败。

## 练习建议

1. **选公开 API 练习**：如 JSONPlaceholder、ReqRes 等免费 API，无需自建服务。
2. **从登录开始**：先实现登录接口测试，理解鉴权流程。
3. **逐步扩展**：登录 → 查询 → 创建 → 更新 → 删除，覆盖 CRUD 全流程。
4. **练习数据驱动**：用参数化覆盖正常、边界、异常场景。

## 面试高频问题

- 「接口自动化框架怎么设计？」→ 按配置管理 → 请求封装 → 断言层 → 数据驱动 → 报告输出的流程回答。
- 「登录态怎么管理？」→ Token 获取 → 缓存 → 过期刷新，封装在请求客户端中，测试用例无感知。
- 「测试数据怎么组织？」→ 数据与代码分离，YAML/JSON 存储，参数化驱动。
- 「怎么处理接口依赖？」→ 前置接口执行结果通过 Fixture 传递给后续用例，或使用数据工厂生成关联数据。
