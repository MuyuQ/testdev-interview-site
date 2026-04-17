---
title: "Pytest 测试框架入门与实战"
description: "从零开始掌握 Pytest：基础语法、Fixture 机制、参数化、工程化实践，一站式学习路径。"
category: "tech"
difficulty: "beginner"
interviewWeight: 3
tags: ["Pytest", "自动化", "框架"]
selfTests:
  - id: "pytest-1"
    question: "Pytest 相比 unittest 的核心优势是什么？"
    options:
      - "Pytest 运行速度更快"
      - "Pytest 无需继承 TestCase 类，用普通函数和 assert 语句即可写测试"
      - "Pytest 只支持 Python 3.x，unittest 支持 Python 2.x"
      - "Pytest 有官方支持，unittest 是社区维护"
    correctIndex: 1
    explanation: "Pytest 的核心理念是「简单优先」，不需要继承任何基类，普通的 assert 语句就能自动生成详细的失败报告。相比 unittest，代码量通常减少 30%-50%，可读性更高。"
  - id: "pytest-2"
    question: "测试用例需要覆盖多组参数组合时，应该用什么方式实现？"
    options:
      - "写多个测试函数，每个函数测一组参数"
      - "在测试函数内部用 for 循环遍历参数"
      - "使用 @pytest.mark.parametrize 装饰器实现参数化"
      - "使用 unittest 的 subTest 机制"
    correctIndex: 2
    explanation: "@pytest.mark.parametrize 是 Pytest 内置的参数化机制，一行代码就能生成多组用例，每组参数独立执行、独立报告结果。相比 for 循环，参数化用例失败时能定位到具体哪组参数出错。"
  - id: "pytest-3"
    question: "conftest.py 文件应该放在什么位置？它的作用是什么？"
    options:
      - "放在项目根目录，只用于配置 pytest.ini"
      - "放在 tests 目录下，用于定义共享 Fixture，子目录可自动继承"
      - "放在任意位置，用命令行参数指定路径"
      - "放在每个测试文件同级目录，只对当前文件生效"
    correctIndex: 1
    explanation: "conftest.py 放在 tests 目录下，定义的 Fixture 对该目录及子目录下的所有测试生效，无需显式导入。这是 Pytest 的共享机制，适合存放登录态、数据库连接等公共资源初始化。"
---

## 基础入门：Pytest 是什么 & 为什么学它

Pytest 核心概念和学习价值

### Pytest 是什么

Pytest 是 Python 生态中最流行的测试框架，核心理念是"简单优先"。它让你用最少的代码写出清晰的测试：不需要继承任何基类，不需要写繁琐的样板代码，普通的 assert 语句就能自动生成详细的失败报告。Pytest 的核心能力包括：[Fixture](/testdev-interview-site/glossary/fixture/) 机制（灵活的测试资源管理）、参数化测试（一键生成多组用例）、标记体系（按标签筛选执行）、插件生态（数百个插件扩展功能）、详细报告（失败时自动展示变量值和断言详情）。相比 Python 自带的 unittest，Pytest 的代码量通常减少 30%-50%，可读性更高。

### 为什么测试开发要学 Pytest

\*\*

第一，行业主流标准\*\*：超过 70% 的 Python 测试项目使用 Pytest，招聘 JD 几乎都要求掌握它。不懂 Pytest 会直接失去很多面试机会。

\*\*

第二，面试高频考点\*\*：Fixture 作用域、参数化设计、conftest 组织方式是面试必问。能讲清楚这些说明你有真实项目经验。

\*\*

第三，框架设计能力体现\*\*：Pytest 的设计理念（依赖注入、声明式配置）能帮你建立测试框架设计思维，这是从执行者到设计者的关键一步。

\*\*

第四，生态丰富开箱即用\*\*：pytest-html 生成报告、pytest-xdist 并行执行、pytest-rerunfailures 失败重试、allure-pytest 可视化报告，这些插件能快速提升框架能力。

