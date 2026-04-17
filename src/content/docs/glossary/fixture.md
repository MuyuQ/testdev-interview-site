---
title: "Fixture"
description: "为测试准备和回收环境、数据、依赖对象的机制。"
category: "glossary"
difficulty: "beginner"
interviewWeight: 2
tags: ["Pytest", "测试框架", "自动化"]
term: "Fixture"
shortDefinition: "测试前置和后置逻辑的可复用组织方式。"
definition: "Fixture 用于统一管理测试依赖，例如登录态、数据库连接、环境准备、浏览器实例和测试数据回收。"
whyItMatters: "面试官常用 Fixture 判断候选人是否真正做过框架建设，而不只是会写脚本。"
commonMistakes:
  - title: "所有 Fixture 都做成 function 级别"
    detail: "所有 Fixture 都设为 function 作用域会导致每个测试都重新初始化，执行时间大幅增加。\n\n好的做法是：根据资源成本和隔离需求选择作用域，登录态用 session、数据库连接用 module、测试数据用 function。\n\n面试时要讲清作用域选择原则和性能权衡。"
  - title: "Fixture 嵌套太深"
    detail: "Fixture 嵌套层级过多会让依赖关系难以追踪，阅读成本高。\n\n好的做法是：控制嵌套深度在 2-3 层，复杂依赖拆成多个独立 Fixture 并通过参数注入组合。\n\n面试时要举一个 Fixture 依赖设计的具体案例。"
  - title: "混入大量业务逻辑"
    detail: "Fixture 应专注于环境准备和资源管理，如果混入业务逻辑会导致难以复用和维护。\n\n好的做法是：Fixture 只做环境层（登录态、数据库、浏览器），业务数据准备放在测试代码或 helper 函数。\n\n面试时要讲清 Fixture 与业务逻辑的边界划分。"
confusingTerms:
  - slug: "setup-teardown"
    term: "setup/teardown"
    difference: "setup/teardown 更偏流程概念，Fixture 是可组合、可注入、可设作用域的实现机制。"
frequentQuestions:
  - "Pytest 里你怎么设计通用 Fixture？"
  - "session 级和 function 级 Fixture 怎么取舍？"
answerHints:
  - "通用 Fixture 的设计要围绕「复用性」「可组合性」和「隔离性」三个原则展开。\n\n第一，按资源类型分层设计。我通常分成三层：基础层（数据库连接、配置加载、日志初始化）、业务层（登录态、测试账号、测试数据准备）和场景层（特定业务场景的环境组合）。基础层 Fixture 用 session 作用域全局复用，业务层 Fixture 用 module 或 function 作用域按需复用，场景层 Fixture 通过参数注入组合多层 Fixture。\n\n第二，Fixture 之间要可组合不耦合。每个 Fixture 只做一件事，复杂场景通过 Fixture 参数注入组合，比如登录态 Fixture + 订单数据 Fixture 组成下单场景 Fixture，而不是在一个 Fixture 里做所有准备。\n\n第三，Fixture 要有明确的职责边界。Fixture 只负责环境准备和资源管理，不混入业务逻辑，业务数据准备放在测试代码或 helper 函数。\n\n面试时可以举例：我们的登录态 Fixture 用 session 作用域，整个测试会话只登录一次。数据库连接 Fixture 用 module 作用域，每个测试模块共用一个连接。测试数据 Fixture 用 function 作用域，每个测试独立准备和清理数据。"
  - "session 级和 function 级 Fixture 的取舍原则是「资源成本 vs 隔离需求」。session 级 Fixture 适合「高成本、低隔离」的资源，function 级 Fixture 适合「低成本、高隔离」的资源。具体判断方法有三点：\n\n第一，看资源初始化成本。登录态获取需要调用接口、等待响应，成本高适合 session 级。数据库连接建立需要网络开销，成本中等适合 module 级。测试数据插入一条记录成本很低适合 function 级。\n\n第二，看隔离需求。登录态大部分测试共用，不需要隔离，适合 session 级。测试数据不同测试需要不同数据，必须隔离，适合 function 级。数据库连接如果测试会修改数据需要隔离，但如果只是查询可以共用。\n\n第三，看执行时间权衡。session 级 Fixture 节省初始化时间但隔离性差，function 级 Fixture 隔离性好但初始化开销大，要根据测试总执行时间和失败定位效率权衡。\n\n面试时要强调：不是所有 Fixture 都设成 session 或 function，要根据资源特性选择合适作用域，同时要考虑 Fixture 嵌套深度（控制在 2-3 层），避免依赖关系过于复杂导致维护困难。"
