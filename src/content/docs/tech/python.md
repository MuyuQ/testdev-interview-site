---
title: "Python 测试开发基础"
description: "掌握函数、列表、字典、异常处理与模块导入，构建测试自动化核心能力"
category: "tech"
stage: "practice"
estimatedMinutes: 18
difficulty: "interview"
interviewWeight: 3
tags: ["编程基础", "Python", "测试开发"]
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper"]
prerequisites:
  - "beginner-course/python-testing-minimum"
  - "beginner-course/pytest-first-test"
  - "glossary/unit-testing"
outcomes:
  - "能用列表推导与字典处理测试结果数据"
  - "能写出带异常捕获的健壮请求函数"
  - "能解释可变默认参数与循环导入的坑"
selfTests:
  - id: "python-q1"
    question: "以下哪个是 Python 列表推导式的正确语法？"
    options:
      [
        "[x for x in range(10)]",
        "{x for x in range(10)}",
        "(x for x in range(10))",
        "<x for x in range(10)>",
      ]
    correctIndex: 0
    explanation: "列表推导式使用方括号，返回列表类型。"
  - id: "python-q2"
    question: "try-except-finally 中，finally 块何时执行？"
    options:
      ["总是执行", "只有异常时执行", "只有无异常时执行", "可以跳过不执行"]
    correctIndex: 0
    explanation: "finally 块无论是否发生异常都会执行，常用于资源清理。"
  - id: "python-q3"
    question: "导入模块时，以下哪种方式会污染命名空间？"
    options:
      [
        "import module",
        "from module import *",
        "import module as alias",
        "from module import func",
      ]
    correctIndex: 1
    explanation: "使用 * 导入会引入所有公开名称，可能覆盖已有变量，不推荐使用。"
  - id: "python-q4"
    question: "以下关于浅拷贝与深拷贝的说法，正确的是？"
    options:
      [
        "copy.deepcopy 会递归复制所有嵌套对象",
        "浅拷贝会复制所有嵌套的子对象",
        "变量赋值（b = a）就是深拷贝",
        "字典和列表在拷贝上没有区别",
      ]
    correctIndex: 0
    explanation: "deepcopy 递归复制所有层级的嵌套对象，副本完全独立；浅拷贝只复制最外层，内层对象仍共享引用；赋值只是引用同一对象，连浅拷贝都算不上。测试数据加工时用错拷贝方式，常导致改了这份数据另一份也跟着变的诡异失败。"
---

## 1. 解决什么问题

Python 在测试开发中解决以下核心问题：

- **自动化脚本编写**：快速实现接口测试、UI 自动化、数据验证等任务
- **测试数据处理**：灵活处理 JSON、CSV、数据库查询结果等测试数据
- **测试框架搭建**：基于 pytest、unittest 构建可扩展的测试工程
- **工具链集成**：通过模块导入整合 CI/CD、报告生成、通知推送等能力
- **异常场景覆盖**：优雅处理网络超时、数据缺失、断言失败等边界情况

## 2. 面试为什么问

- 考察编程基础是否扎实，能否胜任测试脚本开发
- 判断是否理解 Python 的核心特性（动态类型、内存管理、GIL 等）
- 评估代码风格和工程化意识（命名规范、异常处理、模块组织）
- 了解实际项目经验，区分"会用"与"精通"

## 3. 前置条件

- 理解变量、数据类型、运算符等编程基础概念
- 了解基本的控制流（if/else、for/while 循环）
- 安装 Python 3.8+ 环境，熟悉 pip 包管理

## 4. 核心概念

### 函数

函数是代码复用的基本单元，支持默认参数、可变参数和关键字参数。

```python
def run_test(case_name, timeout=30, **kwargs):
    """执行测试用例，支持扩展配置"""
    print(f"运行: {case_name}, 超时: {timeout}s")
    for key, value in kwargs.items():
        print(f"  配置: {key}={value}")
    return {"status": "passed", "duration": 1.5}

# 调用示例
result = run_test("登录测试", timeout=60, retry=3, env="staging")
```

### 列表

列表是有序可变序列，支持切片、推导式等操作。

```python
# 列表推导式：过滤失败的测试用例
test_results = [
    {"name": "test_login", "status": "passed"},
    {"name": "test_logout", "status": "failed"},
    {"name": "test_query", "status": "passed"},
]
failed_cases = [r["name"] for r in test_results if r["status"] == "failed"]

# 切片操作
all_cases = ["case1", "case2", "case3", "case4", "case5"]
batch_one = all_cases[:3]   # 取前三个
batch_two = all_cases[3:]   # 取后两个
```

### 字典

字典是键值对映射结构，测试数据常用字典表示。

```python
# 测试用例配置
test_case = {
    "name": "用户登录",
    "steps": [
        {"action": "input", "locator": "#username", "value": "admin"},
        {"action": "input", "locator": "#password", "value": "123456"},
        {"action": "click", "locator": "#login-btn"},
    ],
    "assertion": {"type": "text", "locator": ".welcome", "expected": "欢迎"}
}

# 字典的 get 方法避免 KeyError
actual = test_case.get("expected_result", "默认值")

# 字典推导式
status_map = {r["name"]: r["status"] for r in test_results}
```

