---
title: "用 Pytest 写第一个接口测试"
description: "用代码请求接口并断言返回结果，完成第一个最小接口测试。"
category: "beginner-course"
stage: "foundation"
estimatedMinutes: 60
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "接口测试", "Pytest"]
prerequisites:
  - "beginner-course/http-api-basics"
  - "beginner-course/pytest-first-test"
outcomes:
  - "能用代码请求接口并对状态码和业务字段做断言"
  - "能写出一个最小可运行的接口自动化测试用例"
  - "面试时能讲清接口测试为什么要同时断言状态与业务"
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
  - id: "pytest-api-first-case-q4"
    question: "给接口请求设置 timeout 的主要目的是什么？"
    options:
      - "让请求更快返回"
      - "防止单个请求无限等待、拖住整个测试"
      - "给服务器减小压力"
      - "这是 HTTP 协议的强制要求"
    correctIndex: 1
    explanation: "不设 timeout 时 requests 会一直等待，一个卡死的请求能让整个测试套件挂起。设置超时后最多等到指定秒数，然后抛超时异常，测试可以快速失败并继续。"
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

| 属性          | 含义                | 例子                             |
| ------------- | ------------------- | -------------------------------- |
| `status_code` | HTTP 状态码（整数） | `200`                            |
| `json()`      | 把响应体解析成字典  | `{"url": "..."}`                 |
| `text`        | 响应体的原始文本    | `'{"url": "..."}'`               |
| `headers`     | 响应头              | `Content-Type: application/json` |

**注意**：`json()` 是方法要加括号，`status_code` 是属性不加括号。写反了会报 `TypeError`，这是新手最常踩的坑。

如果接口返回的不是 JSON（比如 500 错误页），调 `json()` 会直接抛异常。排查问题时可以先 `print(response.text)` 看原始内容。

### 三步骨架

所有接口测试都是同一个骨架：

1. **发起请求**：拿到 response
2. **断言状态码**：HTTP 层面是否成功
3. **断言业务字段**：响应内容是否符合预期

### 参数放哪里：requests 的三种传递方式

同样是"传参数"，按位置分三种，requests 各有对应写法：

| 传到哪里       | requests 写法                             | 典型例子        |
| -------------- | ----------------------------------------- | --------------- |
| URL 查询参数   | `params={"city": "wuhan"}`                | GET 的查询条件  |
| 请求体（JSON） | `json={"user": "demo"}`                   | POST 的登录数据 |
| 请求头         | `headers={"Authorization": "Bearer xxx"}` | token 鉴权      |

用 `params=` 而不是手工拼 URL 的好处：自动处理编码（中文、空格、特殊字符），传字典即可，可读性也好。手工写 `url + "?city=" + city`，一旦 city 里有空格或中文就会出编码问题。

### 超时与基础容错

生产可用的请求至少带 timeout：

```python
response = requests.get("https://httpbin.org/get", timeout=10)
```

不设 timeout 时 requests 会一直等——一个卡死的请求能把整个测试套件拖住。设置后，超时会抛 `ConnectTimeout`（连接都没建立）或 `ReadTimeout`（连上了但响应太慢），测试快速失败并给出明确信号。入门阶段记住"每次请求都带 timeout"这个习惯就够，重试策略到框架阶段再学（可延伸看[重试机制](/testdev-interview-site/coding/retry-mechanism/)）。

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

### 从"能跑"到"工程可用"

同一个 httpbin 用例，工程版长这样：

```python
import requests

def test_get_endpoint_echoes_query_params():
    # 改进 1：测试名说明验证点——"参数回显"，而不是泛泛的 test_get_endpoint
    response = requests.get(
        "https://httpbin.org/get",
        params={"city": "wuhan"},   # 改进 2：用 params 传参，不手工拼 URL
        timeout=10,                 # 改进 3：带超时，卡死请求不会拖住整个套件
    )
    # 改进 4：断言带消息，失败时不用重跑一遍就知道当时返回了什么
    assert response.status_code == 200, f"期望 200，实际 {response.status_code}"
    data = response.json()
    # 改进 5：断言业务语义（参数被服务端收到），不只是"请求成功"
    assert data["args"]["city"] == "wuhan", f"参数回显不符：{data['args']}"
```

和最小版对比：同样是绿，工程版在命名、传参方式、超时、断言消息、断言深度五个维度都更可靠。单看每条改进都小，叠加起来就是"练习脚本"和"可维护测试"的距离。

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

