---
title: "用 Pytest 写第一个接口测试"
description: "用代码请求接口并断言返回结果，完成第一个最小接口测试。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "接口测试", "Pytest"]
relatedSlugs:
  - "beginner-course/mock-login-mini-project"
  - "coding/assertion-wrapper"
selfTests:
  - id: "beginner-api-test-assert"
    question: "接口测试最需要断言什么？"
    options:
      - "只断言状态码 200"
      - "状态码和业务字段都要断言"
      - "只断言返回时间"
      - "不需要断言"
    correctIndex: 1
    explanation: "只断言 200 不够，还需要验证业务字段是否符合预期。"
  - id: "beginner-api-test-struct"
    question: "最小接口测试的步骤是什么？"
    options:
      - "发起请求 → 断言状态码 → 断言业务字段"
      - "只看响应体"
      - "打印日志"
      - "等待响应"
    correctIndex: 0
    explanation: "先请求，再验证状态码和业务结果。"
  - id: "beginner-api-test-common"
    question: "接口测试的常见错误是什么？"
    options:
      - "只断言状态码 200"
      - "断言太多"
      - "请求太慢"
      - "服务器太忙"
    correctIndex: 0
    explanation: "只断言 200 会漏掉业务逻辑错误。"
---

## 你会学到什么

这节帮你：

- 用代码发送 HTTP 请求
- 断言状态码和响应体
- 写出第一个完整的接口测试

学完后，你能用三五行代码验证一个接口的行为，并且看得懂断言失败时报错信息在说什么。

## 为什么要学

上一节你用浏览器观察了请求长什么样。但浏览器只能看，不能自动验证——接口测试的价值在于**把"看一眼对不对"变成代码里的断言**，之后每次改动都能一键重跑。

这是从"懂概念"到"会动手"的关键一步，也是下一节登录小项目的直接基础。

## 前置知识

已完成 `http-api-basics`，理解请求方法、状态码和 JSON。已完成 `pytest-first-test`，会写 `test_` 开头的函数。

## 核心概念

### requests 库

requests 是 Python 最常用的 HTTP 请求库，一行代码发一个请求：

```python
import requests

response = requests.get("https://httpbin.org/get")
```

- GET 用 `requests.get(url)`，POST 用 `requests.post(url, json={...})`
- `json=` 参数会自动把字典序列化成 JSON，并带上 `Content-Type: application/json` 请求头——不用自己拼字符串

### response 对象里有什么

发完请求拿到的 `response`，常用的就这几个属性：

| 属性 | 含义 | 例子 |
| --- | --- | --- |
| `status_code` | HTTP 状态码（整数） | `200` |
| `json()` | 把响应体解析成字典 | `{"url": "..."}` |
| `text` | 响应体的原始文本 | `'{"url": "..."}'` |
| `headers` | 响应头 | `Content-Type: application/json` |

**注意**：`json()` 是方法要加括号，`status_code` 是属性不加括号。写反了会报 `TypeError`，这是新手最常踩的坑。

如果接口返回的不是 JSON（比如 500 错误页），调 `json()` 会直接抛异常。排查问题时可以先 `print(response.text)` 看原始内容。

### 三步骨架

所有接口测试都是同一个骨架：

1. **发起请求**：拿到 response
2. **断言状态码**：HTTP 层面是否成功
3. **断言业务字段**：响应内容是否符合预期

## 最小示例

一个完整的最小接口测试：

```python
import requests

def test_get_endpoint():
    response = requests.get("https://httpbin.org/get")
    assert response.status_code == 200
    assert "url" in response.json()
```

### 断言失败时怎么看报错

故意把断言写错，运行后你会看到：

```text
def test_get_endpoint():
    response = requests.get("https://httpbin.org/get")
>       assert response.status_code == 404
E       assert 200 == 404

test_api.py:5: AssertionError
```

读法很简单：`>` 指向出错的行，`E` 开头告诉你"左边实际值 vs 右边期望值"。先看实际值是什么，再判断是代码错了还是接口错了——这是日常排查的基本功。

### 一个反向用例

正向（200）之外，再加一个反向场景，用例就有"两面"了：

```python
def test_not_found():
    response = requests.get("https://httpbin.org/status/404")
    assert response.status_code == 404
```

httpbin 的 `/status/{code}` 会按你指定的状态码返回，很适合练习异常路径的断言。

## 手把手练习

**练习：测试一个公共接口**

1. 安装 requests：`pip install requests`
2. 新建文件 `test_api.py`
3. 写入测试代码

```python
import requests

def test_httpbin_get():
    response = requests.get("https://httpbin.org/get")
    assert response.status_code == 200
    data = response.json()
    assert "url" in data
```

4. 运行：`pytest test_api.py -v`
5. 加练：把 URL 改成 `https://httpbin.org/get?city=wuhan`，断言 `data["args"]["city"] == "wuhan"`——这验证了"查询参数被服务器正确接收"。

## 检查标准

- 你安装了 requests
- 你写了至少一个正向和一个反向接口测试
- 你断言了状态码和业务字段
- 你能看懂断言失败时报错里的实际值和期望值

## 常见错误

**错误 1：只断言 200，不验证业务**

状态码 200 只说明"请求被处理了"，不说明"处理对了"。业务失败（如密码错误）也常返回 200，必须再断言响应体里的业务码或关键字段。

**错误 2：把 `json()` 写成 `json`**

少了括号拿到的是方法本身，断言会变成"方法对象 == 期望值"，永远失败。报错 `TypeError` 时先检查括号。

**错误 3：用 sleep 等待异步接口**

`sleep(3)` 既慢又不稳：机器快了白等，机器慢了不够。正确做法是轮询查状态或用接口提供的回调，具体见[场景题：异步任务](../../scenario/async-task/)。

**错误 4：不处理网络异常**

公共接口偶尔会超时。练习阶段可以不管，真实项目里要给请求加 `timeout=10`，避免一个卡死的请求拖住整个测试。

## 面试怎么说

如果面试官问："你写的第一个接口测试是什么样的？"，可以回答：

"用 requests 发请求，然后分三层断言：先断状态码，再解析 JSON 断言业务字段，关键字段还会验证存在性和非空。比如测试一个查询接口，我会带上查询参数，然后断言响应里 args 字段正确回显，确认参数被服务端正确接收。"

这个回答把"发过请求"升级成了"有断言策略"，信息量完全不同。

## 下一步

下一节：[小项目：模拟登录接口测试](../mock-login-mini-project/)

延伸阅读：
- [技术专题：接口测试](../../tech/api-testing/)
- [编码题：断言封装](../../coding/assertion-wrapper/)
