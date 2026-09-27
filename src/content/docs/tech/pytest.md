---
title: "Pytest"
description: "Python 生态最流行的测试框架，支持 fixture 依赖注入、参数化测试、标记筛选和丰富插件生态，是自动化测试工程师的必备技能。"
category: "tech"
stage: "practice"
estimatedMinutes: 42
difficulty: "interview"
interviewWeight: 3
tags: ["自动化框架", "Python", "单元测试", "fixture", "参数化", "插件生态"]
prerequisites:
  - "beginner-course/pytest-first-test"
  - "glossary/fixture"
  - "glossary/unit-testing"
outcomes:
  - "能写出带 fixture 的参数化测试用例"
  - "能排查断言失败的根因并判断问题归属"
  - "面试时能讲清 pytest 插件与标记的用法"
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper"]
selfTests:
  - id: "pytest-q1"
    question: "Pytest 的 fixture 相比传统的 setUp/tearDown 有什么优势？"
    options:
      [
        "依赖注入，自动管理生命周期",
        "只能在类中使用",
        "必须手动调用",
        "不支持参数化",
      ]
    correctIndex: 0
    explanation: "fixture 采用依赖注入模式，支持不同作用域（function/class/module/session），可自动管理资源创建和清理。"
  - id: "pytest-q2"
    question: "如何只运行被 @pytest.mark.smoke 标记的测试用例？"
    options:
      ["pytest -m smoke", "pytest --smoke", "pytest -k smoke", "pytest smoke"]
    correctIndex: 0
    explanation: "-m 选项用于按标记筛选测试，-k 用于按名称模糊匹配。"
  - id: "pytest-q3"
    question: "参数化测试 @pytest.mark.parametrize 的作用是什么？"
    options:
      ["用同一测试逻辑运行多组输入数据", "跳过测试", "标记慢测试", "并行执行"]
    correctIndex: 0
    explanation: "参数化让测试更 DRY，避免重复编写相似用例，便于覆盖边界值和异常场景。"
  - id: "pytest-q4"
    question: "使用 pytest-xdist（-n auto）并行执行时，session 级 fixture 的行为是？"
    options:
      [
        "整个运行只创建一次",
        "每个 worker 进程各自创建一份",
        "每个测试函数创建一次",
        "不会被创建",
      ]
    correctIndex: 1
    explanation: "xdist 把用例分发到多个独立进程，每个 worker 有自己的执行环境，session 级 fixture 在每个 worker 内各创建一次。因此依赖全局唯一的资源（如内存缓存、端口监听）在并行下会出现多份实例，设计 fixture 时必须保证多实例安全。"
---

## 这项技术解决什么问题

在 Python 测试领域，开发者长期面临以下痛点：

1. **unittest 臃肿繁琐**：需要继承 TestCase 类，写大量样板代码（setUp、tearDown、self.assertXxx）
2. **测试数据重复**：同一逻辑针对不同输入要写多个几乎相同的测试函数
3. **资源管理混乱**：数据库连接、临时文件等测试资源的创建和清理分散在各处
4. **测试筛选困难**：无法方便地按类型（冒烟、回归）或模块运行特定测试
5. **报告可读性差**：原生输出缺乏详细上下文，失败定位耗时

Pytest 以"约定优于配置"的理念，提供简洁的断言语法、强大的 fixture 系统、优雅的参数化机制和丰富的插件生态，让测试代码更易读、易维护、易扩展。

## 面试为什么会问

- **考察工程化思维**：测试框架的选择和使用反映候选人是否具备构建可维护测试体系的能力
- **检验自动化能力**：fixture、参数化、标记等特性是构建高效自动化测试的核心技能
- **评估问题解决能力**：插件生态的了解程度体现候选人解决实际问题的视野
- **区分度明显**：从"会用 assert"到"精通 fixture 作用域、自定义标记、插件开发"有清晰的技能阶梯

## 学习前置条件