\*\*

第五，与 CI/CD 无缝集成\*\*：Pytest 输出的退出码和 JUnit XML 报告能被 Jenkins、GitLab CI、GitHub Actions 直接识别，是自动化流水线的标配。

### Pytest vs unittest：为什么 Pytest 更适合新项目

## Pytest 与 unittest 对比

Pytest 与 unittest 的详细对比表格

- | 特性 | Pytest | unittest | 说明 |
- | --- | --- | --- | --- |
- | 用例定义 | 普通函数，以 test\_ 开头 | 必须继承 TestCase 类 | Pytest 更简洁，无需样板代码 |
- | 断言方式 | 直接用 assert 语句 | 调用 self.assertEqual() 等方法 | Pytest 的 assert 会自动展示差异 |
- | 资源管理 | Fixture + yield，灵活组合 | setUp/tearDown，固定层级 | Fixture 作用域更灵活，支持依赖注入 |
- | 参数化 | @pytest.mark.parametrize 内置 | 需要第三方库或手动循环 | Pytest 一行代码搞定多组数据 |
- | 报告详情 | 失败时展示变量值、断言表达式 | 只展示 AssertionError 信息 | Pytest 调试效率更高 |
- | 插件生态 | 数百个插件，社区活跃 | 插件较少，功能有限 | Pytest 扩展能力更强 |
- | 学习曲线 | 低，10 分钟能上手 | 中等，需要理解类结构 | Pytest 对新手更友好 |

## 前置知识：学 Pytest 前你需要会什么

学习 Pytest 的前置知识要求

- **必须掌握**：Python 基础语法（变量、函数、类、模块导入）、pip 安装包、命令行基础操作
- **建议掌握**：Python 装饰器概念（理解 @pytest.mark.xxx 的原理）、生成器 yield（理解 Fixture 的资源清理）、面向对象基础（理解 class 组织方式）
- **不需要掌握**：unittest 框架（Pytest 和 unittest 是平行的，不需要先学 unittest）、复杂的测试理论（边学边实践即可）

## 学习路径：从零到能写项目级测试

零基础快速入门指南

### 零基础第一步：如果你完全没接触过 Pytest

花 10 分钟完成这个快速体验：安装 Pytest（pip install pytest），创建一个 test_demo.py 文件，写一个 test_add 函数用 assert 验证 1+1==2，然后在命令行运行 pytest test_demo.py。看到绿色的点表示测试通过，你就已经成功运行了第一个 Pytest 测试。这一步不需要理解任何原理，先建立"我能用它"的信心。

### 分阶段学习建议

## 第一阶段：基础语法

基础语法阶段的学习目标、内容、练习和时间建议

- **目标**：能独立编写和运行单文件测试用例
- **学习内容**：用例命名规则（test\_ 开头的函数/文件）、assert 断言用法、运行指定用例（文件名、类名、函数名、关键字）、-v 详细输出、-x 遇错即停、--tb 短格式错误信息
- **练习任务**：写一个 test_calculator.py，包含加减乘除 4 个测试函数，每个函数验证一个运算结果
- **预期时间**：2-3 天

## 第二阶段：Fixture 和资源管理

Fixture 和资源管理阶段的学习内容

- **目标**：理解 Fixture 的作用，能设计合理的资源初始化和清理逻辑
- **学习内容**：fixture 装饰器基础、yield 实现资源清理、scope 参数（function/module/class/session）、fixture 依赖注入、conftest.py 共享机制、autouse 自动执行
- **练习任务**：写一个 Fixture 初始化测试数据库连接，测试完成后自动关闭。写一个 Fixture 准备测试数据，用例执行后自动清理
- **预期时间**：3-5 天

## 第三阶段：参数化与数据驱动

参数化与数据驱动阶段的学习内容

