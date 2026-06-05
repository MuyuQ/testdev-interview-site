---
title: "Fixture 策略"
description: "Pytest 夹具设计：作用域选择、依赖注入、数据隔离的实战应用"
category: "coding"
difficulty: "interview"
interviewWeight: 3
tags: ["pytest", "测试框架", "夹具设计", "依赖注入"]
relatedSlugs: ["tech/api-testing", "glossary/api-assertion", "coding/mock-strategy"]
selfTests:
  - id: "fixture-strategy-q1"
    question: "fixture 的 function 作用域有什么特点？"
    options: ["每个测试函数执行前后都会创建和销毁", "整个模块只创建一次", "整个会话只创建一次", "手动控制创建时机"]
    correctIndex: 0
    explanation: "function 作用域是默认值，每个测试函数都会触发 fixture 的 setup 和 teardown。"
  - id: "fixture-strategy-q2"
    question: "如何实现 fixture 的依赖注入？"
    options: ["在 fixture 参数中声明其他 fixture 名称", "使用 import 导入", "通过全局变量共享", "使用类继承"]
    correctIndex: 0
    explanation: "Pytest 通过参数声明实现依赖注入，在 fixture 函数的参数中声明需要的 fixture 名称即可自动注入。"
  - id: "fixture-strategy-q3"
    question: "autouse=True 的 fixture 适用什么场景？"
    options: ["所有测试都需要的前置条件", "仅部分测试需要", "性能敏感场景", "需要参数化的场景"]
    correctIndex: 0
    explanation: "autouse=True 适用于全局性的前置条件，如数据库连接、测试数据准备等所有测试都需要的场景。"
---

## 1. 题目描述

设计一个测试夹具系统，支持不同作用域的资源管理、依赖注入和数据隔离。需要处理数据库连接、测试数据准备、临时文件等测试资源，确保测试之间相互独立且高效执行。

## 2. 考察点

- **作用域选择**：理解 function/module/class/package/session 五种作用域的使用场景
- **依赖注入**：通过参数声明实现 fixture 之间的依赖关系
- **数据隔离**：确保测试数据不互相污染，支持并行测试
- **资源管理**：setup/teardown 的正确实现，资源泄漏防范
- **可测试性设计**：通过 fixture 降低测试代码耦合度

## 3. 输入输出

**输入：**
- 测试用例集合，每个用例有特定的资源需求
- 资源配置（数据库连接串、API 地址等）
- 作用域约束（部分资源需要跨测试共享）

**输出：**
- 正确初始化的测试环境
- 隔离的测试数据
- 测试结束后资源正确清理

## 4. 约束边界

- function 作用域：每个测试函数执行一次 setup/teardown
- module 作用域：每个模块执行一次，适合模块级共享资源
- class 作用域：每个测试类执行一次
- session 作用域：整个测试会话只执行一次，适合昂贵的资源初始化
- 作用域嵌套：子作用域可以访问父作用域的 fixture

## 5. 设计思路

### 作用域选择原则

```python
# 昂贵资源用 session/module 作用域
@pytest.fixture(scope="session")
def database():
    """整个测试会话共享一个数据库连接池"""
    db = create_connection_pool()
    yield db
    db.close()

# 每个测试独立的数据用 function 作用域
@pytest.fixture(scope="function")
def clean_user_table(database):
    """每个测试前清空用户表，保证数据隔离"""
    database.execute("TRUNCATE TABLE users")
    yield database
    database.execute("TRUNCATE TABLE users")  # 测试后也清理
```

### 依赖注入模式

```python
# fixture 通过参数声明依赖其他 fixture
@pytest.fixture
def user_factory(database):
    """依赖注入：自动获取 database fixture"""
    created_users = []

    def create_user(**kwargs):
        user = database.insert("users", kwargs)
        created_users.append(user)
        return user

    yield create_user

    # teardown: 清理创建的测试数据
    for user in created_users:
        database.delete("users", user["id"])
```

### 数据隔离策略

```python
# 方案一：事务回滚
@pytest.fixture
def db_session(database):
    """每个测试用事务包装，测试后回滚"""
    session = database.begin_transaction()
    yield session
    session.rollback()

# 方案二：独立数据库
@pytest.fixture(scope="function")
def isolated_db():
    """每个测试使用独立的数据库实例"""
    db_name = f"test_db_{uuid.uuid4()}"
    database.create_database(db_name)
    yield database.connect(db_name)
    database.drop_database(db_name)
```

## 6. 最小实现