| 前置知识        | 重要程度 | 说明                           |
| --------------- | -------- | ------------------------------ |
| Python 基础语法 | 必须     | 函数、类、装饰器、上下文管理器 |
| 单元测试概念    | 必须     | 断言、测试用例、测试套件       |
| 命令行操作      | 重要     | 运行 pytest 命令、理解参数     |
| pip 包管理      | 重要     | 安装插件、管理依赖             |

## 核心概念拆解

### 1. 发现规则（Discovery）

Pytest 默认按以下规则发现测试：

- **文件名**：`test_*.py` 或 `*_test.py`
- **类名**：以 `Test` 开头，且无 `__init__` 方法
- **函数名**：以 `test_` 开头

```python
# test_user.py  ← 会被发现
# user_test.py  ← 会被发现
# user.py       ← 不会被发现

# 以下都会被发现并执行
def test_login():
    assert True

class TestUser:
    def test_create(self):  # ← 被发现
        assert True

    def setup(self):  # ← 不会被发现（非测试方法）
        pass
```

自定义发现规则（pytest.ini）：

```ini
[pytest]
python_files = check_*.py verify_*.py
python_classes = Check Verify
python_functions = check_ verify_
```

### 2. Fixture：依赖注入的资源管理器

fixture 是 Pytest 的核心特性，用于提供测试所需的资源（数据、配置、连接等）。

**作用域（scope）决定 fixture 的生命周期**：

| 作用域           | 生命周期             | 适用场景               |
| ---------------- | -------------------- | ---------------------- |
| function（默认） | 每个测试函数调用前后 | 测试数据、临时文件     |
| class            | 每个测试类前后       | 类级别共享数据         |
| module           | 每个测试文件前后     | 模块级配置             |
| package          | 每个包前后           | 包级共享资源           |
| session          | 整个测试会话前后     | 数据库连接池、全局配置 |

```python
import pytest

# function 级别的 fixture：每次测试都重新创建
@pytest.fixture
def sample_data():
    return {"name": "test", "age": 25}

# session 级别的 fixture：整个测试会话只创建一次
@pytest.fixture(scope="session")
def db_connection():
    conn = create_connection("postgresql://localhost/test")
    yield conn  # yield 之前是 setup，之后是 teardown
    conn.close()

# 使用 fixture 的自动清理功能
@pytest.fixture
def temp_file():
    import tempfile
    f = tempfile.NamedTemporaryFile(delete=False)
    f.write(b"test content")
    f.close()
    yield f.name
    import os
    os.unlink(f.name)  # 测试后自动删除

# 在测试中使用 fixture（通过函数参数注入）
def test_with_sample_data(sample_data):
    assert sample_data["name"] == "test"

def test_with_db(db_connection):
    result = db_connection.execute("SELECT 1")
    assert result.fetchone()[0] == 1
```

**fixture 的高级用法**：

```python
# fixture 依赖其他 fixture
@pytest.fixture
def user_data():
    return {"username": "admin"}

@pytest.fixture
def authenticated_client(user_data):
    client = APIClient()
    client.login(user_data["username"])
    yield client
    client.logout()

# conftest.py 中的 fixture 自动对所有测试可见
# fixtures/conftest.py
@pytest.fixture(scope="session")
def config():
    import yaml
    with open("config.yaml") as f:
        return yaml.safe_load(f)

# 使用 usefixtures 装饰器（不需要返回值时）
@pytest.mark.usefixtures("setup_environment")
def test_something():
    pass

# autouse=True 自动应用 fixture
@pytest.fixture(autouse=True)
def clean_database():
    # 每个测试前后自动清理数据库
    yield
    db.truncate_all_tables()
```

### 3. 参数化测试：DRY 的最佳实践

参数化避免为相似逻辑写重复代码，特别适合边界值测试、等价类划分。