- **目标**：能用参数化减少代码重复，实现数据驱动测试
- **学习内容**：@pytest.mark.parametrize 单参数和多参数、参数组合叠加、参数化 Fixture、外部数据文件加载（YAML/JSON）、ids 参数美化报告
- **练习任务**：用参数化重构 test_calculator.py，让一个测试函数验证多组运算。从 YAML 文件读取测试数据，实现数据和代码分离
- **预期时间**：2-3 天

## 第四阶段：工程化能力

工程化能力阶段的学习内容

- **目标**：能搭建可维护的测试项目结构，集成 CI/CD
- **学习内容**：项目目录结构设计、pytest.ini/pyproject.toml 配置、mark 标签分类（smoke/regression）、钩子函数（pytest_runtest_makereport）、报告生成（pytest-html/allure）、失败截图和日志收集
- **练习任务**：搭建一个接口测试项目骨架，包含 conftest.py、配置文件、测试用例目录、报告输出。配置 GitHub Actions 自动运行测试
- **预期时间**：5-7 天

## 时间投入建议

不同时间投入的学习周期建议

- **每天 1-2 小时**：约 2 周完成全部阶段，适合在职学习
- **每天 30 分钟**：约 4 周完成，建议分多次实践同一阶段内容
- **集中学习（全天）**：约 3-5 天可完成，适合冲刺式学习

## 学习资源推荐

推荐的学习资源和实践建议

- **官方文档**：docs.pytest.org - 最权威，概念解释清晰，示例丰富
- **实践建议**：每学一个概念就在项目里写一个示例，不要只看不练。遇到问题先搜官方文档 FAQ 和 GitHub Issues

## 实操案例：从流程理解真实应用

实操案例说明

### 案例难度说明

## 案例难度表

案例难度和预期时间对照表

- | 案例 | 难度 | 学习目标 | 预计时间 |
- | --- | --- | --- | --- |
- | 案例 0：写第一个 Pytest 测试 | 入门 | 理解基本运行流程 | 10 分钟 |
- | 案例 1：搭建项目骨架 | 基础 | 掌握目录结构和配置 | 30 分钟 |
- | 案例 2：异步回调测试 | 进阶 | 学习复杂场景处理 | 45 分钟 |
- | 案例 3：Mock 依赖隔离 | 进阶 | 理解隔离测试思想 | 45 分钟 |

## 案例 0：写你的第一个 Pytest 测试（入门）

10 分钟完成的入门案例

### 步骤描述

第一步：在终端执行 pip install pytest 安装框架。

第二步：创建 test_first.py 文件，定义一个函数 test_add()，函数体写 assert 1 + 1 == 2。

第三步：在终端运行 pytest test_first.py，观察输出结果。看到绿色的点（.）表示测试通过，看到 F 表示失败。

第四步：故意把断言改成 assert 1 + 1 == 3，再次运行，观察失败信息。Pytest 会展示期望值、实际值和断言表达式。

### 你学到了什么

用例命名规则（test\_ 开头）、assert 断言语句、命令行运行方式、失败信息的可读性。

### 下一步

尝试在一个文件里写多个测试函数，学习如何只运行其中某一个（pytest test_first.py::test_add）。

### 示例代码：第一个 Pytest 测试

```python
# test_first.py
def test_add():
    """测试加法"""
    assert 1 + 1 == 2

def test_string_contains():
    """测试字符串包含"""
    text = "Hello, 测试开发"
    assert "测试" in text
    assert len(text) > 5

def test_list_operations():
    """测试列表操作"""
    items = [1, 2, 3]
    items.append(4)
    assert len(items) == 4
    assert items[-1] == 4

class TestCalculator:
    """使用类组织相关测试"""

    def setup_method(self):
        """每个测试方法前执行"""
        self.result = 0

    def test_add(self):
        self.result = 1 + 2
        assert self.result == 3

    def test_multiply(self):
        self.result = 3 * 4
        assert self.result == 12
```

