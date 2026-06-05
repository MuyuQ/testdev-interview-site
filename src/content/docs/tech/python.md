---
title: "Python 测试开发基础"
description: "掌握函数、列表、字典、异常处理与模块导入，构建测试自动化核心能力"
category: "tech"
difficulty: "interview"
interviewWeight: 3
tags: ["编程基础", "Python", "测试开发"]
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper"]
prerequisites: []
selfTests:
  - id: "python-q1"
    question: "以下哪个是 Python 列表推导式的正确语法？"
    options: ["[x for x in range(10)]", "{x for x in range(10)}", "(x for x in range(10))", "<x for x in range(10)>"]
    correctIndex: 0
    explanation: "列表推导式使用方括号，返回列表类型。"
  - id: "python-q2"
    question: "try-except-finally 中，finally 块何时执行？"
    options: ["总是执行", "只有异常时执行", "只有无异常时执行", "可以跳过不执行"]
    correctIndex: 0
    explanation: "finally 块无论是否发生异常都会执行，常用于资源清理。"
  - id: "python-q3"
    question: "导入模块时，以下哪种方式会污染命名空间？"
    options: ["import module", "from module import *", "import module as alias", "from module import func"]
    correctIndex: 1
    explanation: "使用 * 导入会引入所有公开名称，可能覆盖已有变量，不推荐使用。"
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

| 概念 | 应用场景 |
|------|----------|
| 函数 | 封装通用操作（登录、断言、数据生成） |
| 列表 | 存储测试用例集合、批量执行结果 |
| 字典 | 定义测试数据、配置参数、API 响应 |
| 异常 | 处理网络超时、元素定位失败、数据校验错误 |
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

## 9. 练习

1. 编写一个函数 `parse_test_data(file_path)`，读取 JSON 文件并返回测试数据列表，处理文件不存在和 JSON 格式错误的异常
2. 实现一个简单的测试报告生成器，使用字典存储结果统计，使用列表存储详细用例信息
3. 创建一个模块 `retry_utils.py`，提供装饰器 `@retry(times=3)` 实现失败重试功能
4. 使用列表推导式和字典推导式，从测试结果列表中提取所有失败用例并生成 `{用例名: 错误信息}` 的映射

## 10. 关联

- **pytest 框架**：基于 Python 的测试框架，深入 fixture、parametrize 等高级特性
- **接口测试**：Python + requests 库实现 API 自动化测试
- **数据驱动测试**：结合 JSON/YAML 配置文件实现参数化测试
- **测试报告**：Allure、HTMLTestRunner 生成可视化测试报告