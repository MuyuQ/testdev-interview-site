---
title: "Python 测试最小基础"
description: "掌握写测试需要的最小 Python 知识：函数、列表、字典、条件判断、断言。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 2
tags: ["新手教程", "Python入门", "测试基础"]
relatedSlugs:
  - "beginner-course/pytest-first-test"
  - "tech/python"
selfTests:
  - id: "beginner-python-func"
    question: "Python 函数定义的关键字是什么？"
    options:
      - "function"
      - "def"
      - "func"
      - "define"
    correctIndex: 1
    explanation: "Python 用 def 关键字定义函数，后面是函数名和参数列表。"
  - id: "beginner-python-dict"
    question: "如何从字典 data 中获取 key 为 'name' 的值？"
    options:
      - "data.name"
      - "data['name']"
      - "data.get(name)"
      - "data(0)"
    correctIndex: 1
    explanation: "字典用方括号加键名访问值，如 data['name']。"
  - id: "beginner-python-assert"
    question: "assert 在测试中的作用是什么？"
    options:
      - "打印日志"
      - "判断条件是否成立，不成立则报错"
      - "定义变量"
      - "循环执行"
    correctIndex: 1
    explanation: "assert 用于断言，判断条件是否为真，为假则抛出 AssertionError。"
---

## 你会学到什么

这节帮你掌握写测试需要的最小 Python 知识：

- 函数定义和调用
- 列表和字典基础操作
- 条件判断
- assert 断言

学完后，你能读懂一个简单的测试函数，理解它做了什么，也能照着写出自己的最小脚本。这些语法会贯穿后面所有 Pytest 和接口测试代码，所以这节是地基。

## 为什么要学

测试代码本质是 Python 代码。不懂 Python 基础，写不出测试脚本，更别说框架设计。

这节不求你成为 Python 专家，只教你"能看懂测试代码、能写最小脚本"的知识。遇到更深的语法（类、装饰器、异常），到后面的接口测试和框架阶段再补，不必现在啃完。

## 前置知识

已完成上一节 `testdev-role-map`，理解测开岗位。不需要会写代码，这节从第一行 `def` 讲起。

## 核心概念

### 函数

函数是封装一段逻辑的方式，可以重复调用：

```python
def add(a, b):
    return a + b

result = add(1, 2)  # result = 3
```

- `def` 是定义函数的关键字
- `add` 是函数名
- `a, b` 是参数
- `return` 返回结果

测试函数就是一个普通函数，只是名字以 `test_` 开头。一个容易忽略的点：函数没有 `return` 时默认返回 `None`，后面写断言时要注意拿到的不是你以为的值。

### 列表

列表是一组有序数据：

```python
names = ["Alice", "Bob", "Charlie"]

print(names[0])     # Alice（第一个）
print(names[-1])    # Charlie（最后一个）
names.append("David")  # 添加元素
```

测试里常用列表存放多个测试数据或多个断言结果。比如把多组用户名放在列表里循环断言：

```python
bad_names = ["", "  ", "a" * 100]  # 空、纯空格、超长
for name in bad_names:
    assert is_valid(name) is False
```

这种"一个列表 + 一个循环"的写法，就是后面参数化测试（pytest.mark.parametrize）的雏形。

### 字典

字典是键值对结构，接口返回的 JSON 几乎都是它：

```python
response = {
    "code": 0,
    "message": "success",
    "data": {"token": "abc123"}
}

print(response["code"])       # 0
print(response["data"]["token"])  # abc123
```

取值有两种方式，区别很关键：
- `response["code"]`：键不存在会直接抛 `KeyError`，适合"这个字段必须存在"的强校验
- `response.get("code")`：键不存在返回 `None`，不会报错，适合"可能有也可能没有"的可选字段

接口测试里，断言必返回字段建议用 `[]` 取值（缺了立刻失败），读可选字段用 `.get()`（缺了不崩）。

### 条件判断

用 `if` 判断条件，决定走哪条分支：

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 60:
    print("通过")
else:
    print("不及格")
