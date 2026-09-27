---
title: "Fixture 策略"
description: "Pytest 夹具设计：作用域选择、依赖注入、数据隔离的实战应用"
category: "coding"
stage: "practice"
estimatedMinutes: 31
difficulty: "interview"
interviewWeight: 3
tags: ["pytest", "测试框架", "夹具设计", "依赖注入"]
prerequisites:
  - "tech/pytest"
  - "glossary/fixture"
  - "tech/api-testing"
outcomes:
  - "能按成本选对 fixture 的作用域"
  - "能用工厂 fixture 自动清理测试数据"
  - "能讲清并行下 fixture 隔离的注意点"
relatedSlugs:
  ["tech/api-testing", "glossary/api-assertion", "glossary/mock-stub"]
selfTests:
  - id: "fixture-strategy-q1"
    question: "fixture 的 function 作用域有什么特点？"
    options:
      [
        "每个测试函数执行前后都会创建和销毁",
        "整个模块只创建一次",
        "整个会话只创建一次",
        "手动控制创建时机",
      ]
    correctIndex: 0
    explanation: "function 作用域是默认值，每个测试函数都会触发 fixture 的 setup 和 teardown。"
  - id: "fixture-strategy-q2"
    question: "如何实现 fixture 的依赖注入？"
    options:
      [
        "在 fixture 参数中声明其他 fixture 名称",
        "使用 import 导入",
        "通过全局变量共享",
        "使用类继承",
      ]
    correctIndex: 0
    explanation: "Pytest 通过参数声明实现依赖注入，在 fixture 函数的参数中声明需要的 fixture 名称即可自动注入。"
  - id: "fixture-strategy-q3"
    question: "autouse=True 的 fixture 适用什么场景？"
    options:
      [
        "所有测试都需要的前置条件",
        "仅部分测试需要",
        "性能敏感场景",
        "需要参数化的场景",
      ]
    correctIndex: 0
    explanation: "autouse=True 适用于全局性的前置条件，如数据库连接、测试数据准备等所有测试都需要的场景。"
  - id: "fixture-strategy-q4"
    question: "测试失败时，fixture 中 yield 之后的清理代码还会执行吗？"
    options:
      [
        "不会，测试失败就直接跳过清理",
        "会，pytest 保证测试结束后执行 yield 之后的 teardown",
        "只有写在 try/finally 里才会执行",
        "取决于 fixture 作用域大小",
      ]
    correctIndex: 1
    explanation: "pytest 保证 yield 之后的 teardown 在测试结束后执行，无论测试本身是否失败。但如果清理代码自身可能抛异常，仍建议用 try/finally 兜底，避免资源泄漏或清理中断。"
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

## 4. 约束和边界

五种作用域决定了 fixture 的 setup/teardown 触发时机。**结论先行**：作用域越大，创建次数越少、执行越快，但多个测试会共享同一份资源，隔离性越差；作用域越小，隔离越好，但重复初始化会带来性能开销。选型本质是「隔离成本」与「初始化成本」的权衡。

| 作用域     | setup 触发时机     | teardown 触发时机  | 典型场景             | 主要风险           |
| ---------- | ------------------ | ------------------ | -------------------- | ------------------ |
| `function` | 每个测试函数前     | 每个测试函数后     | 测试数据、临时文件   | 高频初始化拖慢执行 |
| `class`    | 每个测试类前       | 每个测试类后       | 类内共享的登录态     | 类内测试互相污染   |
| `module`   | 每个模块前         | 每个模块后         | 模块级客户端、连接池 | 模块内测试共享状态 |
| `package`  | 每个包前           | 每个包后           | 跨模块的共享配置     | 作用域过大，难调试 |
| `session`  | 整个会话前（一次） | 整个会话后（一次） | 数据库、Web 服务进程 | 状态跨测试残留     |

- **作用域嵌套规则**：子作用域的 fixture 可以注入父作用域的 fixture（如 `function` 用 `session` 的资源），但反过来不行。pytest 会按依赖图自动排序 setup，逆序执行 teardown。
- **边界陷阱**：`module`/`session` 级别的 fixture 若修改了共享资源（如往数据库插数据却不清理），会导致「本用例单独跑通过、整轮跑却失败」的经典 flaky 问题。
- **autouse 边界**：`autouse=True` 的 fixture 对所有测试生效，适合全局前置（如日志初始化），但不适合有副作用的操作，否则会拖慢无关测试、增加耦合。

