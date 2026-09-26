---
title: "小项目：模拟登录接口测试"
description: "把前面知识串成一个小项目，完成登录接口自动化测试。"
category: "beginner-course"
stage: "foundation"
estimatedMinutes: 90
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "小项目", "接口自动化"]
prerequisites:
  - "beginner-course/pytest-api-first-case"
outcomes:
  - "能把登录接口串成含成功与异常的自动化测试小项目"
  - "能覆盖登录成功、密码错误、缺参数三个场景"
  - "面试时能讲清一个接口自动化小项目的结构"
relatedSlugs:
  - "beginner-course/interview-expression-for-first-project"
  - "practice-template/api-automation-template"
  - "scenario/login-auth"
selfTests:
  - id: "beginner-project-test"
    question: "小项目需要测试几个场景？"
    options:
      - "只要登录成功"
      - "登录成功、密码错误、缺少参数"
      - "测试所有页面"
      - "不需要测试"
    correctIndex: 1
    explanation: "最小项目至少覆盖正常路径和异常路径。"
  - id: "beginner-project-assert"
    question: "接口测试断言清单应该包含什么？"
    options:
      - "状态码、业务码、关键字段"
      - "只检查响应时间"
      - "只看状态码"
      - "不需要断言"
    correctIndex: 0
    explanation: "完整断言包含状态码、业务码和关键字段。"
  - id: "beginner-project-output"
    question: "小项目的最终产出是什么？"
    options:
      - "一组可运行的测试用例"
      - "一份文档"
      - "一个网站"
      - "不需要产出"
    correctIndex: 0
    explanation: "产出是可运行的测试用例。"
  - id: "mock-login-mini-project-q4"
    question: "把 BASE_URL 放进 conftest 的 fixture 而不是写死在每个用例里，主要好处是什么？"
    options:
      - "测试运行速度更快"
      - "换测试环境时只需要改一处"
      - "可以少写几条用例"
      - "Pytest 强制要求这样写"
    correctIndex: 1
    explanation: "fixture 让共享配置集中在一处，切换环境（测试、预发）时只改 conftest 一行，所有用例自动生效。这正是用例与配置分离的工程价值。"
---

## 你会学到什么

这节帮你把前面学的知识串成一个完整小项目：

- 登录接口测试
- 成功、失败、异常场景覆盖
- 项目文件组织（含 conftest.py 夹具）
- 三层断言清单

最终产出：一个可运行的登录测试小项目，跑 `pytest` 全部通过。

## 为什么要学

零散知识点在面试里不值钱，"我做了一个项目"才值钱。这一节是你新手路线的**作品**：之后的面试表达、简历项目经历，都从这里取材。

## 前置知识

已完成 `pytest-api-first-case`，会用 requests 发请求、写断言。

## 核心概念

### 用什么接口练手

练习需要找一个"真的会校验密码"的公开接口，否则"密码错误"的用例没法写——如果服务器对任何密码都返回成功，你的异常用例就没有意义。

httpbin 正好提供了一个：

```text
GET https://httpbin.org/basic-auth/{用户名}/{密码}
```

- 凭证正确 → 返回 `200`，响应体 `{"authenticated": true, "user": "..."}`
- 凭证错误或缺失 → 返回 `401`

服务器端真实校验，所以我们的断言是真断言，不是走形式。

### 三个核心场景

| 场景     | 输入                  | 预期结果                   |
| -------- | --------------------- | -------------------------- |
| 登录成功 | 正确用户名 + 密码     | 200，authenticated 为 true |
| 密码错误 | 正确用户名 + 错误密码 | 401                        |
| 缺少凭证 | 不带用户名密码        | 401                        |

正常路径一条、异常路径两条——这是最小项目的覆盖面：不求全，但正反两面都要有。

### 项目文件结构

```
login-test/
├── conftest.py        # 夹具：提供 BASE_URL
└── test_login.py      # 登录测试
```

**conftest.py** 是 Pytest 的共享配置文件，里面的夹具（fixture）可以被所有测试函数使用。把 URL 放这里而不是写死在每个用例里，以后换测试环境只改一处：

```python
# conftest.py
import pytest

@pytest.fixture
def base_url():
    return "https://httpbin.org"
```

测试函数只要声明 `base_url` 参数，Pytest 就会自动把夹具的值传进来。

### fixture 的价值与边界

fixture 解决的是"多个用例都要用的东西放哪"：BASE_URL、登录后的 token、初始化的数据库连接，都适合进 fixture。两个使用要点：

- 用例参数里写名字就能拿到值，Pytest 按名字自动注入——所以 fixture 函数名要起得像资源（`base_url`、`login_token`）
- fixture 也能做"前置动作 + 返回值"，比如先调登录接口再返回 token，这就是后面[夹具策略](/testdev-interview-site/coding/fixture-strategy/)的雏形