```python
import pytest

# 基础参数化：单一参数
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
    (0, 0),
    (-1, -2),
])
def test_double(input, expected):
    assert double(input) == expected

# 多参数组合
@pytest.mark.parametrize("x", [1, 2])
@pytest.mark.parametrize("y", [10, 20])
def test_multiply(x, y):
    # 会产生 4 个测试：1*10, 1*20, 2*10, 2*20
    assert multiply(x, y) == x * y

# 使用 pytest.param 添加标识和标记
@pytest.mark.parametrize("input,expected", [
    pytest.param(1, 2, id="positive"),
    pytest.param(-1, -2, id="negative"),
    pytest.param(0, 0, id="zero"),
])
def test_with_ids(input, expected):
    assert double(input) == expected

# 跳过特定参数组合
@pytest.mark.parametrize("value,expected", [
    (1, True),
    pytest.param(0, False, marks=pytest.mark.xfail(reason="已知 bug")),
    (2, True),
])
def test_with_xfail(value, expected):
    assert is_positive(value) == expected

# 从外部数据源加载参数
def load_test_cases():
    import json
    with open("test_cases.json") as f:
        return json.load(f)

@pytest.mark.parametrize("case", load_test_cases())
def test_from_file(case):
    assert process(case["input"]) == case["expected"]
```

### 4. 标记（Markers）：测试分类与筛选

标记用于对测试进行分类，便于选择性执行。

```python
import pytest

# 内置标记
@pytest.mark.skip(reason="功能未实现")
def test_feature_not_implemented():
    pass

@pytest.mark.skipif(sys.version_info < (3, 8), reason="需要 Python 3.8+")
def test_python38_feature():
    pass

# 自定义标记（需要在 pytest.ini 中注册）
@pytest.mark.smoke
def test_critical_login():
    pass

@pytest.mark.regression
def test_old_bug_fix():
    pass

@pytest.mark.slow
@pytest.mark.integration
def test_database_migration():
    pass

# 标记整个测试类
@pytest.mark.api
class TestUserAPI:
    def test_get_user(self):
        pass

    def test_create_user(self):
        pass
```

**注册自定义标记（pytest.ini）**：

```ini
[pytest]
markers =
    smoke: 冒烟测试，核心功能验证
    regression: 回归测试
    slow: 运行较慢的测试
    integration: 集成测试
    api: API 相关测试
```

### 5. 插件生态：扩展无限可能

常用插件及其用途：

| 插件                 | 用途          | 安装                               |
| -------------------- | ------------- | ---------------------------------- |
| pytest-html          | HTML 测试报告 | `pip install pytest-html`          |
| pytest-cov           | 代码覆盖率    | `pip install pytest-cov`           |
| pytest-xdist         | 并行执行      | `pip install pytest-xdist`         |
| pytest-timeout       | 超时控制      | `pip install pytest-timeout`       |
| pytest-rerunfailures | 失败重跑      | `pip install pytest-rerunfailures` |
| pytest-mock          | Mock 增强     | `pip install pytest-mock`          |
| allure-pytest        | Allure 报告   | `pip install allure-pytest`        |

**插件使用示例**：

```bash
# 并行执行（4 个进程）
pytest -n 4

# 失败用例重跑 2 次
pytest --reruns 2

# 生成 HTML 报告
pytest --html=report.html --self-contained-html

# 生成覆盖率报告
pytest --cov=src --cov-report=html

# 超时控制（单测试最多 5 秒）
pytest --timeout=5
```

### 6. 与 unittest 的差异对比

团队里常有两套测试并存，pytest 能直接运行 unittest 风格的用例，但两者工程能力差距明显：

