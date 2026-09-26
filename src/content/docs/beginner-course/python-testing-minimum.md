---
title: "Python 测试最小基础"
description: "掌握写测试需要的最小 Python 知识：函数、列表、字典、条件判断、断言。"
category: "beginner-course"
stage: "foundation"
estimatedMinutes: 50
difficulty: "beginner"
interviewWeight: 2
tags: ["新手教程", "Python入门", "测试基础"]
prerequisites:
  - "beginner-course/start-here"
outcomes:
  - "能写出带函数、条件判断和断言的最小 Python 脚本"
  - "能区分列表、字典在测试数据准备中的用法"
  - "面试时能讲清为什么写测试要先掌握 Python 基础"
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
  - id: "python-testing-minimum-q4"
    question: "response.get('token') 和 response['token'] 的关键区别是什么？"
    options:
      - "没有区别，完全等价"
      - "get 在键不存在时返回 None，[] 会抛 KeyError"
      - "get 的执行速度更快"
      - "[] 只能取字符串类型的值"
    correctIndex: 1
    explanation: "[] 是强校验，键缺失立刻抛 KeyError 让问题暴露；get 是弱读取，键缺失安静地返回 None。接口测试里必返回字段用 []，可选字段用 get。"
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

### 字符串常用操作

测试数据处理离不开字符串方法，先记三个：

```python
username = "  demouser  "

print(username.strip())         # "demouser"，去掉两端空白
print(username.strip() == "")   # False，非空
print("abc".upper())            # "ABC"，转大写
```

`strip()` 在登录测试里特别常用：用户输入前后带空格是真实场景，断言前往往先 strip 再比较，否则会出现"看起来一样、断言却失败"的诡异结果。

### None 和空值的判断

Python 里"没有值"用 `None` 表示，判断它要用 `is` 而不是 `==`：

```python
token = response.get("token")

if token is None:    # 只拦 None 这一种情况
    print("token 缺失")
if not token:        # None、空字符串 ""、数字 0 都会进这里
    print("token 无效")
```

两种写法语义不同：`is None` 只识别 None；`not token` 会把 `None`、`""`、`0` 都当成"无效"。断言"字段存在但允许空串"时选错了写法，会把合法的空值误判成失败——这是新手容易忽略的语义差别。

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

### 从"能跑"到"工程可用"

还是这个判断函数，看版本升级的差距。版本 1 就是上面那个（能跑）；版本 2 是敢放进测试框架的样子：

```python
def is_success(response):
    """判断接口响应是否成功：HTTP 200 且业务码为 0。

    工程版的三个改动：
    1. 用 .get() 读字段，缺字段时返回 None 而不是抛 KeyError，
       配合 == 比较自然得到 False，语义是"不成功"而不是"崩了"
    2. 加 docstring 说明判定规则，别人接手时不用猜
    3. 两个条件合并成一个表达式，单一出口，分支更少更好测
    """
    status_ok = response.get("status_code") == 200
    biz_ok = response.get("code") == 0
    return status_ok and biz_ok

# 验证四种输入，而不是只验证成功这一种
assert is_success({"status_code": 200, "code": 0}) is True      # 双成功 → True
assert is_success({"status_code": 500, "code": 0}) is False     # HTTP 失败 → False
assert is_success({"status_code": 200, "code": 1001}) is False  # 业务失败 → False
assert is_success({"status_code": 200}) is False                # 缺业务码字段 → False
```

对比两个版本：功能一样，但版本 2 补上了"缺字段""部分成功"这些边界。新手写的测试和工程可用的测试，差距往往不在主路径，而在有没有多验证这几个地方——这正是后面学[测试设计](/testdev-interview-site/glossary/test-design/)时要建立的意识。

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

**练习变体**：

