---
title: "夹具"
description: "掌握 Pytest fixture 的三种作用域、setup/teardown 机制与依赖注入模式，解决测试数据准备与环境清理的重复代码问题。"
category: "glossary"
difficulty: "beginner"
interviewWeight: 4
tags: ["自动化模式", "Pytest", "测试隔离", "依赖注入", "面试高频"]
relatedSlugs: ["tech/pytest", "glossary/test-isolation", "scenario/web-ui-testing"]
selfTests:
  - id: "fixture-scope-1"
    question: "以下哪个 fixture 作用域会在每个测试函数执行前后都运行？"
    options: ["session", "module", "class", "function"]
    correctIndex: 3
    explanation: "function 作用域是默认值，每个测试函数都会触发 fixture 的 setup 和 teardown。适合需要完全隔离的测试数据。"
  - id: "fixture-yield-2"
    question: "fixture 中 yield 关键字的作用是什么？"
    options: ["定义 fixture 的返回类型", "分隔 setup 和 teardown 代码", "声明 fixture 的作用域", "跳过当前测试"]
    correctIndex: 1
    explanation: "yield 之前的代码是 setup（前置处理），yield 返回的值注入到测试中，yield 之后的代码是 teardown（后置清理）。这是 pytest 实现资源清理的核心机制。"
  - id: "fixture-inject-3"
    question: "测试函数如何使用 fixture？"
    options: ["通过 import 导入", "在参数中声明 fixture 名称", "使用 @fixture 装饰器", "在配置文件中注册"]
    correctIndex: 1
    explanation: "Pytest 通过依赖注入机制，当测试函数参数名与 fixture 名称匹配时，自动将 fixture 返回值注入。这就是为什么说 fixture 是 Pytest 依赖注入的核心实现。"
---

## 一句话定义

**夹具（Fixture）** 是 Pytest 提供的依赖注入机制，用于统一管理测试的前置准备（setup）和后置清理（teardown），通过作用域控制资源的创建和销毁时机。

## 为什么测试开发要关心它

1. **消除重复代码**：数据库连接、测试数据准备、浏览器启动等重复逻辑抽离成 fixture，测试代码专注断言
2. **资源管理标准化**：`yield` 语法糖让 setup/teardown 成对出现，避免资源泄漏
3. **面试必问**：fixture 作用域、依赖注入原理、与 unittest setUp/tearDown 的区别是高频考点
4. **团队协作基础**：conftest.py 中的共享 fixture 是测试框架的核心基础设施

## 它在真实工作流中的位置

```
conftest.py (共享 fixture 定义)
    ↓
test_login.py (测试用例通过参数名注入 fixture)
    ↓
┌─────────────────────────────────────┐
│ fixture setup (数据库连接、测试数据)  │
│    ↓                                │
│ 测试函数执行                         │
│    ↓                                │
│ fixture teardown (清理数据、关闭连接) │
└─────────────────────────────────────┘
    ↓
测试报告
```

## 三种作用域详解

Pytest fixture 支持四种作用域（面试常问）：

| 作用域 | 装饰器 | 生命周期 | 典型场景 |
|--------|--------|----------|----------|
| function | `@pytest.fixture(scope="function")` | 每个测试函数前后 | 默认值，隔离测试数据 |
| class | `@pytest.fixture(scope="class")` | 每个测试类前后 | 类级别共享数据 |
| module | `@pytest.fixture(scope="module")` | 每个模块前后 | 模块共享连接 |
| session | `@pytest.fixture(scope="session")` | 整个测试会话前后 | 全局配置、数据库连接池 |

## 最小例子

```python
# conftest.py - fixture 定义
import pytest

@pytest.fixture
def user_data():
    """每个测试函数独立的测试数据"""
    # setup: 准备数据
    data = {"username": "test_user", "age": 25}
    yield data  # 返回给测试函数
    # teardown: 清理（这里演示，实际可能写入数据库后删除）
    print("清理测试数据")

@pytest.fixture(scope="module")
def db_connection():
    """模块级别共享的数据库连接"""
    print("建立数据库连接")
    conn = {"connected": True}  # 模拟连接对象
    yield conn
    print("关闭数据库连接")
    conn["connected"] = False

# test_user.py - fixture 使用
def test_user_age(user_data):
    assert user_data["age"] == 25

def test_user_name(user_data):
    assert user_data["username"] == "test_user"

class TestUserOperations:
    def test_with_db(self, db_connection, user_data):
        assert db_connection["connected"] is True
        assert user_data["username"] == "test_user"
```

运行测试：

```bash
$ pytest test_user.py -v -s
建立数据库连接
test_user.py::test_user_age PASSED
清理测试数据
test_user.py::test_user_name PASSED
清理测试数据
test_user.py::TestUserOperations::test_with_db PASSED
清理测试数据
关闭数据库连接
```

## 依赖注入机制

Pytest 的 fixture 本质是**依赖注入（Dependency Injection）**：