**练习变体**：

- 变体 1（换断言深度）：在 `test_httpbin_get` 里加一条 `assert response.headers["Content-Type"].startswith("application/json")`，验证"响应格式声明正确"
- 变体 2（加异常路径）：写 `def test_server_error():` 请求 `httpbin.org/status/500`，断言 `status_code == 500`——异常状态也是接口行为的一部分，断言它通过是正常的
- 变体 3（触发超时）：运行 `requests.get("https://httpbin.org/delay/10", timeout=2)`，观察超时异常原文——亲手见过一次，以后排查不再陌生

**预期输出**：变体 2 这条用例显示通过（断言 500 成立）；变体 3 会在约 2 秒后抛出 `requests.exceptions.ReadTimeout`，注意它是异常（E）不是断言失败（F），两者排查方向不同。

## 检查标准

- 你安装了 requests
- 你写了至少一个正向和一个反向接口测试
- 你断言了状态码和业务字段
- 你能看懂断言失败时报错里的实际值和期望值
- 你能给请求设置 timeout，并说出不设的后果
- 你知道 params=、json=、headers= 分别对应请求的哪个位置

## 常见错误

**错误 1：只断言 200，不验证业务**

状态码 200 只说明"请求被处理了"，不说明"处理对了"。业务失败（如密码错误）也常返回 200，必须再断言响应体里的业务码或关键字段。

**错误 2：把 `json()` 写成 `json`**

少了括号拿到的是方法本身，断言会变成"方法对象 == 期望值"，永远失败。报错 `TypeError` 时先检查括号。

**错误 3：用 sleep 等待异步接口**

`sleep(3)` 既慢又不稳：机器快了白等，机器慢了不够。正确做法是轮询查状态或用接口提供的回调，具体见[场景题：异步任务](../../scenario/async-task/)。

**错误 4：不处理网络异常**

公共接口偶尔会超时。练习阶段可以不管，真实项目里要给请求加 `timeout=10`，避免一个卡死的请求拖住整个测试。

**错误 5：用 try/except 把异常吞掉**

```python
def test_api():
    try:
        response = requests.get(url)
        assert response.status_code == 200
    except Exception:
        pass  # 想让测试"别红"
```

这段代码任何错误都不会失败，测试永远绿——它不再验证任何东西，比没有测试更糟。排查方法：在项目里全局搜 `except Exception: pass`，看到就删。要处理异常就明确处理（记录日志、标记跳过），要断言就让它自然失败，不要静默吞掉。

**错误 6：多条件挤在一个 assert 里**

`assert response.status_code == 200 and data["code"] == 0` 一旦失败，你只知道"两个条件至少一个不对"，还得重跑排查。多条件拆成多行、每行一条，失败信息才能精确到具体断言。断言是给"未来的自己"看的排查线索，宁可多几行。

## 面试怎么说

如果面试官问："你写的第一个接口测试是什么样的？"，可以回答：

"用 requests 发请求，然后分三层断言：先断状态码，再解析 JSON 断言业务字段，关键字段还会验证存在性和非空。比如测试一个查询接口，我会带上查询参数，然后断言响应里 args 字段正确回显，确认参数被服务端正确接收。"

这个回答把"发过请求"升级成了"有断言策略"，信息量完全不同。

**追问 1**："接口偶发超时导致用例挂，你怎么处理？"

参考回答："先区分是真缺陷还是环境抖动：本地重跑一次、看服务端日志。确认是抖动后，给请求加合理 timeout，对幂等的查询接口可以考虑受控重试（重试 1-2 次），同时把这个不稳定用例标记出来持续观察。原则是不让偶发问题掩盖真问题，也不能见挂就重试。"

**追问 2**："断言业务字段为什么用 [] 而不用 .get()？"

参考回答："必返回字段缺失应该立刻失败，`[]` 抛 KeyError 能第一时间暴露结构变更；`.get()` 返回 None 会把'字段缺失'悄悄变成一次很晚才暴露的问题。字段的可选性不同，取值方式就不同——这本身就是断言策略的一部分。"

## 下一步

下一节：[小项目：模拟登录接口测试](../mock-login-mini-project/)

延伸阅读：

- [技术专题：接口测试](../../tech/api-testing/)
- [编码题：断言封装](../../coding/assertion-wrapper/)
