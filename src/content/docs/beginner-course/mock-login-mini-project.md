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

| 场景 | 输入 | 预期结果 |
| --- | --- | --- |
| 登录成功 | 正确用户名 + 密码 | 200，authenticated 为 true |
| 密码错误 | 正确用户名 + 错误密码 | 401 |
| 缺少凭证 | 不带用户名密码 | 401 |

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

| 层次 | 断什么 | 本项目例子 |
| --- | --- | --- |
| 状态码 | HTTP 层面结果 | 200 / 401 |
| 业务字段 | 响应体的业务语义 | `authenticated is True` |
| 关键字段 | 后续流程依赖的数据 | `user` 字段正确返回 |

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

## 手把手练习

**练习：完成登录测试小项目**

1. 新建目录 `login-test/`
2. 按上面内容创建 `conftest.py` 和 `test_login.py`
3. 运行 `pytest test_login.py -v`
4. 确认三个测试都通过：`3 passed`

加练一：写第四个测试，验证空密码的场景（`auth=("demo", "")`），先预测结果再运行验证。

加练二：故意把 `authenticated` 断言改成 `is False`，运行后读报错信息，说出实际值和期望值各是什么。

## 检查标准

- 你完成了 3 个登录测试，全部通过
- 你覆盖了正常和异常路径
- BASE_URL 在 conftest.py 里，用例里没有写死
- 你能说出三层断言清单各断什么
- 你能说出换成真实登录接口要改哪三处

## 常见错误

**错误 1：只写登录成功，不写异常**

只有正向用例的项目，面试官一问"异常场景呢"就接不住。正反两面是最低配置。

**错误 2：用例之间互相依赖**

比如"用例二依赖用例一登录拿到的 token"。一旦用例一失败，后面连环失败，且无法单独运行某条用例。每条用例应该能独立执行。

**错误 3：断言写错字段导致"假通过"**

比如把 `data["authenticated"]` 写成 `data["authenticate"]`，运行时会抛 KeyError，容易被误读成"接口没返回这个字段"，其实是你自己的断言写错了。写完用例后，故意改错一次断言确认它真的会失败——这叫"验证你的测试能抓到 bug"。

**错误 4：URL 和账号散落在每个用例里**

环境一切换就要改十几处。易变项（URL、账号）集中到 conftest 或配置文件。

## 面试怎么说

如果面试官问："介绍一下你做的接口自动化项目？"，可以回答：

"我用 Pytest + requests 做了一个登录接口测试项目。用例覆盖正常、密码错误、缺少凭证三个场景，断言分三层：状态码、业务字段、关键字段。工程上把 BASE_URL 抽到了 conftest 的 fixture 里，方便切换环境。每条用例独立可运行，跑 pytest 一条命令全部执行。"

这段话的每个细节都对应这个项目里的真实决策，讲的时候有底气。

## 下一步

下一节：[面试表达](../interview-expression-for-first-project/)

延伸阅读：
- [练手模板：API 自动化](../../practice-template/api-automation-template/)
- [场景题：登录鉴权](../../scenario/login-auth/)