| 维度     | pytest                                  | unittest                            |
| -------- | --------------------------------------- | ----------------------------------- |
| 断言     | 原生 `assert`，失败时自动展开左右值     | 必须 `self.assertEqual` 等 30+ 方法 |
| 样板代码 | 纯函数即可，无需继承                    | 必须继承 TestCase                   |
| 资源管理 | fixture + 依赖注入，按 scope 管生命周期 | setUp/tearDown/setUpClass 手动组织  |
| 参数化   | `@parametrize` 一行数据一组用例         | `subTest`，写法繁琐                 |
| 筛选运行 | `-m` 标记、`-k` 表达式、`--lf` 失败优先 | 需要自己组织 TestLoader/Suite       |
| 插件生态 | 数百个插件即插即用                      | 标准库能力，扩展靠自己写            |

迁移建议：存量 unittest 用例不用重写，pytest 直接兼容运行；新用例一律用 pytest 风格，团队逐步过渡。面试被问"为什么不统一成 unittest"时，用断言质量和 fixture 复用两个点回答即可。

## 最小可运行例子

创建以下文件结构：

```
demo/
├── conftest.py
├── test_calculator.py
└── pytest.ini
```

**conftest.py**（共享 fixture）：

```python
import pytest

@pytest.fixture(scope="session")
def calculator():
    """提供一个计算器实例"""
    class Calculator:
        def add(self, a, b): return a + b
        def subtract(self, a, b): return a - b
        def multiply(self, a, b): return a * b
        def divide(self, a, b):
            if b == 0:
                raise ValueError("除数不能为零")
            return a / b
    return Calculator()

@pytest.fixture
def test_data():
    """测试数据"""
    return {
        "positive": [1, 2, 3, 10, 100],
        "negative": [-1, -2, -3, -10],
        "zero": 0,
        "edge_cases": [0.001, 999999, -0.001]
    }
```

**test_calculator.py**：

```python
import pytest

class TestCalculator:
    @pytest.mark.smoke
    def test_add_positive(self, calculator, test_data):
        for n in test_data["positive"]:
            assert calculator.add(n, n) == n * 2

    @pytest.mark.parametrize("a,b,expected", [
        (1, 2, 3),
        (0, 0, 0),
        (-1, 1, 0),
        (0.1, 0.2, 0.3),
    ])
    def test_add_various(self, calculator, a, b, expected):
        assert abs(calculator.add(a, b) - expected) < 0.0001

    @pytest.mark.parametrize("a,b,expected", [
        (10, 2, 5),
        (9, 3, 3),
    ])
    @pytest.mark.regression
    def test_divide(self, calculator, a, b, expected):
        assert calculator.divide(a, b) == expected

    def test_divide_by_zero(self, calculator):
        with pytest.raises(ValueError, match="除数不能为零"):
            calculator.divide(1, 0)
```

**pytest.ini**：

```ini
[pytest]
markers =
    smoke: 核心功能冒烟测试
    regression: 回归测试
testpaths = .
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --tb=short
```

**运行命令**：

```bash
# 运行所有测试
pytest

# 只运行冒烟测试
pytest -m smoke

# 并行执行
pytest -n auto

# 生成覆盖率报告
pytest --cov=. --cov-report=html
```

## 在项目中怎么落地

### 1. 项目结构规范

```
project/
├── src/
│   └── myapp/
│       ├── __init__.py
│       └── core.py
├── tests/
│   ├── conftest.py          # 共享 fixture
│   ├── fixtures/             # fixture 模块化
│   │   ├── __init__.py
│   │   ├── db.py
│   │   └── api.py
│   ├── unit/                 # 单元测试
│   │   └── test_core.py
│   ├── integration/          # 集成测试
│   │   └── test_api.py
│   └── e2e/                  # 端到端测试
│       └── test_workflow.py
├── pytest.ini
└── requirements-test.txt
```

### 2. conftest.py 最佳实践

