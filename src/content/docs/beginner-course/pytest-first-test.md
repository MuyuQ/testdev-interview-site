---
title: "Pytest 第一个测试用例"
description: "写出第一个可运行的 Pytest 测试，理解测试发现和运行机制。"
category: "beginner-course"
stage: "foundation"
estimatedMinutes: 50
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "Pytest入门", "单元测试"]
prerequisites:
  - "beginner-course/python-testing-minimum"
outcomes:
  - "能独立写出并运行一个以 test_ 开头的 Pytest 用例"
  - "能解释 Pytest 的测试发现与执行机制"
  - "面试时能讲清测试函数命名规范的作用"
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
  - id: "pytest-first-test-q4"
    question: "pytest -k add 这个命令的作用是什么？"
    options:
      - "只运行名字里含 add 的测试"
      - "运行所有测试并打印 add 相关日志"
      - "删除 add 相关的测试"
      - "检查 add 函数的语法"
    correctIndex: 0
    explanation: "-k 按名字过滤用例，pytest -k add 只执行名字里含 add 的测试，其余会被标记为 deselected。调试阶段挑某条用例单独跑时非常常用。"
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

排查"测试没被发现"的第一步是运行 `pytest --collect-only`：它不执行测试，只列出 Pytest 认到的所有用例。你的用例不在列表里，就是命名或路径问题；在列表里但执行失败，才是代码问题。先收集、再执行，排查方向立刻收窄一半。

### 一条测试什么时候算"通过"

规则很简单：函数正常执行完、没有抛出任何异常，就是通过。反过来说，让测试出问题的途径不止 assert：

- `assert` 条件不成立 → 失败（F），这是"预期的失败"，报错最清晰
- 函数中途抛了别的异常（比如 KeyError）→ 错误（E），说明测试代码或被测对象本身出了问题

Pytest 的输出里 F 和 E 是不同的标记。排查时先分清：F 优先怀疑"预期或逻辑不对"，E 优先怀疑"代码写错了"。这个区分在后面的接口测试里同样适用——断言失败和请求异常是两条排查路径。

### 和 unittest 的直观对比

面试常问"为什么选 Pytest"，用一张表就够：

| 维度     | unittest                             | Pytest                         |
| -------- | ------------------------------------ | ------------------------------ |
| 断言     | 必须用 self.assertEqual 等一整套方法 | 原生 `assert` 表达式即可       |
| 用例写法 | 继承 TestCase 类                     | 普通函数                       |
| 失败信息 | 简短                                 | 自动展开实际值 vs 期望值       |
| 生态     | 标准库自带                           | 插件丰富（参数化、报告、重试） |

不是 unittest 不能用，而是 Pytest 的上手成本和表达成本都更低，这也是它成为测开岗位默认技能的原因。

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

### 从"能跑"到"工程可用"

把同一个测试升级一遍，看差距在哪：

```python
# test_math.py
# 版本 1：能跑，但失败时信息量不足
def test_add():
    assert add(2, 3) == 5

# 版本 2：工程可用
def test_add_two_positive_numbers():
    # 改进 1：名字带场景信息，失败时不用打开代码就知道测的是什么
    result = add(2, 3)
    # 改进 2：先算后断，报错时 Pytest 能显示 result 的实际值
    # 改进 3：断言带自定义消息，失败原因一眼可见
    assert result == 5, f"2 + 3 应等于 5，实际得到 {result}"
```

版本 1 和版本 2 在"全绿"时看不出区别，差别全部体现在失败的那一刻——而测试框架的价值恰恰是在失败时帮你省时间。命名、断言消息、单一职责，这三件事是后面所有用例（包括接口测试）通用的工程习惯。

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

**练习变体**：

- 变体 1（观察发现机制）：建一个 `check_math.py`（名字不带 test\_ 前缀），把测试函数复制进去再运行 `pytest`，观察 "no tests ran"——亲手制造一次"测试消失"，比读十遍规则记得牢
- 变体 2（用 -k 过滤）：加一个 `def test_subtract():` 测试，运行 `pytest -k add`，确认只有 add 相关用例被执行
- 变体 3（看收集结果）：运行 `pytest --collect-only`，列出 Pytest 认到的所有测试及其文件路径和行号