```bash
# 常用 pytest 命令
pytest                          # 运行所有测试
pytest test_first.py            # 运行指定文件
pytest test_first.py::test_add  # 运行指定函数
pytest -v                       # 详细输出
pytest -x                       # 遇错即停
pytest --tb=short               # 简短错误信息
pytest -k "add"                 # 运行名称包含 add 的测试
```

## 案例 1：搭建一个接口自动化项目骨架（基础）

理解项目骨架的核心设计

### 架构流程

项目根目录下创建以下结构：tests/ 目录存放测试用例，conftest.py 存放共享 Fixture，config/ 目录存放环境配置，utils/ 目录存放工具函数，pytest.ini 存放 Pytest 配置。

### 核心流程描述

**初始化流程**：Pytest 启动时读取 pytest.ini 配置，确定测试目录和运行参数。

**Fixture 准备**：执行测试前，conftest.py 中的 Fixture 按作用域和依赖关系初始化。\n\n比如 db fixture 准备数据库连接，api_client fixture 准备请求客户端。

**用例执行**：从 tests/ 目录收集所有 test\_ 开头的文件和函数，按配置顺序执行。每个用例函数通过参数声明需要的 Fixture。

**结果收集**：每个用例执行后，钩子函数收集结果，失败时触发截图、日志收集等逻辑。

**报告生成**：所有用例执行完毕，生成 HTML 报告或 JUnit XML 报告。

### 关键设计要点

### 示例代码：项目骨架结构

```
project/
├── pytest.ini              # Pytest 配置
├── conftest.py             # 根目录共享 Fixture
├── config/
│   ├── dev.yaml            # 开发环境配置
│   ├── test.yaml           # 测试环境配置
│   └── prod.yaml           # 生产环境配置
├── tests/
│   ├── conftest.py         # 测试目录 Fixture
│   ├── test_login.py       # 登录测试
│   ├── test_order.py       # 订单测试
│   └── api/
│       └── conftest.py     # API 模块专用 Fixture
├── utils/
│   ├── http_client.py      # 请求客户端
│   └── assertions.py       # 断言封装
└── requirements.txt        # 依赖列表
```

```python
# pytest.ini
[pytest]
testpaths = tests
addopts = -v --tb=short --html=reports/report.html
markers =
    smoke: 冒烟测试
    regression: 回归测试
    api: 接口测试
```

```python
# conftest.py - 根目录共享 Fixture
import pytest
import yaml
from pathlib import Path
from utils.http_client import HttpClient

def load_config(env: str = "test") -> dict:
    """加载环境配置"""
    config_path = Path(__file__).parent / "config" / f"{env}.yaml"
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

@pytest.fixture(scope="session")
def config(request):
    """会话级配置 Fixture"""
    env = request.config.getoption("--env", default="test")
    return load_config(env)

@pytest.fixture(scope="session")
def api_client(config) -> HttpClient:
    """会话级 API 客户端"""
    client = HttpClient(config["base_url"])
    yield client
    # 清理逻辑（如关闭 session）

@pytest.fixture(scope="function")
def test_user(api_client):
    """函数级测试用户 Fixture"""
    # 创建测试用户
    resp = api_client.post("/users", json={"name": "test_user"})
    user_id = resp["body"]["id"]
    yield {"id": user_id, "name": "test_user"}
    # 清理：删除测试用户
    api_client.delete(f"/users/{user_id}")
```

## 案例 1 关键要点

案例 1 的关键设计要点对照表

- | 要点 | 说明 | 常见问题 |
- | --- | --- | --- |
- | 目录分离 | 用例、配置、工具分目录存放 | 全部堆在根目录，难以维护 |
- | conftest 层级 | 根目录放通用 Fixture，子目录放专用 Fixture | 所有 Fixture 都写在一个文件 |
- | 配置集中 | pytest.ini 统一配置，避免命令行参数散落 | 每次运行都要输入长命令 |
- | 命名规范 | 文件和函数都以 test\_ 开头 | 命名不规范导致 Pytest 找不到用例 |