```python
import pytest
from typing import Generator, Callable

# Session 作用域：昂贵资源全局共享
@pytest.fixture(scope="session")
def app_config() -> dict:
    """应用配置，整个会话只加载一次"""
    return {
        "database_url": "postgresql://localhost/test",
        "api_base_url": "http://localhost:8080",
        "timeout": 30
    }

# Module 作用域：模块级共享
@pytest.fixture(scope="module")
def api_client(app_config) -> Generator:
    """API 客户端，模块内所有测试共享"""
    client = APIClient(app_config["api_base_url"])
    yield client
    client.close()

# Function 作用域：每个测试独立
@pytest.fixture
def test_data(api_client) -> Generator[dict, None, None]:
    """测试数据，每个测试独立，自动清理"""
    # Setup: 创建测试数据
    data = {
        "user": api_client.create_user(name="test_user"),
        "order": api_client.create_order(user_id=1, amount=100)
    }
    yield data
    # Teardown: 自动清理
    api_client.delete_user(data["user"]["id"])
    api_client.delete_order(data["order"]["id"])

# 工厂模式 fixture
@pytest.fixture
def order_factory(api_client) -> Callable:
    """订单工厂，支持灵活创建测试数据"""
    orders = []

    def create(**kwargs):
        order = api_client.create_order(**kwargs)
        orders.append(order)
        return order

    yield create

    # 清理所有创建的订单
    for order in orders:
        api_client.delete_order(order["id"])
```

## 7. 测试用例

```python
def test_user_creation(test_data):
    """测试用户创建 - 自动获取 test_data fixture"""
    assert test_data["user"]["name"] == "test_user"
    assert test_data["user"]["id"] is not None

def test_order_creation(test_data, api_client):
    """测试订单创建 - 多 fixture 注入"""
    order = test_data["order"]
    assert order["amount"] == 100
    # 验证订单属于用户
    user_orders = api_client.get_user_orders(test_data["user"]["id"])
    assert order["id"] in [o["id"] for o in user_orders]

def test_order_factory_pattern(order_factory):
    """测试工厂模式 fixture"""
    order1 = order_factory(user_id=1, amount=50)
    order2 = order_factory(user_id=1, amount=150)

    assert order1["amount"] == 50
    assert order2["amount"] == 150
    # fixture teardown 会自动清理所有创建的订单

class TestUserAPI:
    """类级别测试 - 演示 class 作用域"""

    @pytest.fixture(scope="class")
    def class_data(cls, api_client):
        """类级别 fixture，类内所有测试共享"""
        user = api_client.create_user(name="class_user")
        yield user
        api_client.delete_user(user["id"])

    def test_class_fixture_shared(self, class_data):
        """类内第一个测试"""
        assert class_data["name"] == "class_user"

    def test_class_fixture_reuse(self, class_data):
        """类内第二个测试 - 共享同一个 class_data"""
        assert class_data["name"] == "class_user"
```

## 8. 可扩展点

1. **参数化 fixture**：使用 `params` 参数支持多场景测试
2. **异步 fixture**：支持 `async def` 配合 pytest-asyncio
3. **fixture 组合**：创建高级 fixture 组合多个低级 fixture
4. **conftest.py**：合理组织 fixture 到不同的 conftest 文件
5. **fixture 标记**：使用 `@pytest.mark` 对 fixture 进行分类管理
6. **动态 fixture**：使用 `request.param` 实现条件化 fixture 行为

## 9. 面试讲解

"在测试框架设计中，我非常重视 Fixture 策略的设计。核心思路是通过合理的作用域选择、依赖注入和数据隔离来提高测试的可维护性和执行效率。

**作用域选择**上，我会根据资源的创建成本和使用频率来决定。数据库连接池这种昂贵资源用 session 作用域，整个测试会话只初始化一次；而每个测试需要独立的测试数据，就用 function 作用域，确保测试之间互不影响。

**依赖注入**是 pytest fixture 的精髓。我只需要在 fixture 参数中声明需要的其他 fixture 名称，pytest 会自动按依赖顺序注入。这让测试代码非常简洁，也方便 mock 和替换依赖。

**数据隔离**我有两种常用策略：一是事务回滚，每个测试用事务包装，测试后自动回滚；二是使用独立数据库或 schema，每个测试用独立的命名空间。这样就能安全地并行执行测试。"

## 10. 追问

1. **fixture 作用域越小性能越差，如何平衡？**
   - 分析资源的创建成本和共享风险
   - 对于无状态的只读资源，大胆使用大作用域
   - 对于有状态的资源，权衡隔离需求和性能开销

2. **多个 fixture 有依赖顺序时，pytest 如何处理？**
   - pytest 通过参数声明自动解析依赖图
   - 按照依赖顺序执行 setup，逆序执行 teardown
   - 循环依赖会报错，需要重构 fixture 结构

3. **如何处理 fixture 中的异常？**
   - yield 之前的异常会阻止测试执行
   - yield 之后的异常（teardown 阶段）会被捕获并报告
   - 使用 try-finally 确保资源清理

## 11. 关联

- **Mock 策略**：fixture 与 mock 配合实现依赖替换
- **API 测试**：fixture 提供 API 客户端和测试数据
- **参数化测试**：fixture 的 params 与 @pytest.mark.parametrize 配合
- **测试并行**：数据隔离是实现并行测试的前提
- **工厂模式**：fixture 工厂是测试数据管理的最佳实践