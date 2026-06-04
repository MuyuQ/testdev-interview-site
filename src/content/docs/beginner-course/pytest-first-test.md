---
title: "Pytest 第一个测试用例"
description: "写出第一个可运行的 Pytest 测试，理解测试发现和运行机制。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "Pytest入门", "单元测试"]
relatedSlugs:
  - "beginner-course/http-api-basics"
  - "tech/pytest"
selfTests:
  - id: "beginner-pytest-name"
    question: "Pytest 如何发现测试函数？"
    options:
      - "所有函数都运行"
      - "文件名以 test_ 开头，函数名以 test_ 开头"
      - "只运行 main 函数"
      - "需要手动指定每个函数"
    correctIndex: 1
    explanation: "Pytest 自动发现 test_*.py 或 *_test.py 文件中以 test_ 开头的函数。"
  - id: "beginner-pytest-run"
    question: "运行 Pytest 测试的命令是什么？"
    options:
      - "python test.py"
      - "pytest"
      - "run pytest"
      - "test run"
    correctIndex: 1
    explanation: "直接运行 pytest 命令，它会自动发现并执行测试。"
  - id: "beginner-pytest-fail"
    question: "当 assert 失败时 Pytest 会怎样？"
    options:
      - "继续运行其他测试"
      - "停止所有测试"
      - "跳过当前测试"
      - "忽略错误"
    correctIndex: 0
    explanation: "Pytest 会报告失败但继续运行其他测试，最后汇总结果。"
---

## 你会学到什么

这节帮你：

- 安装和运行 Pytest
- 写出第一个通过的测试
- 写出第一个失败的测试
- 理解 Pytest 的测试发现规则

学完后，你能创建一个测试文件并运行它。

## 为什么要学

Pytest 是测试开发最常用的 Python 测试框架。它比 unittest 更简洁，插件生态更丰富，是测开面试必问技能。

先学会写一个最简单的 Pytest 测试，后面接口测试、框架设计都基于这个基础。

## 前置知识

已完成上一节 `python-testing-minimum`，掌握函数和 assert。

## 核心概念

### 安装 Pytest

```bash
pip install pytest
```

安装后可以运行 `pytest --version` 检查。

### 测试发现规则

Pytest 自动发现测试，规则是：

- 文件名：`test_*.py` 或 `*_test.py`
- 函数名：以 `test_` 开头

不需要手动注册，只要命名符合规则就会被发现。

### 最小测试

```python
def test_add():
    assert 1 + 1 == 2
```

这就是一个完整的 Pytest 测试：

- 文件名：`test_math.py`
- 函数名：`test_add`
- 断言：`assert 1 + 1 == 2`

### 运行测试

```bash
pytest test_math.py
```

输出类似：

```text
test_math.py .  [100%]
1 passed in 0.01s
```

`.` 表示通过，`F` 表示失败。

## 最小示例

一个通过的测试和一个失败的测试：

```python
# test_example.py

def test_pass():
    assert "hello" == "hello"

def test_fail():
    assert 1 == 2  # 这会失败
```

运行：

```bash
pytest test_example.py
```

输出：

```text
test_example.py .F  [100%]
1 passed, 1 failed
```

失败时会显示断言位置和错误信息。

## 手把手练习

**练习：写一个加减测试**

1. 新建文件 `test_math.py`

2. 写一个 add 函数和测试：

```python
def add(a, b):
    return a + b

def test_add_two_numbers():
    result = add(2, 3)
    assert result == 5
```

3. 写一个失败的测试：

```python
def test_add_wrong():
    result = add(2, 3)
    assert result == 6  # 故意写错
```

4. 运行：`pytest test_math.py -v`

`-v` 显示详细信息，你能看到哪个通过哪个失败。

5. 把失败的断言改成正确的，再次运行。

## 检查标准

完成本节的标准：

- 你安装了 Pytest
- 你写了至少 2 个测试函数
- 你运行 pytest 看到了通过和失败
- 你理解测试文件命名规则

## 常见错误

**错误 1：文件名不以 test_ 开头**

Pytest 不会发现 `my_test.py`（没有 test_ 則缀）。命名必须符合规则。

**错误 2：函数名不以 test_ 开头**

`def check_add()` 不会被识别为测试，必须写成 `def test_add()`。

**错误 3：忘记断言**

只有函数没有 assert，Pytest 会报"no assertions"。

## 面试怎么说

如果面试官问："你用 Pytest 写测试的基本流程是什么？"，可以回答：

"我创建 test_ 开头的文件，在里面写 test_ 开头的函数，用 assert 断言验证结果。运行 pytest 命令，它会自动发现所有测试并执行。如果断言失败，Pytest 会报告具体位置和错误信息。"

这个回答简洁展示了你对 Pytest 使用流程的理解。

## 下一步

下一节：[HTTP 和接口测试基础](../http-api-basics/)

延伸阅读：
- [技术专题：Pytest](../../tech/pytest/)
- [术语体系：单元测试](../../glossary/unit-testing/)