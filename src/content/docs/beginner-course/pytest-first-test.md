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

这节帮你真正跑起第一个测试：

- 安装和运行 Pytest
- 写出第一个通过的测试
- 写出第一个失败的测试
- 理解 Pytest 的测试发现规则

学完后，你能创建一个测试文件、运行它、并看懂输出里哪个过了哪个挂了。这是后面所有接口测试、框架练习的起点。

## 为什么要学

Pytest 是测试开发最常用的 Python 测试框架。它比 unittest 更简洁，插件生态更丰富，是测开面试必问技能。

先学会写一个最简单的 Pytest 测试，后面接口测试、框架设计都基于这个基础。连"测试怎么被发现、怎么被运行"都没搞清，直接写接口测试只会处处踩坑。

## 前置知识

已完成上一节 `python-testing-minimum`，掌握函数和 assert。需要本机装好 Python（建议 3.8+）。

## 核心概念

### 安装 Pytest

```bash
pip install pytest
```

安装后可以运行 `pytest --version` 检查版本。建议用虚拟环境（`python -m venv venv`）隔离依赖，避免和系统的包互相污染——这是工程里的基本习惯。

### 用哪种命令运行

推荐用 `python -m pytest` 而不是裸 `pytest`：

```bash
python -m pytest test_math.py
```

区别：裸 `pytest` 用的是 PATH 里找到的那个 pytest，可能装错环境；`python -m pytest` 保证用"当前这个 Python 解释器"对应的 pytest，环境一定对。初学阶段两者通常一样，但养成 `python -m pytest` 的习惯能少踩很多"明明装了却找不到"的坑。

### 测试发现规则

Pytest 自动发现测试，规则是：

- 文件名：`test_*.py` 或 `*_test.py`
- 函数名：以 `test_` 开头
- 目录：默认递归当前目录及子目录

不需要手动注册，只要命名符合规则就会被发现。这也是为什么命名前缀这么重要——改错一个前缀，测试就"消失"了。

### 最小测试

```python
def test_add():
    assert 1 + 1 == 2
```

这就是一个完整的 Pytest 测试：

- 文件名：`test_math.py`
- 函数名：`test_add`
- 断言：`assert 1 + 1 == 2`

Pytest 找到 `test_add` 后执行它，断言成立就算通过。

### 运行测试

```bash
pytest test_math.py
```

输出类似：

```text
test_math.py .  [100%]
1 passed in 0.01s
```

- `.` 表示通过（pass）
- `F` 表示失败（fail）
- `[100%]` 是进度，表示测试已跑完的比例

常用运行参数：
- `-v`（`--verbose`）：显示每个测试的名字和结果，信息更全
- `-q`（`--quiet`）：只显示 `.`/`F` 汇总，更安静
- `-k 关键字`：只跑名字含关键字的测试，比如 `pytest -k add` 只跑 `test_add`

## 最小示例

一个通过的测试和一个失败的测试，看输出怎么区分：

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

逐行看输出：
- `.F`：第一个测试通过（`.`），第二个失败（`F`），顺序和函数定义一致
- `1 passed, 1 failed`：汇总
- 失败时 Pytest 还会额外打印断言位置和"期望 vs 实际"，告诉你 `1 == 2` 不成立

失败时不要慌，先看它指出的那一行——绝大多数问题一眼就能定位。

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
    assert result == 6  # 故意写错，观察失败输出
```

4. 运行：`pytest test_math.py -v`

`-v` 显示详细信息，你能看到哪个通过哪个失败，以及每个测试的全名。

5. 把失败的断言改成正确的（`assert result == 5`），再次运行，确认两条都绿。

**小提示**：如果运行后提示"no tests ran"，先检查文件名和函数名是否都以 `test_` 开头，再检查当前目录对不对。

## 检查标准

完成本节的标准：

- 你安装了 Pytest，并能用 `pytest --version` 看到版本
- 你写了至少 2 个测试函数
- 你运行 pytest 看到了通过（`.`）和失败（`F`）
- 你理解测试文件命名规则，以及 `-v` 参数的作用

## 常见错误

**错误 1：文件名不以 test_ 开头**

Pytest 不会发现 `my_test.py`（没有 test_ 前缀）。命名必须符合规则，否则测试"凭空消失"。

**错误 2：函数名不以 test_ 开头**

`def check_add()` 不会被识别为测试，必须写成 `def test_add()`。

**错误 3：忘记断言**

只有函数没有 assert，Pytest 会报"no assertions"。没有断言，测试永远"通过"——这比失败更危险，因为它在假装测了。

**错误 4：用 `python test_math.py` 跑测试**

这样不会触发 Pytest 的发现机制，只是把文件当普通脚本执行。除非文件里有顶层 assert，否则看起来"通过了"其实根本没跑测试框架。要用 `pytest` 或 `python -m pytest`。

## 面试怎么说

如果面试官问："你用 Pytest 写测试的基本流程是什么？"，可以回答：

"我创建 test_ 开头的文件，在里面写 test_ 开头的函数，用 assert 断言验证结果。运行 pytest 命令，它会自动发现所有测试并执行。如果断言失败，Pytest 会报告具体位置和错误信息。我一般用 `-v` 看详细结果，用 `-k` 挑某条测试单独跑。"

这个回答简洁展示了你对 Pytest 使用流程的理解，还顺带提到了实用参数，比只说"跑 pytest"更像个用过的人。

## 下一步

下一节：[HTTP 和接口测试基础](../http-api-basics/)

延伸阅读：
- [技术专题：Pytest](../../tech/pytest/)
- [术语体系：单元测试](../../glossary/unit-testing/)