```python
# 测试函数不需要知道 fixture 如何创建对象
def test_login(auth_token, browser):  # 两个 fixture 自动注入
    browser.get("https://example.com")
    browser.add_cookie({"name": "token", "value": auth_token})
    assert "dashboard" in browser.current_url

# fixture 可以依赖其他 fixture（依赖链）
@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

@pytest.fixture
def auth_token(browser):  # 注入 browser fixture
    browser.get("https://example.com/login")
    # ... 登录获取 token
    return "fake_token_123"
```

## 面试怎么说

**面试官问**：「请介绍一下 Pytest 的 fixture 机制？」

**参考回答**：

> Fixture 是 Pytest 的核心特性，本质上是一个依赖注入机制。它解决了测试中三个问题：
>
> 第一，**资源管理**：通过 `yield` 语法，setup 和 teardown 成对定义，资源不会泄漏。比如数据库连接、浏览器实例这些昂贵资源可以复用。
>
> 第二，**作用域控制**：有四种作用域——function、class、module、session。function 级别每个测试前后都执行，session 级别整个测试会话只执行一次，适合全局配置。
>
> 第三，**依赖注入**：测试函数声明参数名，Pytest 自动匹配同名 fixture 并注入返回值。fixture 还可以依赖其他 fixture，形成依赖链。
>
> 在我们项目中，我把数据库连接、测试数据工厂、认证 token 都抽成 fixture 放在 conftest.py 里，测试代码非常干净。

## 易错点

### 1. 作用域选错导致测试污染

```python
# 错误：用 function 作用域共享可变状态
@pytest.fixture  # 默认 function，每个测试都新建
def shared_list():
    return []

def test_a(shared_list):
    shared_list.append(1)  # 修改了

def test_b(shared_list):
    # 这里是空列表，因为 function 作用域重新创建了
    assert len(shared_list) == 0  # 通过！

# 但如果改成 module 作用域，test_b 就会失败
@pytest.fixture(scope="module")
def shared_list():
    return []
```

### 2. 忘记 yield 导致 teardown 不执行

```python
# 错误：用 return 而不是 yield
@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    return driver  # 后面的代码永远不会执行
    driver.quit()  # 死代码，浏览器不会关闭

# 正确：用 yield
@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    yield driver  # 先返回，测试结束后回来执行
    driver.quit()  # 一定会执行
```

### 3. fixture 循环依赖

```python
# 错误：A 依赖 B，B 依赖 A
@pytest.fixture
def fixture_a(fixture_b):
    return "a" + fixture_b

@pytest.fixture
def fixture_b(fixture_a):
    return "b" + fixture_a

# 运行时报错：Fixture 'fixture_a' not found
```

## 容易混淆的概念

| 概念 | 说明 | 区别 |
|------|------|------|
| fixture vs setUp/tearDown | unittest 的类方法 | fixture 更灵活，支持依赖注入和作用域 |
| fixture vs 工厂函数 | 手动调用创建数据 | fixture 自动注入，生命周期由框架管理 |
| yield vs return | 返回值给测试函数 | yield 后可执行 teardown 代码 |
| conftest.py vs 普通文件 | 共享 fixture 定义 | conftest.py 中的 fixture 自动发现，无需导入 |

## 自测题

### 题目 1：作用域选择

一个 Web UI 自动化项目需要：每个测试用例用独立的浏览器会话，但所有测试共享同一个登录账号的 token。如何设计 fixture 作用域？

<details>
<summary>查看答案</summary>

```python
@pytest.fixture(scope="function")  # 默认值，每个测试独立
def browser():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

@pytest.fixture(scope="session")  # 整个会话共享
def auth_token():
    # 登录一次，返回 token
    token = login_and_get_token()
    yield token
    # 会话结束时可选清理
```

关键点：浏览器需要隔离用 function，登录 token 可以复用用 session。
</details>

### 题目 2：fixture 执行顺序

```python
@pytest.fixture(scope="session")
def setup_session():
    print("A")
    yield
    print("B")

@pytest.fixture(scope="module")
def setup_module():
    print("C")
    yield
    print("D")

@pytest.fixture
def setup_function():
    print("E")
    yield
    print("F")

def test_order(setup_session, setup_module, setup_function):
    print("TEST")
```

运行 `pytest -s` 输出顺序是什么？

<details>
<summary>查看答案</summary>

```
A        # session setup（最先）
C        # module setup
E        # function setup
TEST     # 测试执行
F        # function teardown
D        # module teardown
B        # session teardown（最后）
```

规则：setup 按作用域从大到小，teardown 按作用域从小到大。
</details>

## 关联内容

- **同家族术语**：[测试隔离](/glossary/test-isolation)、[Mock/Stub](/glossary/mock-stub)
- **技术实践**：[Pytest 技术指南](/tech/pytest)
- **应用场景**：[Web UI 测试场景](/scenario/web-ui-testing)
- **进阶概念**：[conftest.py 共享机制](/tech/pytest-conftest)

## 下一步

1. 动手练习：创建一个 conftest.py，定义 session 级别的数据库连接 fixture
2. 深入学习：了解 `autouse=True` 自动应用 fixture 的场景
3. 项目实践：将现有测试中的 setup 代码重构为 fixture