```python
# tests/conftest.py
import pytest
from myapp import create_app, db

@pytest.fixture(scope="session")
def app():
    """创建测试应用"""
    app = create_app(config="testing")
    yield app

@pytest.fixture(scope="function")
def client(app):
    """创建测试客户端"""
    return app.test_client()

@pytest.fixture(scope="function")
def db_session(app):
    """数据库会话，每个测试后自动回滚"""
    with app.app_context():
        connection = db.engine.connect()
        transaction = connection.begin()
        session = db.create_scoped_session(options={"bind": connection})
        db.session = session
        yield session
        transaction.rollback()
        connection.close()
        session.remove()

@pytest.fixture
def auth_header(client):
    """API 认证头"""
    response = client.post("/auth/login", json={
        "username": "test",
        "password": "test123"
    })
    token = response.json["token"]
    return {"Authorization": f"Bearer {token}"}
```

### 3. CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: pip install -r requirements-test.txt

      - name: Run tests with coverage
        run: |
          pytest \
            --cov=src \
            --cov-report=xml \
            --cov-report=html \
            --junitxml=junit.xml \
            -n auto

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

### 4. 命名规范

| 类型     | 规范                        | 示例                                |
| -------- | --------------------------- | ----------------------------------- |
| 测试文件 | `test_{module}.py`          | `test_user.py`                      |
| 测试类   | `Test{Feature}`             | `TestLogin`                         |
| 测试函数 | `test_{action}_{condition}` | `test_login_with_valid_credentials` |
| fixture  | 小写下划线                  | `db_session`                        |
| 标记     | 小写                        | `@pytest.mark.smoke`                |

## 常见坑和排查方法

### 坑1：fixture 循环依赖

```python
# 错误：A 依赖 B，B 依赖 A
@pytest.fixture
def a(b):
    return "a"

@pytest.fixture
def b(a):
    return "b"

# 排查：pytest 会抛出 FixtureLookupError
# 解决：重构 fixture，拆分职责
```

### 坑2：作用域不匹配导致数据污染

```python
# 错误：function 级别的 fixture 被 module 级别的 fixture 依赖
@pytest.fixture  # 默认 function
def clean_db():
    db.truncate()
    yield

@pytest.fixture(scope="module")  # module 级别
def test_data(clean_db):  # 依赖 function 级别的 fixture
    return db.insert({"name": "test"})

# 排查：pytest 会警告 scope 不匹配
# 解决：提升 clean_db 的 scope 到 module 或更高
```

### 坑3：conftest.py 放错位置

```python
# pytest 从测试文件所在目录向上查找 conftest.py
# 如果 conftest.py 在 tests/fixtures/ 下，
# tests/unit/ 下的测试无法自动发现其中的 fixture

# 解决：
# 1. 把 conftest.py 放在 tests/ 根目录
# 2. 或在子目录的 conftest.py 中显式导入
```

### 坑4：参数化导致测试爆炸

```python
# 错误：笛卡尔积导致测试数量爆炸
@pytest.mark.parametrize("a", range(100))
@pytest.mark.parametrize("b", range(100))
def test_combination(a, b):  # 产生 10000 个测试！
    pass

# 解决：精选边界值和等价类
@pytest.mark.parametrize("a,b", [
    (0, 0), (1, 1), (1, 0), (0, 1),
    (MAX, MAX), (MAX, MIN), (MIN, MAX),
])
def test_combination(a, b):
    pass
```

### 坑5：断言过于简单

```python
# 错误：失败时无上下文
def test_user():
    user = get_user(1)
    assert user.age == 25  # 失败只知道不等于 25

# 改进：使用 pytest 的断言重写功能
def test_user():
    user = get_user(1)
    assert user.age == 25, f"期望年龄 25，实际 {user.age}"
    assert user.name == "Alice", f"用户数据: {user.__dict__}"
```

### 坑6：ScopeMismatch——作用域冲突的真实报错

```text
ScopeMismatch: You tried to access the 'function' scoped fixture 'clean_db'
with a 'module' scoped request object, involved factories:
conftest.py:20:  def test_data(clean_db)
```