### 异常处理

异常处理保证测试脚本的健壮性，避免因意外错误中断执行。

```python
def safe_request(url, retries=3):
    """安全的 HTTP 请求，自动重试"""
    import requests

    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # 非 2xx 状态码抛异常
            return response.json()
        except requests.Timeout:
            print(f"请求超时，第 {attempt + 1} 次重试...")
        except requests.RequestException as e:
            print(f"请求失败: {e}")
            break
        finally:
            print("请求结束，清理资源")
    return None
```

### 模块导入

模块导入实现代码组织和复用，测试框架依赖这一机制。

```python
# 标准库导入
import json
from datetime import datetime

# 第三方库导入
import pytest
import requests

# 本地模块导入（推荐绝对导入）
from utils.assertion import assert_equal
from config.settings import BASE_URL

# 动态导入（高级用法）
module_name = "test_login"
test_module = __import__(f"tests.{module_name}", fromlist=[""])
```

## 5. 最小例子

一个完整的测试函数示例，综合运用函数、列表、字典、异常和导入：

```python
# test_user_api.py
import pytest
import requests
from utils.assertion import assert_response

def test_get_user_list():
    """测试获取用户列表接口"""
    # 准备测试数据
    url = "https://api.example.com/users"
    headers = {"Authorization": "Bearer test_token"}

    # 发送请求并处理异常
    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()
    except requests.RequestException as e:
        pytest.fail(f"接口请求失败: {e}")

    # 断言响应
    assert response.status_code == 200
    assert isinstance(data, list)
    assert all("id" in user and "name" in user for user in data)
```

## 6. 项目落地

在真实测试项目中，这些概念的应用场景：

| 概念 | 应用场景                                    |
| ---- | ------------------------------------------- |
| 函数 | 封装通用操作（登录、断言、数据生成）        |
| 列表 | 存储测试用例集合、批量执行结果              |
| 字典 | 定义测试数据、配置参数、API 响应            |
| 异常 | 处理网络超时、元素定位失败、数据校验错误    |
| 模块 | 组织项目结构（pages、utils、tests、config） |

项目目录结构示例：

```
test_project/
├── config/
│   └── settings.py      # 配置模块
├── pages/
│   └── login_page.py    # 页面对象模块
├── tests/
│   ├── conftest.py      # pytest 配置和 fixtures
│   └── test_login.py    # 测试用例模块
├── utils/
│   ├── assertion.py     # 断言工具模块
│   └── logger.py        # 日志工具模块
└── requirements.txt
```

## 7. 常见坑

### 可变默认参数

```python
# 错误：默认参数是可变对象
def add_case(case, case_list=[]):
    case_list.append(case)
    return case_list

# 正确：使用 None 作为默认值
def add_case(case, case_list=None):
    if case_list is None:
        case_list = []
    case_list.append(case)
    return case_list
```

### 循环中修改列表

```python
# 错误：遍历时删除元素
numbers = [1, 2, 3, 4, 5]
for n in numbers:
    if n % 2 == 0:
        numbers.remove(n)  # 可能遗漏元素

# 正确：使用列表推导式或倒序遍历
numbers = [n for n in numbers if n % 2 != 0]
```

### 异常捕获过于宽泛

```python
# 错误：捕获所有异常，掩盖真实问题
try:
    do_something()
except:
    pass

# 正确：捕获具体异常并记录
try:
    do_something()
except (ValueError, TypeError) as e:
    logger.error(f"数据处理错误: {e}")
    raise
```

### 循环导入

```python
# module_a.py
from module_b import func_b  # module_b 可能还未加载完成

# 正确：延迟导入或重构模块结构
def func_a():
    from module_b import func_b
    return func_b()
```

## 8. 追问骨架

面试官可能的追问路径：

1. **函数** → 装饰器原理？闭包应用场景？生成器 vs 列表？
2. **列表/字典** → 深拷贝 vs 浅拷贝？字典底层实现？有序性保证？
3. **异常** → 自定义异常？异常链？上下文管理器 with 语句？
4. **模块** → `__init__.py` 作用？相对导入 vs 绝对导入？模块缓存机制？
5. **综合** → GIL 对多线程的影响？内存管理与垃圾回收？性能优化策略？

### 参考回答精选

**问：深拷贝和浅拷贝的区别？测试脚本里什么时候会踩？**

回答骨架：

> 浅拷贝（copy.copy、切片、dict.copy）只复制最外层，嵌套对象共享引用；深拷贝（copy.deepcopy）递归复制所有层级。测试脚本里最常踩的场景是给用例"复制"一份基线数据再修改——用浅拷贝时改了嵌套的 dict，基线也被改掉，后面的用例拿到脏数据偶发失败。规则很简单：共享只读基线用浅拷贝，要改嵌套结构必须 deepcopy。