## 案例 2：测试异步回调接口（进阶）

异步回调接口的测试流程

### 场景说明

很多业务接口是异步的：调用后立即返回一个任务 ID，实际结果通过回调或轮询获取。这类场景需要特殊处理。

### 测试流程

第一步：调用异步接口，获取任务 ID。

第二步：启动轮询逻辑，每隔 N 秒查询一次任务状态。使用 time.sleep 或更优雅的方案如 tenacity 库实现重试。

第三步：设置超时时间，避免无限等待。\n\n比如最多等待 60 秒，超过则判定失败。

第四步：验证最终状态。成功则校验返回数据，失败则记录错误原因。

### 关键要点

## 案例 2 关键要点

案例 2 的关键要点对照表

- | 要点 | 说明 | 常见问题 |
- | --- | --- | --- |
- | 轮询间隔 | 根据业务响应时间设置，太快浪费资源，太慢延长测试时间 | 间隔设置不合理，要么太频繁要么太慢 |
- | 超时控制 | 必须设置最大等待时间，防止测试卡死 | 忘记设置超时，测试用例无限等待 |
- | 状态判断 | 明确成功、失败、处理中的状态值 | 状态判断不完整，遗漏异常情况 |
- | 日志记录 | 记录每次轮询的结果，便于定位问题 | 没有日志，失败时无法分析原因 |

## 案例 3：使用 Mock 测试依赖隔离（进阶）

Mock 依赖隔离的测试流程

### 场景说明

测试支付功能时，不想真的调用第三方支付接口。这时需要用 Mock 模拟外部依赖，让测试独立、可控、快速。

### Mock 流程

第一步：识别需要 Mock 的依赖。\n\n比如支付模块调用的第三方支付网关、短信服务、邮件通知。

第二步：使用 pytest-mock 插件或 unittest.mock 创建 Mock 对象。设置 Mock 的返回值或副作用。

第三步：在 Fixture 中注入 Mock 对象，让测试代码使用 Mock 而不是真实服务。

第四步：编写断言验证 Mock 是否被正确调用。检查调用次数、调用参数、调用顺序。

第五步：测试完成后，Mock 对象自动清理，不影响其他测试。

### 关键要点

## 案例 3 关键要点

案例 3 的关键要点对照表

- | 要点 | 说明 | 常见问题 |
- | --- | --- | --- |
- | 边界清晰 | 只 Mock 外部依赖，不要 Mock 被测逻辑本身 | Mock 过度，测试变成了测 Mock |
- | 返回真实 | Mock 返回值要模拟真实响应结构 | 返回值过于简单，没覆盖边界情况 |
- | 验证调用 | 不仅验证结果，还要验证依赖是否被正确调用 | 只验证返回，没验证交互逻辑 |
- | 清理状态 | 确保测试间 Mock 状态隔离 | Mock 状态泄漏到其他测试 |

## 常见误区：初学者最容易踩的坑

误区说明

以下是 Pytest 使用中常见的五个误区，了解这些误区可以帮助你避免踩坑，也能在面试中展示你的经验。

### 误区 1：把所有 Fixture 都写在根目录 conftest.py

## 误区 1：Fixture 文件组织混乱

Fixture 文件组织混乱的误区

### 错误表现

所有 Fixture 都写在根目录的 conftest.py，文件越来越大，维护困难。

### 为什么错

根目录 conftest.py 的 Fixture 在所有测试中可用，但不同模块可能只需要部分 Fixture。全部堆在一起导致命名冲突、加载变慢、职责不清。

### 正确做法

按模块拆分 Fixture。通用 Fixture（环境配置、日志初始化）放根目录 conftest.py。模块专用 Fixture 放对应子目录的 conftest.py。Pytest 会自动加载当前目录和父目录的 conftest.py。

