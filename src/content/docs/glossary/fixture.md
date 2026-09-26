---
title: "夹具"
description: "掌握 Pytest fixture 的三种作用域、setup/teardown 机制与依赖注入模式，解决测试数据准备与环境清理的重复代码问题。"
category: "glossary"
stage: "foundation"
estimatedMinutes: 18
difficulty: "beginner"
interviewWeight: 3
tags: ["自动化模式", "Pytest", "测试隔离", "依赖注入", "面试高频"]
prerequisites:
  - "tech/pytest"
  - "beginner-course/pytest-first-test"
outcomes:
  - "能写出一个带 setup/teardown 的 Pytest fixture"
  - "能说清 function/session 等不同作用域的差异"
  - "面试时能讲清 fixture 如何用依赖注入减少重复代码"
relatedSlugs: ["tech/pytest", "glossary/mock-stub", "tech/playwright"]
selfTests:
  - id: "fixture-scope-1"
    question: "以下哪个 fixture 作用域会在每个测试函数执行前后都运行？"
    options: ["session", "module", "class", "function"]
    correctIndex: 3
    explanation: "function 作用域是默认值，每个测试函数都会触发 fixture 的 setup 和 teardown。适合需要完全隔离的测试数据。"
  - id: "fixture-yield-2"
    question: "fixture 中 yield 关键字的作用是什么？"
    options:
      [
        "定义 fixture 的返回类型",
        "分隔 setup 和 teardown 代码",
        "声明 fixture 的作用域",
        "跳过当前测试",
      ]
    correctIndex: 1
    explanation: "yield 之前的代码是 setup（前置处理），yield 返回的值注入到测试中，yield 之后的代码是 teardown（后置清理）。这是 pytest 实现资源清理的核心机制。"
  - id: "fixture-inject-3"
    question: "测试函数如何使用 fixture？"
    options:
      [
        "通过 import 导入",
        "在参数中声明 fixture 名称",
        "使用 @fixture 装饰器",
        "在配置文件中注册",
      ]
    correctIndex: 1
    explanation: "Pytest 通过依赖注入机制，当测试函数参数名与 fixture 名称匹配时，自动将 fixture 返回值注入。这就是为什么说 fixture 是 Pytest 依赖注入的核心实现。"
  - id: "fixture-q3"
    question: "以下哪种资源最适合用 session 作用域的 fixture 管理？"
    options:
      [
        "每个用例各自要修改的订单数据",
        "测试结束后必须立即删除的临时记录",
        "整个测试会话只读一次的全局配置",
        "每个用例都需要全新状态的购物车",
      ]
    correctIndex: 2
    explanation: "session 作用域的资源整个测试会话只创建一次，适合开销大且不会被用例修改的全局只读资源（配置、连接池）。会被用例修改的数据放 session 作用域会造成用例间污染，必须留在 function 作用域隔离。"
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

| 作用域   | 装饰器                              | 生命周期         | 典型场景               |
| -------- | ----------------------------------- | ---------------- | ---------------------- |
| function | `@pytest.fixture(scope="function")` | 每个测试函数前后 | 默认值，隔离测试数据   |
| class    | `@pytest.fixture(scope="class")`    | 每个测试类前后   | 类级别共享数据         |
| module   | `@pytest.fixture(scope="module")`   | 每个模块前后     | 模块共享连接           |
| session  | `@pytest.fixture(scope="session")`  | 整个测试会话前后 | 全局配置、数据库连接池 |

**作用域选择的判断口诀：贵不贵、改不改、脏不脏。**

- **贵**（建一次要几秒以上，如数据库连接池、浏览器实例、登录 token）：尽量往上提作用域复用
- **会改**（用例执行中会修改它，如订单记录、购物车状态）：必须留在 function，一个用例一份
- **怕脏**（一旦污染就出现"单独跑过、合起来挂"的偶发失败）：宁可贵一点也要 function

常见折中方案：session 级建**连接池**，function 级从池里借独立连接——贵资源复用，可变数据隔离，两头都占。

再补两个工程上高频的进阶用法：