**预期输出**：变体 2 的汇总应类似 `1 passed, 1 deselected`（deselected 就是被 -k 过滤掉的）；变体 3 能直接验证命名是否符合发现规则，是排查"测试没被跑"的第一动作。

## 检查标准

完成本节的标准：

- 你安装了 Pytest，并能用 `pytest --version` 看到版本
- 你写了至少 2 个测试函数
- 你运行 pytest 看到了通过（`.`）和失败（`F`）
- 你理解测试文件命名规则，以及 `-v` 参数的作用
- 你能说出 F 和 E 两种标记的区别
- 你会用 `--collect-only` 排查测试没被发现的问题

## 常见错误

**错误 1：文件名不以 test\_ 开头**

Pytest 不会发现 `my_test.py`（没有 test\_ 前缀）。命名必须符合规则，否则测试"凭空消失"。

**错误 2：函数名不以 test\_ 开头**

`def check_add()` 不会被识别为测试，必须写成 `def test_add()`。

**错误 3：忘记断言**

只有函数没有 assert，Pytest 会报"no assertions"。没有断言，测试永远"通过"——这比失败更危险，因为它在假装测了。

**错误 4：用 `python test_math.py` 跑测试**

这样不会触发 Pytest 的发现机制，只是把文件当普通脚本执行。除非文件里有顶层 assert，否则看起来"通过了"其实根本没跑测试框架。要用 `pytest` 或 `python -m pytest`。

**错误 5：pytest 装到了别的环境**

运行时报：

```text
ModuleNotFoundError: No module named 'pytest'
```

说明当前这个 Python 环境里没有 pytest——你可能装到了另一个解释器（比如系统 Python 和虚拟环境各有一套包）。排查步骤：①运行 `python -m pip list | grep pytest` 看当前环境有没有；②没有就 `python -m pip install pytest`；③以后统一用 `python -m pytest` 运行，保证解释器和 pytest 来自同一个环境。这正是前面推荐 `python -m pytest` 的原因。

**错误 6：断言前面的代码先炸了**

```text
def test_profile():
>       data = fetch_user(-1)
E       KeyError: 'name'
```

注意 `>` 指向的不是 assert，而是 assert 之前的那行——取值代码抛了异常，根本没走到断言。这类问题（标记 E）的排查顺序和断言失败（标记 F）不同：先确认上游代码和数据是否正常，再谈断言对不对。区分"没跑到断言"和"断言不通过"，能省一半排查时间。

## 面试怎么说

如果面试官问："你用 Pytest 写测试的基本流程是什么？"，可以回答：

"我创建 test* 开头的文件，在里面写 test* 开头的函数，用 assert 断言验证结果。运行 pytest 命令，它会自动发现所有测试并执行。如果断言失败，Pytest 会报告具体位置和错误信息。我一般用 `-v` 看详细结果，用 `-k` 挑某条测试单独跑。"

这个回答简洁展示了你对 Pytest 使用流程的理解，还顺带提到了实用参数，比只说"跑 pytest"更像个用过的人。

**追问 1**："Pytest 和 unittest 的区别，你说两个最关键的？"

参考回答："一是断言方式，Pytest 用原生 assert，失败时还能自动展开实际值和期望值；二是用例形态，Pytest 是普通函数不用继承类，写起来更轻。所以新项目我默认选 Pytest。"

**追问 2**："只有部分用例失败时，怎么快速重跑失败的那几条？"

参考回答："Pytest 会记住上次失败的用例，用 `pytest --lf`（last-failed）只重跑挂掉的那几条；调试时配合 `-k` 按名字过滤也很常用。这两个手段能明显缩短调试的反馈循环。"

## 下一步

下一节：[HTTP 和接口测试基础](../http-api-basics/)

延伸阅读：

- [技术专题：Pytest](../../tech/pytest/)
- [术语体系：单元测试](../../glossary/unit-testing/)