### 面试应对

被问 Fixture 组织时，先说明分层原则：通用层放根目录，业务层按模块拆分。然后举例说明：比如支付模块有支付专用 Fixture，用户模块有用户专用 Fixture，互不干扰。

## 误区 2：Fixture 作用域选择一刀切

Fixture 作用域选择一刀切的误区

### 错误表现

要么全用默认 function 作用域，要么全用 session 作用域，不考虑实际场景。

### 为什么错

function 作用域每个用例都初始化，资源开销大。session 作用域全程只初始化一次，可能导致用例间相互影响。选择不当要么浪费资源，要么引入隐患。

### 判断流程

首先问自己这个资源初始化成本高吗？高成本（数据库连接、浏览器启动）考虑大作用域。然后问不同用例需要独立状态吗？需要独立则用 function 或 class。

最后问资源需要清理吗？需要清理则用 yield 确保清理逻辑执行。

### 选择表格

| 资源类型 | 推荐作用域 | 理由 | | 数据库连接池 | session | 初始化成本高，可共享 | | 测试账号 token | module 或 class | 可能过期，需要定期刷新 | | 测试数据记录 | function | 每个用例独立，避免互相影响 | | 临时文件目录 | function 或 module | 需要清理，避免磁盘堆积 |

### 面试应对

被问作用域选择时，先说原则：根据资源初始化成本和隔离需求权衡。然后举例：数据库连接池用 session 因为建立连接慢且可共享。测试数据用 function 因为每个用例需要独立数据状态。

## 误区 3：Fixture 命名没有含义

Fixture 命名没有含义的误区

### 错误表现

Fixture 命名为 fixture1、data1、setup 等无意义名称。

### 为什么错

看名字不知道这个 Fixture 做什么，维护时需要读代码才能理解。多人协作时更容易产生重复或冲突。

### 正确做法

命名体现职责和返回内容。\n\n比如 db_connection 表示数据库连接，test_user 表示测试用户数据，clean_db 表示清理数据库状态。用动词 + 名词或形容词 + 名词的组合。

### 面试应对

强调命名规范的重要性，举例说明好的命名如何让代码自解释：看到 admin_user 就知道是管理员账号，看到 fresh_db 就知道是干净的数据库状态。

## 误区 4：参数化爆炸，用例数失控

参数化爆炸的误区

### 错误表现

参数化覆盖所有可能的输入组合，用例数量成倍增长，执行时间过长。

### 为什么错

不是所有组合都有测试价值。盲目参数化导致测试套件臃肿，CI 时间过长，维护成本增加。

### 正确做法

参数化只覆盖有价值的边界值和典型场景。使用等价类划分和边界值分析减少冗余组合。可以用 ids 参数给每组数据命名，让报告更易读。

### 面试应对

说明参数化的设计原则：只测有价值的组合。

举例：登录接口不需要测试所有用户名密码组合，但需要测试正确、错误、空值、超长等边界情况。

## 误区 5：忽略资源清理

忽略资源清理的误区

### 错误表现

Fixture 只做初始化，不做清理。或者清理逻辑写错位置（yield 之前）。

### 为什么错

资源不清理会导致后续测试受影响，比如数据库残留数据、临时文件未删除、进程未退出。长期运行会产生内存泄漏、磁盘空间不足等问题。

### 正确做法

使用 yield 分隔初始化和清理逻辑。yield 之前是初始化，yield 之后是清理。即使测试失败，清理逻辑也会执行。清理逻辑要考虑异常处理，确保即使清理过程出错也不影响后续测试。

### 面试应对

强调资源清理的重要性，举例说明：数据库测试后要删除测试数据，临时文件测试后要删除文件，浏览器测试后要关闭窗口。展示 yield 的正确用法。

## 面试问答：如何把知识讲清楚

面试问答说明

以下是 Pytest 面试中的高频问题，掌握这些问题能帮助你在面试中自信地展示你的 Pytest 能力。