边界：只有一个用例用的东西不必抽 fixture，过度抽取会让读用例的人来回跳文件。共享的才抽，是判断标准。

### 测试数据的演进路线

本项目凭证直接写在用例里，入门没问题，但要知道工程里的演进方向：

1. **写死在用例里**（本节）：直观，适合最小项目
2. **抽到配置文件**：环境相关的（URL、测试账号）进 config，代码零改动切环境
3. **数据驱动**：同一场景多组数据用参数化跑，比如 10 组错误密码一次验证
4. **造数服务**：用例需要的数据（如未注册账号）由工具动态生成，避免测试数据被人改坏

每一步都是为了解决上一步的真实痛点，不必一步到位。后面读到[夹具](/testdev-interview-site/glossary/fixture/)和[数据库测试](/testdev-interview-site/tech/database-testing/)的进阶内容，对应的就是第 2-4 步。

## 最小示例

```python
# test_login.py
import requests

def test_login_success(base_url):
    """正常路径：正确凭证登录成功"""
    response = requests.get(
        f"{base_url}/basic-auth/demo/correct",
        auth=("demo", "correct")
    )
    assert response.status_code == 200
    data = response.json()
    assert data["authenticated"] is True
    assert data["user"] == "demo"

def test_login_wrong_password(base_url):
    """异常路径：密码错误被拒绝"""
    response = requests.get(
        f"{base_url}/basic-auth/demo/correct",
        auth=("demo", "wrong")
    )
    assert response.status_code == 401

def test_login_missing_credential(base_url):
    """异常路径：缺少凭证被拒绝"""
    response = requests.get(f"{base_url}/basic-auth/demo/correct")
    assert response.status_code == 401
```

`auth=("demo", "correct")` 是 requests 提供的便捷参数，会自动生成 Basic Auth 请求头，等价于手工设置 `Authorization`。

### 断言清单

每条用例的断言按三层自查：

| 层次     | 断什么             | 本项目例子              |
| -------- | ------------------ | ----------------------- |
| 状态码   | HTTP 层面结果      | 200 / 401               |
| 业务字段 | 响应体的业务语义   | `authenticated is True` |
| 关键字段 | 后续流程依赖的数据 | `user` 字段正确返回     |

异常用例至少要断状态码；如果接口在异常时也返回错误码或错误消息，一并断言。

### 换成真实项目怎么写

公司里的登录接口通常是 `POST /api/login`、JSON 请求体、响应里带业务码和 token。骨架不变，断言更丰满：

```python
def test_login_success(base_url):
    response = requests.post(
        f"{base_url}/api/login",
        json={"username": "demo", "password": "correct"}
    )
    assert response.status_code == 200          # 第一层：HTTP
    data = response.json()
    assert data["code"] == 0                    # 第二层：业务码
    assert data["data"]["token"]                # 第三层：token 非空
```

从练习项目迁移到真实项目，要换的只有三样：请求方法、URL、断言字段。**骨架完全复用**——这正是小项目的意义。

### 从"能跑"到"工程可用"：参数化版

三个"凭证被拒"的用例结构高度相似——都是"给一组凭证，断言 401"。参数化（parametrize）能把它们合并成一个测试函数：

```python
import pytest
import requests

@pytest.mark.parametrize(
    "desc, username, password",          # 1. 声明参数名，顺序对应下面的元组
    [
        ("密码错误",   "demo",   "wrong"),
        ("空密码",     "demo",   ""),
        ("用户名不存在", "nobody", "correct"),
    ],
)
def test_login_rejected(base_url, desc, username, password):
    # 2. desc 会拼进用例名：test_login_rejected[密码错误-wrong-...]
    #    失败时一眼看出是哪组数据挂了
    response = requests.get(
        f"{base_url}/basic-auth/{username}/{password}",
        auth=(username, password),
        timeout=10,                      # 3. 工程习惯：带超时
    )
    assert response.status_code == 401, f"{desc} 场景应返回 401，实际 {response.status_code}"
```

运行 `pytest test_login.py -v`，原来的异常用例变成 3 条参数化用例，每条有独立名字和独立失败信息。**新增一个异常场景只需在列表里加一行元组**，这就是参数化带来的扩展性。参数化不是本节必须掌握的内容，这里先埋个种子，正式学习在框架阶段。

## 手把手练习

**练习：完成登录测试小项目**

1. 新建目录 `login-test/`
2. 按上面内容创建 `conftest.py` 和 `test_login.py`
3. 运行 `pytest test_login.py -v`
4. 确认三个测试都通过：`3 passed`