- 变体 1（换断言）：把第三条断言改成 `assert is_positive(0) == True`，运行后读报错，练习说出"实际值 False、期望值 True"
- 变体 2（字典练习）：新建 `resp = {"code": 0, "data": {"token": "abc"}}`，分别用 `[]` 和 `.get()` 取 `"token"` 和不存在的 `"sign"`，观察后者返回 None 而不报错
- 变体 3（加异常路径）：写 `def is_adult(age): return age >= 18`，断言 `is_adult(17)`、`is_adult(18)`、`is_adult(-1)` 三条——18 是"取到等号"的边界，-1 是非法输入边界

**预期输出**：三条断言全过时命令行没有任何输出（Python 的惯例：没有消息就是好消息）。故意改错某条断言再运行，会看到 `AssertionError`，报错行号就是断言所在行。

## 检查标准

完成本节的标准：

- 你能读懂一个包含函数、字典、条件、assert 的代码
- 你能写一个简单的判断函数
- 你能写 3 条 assert 测试这个函数（含 0 这类边界）
- 你理解字典和列表的区别，以及 `[]` 和 `.get()` 的取值差异
- 你能说出 `is None` 和 `not x` 两种判断的语义差别
- 你知道 `strip()` 为什么在登录类测试里常用

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

**错误 5：字符串和数字直接比较**

```text
TypeError: '>' not supported between instances of 'str' and 'int'
```

典型场景：接口返回的年龄是字符串 `"18"`，你写 `age > 17` 就报这个错。排查步骤：①看报错行，用 `print(type(age))` 确认变量实际类型；②确认数据来源（接口返回、输入框内容默认都是字符串）；③比较前转类型 `int(age)`。根因永远是"你以为它是数字，实际是字符串"。

**错误 6：取嵌套字段时中间层不存在**

```text
KeyError: 'data'
```

比如写 `response["data"]["token"]`，但这次响应里根本没有 `data` 字段——登录失败时常常只返回错误码，不返回 data。排查步骤：①先 `print(response)` 看完整响应；②确认失败场景下响应结构是否变了；③如果结构确实不同，成功和失败用例的断言要分开写，不要假设结构永远一样。

**错误 7：把函数对象当值比较了**

`assert is_positive == True` 忘了传参数，或 `assert resp.json == data` 忘了 `json()` 的括号，断言的其实是函数对象本身。报错形如：

```text
AssertionError: assert <function is_positive at 0x102...> == True
```

看到报错里出现 `<function` 或 `<built-in` 字样，第一反应就是"少了调用"。这类错误和错误 2 同源：括号不是装饰，是调用动作。

## 面试怎么说

如果面试官问："你用 Python 做测试时最常用的语法是什么？"，可以回答：

"我主要用函数封装测试逻辑，用字典处理接口返回的 JSON，用列表管理测试数据，用 assert 断言验证结果。比如判断接口响应是否成功，我会写一个函数检查 status_code 和业务 code，然后用 assert 验证返回值。断言我还会带一句说明，失败时一眼能看出原因。"

这样回答展示了你对 Python 测试场景的理解，不是泛泛的语法背诵，而且点出了"断言带说明"这个实战细节。

**追问 1**："字典的 `[]` 和 `.get()`，你什么场景下选哪个？"

参考回答："必返回字段用 `[]`，字段缺失立刻抛 KeyError，让测试第一时间失败暴露问题；可选字段用 `.get()` 并对 None 做处理。原则是：必须有的东西缺失要大声失败，可有可无的东西缺失要安静降级。"

**追问 2**："Python 里 `is` 和 `==` 有什么区别？"

参考回答："`==` 比较值是否相等，`is` 比较是不是同一个对象。判断 None 我固定用 `is None`，这是约定俗成的写法；普通值比较用 `==`。写测试断言时基本都用 `==`，只有 None 判断例外。"

## 下一步

下一节：[Pytest 第一个测试用例](../pytest-first-test/)

延伸阅读：

- [技术专题：Python](../../tech/python/)
- [术语体系：断言](../../glossary/api-assertion/)