### 问题优先级说明

## 面试问题优先级

面试问题的频率、难度和优先级对照表

- | 问题 | 频率 | 难度 | 优先级 |
- | --- | --- | --- | --- |
- | Q1：项目结构设计 | 高 | 中 | P0 |
- | Q2：Fixture 作用域选择 | 高 | 中 | P0 |
- | Q3：参数化设计 | 高 | 低 | P0 |
- | Q4：测试数据管理 | 中 | 高 | P1 |
- | Q5：Pytest 相比 unittest 的优势 | 高 | 低 | P1 |

## Q1：你如何设计 Pytest 项目结构？（P0）

项目结构设计问题的回答骨架和深度答案

### 回答骨架

分三层回答：目录结构、Fixture 分层、配置管理。

### 深度答案

**目录结构**：tests/ 目录按业务模块划分子目录，每个子目录有自己的 conftest.py。config/ 目录存放环境配置，支持多环境切换。utils/ 目录存放工具函数，如请求封装、日志封装。reports/ 目录存放测试报告。pytest.ini 或 pyproject.toml 存放 Pytest 配置。

**Fixture 分层**：根目录 conftest.py 存放最通用的 Fixture，如环境配置、日志初始化、数据库连接池。子目录 conftest.py 存放模块专用 Fixture，如支付模块的支付账号、用户模块的测试用户。

**配置管理**：使用 pytest.ini 集中配置测试目录、标记注册、命令行参数默认值。避免每个人运行时输入不同参数，保证团队执行一致。

### 追问应对

## Q1 追问应对

Q1 的追问应对策略

- | 追问 | 应对策略 |
- | --- | --- |
- | conftest.py 有多个时加载顺序是什么？ | 先加载父目录，再加载子目录。子目录可以覆盖父目录的同名 Fixture。 |
- | 如何让某些 Fixture 只在特定条件下执行？ | 使用 autouse=False 配合用例显式声明，或使用 pytest.mark 标记控制执行范围。 |

## Q2：Fixture 作用域你怎么选择？（P0）

Fixture 作用域选择问题的回答骨架和深度答案

### 回答骨架

先说四个作用域区别，再说选择原则，最后举实际例子。

### 深度答案

**四个作用域**：function（默认）每个测试函数执行一次。class 每个测试类执行一次。module 每个测试文件执行一次。session 整个测试会话执行一次。

**选择原则**：初始化成本高的资源用大作用域（数据库连接池用 session）。需要独立状态的资源用小作用域（测试数据用 function）。资源需要清理时必须用 yield 确保清理执行。

**实际例子**：数据库连接池用 session，因为建立连接慢且可共享。测试用户 token 用 module 或 class，因为可能过期需要刷新。每条测试数据用 function，因为用例间不能互相影响。

### 追问应对

## Q2 追问应对

Q2 的追问应对策略

- | 追问 | 应对策略 |
- | --- | --- |
- | session 作用域的 Fixture 什么时候销毁？ | 所有测试执行完毕后销毁。\n\n如果中途异常，也会执行 yield 后的清理逻辑。 |
- | 作用域设置错误会有什么问题？ | 太小会浪费资源，太大会导致用例间状态污染。需要根据实际情况权衡。 |

## Q3：参数化和数据驱动如何做？（P0）

参数化和数据驱动问题的回答骨架和深度答案

### 回答骨架

先说参数化语法，再说数据分离方案，最后说设计原则。

### 深度答案

**参数化语法**：使用 @pytest.mark.parametrize 装饰器，第一个参数是参数名（字符串或列表），第二个参数是参数值列表。多参数时传多个参数名和对应的元组列表。

**数据分离方案**：测试数据存储在独立文件（YAML 或 JSON），通过 Fixture 或钩子函数加载。数据文件和测试代码分开维护，非技术人员也能修改数据。

