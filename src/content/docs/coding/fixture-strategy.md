---
title: "Fixture 设计题"
description: "答题重点是作用域、复用层次和前后置管理。"
category: "coding"
difficulty: "interview"
interviewWeight: 2
tags: ["Fixture", "Pytest", "框架设计"]
selfTests:
  - id: "fixture-scope-selection"
    question: "Fixture 作用域应该如何选择？"
    options:
      - "全部使用 function 作用域"
      - "全部使用 session 作用域"
      - "根据资源特性选择：全局共享用 session，模块共享用 module，需要隔离用 function"
      - "随机选择作用域"
    correctIndex: 2
    explanation: "Fixture 作用域应根据资源特性选择：session 用于全局共享资源（环境配置、数据库连接），module 用于模块内共享（登录态），function 用于需要隔离的资源（测试数据）。"
  - id: "fixture-cleanup-design"
    question: "Fixture 的清理逻辑应该写在哪里？"
    options:
      - "写在测试用例中"
      - "写在 yield 关键字之后"
      - "写在 yield 关键字之前"
      - "不需要清理"
    correctIndex: 1
    explanation: "使用 yield 实现前后置分离，yield 前是准备逻辑，yield 后是清理逻辑。清理逻辑放在 yield 后确保即使测试失败也能执行清理。"
  - id: "fixture-dependency-chain"
    question: "Fixture 依赖链的执行和清理顺序是什么？"
    options:
      - "准备和清理顺序相同"
      - "Fixture A 依赖 B：B 准备 → A 准备 → 测试执行 → A 清理 → B 清理"
      - "所有 Fixture 同时准备和清理"
      - "清理顺序是随机的"
    correctIndex: 1
    explanation: "Fixture 依赖链执行顺序是 B 的准备 → A 的准备 → 测试执行 → A 的清理 → B 的清理。清理顺序与准备顺序相反，确保依赖正确释放。"
---

## 题目背景

这道题考察的是测试框架的工程化设计能力。面试官想知道你能否从全局视角组织测试代码，而不是只会写单个测试函数。[Fixture](/testdev-interview-site/glossary/fixture/) 是 Pytest 的核心特性，涉及资源管理、依赖注入、前后置处理等概念。好的 Fixture 设计能让测试代码简洁、可维护、运行高效。这道题属于设计类题目，重点在于展示你对职责拆分、作用域选择、依赖管理和清理流程的理解，而不是写出完美代码。

## 解题思路

- 第一步：职责拆分。

识别项目中需要 Fixture 支撑的能力：登录态、环境配置、测试数据、浏览器实例、数据库连接等，每个职责独立一个 Fixture。

- 第二步：作用域选择。根据资源特性选择作用域：session 用于全局共享资源（环境配置、数据库连接），module 用于模块内共享（登录态），function 用于需要隔离的资源（测试数据、临时文件）。
- 第三步：依赖管理。Fixture 可以依赖其他 Fixture，形成依赖链。\n\n比如登录态 Fixture 依赖环境配置 Fixture，测试数据 Fixture 依赖数据库连接 Fixture。依赖关系要清晰透明。
- 第四步：清理设计。使用 yield 关键字实现前后置分离，yield 前是准备逻辑，yield 后是清理逻辑。清理要覆盖数据库回滚、文件删除、会话关闭等场景。
- 权衡考虑：速度与隔离性的平衡。大作用域（session/module）提升速度但降低隔离性，小作用域（function）隔离性好但速度慢。要根据资源特性合理选择。

## 示例代码：Fixture 分层设计

```python
# conftest.py - Fixture 分层设计
import pytest
from utils.http_client import HttpClient

# ========== 工具层 Fixture (session 级) ==========
@pytest.fixture(scope="session")
def config(request):
    """会话级配置"""
    env = request.config.getoption("--env", default="test")
    return {"base_url": f"https://{env}-api.example.com", "env": env}

@pytest.fixture(scope="session")
def db(config):
    """会话级数据库连接"""
    from utils.db_helper import DatabaseHelper
    helper = DatabaseHelper(
        host="localhost", port=5432,
        dbname=f"{config['env']}_db",
        user="test_user", password="test_pass",
    )
    yield helper
    helper.close()  # 清理：关闭连接

# ========== 资源层 Fixture (module/function 级) ==========
@pytest.fixture(scope="module")
def api_client(config) -> HttpClient:
    """模块级 API 客户端"""
    client = HttpClient(config["base_url"])
    yield client
    # 清理：关闭 session

@pytest.fixture(scope="function")
def test_user(api_client):
    """函数级测试用户 - 每个测试独立"""
    resp = api_client.post("/users", json={"name": "test_user"})
    user_id = resp["body"]["id"]
    yield {"id": user_id, "name": "test_user"}
    # 清理：删除测试用户
    api_client.delete(f"/users/{user_id}")

# ========== 请求层 Fixture (function 级) ==========
@pytest.fixture(scope="function")
def auth_client(api_client, test_user):
    """已认证的请求客户端"""
    login_resp = api_client.post("/login", json={
        "username": test_user["name"],
        "password": "default_pass",
    })
    api_client.set_token(login_resp["body"]["token"])
    yield api_client
```