## 5. 设计思路

### 核心机制：yield 分隔 setup 与 teardown

pytest fixture 用 `yield` 关键字把函数一分为二：**yield 之前是 setup（准备资源），yield 之后是 teardown（清理资源）**。测试代码拿到的就是 yield 返回的值。

```python
# 昂贵资源用 session 作用域：整个会话只初始化一次
@pytest.fixture(scope="session")
def database():
    """整个测试会话共享一个数据库连接池"""
    db = create_connection_pool()
    yield db          # 把连接池交给测试用
    db.close()        # 全部测试跑完后才关闭

# 每个测试独立的数据用 function 作用域
@pytest.fixture(scope="function")
def clean_user_table(database):
    """每个测试前清空用户表，保证数据隔离"""
    database.execute("TRUNCATE TABLE users")
    yield database
    database.execute("TRUNCATE TABLE users")  # 测试后也清理，避免污染下一个用例
```

**注意 teardown 的两类异常**：yield 之前的异常会直接阻止测试执行；yield 之后的异常（清理阶段）不会掩盖测试本身的失败，而是被 pytest 单独报告。所以清理逻辑务必用 `try/finally` 兜底，确保即使清理出错也不影响资源释放。

### 作用域选择原则

- **无状态、只读、创建昂贵**（如配置、连接池）→ `session`/`module`
- **有状态、需要隔离**（如测试数据、脏写）→ `function`
- **autouse 慎用**：只有「所有测试都必需且无副作用」的前置才用 `autouse=True`，否则会拖慢无关用例、增加隐式耦合。

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

### 代码走查：面试官看这段代码的打分点

1. **依赖链命名**：`app_config → api_client → test_data` 形成一条自解释的依赖链，fixture 名与它返回的东西一致（`test_data` 返回数据、`api_client` 返回客户端）。面试官第一眼扫的就是命名，链路清晰等于白拿风格分。
2. **作用域显式标注**：即使 `function` 是默认值，每个 fixture 都显式写出 scope，说明作者考虑过作用域选择而不是随手写的。这是低成本高回报的表达动作。
3. **类型注解**：`Generator[dict, None, None]`、`Callable` 表明作者理解 fixture「既是函数也是资源」的双重身份。小瑕疵：`api_client` 的注解只写了裸 `Generator`，统一写成 `Generator[APIClient, None, None]` 更严谨，走查时会被提一句。
4. **teardown 完整性（必被追问）**：`test_data` 的 setup 里先建 `user` 再建 `order`，如果 `create_order` 抛异常，已创建的 `user` 不会被清理——setup 中途失败时 yield 之后的代码根本不会执行。修正思路是把数据创建交给 `order_factory` 这类工厂 fixture 按需创建，或 setup 内部自己 try/except 回滚。
5. **可测性**：所有依赖都通过参数注入，没有全局变量、没有模块级状态，测试随时可以用 mock 替换任意一层。

### 常见错误实现与修正

错误实现一：想清理，却把清理写在了 return 之后

```python
@pytest.fixture
def api_client_bad():
    client = APIClient("http://localhost:8080")
    return client
    client.close()  # 永远不会执行：return 之后的代码不可达
```

问题：

1. `return` 之后是死代码，清理逻辑形同虚设，资源随用例数量线性泄漏
2. 更隐蔽的变体：作者其实记得「yield 之后写清理」，却把资源创建写成了 `return`，pytest 不会报错，问题要到连接池打满才暴露

修正版——`yield` 分隔 setup/teardown，并用 `try/finally` 兜底：

```python
@pytest.fixture
def api_client_fixed():
    client = APIClient("http://localhost:8080")
    try:
        yield client   # 测试拿到的就是 client
    finally:
        client.close() # 即使测试失败也保证释放
```

错误实现二：大作用域里造有状态数据——单跑通过、整轮失败

```python
@pytest.fixture(scope="session")
def admin_user(api_client):
    # session 作用域里创建业务数据，整轮只建一次
    return api_client.create_user(name="admin", role="admin")
```

问题：