relatedSlugs: ["pytest", "fixture-strategy"]
termLinks:
  - slug: "data-driven-testing"
    term: "数据驱动测试"
  - slug: "mock-stub"
    term: "Mock 与 Stub"
  - slug: "test-environment-management"
    term: "测试环境管理"
selfTests:
  - id: "fixture-1"
    question: "Pytest 中 session 级和 function 级 Fixture 的主要区别是什么？"
    options:
      - "session 级更快，function 级更慢"
      - "session 级整个测试会话只初始化一次，function 级每个测试都初始化"
      - "session 级只能用于数据库，function 级通用"
      - "没有区别，只是名称不同"
    correctIndex: 1
    explanation: "session 级 Fixture 整个测试会话只初始化一次，适合高成本的共享资源；function 级每个测试都重新初始化，适合需要隔离的测试数据。"
  - id: "fixture-2"
    question: "Fixture 嵌套过深会导致什么问题？"
    options:
      - "运行速度变快"
      - "依赖关系难以追踪，阅读成本高"
      - "测试结果更准确"
      - "内存占用减少"
    correctIndex: 1
    explanation: "Fixture 嵌套层级过多会让依赖关系难以追踪，代码阅读和维护成本高。建议控制嵌套深度在 2-3 层。"
  - id: "fixture-3"
    question: "Fixture 应该专注于什么？"
    options:
      - "复杂的业务逻辑处理"
      - "环境准备和资源管理"
      - "测试结果断言"
      - "测试报告生成"
    correctIndex: 1
    explanation: "Fixture 应专注于环境准备和资源管理（如登录态、数据库连接、浏览器实例），不混入业务逻辑，业务数据准备放在测试代码或 helper 函数中。"
---

## 基础入门

Fixture 是 pytest 测试框架中的核心机制，用于统一管理测试依赖。

它的核心作用是：为测试准备前置条件（如登录态、数据库连接、测试数据），并在测试结束后清理资源（如删除测试数据、断开连接）。Fixture 让测试代码更简洁、更复用、更易维护。

举个例子：测试下单功能需要先登录获取 token、准备测试商品、创建测试用户。\n\n如果没有 Fixture，每个测试都要重复写这些准备代码。有了 Fixture，可以把登录、准备商品、创建用户封装成三个 Fixture，测试代码只需声明依赖，pytest 会自动注入。

Fixture 的核心优势有四：

一是作用域灵活（function、module、session）。

二是依赖注入（测试函数通过参数名自动获取 Fixture）。

三是可组合（Fixture 可以依赖其他 Fixture）。

四是资源清理（用 yield 语法在测试后自动清理）。

面试时能讲清作用域选择和依赖注入机制，能体现对 pytest 的深入理解。

## 为什么重要

- 提升代码复用：Fixture 把公共准备逻辑封装一次，多处复用，避免重复代码。
- 提高执行效率：session 级 Fixture 全局复用（如登录态），避免每个测试都重新初始化，大幅减少执行时间。
- 面试高频考点：「Pytest 里你怎么设计通用 Fixture」「session 级和 function 级怎么取舍」是测试开发面试的经典问题。
- 测试隔离保障：function 级 Fixture 保证每个测试独立准备数据，测试间互不影响，失败定位更准确。
- 框架建设能力：面试官常用 Fixture 设计判断候选人是否真正做过框架建设，而不只是会写脚本。

## 前置知识

- Python 基础：理解函数定义、参数传递、装饰器语法（@pytest.fixture）。
- pytest 基础：了解 pytest 测试用例的写法（test\_开头的函数）、assert 断言语法。
- 作用域概念：理解 function、module、session 等作用域的含义，知道不同作用域的生命周期。
- 测试隔离概念：理解为什么测试需要独立数据，知道测试间相互干扰会导致什么问题。
- 资源管理概念：理解「准备 - 使用 - 清理」的资源管理模式，知道测试后清理数据的重要性。

## 学习路径