**根因**：module 级 fixture 依赖了 function 级 fixture——大作用域无法引用小作用域，因为小作用域资源在大作用域存活期间要反复创建和销毁，生命周期矛盾。这与上文"坑2"是同一类问题，这里是 pytest 给出的原始报错长相。

**修复**：把被依赖的 fixture 提升到相同或更大作用域；如果清理逻辑必须保持 function 级，就把它移到测试函数体内，或用独立的 autouse fixture 承担清理。

### 坑7：把 fixture 当普通函数调用

```text
Failed: Fixture "db_connection" called directly. Fixtures are not meant to be called directly,
but are created automatically when test functions request them as parameters.
```

**根因**：代码里写了 `db_connection()` 这样的直接调用。fixture 只有通过测试函数参数声明才会被注入，直接调用拿到的是一个错误对象而不是数据。

**修复**：在测试函数签名里声明参数；如果确实要在非测试代码里复用 fixture 的逻辑，把这段逻辑抽成普通函数，让 fixture 和测试代码都调用它。

### 调试技巧

```bash
# 失败时进入 pdb 调试
pytest --pdb

# 在第一个失败处停止
pytest -x

# 失败用例的详细回溯
pytest --tb=long

# 只运行上次失败的用例
pytest --lf

# 先运行上次失败的，再运行其他
pytest --ff

# 打印 print 输出
pytest -s

# 显示最慢的 10 个测试
pytest --durations=10
```

## 面试追问与回答骨架

### Q1: fixture 的四种 scope 有什么区别？什么时候用哪个？

**回答骨架**：

- 说明四种 scope：function、class、module、session
- 解释生命周期：function 每个测试都创建，session 整个会话只创建一次
- 举例场景：session 用于数据库连接池，function 用于测试数据
- 提及性能权衡：scope 越大越省资源，但越容易产生状态污染

### Q2: 如何处理测试之间的依赖关系？

**回答骨架**：

- 原则：测试应该独立，不依赖执行顺序
- 如果确实需要，用 fixture 的依赖注入来共享资源
- 用 `pytest-dependency` 插件可以显式声明依赖（不推荐）
- 更好的做法是重构测试，让每个测试自包含

### Q3: 你们项目是怎么组织测试代码的？

**回答骨架**：

- 按测试类型分层：unit / integration / e2e
- 用 conftest.py 管理 fixture，按功能模块拆分
- 用标记区分：smoke / regression / slow
- CI 中根据场景选择性运行

### Q4: 参数化测试有什么优缺点？

**回答骨架**：

- 优点：DRY、覆盖边界值方便、失败时自动显示具体参数
- 缺点：过度参数化导致测试难以理解、错误参数组合会隐藏逻辑问题
- 建议：一个参数化函数只测一个维度，复杂场景拆分多个测试

### Q5: 如何提高测试执行速度？

**回答骨架**：

- 并行执行：pytest-xdist
- 按标记分层：CI 中先跑 smoke，再跑全量
- 合理设置 fixture scope：session 复用昂贵资源
- 避免不必要的 I/O：用 mock 替代真实网络/数据库
- 分布式执行：配合 pytest-testmon 只跑受影响的测试

### Q6：fixture 的 teardown 什么时候不会执行？

**回答骨架**：

- yield 之前的代码抛异常时，该 fixture 自己 yield 之后的清理不会执行——所以"创建资源"要尽量前移，让异常尽早暴露
- 已完成 setup 的上级/兄弟 fixture 的 teardown 仍会正常执行，pytest 保证资源不泄漏
- 测试被 Ctrl-C 强杀或进程崩溃时，清理可能不执行，这就是为什么数据库清理除了靠 fixture 回滚，还要有兜底的定时清理任务

### Q7：用例规模到几千条后，怎么维持执行速度和稳定性？

**回答骨架**：