1. `admin_user` 全会话共享，任何一个用例修改它（改密码、禁用账号），后面依赖它的用例集体失败——这就是「本用例单独跑通过、整轮跑却挂」的经典 flaky 来源
2. 并行（pytest-xdist）下每个 worker 进程各初始化一份 session fixture：如果业务上用户名唯一，第二个 worker 建重名用户直接报错；即便不报错，两个 worker 也各改各的，状态互不可见

修正版——大作用域只放无状态只读资源（连接池、配置），业务数据一律 function 级创建并回收：

```python
import uuid

@pytest.fixture(scope="function")
def admin_user(api_client):
    # 名字带随机后缀，避免并行下撞唯一约束
    user = api_client.create_user(name=f"admin_{uuid.uuid4().hex[:8]}", role="admin")
    yield user
    api_client.delete_user(user["id"])
```

## 7. 测试用例

下面是一份**可独立运行**的测试文件。为了不依赖真实数据库，我们用 `unittest.mock.MagicMock` 模拟 `APIClient`，重点验证两件事：fixture 的依赖注入是否生效、function 作用域是否保证每次测试拿到干净的数据。

```python
import pytest
from unittest.mock import MagicMock

# 被测试的 fixture 定义（与生产代码一致）
@pytest.fixture(scope="module")
def api_client():
    """模块级共享的客户端（无状态，适合大作用域）"""
    client = MagicMock()
    client.create_user.return_value = {"id": 1, "name": "test_user"}
    client.create_order.return_value = {"id": 100, "amount": 100, "user_id": 1}
    yield client
    client.close.assert_not_called()  # teardown 行为可断言

@pytest.fixture
def test_data(api_client):
    """function 作用域：每个测试独立创建并清理"""
    data = {
        "user": api_client.create_user(name="test_user"),
        "order": api_client.create_order(user_id=1, amount=100),
    }
    yield data
    # teardown：验证清理逻辑被调用
    api_client.delete_user.assert_called_with(data["user"]["id"])
    api_client.delete_order.assert_called_with(data["order"]["id"])


@pytest.fixture
def order_factory(api_client):
    """工厂模式 fixture：在测试内灵活创建订单，teardown 统一回收"""
    orders = []
    def create(**kwargs):
        order = api_client.create_order(**kwargs)
        orders.append(order)
        return order
    yield create
    for order in orders:
        api_client.delete_order.assert_called_with(order["id"])


def test_user_creation(test_data):
    """测试用户创建 - 自动获取 test_data fixture"""
    assert test_data["user"]["name"] == "test_user"
    assert test_data["user"]["id"] is not None


def test_order_creation(test_data, api_client):
    """测试订单创建 - 多 fixture 注入，验证依赖关系"""
    order = test_data["order"]
    assert order["amount"] == 100
    # 验证订单归属：通过 mock 的返回值断言调用入参
    api_client.create_order.assert_called_with(user_id=1, amount=100)


def test_order_factory_pattern(order_factory):
    """测试工厂模式 fixture：灵活创建多份数据"""
    order1 = order_factory(user_id=1, amount=50)
    order2 = order_factory(user_id=1, amount=150)
    assert order1["amount"] == 50
    assert order2["amount"] == 150
    # fixture teardown 会自动清理所有创建的订单


def test_isolation_between_tests(api_client, test_data):
    """隔离性验证：function 作用域下两次测试互不影响"""
    # 第一个测试修改了 data，但下一个测试的 test_data 是全新的一份
    test_data["tampered"] = True
    assert test_data["user"]["name"] == "test_user"  # 仍来自 setup，未被其他用例污染


class TestUserAPI:
    """类级别测试 - 演示 class 作用域的共享语义"""

    @pytest.fixture(scope="class")
    def class_data(cls, api_client):
        user = api_client.create_user(name="class_user")
        yield user
        api_client.delete_user(user["id"])

    def test_class_fixture_shared(self, class_data):
        assert class_data["name"] == "class_user"

    def test_class_fixture_reuse(self, class_data):
        # 同一个 class_data 对象在类内两个测试间复用
        assert class_data["name"] == "class_user"
```

**为什么这份用例能体现边界**：`test_isolation_between_tests` 模拟了「一个用例篡改了共享 data」的极端情况，但因为 `test_data` 是 `function` 作用域，下一个用例拿到的仍是 setup 阶段全新初始化的对象——这正是数据隔离想要保证的效果。

## 8. 可扩展点

### 1. 参数化 fixture（多场景）

用 `params` 让一个 fixture 自动驱动多组数据，配合 `request.param` 取当前值：