## 代码逻辑（流程描述）

核心逻辑分三层设计：

第一层：工具层 Fixture。提供基础能力，如日志初始化、配置加载、数据库连接。作用域通常为 session，在测试会话开始时创建，结束时关闭。准备阶段：加载配置、初始化连接、设置日志。清理阶段：关闭连接、清理临时资源。

第二层：资源层 Fixture。提供业务资源，如登录态、测试账号、测试数据。作用域根据需求选择，登录态通常为 module（每个测试模块重新登录），测试数据通常为 function（每个测试独立数据）。准备阶段：调用登录接口获取 token、创建测试数据记录。清理阶段：清理测试数据、释放账号。

第三层：请求层 Fixture。为每个请求提供上下文，如请求客户端、请求头注入。作用域通常为 function。准备阶段：创建请求客户端、注入认证信息。清理阶段：无需特殊清理（随测试结束自动释放）。

yield 清理流程：Fixture 函数在 yield 处暂停，返回资源给测试使用。测试执行完成后，继续执行 yield 后的清理代码。清理逻辑要放在 yield 后，确保即使测试失败也能执行清理。

示例流程：数据库 Fixture → 创建连接 → yield 返回连接对象 → 测试使用连接 → 测试结束 → 执行清理（关闭连接、回滚事务）。

依赖链执行顺序：Fixture A 依赖 Fixture B，执行顺序是 B 的准备 → A 的准备 → 测试执行 → A 的清理 → B 的清理。清理顺序与准备顺序相反，确保依赖正确释放。

## 常见失分点

- 【失分点 1】所有 Fixture 混在一起：把登录、数据、配置、浏览器等全部写在一个 conftest.py 里，导致文件臃肿、职责不清。改进：按职责拆分到不同 conftest.py 或 Fixture 文件，每个 Fixture 只负责一件事。
- 【失分点 2】作用域选择错误：全部用 function 作用域（导致登录等昂贵操作重复执行）或全部用 session 作用域（导致数据污染、状态残留）。改进：根据资源特性选择作用域，全局共享用 session，模块共享用 module，需要隔离用 function。
- 【失分点 3】没有清理逻辑：只写准备代码，yield 后没有清理，导致数据库数据残留、临时文件堆积、连接未关闭。改进：每个需要清理的 Fixture 都要在 yield 后写清理逻辑，确保测试结束后环境干净。
- 【失分点 4】命名不清晰：Fixture 命名为 db、client、data 等泛泛名称，阅读时不知道具体是什么资源。改进：命名要体现资源特性，如 db_connection、auth_token、test_order_data。
- 【失分点 5】依赖关系混乱：Fixture 依赖链不透明，阅读代码时不知道一个 Fixture 依赖了哪些其他 Fixture。改进：在 Fixture 定义处用参数明确列出依赖，并在文档或注释中说明依赖关系。

## 进阶讨论

### Fixture 和 conftest 怎么组织？

根目录 conftest.py 放全局 Fixture（环境配置、日志初始化），各模块目录的 conftest.py 放模块专用 Fixture（该模块的登录态、数据准备）。命名上，通用 Fixture 用 base\_ 前缀，业务 Fixture 用业务场景前缀。这样既避免全局膨胀，又保证 Fixture 作用域清晰。

### 多环境配置怎么切换？

配置 Fixture 通过环境变量或命令行参数选择环境（dev/test/staging）。设计上，配置数据用字典或 dataclass 结构化存储，Fixture 根据参数加载对应配置文件。切换时只需传递 --env=staging 参数，无需修改代码。

### Fixture 如何复用？

复用策略有三层：

一是通过 conftest.py 自动发现，同目录及子目录的测试都能使用。

二是通过 autouse=True 自动应用到所有测试（谨慎使用，避免隐形依赖）。

三是通过参数化 Fixture，一个 Fixture 支持多种场景（如登录态 Fixture 支持普通用户和管理员用户）。

关键是复用要显式、可控，避免隐形副作用。