**问：GIL 对测试并行有什么影响？**

回答骨架：

> GIL 让同一进程内多个线程无法真正并行执行 Python 字节码，所以 CPU 密集的断言、数据处理用多线程没有收益；但 IO 密集场景（并发发 HTTP 请求）线程会在等待时释放 GIL，多线程仍然有效。要吃满多核就用多进程：pytest-xdist 本质就是多进程并行，这也是它比线程方案更适合测试并行的原因。

## 9. 练习

1. 编写一个函数 `parse_test_data(file_path)`，读取 JSON 文件并返回测试数据列表，处理文件不存在和 JSON 格式错误的异常
2. 实现一个简单的测试报告生成器，使用字典存储结果统计，使用列表存储详细用例信息
3. 创建一个模块 `retry_utils.py`，提供装饰器 `@retry(times=3)` 实现失败重试功能
4. 使用列表推导式和字典推导式，从测试结果列表中提取所有失败用例并生成 `{用例名: 错误信息}` 的映射

## 版本与生态

Python 版本迭代对测试开发有实际影响，重点是"能用什么语法、该选什么版本"：

| 版本 | 关键特性                                     | 对测试开发的意义               |
| ---- | -------------------------------------------- | ------------------------------ |
| 3.8  | 海象运算符 `:=`、f-string 自文档化 `f"{x=}"` | 调试打印变量更省事             |
| 3.9  | `list[int]` 等内置泛型注解                   | 类型标注不再依赖 typing 大写类 |
| 3.10 | `match-case` 结构化分支、联合类型 `X \| Y`   | 参数校验分支更清晰             |
| 3.11 | 异常组、报错信息精确到表达式位置             | 排查测试脚本报错更快           |
| 3.12 | f-string 支持嵌套引号、`type` 别名语法       | 模板化数据校验更顺手           |

选型原则：测试工具链跟随被测服务的主流版本，通常选稳定版区间（当前 3.10/3.11 是主流），团队统一比追新重要；CI 里至少覆盖最低支持版本，避免"本地 3.12 写的语法 CI 3.9 跑不了"。

## 踩坑实录

### 坑1：拼接响应字段时报 TypeError

```text
TypeError: can only concatenate str (not "int") to str
```

**根因**：接口返回的 `user_id` 是 int，代码里直接 `"用户ID：" + user_id` 拼接。动态类型在写代码时不报错，跑起来才炸，测试脚本里这类错误常出现在断言消息拼接处。

**修复**：统一用 f-string：`f"用户ID：{user_id}"`；对响应字段先做类型校验再使用，类型问题应该在断言层暴露，而不是在日志拼接时暴露。

### 坑2：响应缺字段导致 KeyError

```text
KeyError: 'data'
```

**根因**：用 `response.json()["data"]` 直接取值，接口异常时返回结构里没有 `data` 字段，用例不是"断言失败"而是"报错崩溃"，报告里只有一堆堆栈，看不出业务差异。

**修复**：读取用 `data = body.get("data")`，取不到时走显式断言：`assert data is not None, f"响应缺少 data 字段: {body}"`——把"结构异常"翻译成人能看懂的断言失败，定位效率完全不同。

### 坑3：从不同目录运行报 ModuleNotFoundError

```text
ModuleNotFoundError: No module named 'utils'
```

**根因**：`utils` 包在项目根目录下，在项目根目录运行 `pytest` 能找到；切到 `tests/` 目录运行时 `sys.path` 里没有根目录，导入全部失败。同一段代码"有时能跑有时不能跑"，根因是运行目录。

**修复**：规范入口，永远从项目根目录用 `python -m pytest` 运行（`-m` 会把当前目录加入 `sys.path`）；包目录补齐 `__init__.py`；团队用 Makefile 或脚本统一入口，禁止在子目录裸跑 pytest。

## 10. 关联

- **pytest 框架**：基于 Python 的测试框架，深入 fixture、parametrize 等高级特性
- **接口测试**：Python + requests 库实现 API 自动化测试
- **数据驱动测试**：结合 JSON/YAML 配置文件实现参数化测试
- **测试报告**：Allure、HTMLTestRunner 生成可视化测试报告

## 11. 下一步

掌握 Python 基础后，下一步是把语言能力转化为测试工程能力：

1. **进阶框架**：直接学习 [pytest](/testdev-interview-site/tech/pytest/)，用 fixture、parametrize 组织可维护的测试工程
2. **接口实战**：用 [接口测试](/testdev-interview-site/tech/api-testing/) 把 requests 与断言设计结合起来写 API 用例
3. **断言沉淀**：把常用校验抽成工具函数，参考 [断言封装](/testdev-interview-site/coding/assertion-wrapper/)
4. **避坑巩固**：对照本文"常见坑"逐条写反例，确保吃透可变默认参数、循环导入等陷阱

面试冲刺把"深拷贝 vs 浅拷贝""异常链""模块缓存机制"三个追问作为必背项。