```python
# autouse=True：不需要用例显式声明就自动生效，适合全局横切逻辑
@pytest.fixture(autouse=True)
def _clean_test_data():
    yield
    # 每个用例结束后自动清理自己产生的数据，防止相互污染
    db.execute("DELETE FROM orders WHERE created_by = 'test'")

# params 参数化：fixture 自身可带参数，同一组用例在多套配置下各跑一遍
@pytest.fixture(params=["mysql", "postgres"], ids=["mysql", "pg"])
def db_dialect(request):
    return request.param

def test_pagination_query(db_dialect):
    # 这个用例会自动执行两次：一次 mysql、一次 postgres
    assert Pagination(db_dialect).page(1).is_ok
```

autouse 的使用纪律：只放"所有用例都该有、且不影响断言结果"的逻辑（清理、日志、环境复位）。需要被断言或被个别用例特殊对待的资源，一律显式声明——否则读用例代码时看不出自己依赖了什么，这是隐式依赖的经典坑。

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

### 4. 简历误用："所有前置数据都用 fixture 管理得井井有条"

面试官听到"所有"就会追问两个细节：你的 fixture 里有没有参数化？多场景的数据变体怎么处理？典型翻车信号：所有 fixture 都是硬编码一份数据、没有工厂函数、没有 params。加分做法是准备一个具体例子：`make_user(**overrides)` 数据工厂 fixture——默认值合理，用例只声明差异字段（`make_user(vip=True)`），并能说清这比每个用例手写完整数据好维护在哪里（字段变更只改工厂一处、用例意图更突出）。

## 容易混淆的概念

| 概念                      | 说明              | 区别                                        |
| ------------------------- | ----------------- | ------------------------------------------- |
| fixture vs setUp/tearDown | unittest 的类方法 | fixture 更灵活，支持依赖注入和作用域        |
| fixture vs 工厂函数       | 手动调用创建数据  | fixture 自动注入，生命周期由框架管理        |
| yield vs return           | 返回值给测试函数  | yield 后可执行 teardown 代码                |
| conftest.py vs 普通文件   | 共享 fixture 定义 | conftest.py 中的 fixture 自动发现，无需导入 |

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

## 面试官追问

**追问 1：「session 作用域的 fixture 被某个用例改了状态，怎么防污染？」**

> 参考回答：分三档处理。第一档约定只读：session 级资源只提供查询能力，写操作全部走 function 级 fixture 建的临时数据。第二档借还模式：session 级只管连接池，每个用例借独立连接、用完归还，数据层面互不可见。第三档防御性校验：在 session fixture 的 teardown 里做完整性检查（比如配置对象被改动就报错），让污染第一时间暴露，而不是变成排查一周的偶发失败。真正不该做的是"因为会互相影响就把所有 fixture 都调成 session 图省事"——那是在用隔离性换执行时间，得不偿失。

**追问 2：「一个用例依赖多个 fixture，执行顺序是什么？」**

> 参考回答：两条规则叠加。第一，作用域大的先执行：session → module → class → function，teardown 反过来，小作用域先清理。第二，同作用域内按依赖链拓扑排序，被依赖的 fixture 先建；没有依赖关系时按用例参数声明顺序执行。所以需要控制顺序时，正确做法不是猜或背规则，而是让 fixture 之间显式声明依赖——依赖链本身就是执行顺序的活文档，比口头约定可靠得多。

**追问 3：「fixture 和直接在测试里写 setup 代码，边界在哪？」**

> 参考回答：判断标准是"这个准备动作是不是多个用例的共同前置"。只在一个用例里用、且和该用例语义强绑定的准备，直接写在用例里反而可读——读者不用跳到 conftest.py 才知道数据长什么样。一旦第二个用例也要用，或者涉及必须成对出现的清理动作，就上提为 fixture。我落地时还有一条硬规则：凡是"创建了环境"的 fixture 必须负责"销毁环境"，yield 后不留悬空资源，这条在 code review 里是一票否决项。

## 关联内容

- **同家族术语**：[测试隔离](/testdev-interview-site/glossary/mock-stub/)、[Mock/Stub](/testdev-interview-site/glossary/mock-stub/)
- **技术实践**：[Pytest 技术指南](/testdev-interview-site/tech/pytest/)
- **应用场景**：[Web UI 测试场景](/testdev-interview-site/tech/playwright/)
- **进阶概念**：[Pytest 共享 fixture 机制](/testdev-interview-site/tech/pytest/)

## 下一步

1. 动手练习：创建一个 conftest.py，定义 session 级别的数据库连接 fixture
2. 深入学习：了解 `autouse=True` 自动应用 fixture 的场景
3. 项目实践：将现有测试中的 setup 代码重构为 fixture