**设计原则**：只参数化有价值的组合，避免用例爆炸。使用 ids 参数给每组数据命名，提高报告可读性。边界值、异常值、典型正常值各覆盖一组即可。

### 追问应对

## Q3 追问应对

Q3 的追问应对策略

- | 追问 | 应对策略 |
- | --- | --- |
- | 多个 parametrize 装饰器叠加会怎样？ | 会生成笛卡尔积，用例数成倍增长。要谨慎使用叠加。 |
- | 如何在参数化中跳过某些用例？ | 在参数值中传入 pytest.skip 或使用 pytest.mark.xfail 标记预期失败。 |

## Q4：测试数据如何管理？（P1）

测试数据管理问题的回答骨架和深度答案

### 回答骨架

分三个层次：数据来源、数据组织、数据清理。

### 深度答案

**数据来源**：静态数据用 YAML/JSON 文件存储，适合配置类数据。动态数据用 Factory 模式或 Builder 模式生成，适合业务对象。预置数据用数据库脚本或 API 初始化，适合依赖数据。

**数据组织**：按业务场景分文件，如 users.yml、orders.yml。按环境分层级，如 dev/、staging/、prod/。使用 Fixture 封装数据加载逻辑，用例通过参数注入数据。

**数据清理**：测试完成后清理测试数据，避免污染后续测试。可以使用数据库事务回滚、临时数据表、数据标记软删除等策略。

### 追问应对

## Q4 追问应对

Q4 的追问应对策略

- | 追问 | 应对策略 |
- | --- | --- |
- | 测试数据和测试代码放同一仓库吗？ | 可以放同一仓库不同目录，也可以放独立仓库。小团队推荐同一仓库，便于版本同步。 |
- | 如何处理数据依赖？ | 使用 Fixture 的依赖注入，被依赖的数据先初始化。或使用钩子函数控制执行顺序。 |

## Q5：Pytest 相比 unittest 有什么优势？（P1）

Pytest 相比 unittest 优势问题的回答骨架和深度答案

### 回答骨架

从三个角度回答：代码简洁性、功能丰富性、生态完善性。

### 深度答案

**代码简洁性**：Pytest 不需要继承 TestCase 类，不需要 self.assertXxx() 方法，直接用 assert 语句。同样的测试功能，Pytest 代码量减少 30%-50%，可读性更高。

**功能丰富性**：内置参数化、自动发现用例、详细失败报告。Fixture 机制比 setUp/tearDown 更灵活，支持不同作用域和依赖注入。标记系统支持按标签筛选执行。

**生态完善性**：数百个插件覆盖报告、并行、重试、Mock 等场景。与 CI/CD 无缝集成，报告格式通用。社区活跃，问题容易找到解决方案。

### 追问应对

## Q5 追问应对

Q5 的追问应对策略

- | 追问 | 应对策略 |
- | --- | --- |
- | 什么时候还用 unittest？ | 需要兼容老项目、团队对 unittest 更熟悉、项目依赖 unittest 特定功能时。新项目推荐 Pytest。 |
- | Pytest 能运行 unittest 用例吗？ | 可以，Pytest 兼容 unittest，直接运行即可。但建议逐步迁移到 Pytest 风格。 |

## 面试回答的核心技巧

面试回答的核心技巧总结

- | 技巧 | 说明 | 示例 |
- | --- | --- | --- |
- | 先说骨架再展开 | 开头一句话概括，再分点展开 | "我分三层设计：目录结构、Fixture 分层、配置管理" |
- | 举具体例子 | 不要只讲概念，要有实际场景 | "比如数据库连接池，我用 session 作用域" |
- | 说明为什么 | 不只要说怎么做，要说为什么这样设计 | "因为数据库连接建立慢，用 session 可以复用" |
- | 展示权衡思维 | 说明选择的取舍，体现设计思考 | "大作用域节省资源，但可能影响隔离性，需要权衡" |