```

测试里常用条件判断来区分不同测试场景，比如根据状态码走"成功分支"还是"失败分支"分别断言。

### assert 断言

`assert` 判断条件是否成立，不成立就抛 `AssertionError`，Pytest 据此判定测试失败：

```python
assert 1 + 1 == 2   # 成立，不报错
assert 1 + 1 == 3   # 不成立，抛出 AssertionError
```

断言还可以带说明信息，失败时能直接看懂原因：

```python
assert resp["code"] == 0, "业务码非 0，登录应成功"
```

这条说明在测试失败时非常有用——上百条用例里一眼定位是哪条、为什么挂。所以写断言时顺手加一句有意义的描述，是好习惯。

## 最小示例

一个判断接口响应是否成功的函数，把上面几个概念串起来：

```python
def is_success(response):
    # 检查状态码是否为 200（HTTP 层面成功）
    if response["status_code"] == 200:
        # 检查业务码是否为 0（业务层面成功）
        if response["code"] == 0:
            return True
    return False

# 使用示例
resp = {"status_code": 200, "code": 0}
assert is_success(resp) is True
```

逐段解读：
- `response["status_code"]`：用字典取值读 HTTP 状态码
- 第一个 `if`：状态码不是 200 直接落到最后的 `return False`
- 第二个 `if`：状态码对了再查业务码，两层都过才返回 `True`
- 最外层 `assert`：验证函数对"成功响应"返回 `True`

这个函数用到了：字典访问、条件判断、返回值、assert。它不长，但已经是一个真实接口断言的骨架。

## 手把手练习

**练习：写一个判断函数并断言**

1. 新建文件 `test_basic.py`

2. 写一个函数判断数字是否为正数：

```python
def is_positive(num):
    return num > 0
```

3. 用 assert 测试三组边界：

```python
assert is_positive(5) == True
assert is_positive(-3) == False
assert is_positive(0) == False   # 0 不是正数，这是容易漏的边界
```

4. 运行：`python test_basic.py`

如果没有任何报错输出，说明三条断言都通过了（因为断言失败时才会抛异常、有打印）。注意这里用 `python` 直接跑，断言是顶层语句会被执行；后面的 Pytest 章节会用 `pytest` 命令自动发现并运行。

## 检查标准

完成本节的标准：

- 你能读懂一个包含函数、字典、条件、assert 的代码
- 你能写一个简单的判断函数
- 你能写 3 条 assert 测试这个函数（含 0 这类边界）
- 你理解字典和列表的区别，以及 `[]` 和 `.get()` 的取值差异

## 常见错误

**错误 1：混淆 = 和 ==**

- `=` 是赋值：`a = 1`
- `==` 是比较：`if a == 1`

写断言时用 `==`，不是 `=`。写成 `assert a = 1` 会直接语法报错。

**错误 2：字典取值用点号**

`response.code` 在 Python 里不对，要用 `response["code"]`。点号只对对象属性有效，字典必须用方括号键名。

**错误 3：忘记 return**

函数没有 `return` 就返回 None。断言 None 会出错，比如 `assert is_positive(5)` 期望返回 True，但函数没写 return 就得到 None，断言失败。

**错误 4：该用 .get 硬用 [] 取可选字段**

接口有时不返回某个可选字段，用 `response["optional"]` 会抛 `KeyError` 把测试跑崩。可选字段用 `response.get("optional")` 更稳妥。

## 面试怎么说

如果面试官问："你用 Python 做测试时最常用的语法是什么？"，可以回答：

"我主要用函数封装测试逻辑，用字典处理接口返回的 JSON，用列表管理测试数据，用 assert 断言验证结果。比如判断接口响应是否成功，我会写一个函数检查 status_code 和业务 code，然后用 assert 验证返回值。断言我还会带一句说明，失败时一眼能看出原因。"

这样回答展示了你对 Python 测试场景的理解，不是泛泛的语法背诵，而且点出了"断言带说明"这个实战细节。

## 下一步

下一节：[Pytest 第一个测试用例](../pytest-first-test/)

延伸阅读：
- [技术专题：Python](../../tech/python/)
- [术语体系：断言](../../glossary/api-assertion/)