- 并行：xdist `-n auto`，但要知道 session fixture 每个 worker 各一份，跨进程共享资源要重新设计
- 分层：PR 只跑 smoke，全量放合并后，夜间跑带 slow/integration 标记的用例
- 顺序随机化：pytest-randomly 打乱执行顺序，倒逼用例独立，能提前暴露隐藏的顺序依赖
- 慢用例治理：`--durations=10` 定期找慢用例，该 mock 的 mock、该合并的合并
- 重试克制：`--reruns` 只对确认是环境抖动的用例启用，滥用重试会让真正的 bug 被运气掩盖

## 练习任务

### 任务1：基础练习

1. 创建一个简单的计算器模块，为加减乘除各写至少 2 个测试
2. 使用参数化重写测试，覆盖正数、负数、零的情况

### 任务2：fixture 实践

1. 创建一个 fixture，模拟数据库连接（可以用字典模拟）
2. 创建 session 级别的 fixture 存放测试数据
3. 编写测试验证 fixture 的作用域行为

### 任务3：标记与筛选

1. 为测试添加 smoke、regression 标记
2. 配置 pytest.ini 注册自定义标记
3. 练习使用 -m 和 -k 参数筛选测试

### 任务4：进阶挑战

1. 编写一个 conftest.py，实现测试数据的自动清理
2. 使用 pytest-mock 模拟 API 调用
3. 生成 HTML 测试报告并配置失败截图

### 任务5：项目实战

1. 搭建一个完整的测试项目结构
2. 配置 CI/CD 流水线运行测试
3. 实现覆盖率阈值检查（如低于 80% 则失败）

## 性能与规模化

用例数量从百级到千级，pytest 工程要做一轮系统性升级，核心是让"并行、分层、反馈"三者同时成立：

**1. 并行：pytest-xdist 的工作方式**

```bash
# 按 worker 进程并行，auto 等于 CPU 核数
pytest -n auto

# 同一文件的用例固定分给同一个 worker，
# 适合 module 内有共享状态的存量用例
pytest -n 4 --dist loadfile

# 与耗时均衡分片配合，CI 多节点各跑一份
pytest --splits 4 --group 2
```

关键边界：xdist 是多进程，每个 worker 独立复制一份 session 级 fixture；依赖"全局只初始化一次"的逻辑（监听端口、内存计数）在并行下会出问题，要么改成进程安全，要么用 `--dist loadfile` 把相关用例黏到同一个进程。

**2. 分层执行矩阵**

| 场景     | 命令                              | 目标       |
| -------- | --------------------------------- | ---------- |
| 本地开发 | `pytest tests/unit -x -q`         | 秒级反馈   |
| PR 门禁  | `pytest -m "not slow" -n auto`    | 5 分钟内   |
| 主干合并 | `pytest -n auto --cov=src`        | 20 分钟内  |
| 夜间回归 | `pytest -m "slow or integration"` | 覆盖率兜底 |

**3. 稳定性机制**：`--timeout=60` 防止单条用例挂死整个流水线；`--lf`（last-failed）修复时只跑失败集；随机顺序插件常态化运行，保证用例无顺序依赖——这三件事做完，并行和分层才敢真正收紧门禁。

## 关联内容

- [API 断言最佳实践](/testdev-interview-site/glossary/api-assertion/) - 断言编写技巧
- [断言封装模式](/testdev-interview-site/coding/assertion-wrapper/) - 如何封装自定义断言
- unittest 对比 - 与 Pytest 的差异分析（标准库 unittest 的差异见下文对比）
- 测试数据管理 - 测试数据的设计与管理（详见数据驱动章节）
- [Mock 技术](/testdev-interview-site/tech/mock-framework/) - 测试替身详解
- [CI/CD 集成](/testdev-interview-site/tech/ci-cd/) - 持续集成中的测试策略

---

_Pytest 是测试工程师的瑞士军刀，掌握它意味着掌握了高效测试的钥匙。从简单的 assert 开始，逐步深入 fixture、参数化、插件，最终形成完整的测试工程化能力。_