- 第一阶段：理解概念。学习 Fixture 的定义、作用、基本语法，理解为什么需要 Fixture。
- 第二阶段：基础用法。练习编写简单的 Fixture（如准备测试数据）、使用 yield 清理资源、理解 function 作用域。
- 第三阶段：作用域选择。学习 function、module、session 级 Fixture 的区别，掌握作用域选择原则（成本 vs 隔离）。
- 第四阶段：依赖注入。理解 Fixture 如何通过参数注入被测试使用，学习 Fixture 依赖其他 Fixture 的写法。
- 第五阶段：工程化实践。学习 conftest.py 组织全局 Fixture、Fixture 分层设计、Fixture 与参数化配合。
- 第六阶段：进阶实践。学习 Fixture 动态参数化（request 参数）、Fixture 与插件配合（如 pytest-django、pytest-asyncio）。

## 实操案例：三层 Fixture 设计

场景：某电商测试项目需要设计通用 Fixture 体系，支撑上百个测试用例。

解决方案：三层 Fixture 设计

第一层：基础层 Fixture（session 作用域）

```python
@pytest.fixture(scope="session")
def db_connection():
    """数据库连接，整个测试会话共用"""
    conn = create_connection()
    yield conn
    conn.close()

@pytest.fixture(scope="session")
def auth_token():
    """登录态，整个测试会话只登录一次"""
    token = login("test_user", "password")
    yield token
    logout(token)
```

基础层 Fixture 负责最底层的资源初始化，成本高、隔离需求低，适合 session 作用域。

第二层：业务层 Fixture（module/function 作用域）

```python
@pytest.fixture(scope="module")
def test_user(db_connection):
    """测试用户，每个测试模块共用一个"""
    user = create_user(db_connection)
    yield user
    delete_user(db_connection, user.id)

@pytest.fixture(scope="function")
def test_order(db_connection, test_user):
    """测试订单，每个测试独立一个"""
    order = create_order(db_connection, test_user.id)
    yield order
    delete_order(db_connection, order.id)
```

业务层 Fixture 依赖基础层 Fixture，通过参数注入组合。test_user 用 module 作用域（同一模块复用），test_order 用 function 作用域（每个测试独立）。

第三层：场景层 Fixture（按需组合）

```python
@pytest.fixture
def paid_order(test_order):
    """已支付的订单场景"""
    pay_order(test_order.id)
    yield test_order

@pytest.fixture
def shipped_order(paid_order):
    """已发货的订单场景"""
    ship_order(paid_order.id)
    yield paid_order
```

场景层 Fixture 通过组合多层 Fixture 构建特定业务场景，测试时直接注入使用。

面试表达要点：强调 Fixture 分层原则（基础层 session、业务层 module/function、场景层按需），依赖注入实现组合，作用域选择权衡成本和隔离。

## 实操案例：Fixture 作用域选择

场景：项目中 Fixture 作用域混乱，导致执行时间长、测试不稳定。

解决方案：按资源特性选择作用域

session 作用域（全局复用）
适用场景：

- 登录态获取（调用接口、等待响应，成本高）
- 配置加载（读取配置文件、解析，成本低但全局共用）
- 全局资源（如 Redis 连接池、日志初始化）
  判断标准：初始化成本高、隔离需求低、全局共用安全

module 作用域（模块内复用）
适用场景：

- 数据库连接（建立连接有网络开销，同一模块内可复用）
- API 客户端（初始化耗时，模块内复用）
- 测试数据模板（如商品模板、用户模板，模块内复用）
  判断标准：初始化成本中等、隔离需求中等、模块内复用安全

function 作用域（每个测试独立）
适用场景：

- 测试数据（每个测试需要独立数据，避免相互影响）
- 会修改状态的操作（如下单、支付，测试后需要清理）
- 隔离需求高的资源（如浏览器实例，测试间不能共用）
  判断标准：隔离需求高、成本低或必须独立

面试表达要点：强调作用域选择原则是「资源成本 vs 隔离需求」。session 级节省时间但隔离性差，function 级隔离性好但开销大。要根据资源特性选择合适作用域，同时控制 Fixture 嵌套深度在 2-3 层。

## 常见误区

### 误区一：所有 Fixture 都做成 function 级别

所有 Fixture 都设为 function 作用域会导致每个测试都重新初始化，执行时间大幅增加。

正确做法是：根据资源成本和隔离需求选择作用域，登录态用 session（成本高、无需隔离）、数据库连接用 module（成本中等、模块内复用）、测试数据用 function（隔离需求高）。面试时要讲清作用域选择原则和性能权衡。

### 误区二：Fixture 嵌套太深

Fixture 嵌套层级过多会让依赖关系难以追踪，阅读成本高。