```python
@pytest.fixture(params=["sqlite", "postgres"])
def db_engine(request):
    """同一套测试在两种数据库上各跑一遍"""
    engine = create_engine(request.param)
    yield engine
    engine.dispose()

def test_insert(db_engine):
    # 该用例会因 params 被执行两次（sqlite / postgres）
    assert db_engine.execute("SELECT 1").scalar() == 1
```

### 2. 异步 fixture

配合 `pytest-asyncio`，用 `async def` 声明，测试函数加 `@pytest.mark.asyncio`：

```python
@pytest.fixture
async def async_client():
    client = await AsyncAPIClient.connect()
    yield client
    await client.close()
```

### 3. fixture 组合与层级

高级 fixture 可由多个低级 fixture 组合而成，pytest 自动解析依赖。把「数据准备 + 客户端 + 断言工具」打包成一个业务 fixture，测试签名更干净。

### 4. conftest.py 分层组织

- 根目录 `conftest.py`：放 session/module 级共享 fixture（数据库连接、配置）
- 子目录 `conftest.py`：放该模块专属的 function 级 fixture
- 好处：fixture 无需 import，pytest 自动向上查找；避免循环依赖。

### 5. fixture 标记与条件跳过

```python
@pytest.fixture
def slow_resource():
    pass

@pytest.mark.usefixtures("slow_resource")
def test_xxx(): ...
# 用 -m "not slow" 可在 CI 中跳过重型 fixture
```

### 6. 复杂度与规模化：用例数上来之后哪里先崩

按 50 → 500 → 5000 条用例的顺序，本文的结构会依次撞到三堵墙：

1. **50 条以上：function 级真实建删数据成为耗时大头。** 每个用例都走一遍「创建 + 清理」的完整 HTTP 往返，套件时间随用例数线性膨胀。缓解：只读数据（用户资料模板、商品目录）下沉到 session/module 作用域；接口支持批量创建就用工厂一次造一批，teardown 也批量删。
2. **500 条以上：清理型 fixture 开始互相踩。** teardown 逻辑变复杂后自身出错概率上升，一个 teardown 抛异常会让它管理的资源滞留，污染下一个用例，失败开始「传染」。缓解：所有清理写进 `try/finally`；清理失败单独记录成 warning 而不是静默吞掉，让泄漏可见。
3. **5000 条以上：根 conftest.py 变成垃圾场 + xdist 数据竞争。** 所有 fixture 堆在根 conftest，没人敢删没人在用；多个 worker 共写同一张真实表，随机失败率随 worker 数上涨。缓解：conftest 按目录分层（对应扩展点 4）；每个 worker 用独立 schema 或表名加 worker 前缀（这是「并行测试」追问的落地动作）。

再往后就是环境架构问题：测试环境按 session 拉起容器、结果缓存跳过未变更模块——已超出 fixture 范畴，面试里点到「我知道边界在哪」即可，不要展开编造没做过的方案。

## 9. 面试讲解

"在测试框架设计中，我非常重视 Fixture 策略的设计。核心思路是通过合理的作用域选择、依赖注入和数据隔离来提高测试的可维护性和执行效率。

**作用域选择**上，我会根据资源的创建成本和使用频率来决定。数据库连接池这种昂贵资源用 session 作用域，整个测试会话只初始化一次；而每个测试需要独立的测试数据，就用 function 作用域，确保测试之间互不影响。

**依赖注入**是 pytest fixture 的精髓。我只需要在 fixture 参数中声明需要的其他 fixture 名称，pytest 会自动按依赖顺序注入。这让测试代码非常简洁，也方便 mock 和替换依赖。

**数据隔离**我有两种常用策略：一是事务回滚，每个测试用事务包装，测试后自动回滚；二是使用独立数据库或 schema，每个测试用独立的命名空间。这样就能安全地并行执行测试。"

## 10. 常见追问

1. **fixture 作用域越小性能越差，如何平衡？**
   - 先算「初始化成本」：创建连接池、拉起容器这类昂贵操作坚决用大作用域；创建一条内存数据这类廉价比操作放心用 `function`。
   - 再算「共享风险」：无状态、只读资源（配置、Schema）大胆共享；有状态资源（数据库行、登录态）宁可每次重建，避免相互污染。
   - 折中方案：大作用域只负责「建好空容器」，小作用域在容器内做「填充+清空」，兼顾速度与隔离。