加练一：写第四个测试，验证空密码的场景（`auth=("demo", "")`），先预测结果再运行验证。

加练二：故意把 `authenticated` 断言改成 `is False`，运行后读报错信息，说出实际值和期望值各是什么。

**练习变体**：

- 变体 1（加异常路径）：写第五个测试 `test_login_wrong_user`，用 `auth=("nobody", "correct")`，先预测状态码再运行（预期 401：用户名不存在同样被拒）
- 变体 2（验证 fixture 生效）：把 `conftest.py` 里的 URL 临时改成错误域名，运行后所有用例应集体报连接错误——这证明每条用例确实在读同一个 fixture
- 变体 3（单独执行一条）：运行 `pytest test_login.py::test_login_wrong_password -v`，确认这条用例不依赖其他用例也能通过

**预期输出**：变体 3 是"用例独立性"的验收动作，输出应只有这一条的结果 `1 passed`。如果它必须先跑别的用例才能过，说明用例之间有隐藏依赖，要回头改。

## 检查标准

- 你完成了 3 个登录测试，全部通过
- 你覆盖了正常和异常路径
- BASE_URL 在 conftest.py 里，用例里没有写死
- 你能说出三层断言清单各断什么
- 你能说出换成真实登录接口要改哪三处
- 你知道 fixture 抽取的边界：共享的才抽，单个用例用的不抽
- 你会用 `pytest 文件::函数名` 单独执行一条用例来验证独立性

## 常见错误

**错误 1：只写登录成功，不写异常**

只有正向用例的项目，面试官一问"异常场景呢"就接不住。正反两面是最低配置。

**错误 2：用例之间互相依赖**

比如"用例二依赖用例一登录拿到的 token"。一旦用例一失败，后面连环失败，且无法单独运行某条用例。每条用例应该能独立执行。

**错误 3：断言写错字段导致"假通过"**

比如把 `data["authenticated"]` 写成 `data["authenticate"]`，运行时会抛 KeyError，容易被误读成"接口没返回这个字段"，其实是你自己的断言写错了。写完用例后，故意改错一次断言确认它真的会失败——这叫"验证你的测试能抓到 bug"。

**错误 4：URL 和账号散落在每个用例里**

环境一切换就要改十几处。易变项（URL、账号）集中到 conftest 或配置文件。

**错误 5：conftest.py 文件名或位置不对，fixture 找不到**

```text
E       fixture 'base_url' not found
```

Pytest 只认 `conftest.py` 这个确切文件名（不能是 conftest.txt、Conftest.py），且它必须和测试文件在同一目录或父级目录。排查步骤：①确认文件名拼写；②确认它和 `test_login.py` 在同一目录；③运行 `pytest --fixtures`，确认 `base_url` 出现在列表里。

**错误 6：公共接口偶发超时，用例"时好时坏"**

httpbin 是公共服务，偶发的慢响应会让用例一次过一次挂。排查方法：看失败报错是不是 `ReadTimeout` / `ConnectTimeout`——是的话是网络问题，不是你的代码问题。缓解手段：每个请求加 `timeout`，失败先本地重跑确认。要根治可以把外部接口换成本地 Mock 服务（参考[Mock 服务模板](/testdev-interview-site/practice-template/mock-service-template/)），这也是团队隔离不稳定依赖的标准做法。

## 面试怎么说

如果面试官问："介绍一下你做的接口自动化项目？"，可以回答：

"我用 Pytest + requests 做了一个登录接口测试项目。用例覆盖正常、密码错误、缺少凭证三个场景，断言分三层：状态码、业务字段、关键字段。工程上把 BASE_URL 抽到了 conftest 的 fixture 里，方便切换环境。每条用例独立可运行，跑 pytest 一条命令全部执行。"

这段话的每个细节都对应这个项目里的真实决策，讲的时候有底气。

**追问 1**："如果登录前还要先调验证码接口怎么办？"

参考回答："把'登录成功拿到 token'本身做成一个 fixture：先请求验证码接口取值，再请求登录接口，把 token 返回给用例。用例只声明参数，不关心登录细节；流程变复杂时只改 fixture 一处，所有用例自动生效。"

**追问 2**："这个项目怎么接入 CI？"

参考回答："项目本身就是 `pytest` 一条命令可跑，接入 CI 只需要流水线里装好依赖（pytest、requests），然后执行 `python -m pytest`，按退出码判断结果：0 是全过，非 0 是有失败。这也是我把用例做成'一条命令可重复执行'的原因——它是 CI 集成的前提。"

## 下一步

下一节：[面试表达](../interview-expression-for-first-project/)

延伸阅读：

- [练手模板：API 自动化](../../practice-template/api-automation-template/)
- [场景题：登录鉴权](../../scenario/login-auth/)