正确做法是：控制嵌套深度在 2-3 层，复杂依赖拆成多个独立 Fixture 并通过参数注入组合。\n\n例如登录态 Fixture 和订单数据 Fixture 独立定义，场景 Fixture 通过参数注入组合两者，而不是在一个 Fixture 里做所有准备。面试时要举一个 Fixture 依赖设计的具体案例。

### 误区三：混入大量业务逻辑

Fixture 应专注于环境准备和资源管理，如果混入业务逻辑会导致难以复用和维护。

正确做法是：Fixture 只做环境层（登录态、数据库、浏览器），业务数据准备放在测试代码或 helper 函数。\n\n例如 Fixture 负责创建订单记录，但订单金额计算逻辑应该放在 helper 函数中。面试时要讲清 Fixture 与业务逻辑的边界划分。

### 误区四：忽略资源清理

测试后不清理数据会导致数据污染、测试相互干扰。

正确做法是：使用 yield 语法在 Fixture 中清理资源，如删除测试数据、断开连接。对于 function 作用域的 Fixture，pytest 会在测试结束后自动执行 yield 后的清理代码。

面试时要强调：Fixture 的清理逻辑和准备逻辑同等重要。

### 误区五：Fixture 命名不清晰

Fixture 名称晦涩难懂会让测试代码可读性变差。

正确做法是：用描述性的名称（如 auth_token、test_user、paid_order），让测试代码一目了然。避免使用 a、b、data 等无意义名称。

面试时要说明：Fixture 命名是测试可维护性的重要体现。

## 面试问答

### Pytest 里你怎么设计通用 Fixture？

通用 Fixture 的设计围绕三个原则：复用性、可组合性、隔离性。

第一，按资源类型分层设计。我通常分成三层：基础层（数据库连接、配置加载、登录态）用 session 作用域全局复用。业务层（测试用户、测试商品）用 module 或 function 作用域按需复用。场景层（已支付订单、已发货订单）通过参数注入组合多层 Fixture。

第二，Fixture 之间可组合不耦合。每个 Fixture 只做一件事，复杂场景通过 Fixture 参数注入组合，如登录态 Fixture + 订单数据 Fixture 组成下单场景 Fixture。

第三，Fixture 有明确的职责边界。Fixture 只负责环境准备和资源管理，不混入业务逻辑。

面试时可以举例：我们的登录态 Fixture 用 session 作用域，整个测试会话只登录一次。测试数据 Fixture 用 function 作用域，每个测试独立准备和清理数据。

### session 级和 function 级 Fixture 怎么取舍？

取舍原则是「资源成本 vs 隔离需求」。session 级 Fixture 适合高成本、低隔离的资源，如登录态（获取需要调用接口、等待响应）。function 级 Fixture 适合低成本、高隔离的资源，如测试数据（每个测试需要独立数据）。

具体判断方法：一看资源初始化成本，成本高优先考虑 session 级。二看隔离需求，需要独立数据用 function 级。三看执行时间权衡，session 级节省时间但隔离性差。

面试时要强调：不是所有 Fixture 都设成 session 或 function，要根据资源特性选择合适作用域，同时控制 Fixture 嵌套深度在 2-3 层。

### Fixture 如何实现依赖注入？

pytest 通过参数名匹配实现依赖注入。测试函数或 Fixture 的参数名如果与某个 Fixture 同名，pytest 会自动注入该 Fixture 的返回值。\n\n例如定义一个 auth_token 的 Fixture 后，任何测试函数只要参数名为 auth_token，就能自动获取登录态。

依赖注入的好处是：测试代码无需显式调用 Fixture，依赖关系清晰。Fixture 可以链式依赖，形成依赖树。

面试时可以举例：test_order Fixture 依赖 test_user，只需把 test_user 作为参数传入，pytest 会先执行 test_user Fixture 再执行 test_order。

### conftest.py 的作用是什么？

conftest.py 是 pytest 的局部配置目录，用于存放可复用的 Fixture 和配置。放在 conftest.py 中的 Fixture 可以被同目录及子目录下的所有测试文件使用，无需显式导入。

好处是：Fixture 集中管理、测试文件无需 import、目录结构清晰。通常做法是：项目根目录的 conftest.py 放全局 Fixture（如数据库连接），模块目录的 conftest.py 放模块级 Fixture（如特定业务的测试数据）。面试时要说明：conftest.py 是 pytest 工程化的重要组成部分。