2. **多个 fixture 有依赖顺序时，pytest 如何处理？**
   - pytest 通过参数声明自动解析依赖图（DAG），按拓扑序执行 setup，逆序执行 teardown。
   - 例如 `test_data(api_client, db_session)`，会先初始化 `api_client` 与 `db_session`，再注入 `test_data`。
   - **循环依赖会直接报错**，这是好事——提醒你 fixture 职责划分有问题，应抽出公共底层 fixture。

3. **如何处理 fixture 中的异常？**
   - yield 之前的异常会阻止测试运行，并标记为 fixture 错误（而非用例失败），便于定位是准备阶段出问题。
   - yield 之后的异常（teardown）不会掩盖测试本身的失败，pytest 会单独报告，但可能让资源清理不完整。
   - 用 `try/finally` 兜底清理逻辑，确保即使 teardown 出错，关键资源（连接、文件锁）也能释放。

4. **fixture 与 `@pytest.mark.parametrize` 一起用时，作用域怎么算？**
   - parametrize 作用在测试函数上，函数被展开成 N 条用例；如果依赖的 fixture 是 `function` 作用域，每条参数化用例都会重新 setup/teardown 一次。
   - 想要「一组参数只建一次资源」，应把重资源 fixture 提到 `module`/`session`，让参数化只影响轻量数据 fixture。
   - 关键认知：**参数化是「测试维度」的复制，fixture 作用域是「资源维度」的复用，两者正交**。

5. **并行测试（pytest-xdist）下 fixture 隔离要注意什么？**
   - 多进程下 `session` 级 fixture 在每个 worker 进程里各初始化一份，不是全局唯一；不能用它做跨 worker 的计数或锁。
   - function 级数据隔离是并行安全的前提；若依赖同一张真实表，需给每个 worker 分配独立 schema 或加 worker id 前缀。

6. **fixture 和 setup_method/teardown_method 怎么选？**
   - xUnit 风格的 `setup_method` 绑定在测试类上，没有依赖注入、没有作用域可选，跨类复用只能靠继承，继承层级一深就难维护。
   - fixture 可以跨文件共享（conftest.py 自动发现）、可以组合嵌套、可以参数化，需要「同一个前置被多个测试类复用」时几乎总是更优解。
   - 例外：团队已有统一的 xUnit 风格且逻辑只在单个类内使用，不必为了「先进」强行迁移，一致性比工具先进性重要。

7. **fixture 里能不能写断言？**
   - 技术上可以，比如断言「测试环境已就绪」，但要克制：setup 阶段的断言失败会被 pytest 标记为 error 而不是 failure，报告语义完全不同，聚合统计时会被误读。
   - 更好的做法是把前置健康检查做成显式的 fixture（如 `ready_env`），依赖它的用例在环境损坏时整体标记 error，其余用例照常执行，问题边界一眼可见。
   - teardown 里同理：清理代码里放断言会让「清理失败」掩盖不了什么，反而制造噪音，清理失败用 warning 日志记录即可。

8. **如何调试一个「时灵时不灵」的 fixture？**
   - 第一步定作用域：单独跑这条用例能复现吗？单跑通过、整轮失败，基本锁定大作用域共享状态被前面的用例改了。
   - 第二步看 teardown：加 `-l` 显示失败时的局部变量，在 teardown 里打时间戳日志确认清理顺序，排查「清理顺序依赖」类问题。
   - 第三步看并行：用 `-p xdist -n 1` 先排除并行因素，再逐个加回 worker 复现；怀疑与 worker 共享有关时，把可疑 fixture 从 session 降到 function 做对照实验。

## 11. 关联技术和场景

- **[Mock 与 Stub](/testdev-interview-site/glossary/mock-stub/)**：fixture 与 mock 配合实现依赖替换，是隔离外部依赖的常用手段
- **[API 测试](/testdev-interview-site/tech/api-testing/)**：fixture 提供 API 客户端和测试数据
- **参数化测试**：fixture 的 `params` 与 `@pytest.mark.parametrize` 配合，复用同一套测试逻辑
- **测试并行**：数据隔离是实现并行测试（pytest-xdist）的前提
- **工厂模式**：fixture 工厂是测试数据管理的最佳实践，避免散落的硬编码数据
