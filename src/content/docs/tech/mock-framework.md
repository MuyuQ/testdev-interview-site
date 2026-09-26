---
title: "Mock 框架"
description: "模拟外部依赖，隔离测试环境，提升测试效率和稳定性"
category: "tech"
stage: "practice"
estimatedMinutes: 22
difficulty: "interview"
interviewWeight: 3
tags: ["接口测试", "测试隔离", "Python"]
prerequisites:
  - "tech/api-testing"
  - "tech/pytest"
  - "glossary/mock-stub"
outcomes:
  - "能用 responses 拦截请求返回预设响应"
  - "能封装 fixture 管理 Mock 生命周期避免污染"
  - "能讲清 Mock 与 Stub 的区别及使用边界"
relatedSlugs:
  ["glossary/api-assertion", "coding/assertion-wrapper", "tech/api-testing"]
selfTests:
  - id: "mock-framework-q1"
    question: "Mock 框架的核心作用是什么？"
    options:
      [
        "模拟外部依赖，隔离测试环境",
        "只做文档展示",
        "替代真实服务器",
        "只用于性能测试",
      ]
    correctIndex: 0
    explanation: "Mock 框架用于模拟外部依赖，隔离测试环境，提升测试效率和稳定性。"
  - id: "mock-framework-q2"
    question: "responses 库基于哪个库实现 Mock 功能？"
    options: ["requests", "urllib3", "http.client", "aiohttp"]
    correctIndex: 0
    explanation: "responses 库基于 requests 库实现 Mock 功能，通过拦截 requests 的 HTTP 调用来模拟响应。"
  - id: "mock-framework-q3"
    question: "以下哪个场景最不适合用 Mock？"
    options:
      [
        "第三方支付回调难以主动触发",
        "性能压测需要评估真实网络开销",
        "联调时对方接口尚未开发完成",
        "模拟服务偶发超时的异常场景",
      ]
    correctIndex: 1
    explanation: "Mock 返回预设响应，没有真实网络开销和服务处理耗时，压测结果会严重失真，性能测试必须打真实或等价服务。其余三类正是 Mock 的典型适用场景：难以构造、尚未就绪、需要可控异常。"
---

## 1. 这项技术解决什么问题

在测试开发中，我们经常遇到以下痛点：

- **外部依赖不稳定**：第三方 API 服务可能超时、宕机或返回异常数据
- **测试数据难以构造**：某些场景（如支付回调、短信验证码）难以通过真实服务触发
- **测试执行效率低**：网络请求耗时，导致测试用例运行缓慢
- **测试环境不可控**：开发环境、测试环境数据不一致，测试结果不稳定
- **联调阻塞**：前端开发等待后端接口，后端开发等待第三方服务

Mock 框架通过**模拟外部依赖的响应**，让测试用例在隔离环境中运行，解决以上问题。它让测试更加可控、快速、稳定。

## 2. 面试为什么会问

面试官考察 Mock 框架，主要关注以下几点：

1. **工程化思维**：是否理解测试隔离的重要性，能否设计稳定的测试环境
2. **工具选型能力**：是否了解不同 Mock 工具的适用场景（responses、Mock Server、WireMock）
3. **问题解决能力**：面对复杂依赖链，能否设计合理的 Mock 策略
4. **实践经验**：是否在真实项目中落地过 Mock 方案，遇到过哪些坑

这个问题能区分"会用工具"和"理解原理"的候选人。

## 3. 学习前置条件

学习 Mock 框架前，需要掌握：

| 前置知识        | 重要程度 | 说明                       |
| --------------- | -------- | -------------------------- |
| Python 基础     | 必需     | 语法、函数、装饰器         |
| requests 库     | 必需     | 发送 HTTP 请求、处理响应   |
| pytest 测试框架 | 必需     | 测试用例编写、fixture 机制 |
| HTTP 协议基础   | 重要     | 请求方法、状态码、请求头   |
| JSON 数据处理   | 重要     | 序列化、反序列化           |

## 4. 核心概念拆解

### 4.1 Mock 的本质

Mock 的本质是**拦截真实调用，返回预设响应**。在 Python 生态中，主要有两种实现方式：

```
方式一：代码层 Mock（如 responses 库）
  测试代码 -> requests 库 -> responses 拦截 -> 返回 Mock 数据

方式二：网络层 Mock（如 Mock Server）
  测试代码 -> 网络 -> Mock Server -> 返回 Mock 数据
```

### 4.2 responses 库核心用法

`responses` 是 Python 中最常用的 HTTP Mock 库，核心概念：

- **@responses.activate**：装饰器，激活 Mock 模式
- **responses.add()**：注册 Mock 响应
- **method/url/body/status**：配置响应参数

### 4.3 Mock Server 架构

当需要跨语言、跨团队共享 Mock 时，搭建独立的 Mock Server 是更好的选择：

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  测试代码    │ --> │ Mock Server │ --> │  Mock 数据   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ↓
                    ┌─────────────┐
                    │ 管理界面/API │
                    └─────────────┘
```

### 4.4 responses 的请求校验能力

responses 不只是"返回假数据"，还能验证"请求本身对不对"，这正是 Mock 优于 Stub 的地方：

```python
import responses
import requests

@responses.activate
def test_create_user_sends_correct_payload():
    responses.add(
        method=responses.POST,
        url="https://api.example.com/users",
        json={"id": 1, "name": "张三"},
        status=201,
    )

    resp = requests.post(
        "https://api.example.com/users",
        json={"name": "张三", "email": "zhang@example.com"},
    )

    assert resp.status_code == 201
    # 校验请求行为：调用了 1 次、请求体正确
    assert len(responses.calls) == 1
    assert responses.calls[0].request.body == '{"name": "张三", "email": "zhang@example.com"}'
```

- `responses.calls` 记录所有被拦截的请求，可断言调用次数、请求头和请求体
- 注册的 Mock 未被消费时，`RequestsMock` 上下文退出会报 `ConnectionError: Not all requests have been executed`——这个"严格模式"能反向发现"该发的请求没发出去"的用例缺陷

## 5. 最小可运行例子

### 5.1 responses 库基础用法

```python
# test_with_responses.py
import pytest
import requests
import responses

# 基础 Mock 示例
@responses.activate
def test_get_user():
    """模拟 GET 请求"""
    # 注册 Mock 响应
    responses.add(
        method=responses.GET,
        url="https://api.example.com/users/1",
        json={"id": 1, "name": "张三"},
        status=200
    )

    # 发起请求（实际不会访问真实服务）
    resp = requests.get("https://api.example.com/users/1")

    # 断言
    assert resp.status_code == 200
    assert resp.json()["name"] == "张三"


# 模拟异常场景
@responses.activate
def test_timeout():
    """模拟超时异常"""
    responses.add(
        method=responses.GET,
        url="https://api.example.com/users/1",
        body=responses.ConnectionError()
    )

    with pytest.raises(requests.ConnectionError):
        requests.get("https://api.example.com/users/1")


# 动态响应
@responses.activate
def test_dynamic_response():
    """根据请求动态返回响应"""
    def request_callback(request):
        # 解析请求体
        payload = request.body
        # 返回动态响应
        return (200, {}, json.dumps({"received": payload}))

    responses.add_callback(
        method=responses.POST,
        url="https://api.example.com/echo",
        callback=request_callback
    )

    resp = requests.post("https://api.example.com/echo", json={"msg": "hello"})
    assert resp.json()["received"] == '{"msg": "hello"}'
```

### 5.2 Mock Server 搭建示例

```python
# mock_server.py
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Mock 数据存储
mock_data = {
    "/api/users/1": {"id": 1, "name": "张三"},
    "/api/users/2": {"id": 2, "name": "李四"},
}

@app.route("/api/users/<user_id>", methods=["GET"])
def get_user(user_id):
    """模拟获取用户接口"""
    key = f"/api/users/{user_id}"
    if key in mock_data:
        return jsonify(mock_data[key])
    return jsonify({"error": "User not found"}), 404

@app.route("/api/mock/config", methods=["POST"])
def config_mock():
    """动态配置 Mock 响应"""
    data = request.json
    mock_data[data["path"]] = data["response"]
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5000)
```

## 6. 在项目中怎么落地

### 6.1 目录结构设计

```
tests/
├── conftest.py          # pytest 配置，Mock fixture
├── mocks/               # Mock 数据文件
│   ├── user_api.json
│   └── order_api.json
├── api/
│   └── test_user.py
└── utils/
    └── mock_helper.py   # Mock 工具函数
```

### 6.2 conftest.py 配置

```python
# conftest.py
import pytest
import responses
import json
from pathlib import Path

@pytest.fixture
def mock_api():
    """Mock API 请求的 fixture"""
    with responses.RequestsMock() as rsps:
        yield rsps

@pytest.fixture
def load_mock_data():
    """加载 Mock 数据文件"""
    def _loader(filename):
        path = Path(__file__).parent / "mocks" / filename
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return _loader

# 示例：在 fixture 中预置常用 Mock
@pytest.fixture
def mock_user_api(mock_api, load_mock_data):
    """预置用户 API Mock"""
    data = load_mock_data("user_api.json")
    for item in data:
        mock_api.add(**item)
    return mock_api
```

### 6.3 Mock 数据管理

```json
// mocks/user_api.json
[
  {
    "method": "GET",
    "url": "https://api.example.com/users/1",
    "json": { "id": 1, "name": "张三" },
    "status": 200
  },
  {
    "method": "POST",
    "url": "https://api.example.com/users",
    "json": { "id": 100, "name": "新用户" },
    "status": 201
  }
]
```

### 6.4 Mock Server 容器化进 CI

代码层 Mock（responses）只能拦截 Python 用例里的请求；当被测系统自身要调第三方接口时，需要网络层 Mock Server，把它打进 Docker 镜像随流水线一起编排：

```yaml
# docker-compose.test.yml 片段
services:
  app-under-test:
    build: .
    environment:
      - SMS_API_URL=http://mock-server:5000/api/sms # 被测系统指向 Mock
    depends_on:
      - mock-server

  mock-server:
    build: ./mock_server
    ports:
      - "5000:5000"
```

这样被测应用在集成测试里真实地"调用了"短信服务，只是对端是 Mock——测试完整性远高于代码层 Mock。完整的 Mock 服务模板参考 [Mock 服务模板](/testdev-interview-site/practice-template/mock-service-template/)，登录场景里模拟短信验证码的完整用法见 [Mock 登录小项目](/testdev-interview-site/beginner-course/mock-login-mini-project/)。

## 7. 常见坑和排查方法

### 7.1 Mock 未生效

**现象**：请求仍然访问真实服务

**原因**：

- 忘记添加 `@responses.activate` 装饰器
- URL 匹配失败（协议、路径、查询参数不一致）

**解决方案**：

```python
# 错误示例
def test_wrong():
    responses.add(...)  # 没有装饰器，Mock 不生效
    requests.get(...)

# 正确示例
@responses.activate
def test_correct():
    responses.add(...)
    requests.get(...)

# URL 匹配问题：使用正则
import re
responses.add(
    method=responses.GET,
    url=re.compile(r"https://api\.example\.com/users/\d+"),
    json={"id": 1}
)
```

### 7.2 Mock 污染

**现象**：测试用例之间相互影响

**原因**：

- Mock 注册未清理
- 全局 Mock 配置被修改

**解决方案**：

```python
# 使用 pytest fixture 自动清理
@pytest.fixture
def clean_mock():
    with responses.RequestsMock() as rsps:
        yield rsps
    # 退出 with 块时自动清理

# 或手动清理
@responses.activate
def test_with_cleanup():
    responses.add(...)
    try:
        # 测试逻辑
        pass
    finally:
        responses.reset()
```

### 7.3 Mock 数据维护困难

**现象**：Mock 数据文件庞大，难以维护

**解决方案**：

- 按业务模块拆分 Mock 数据文件
- 使用模板引擎生成动态 Mock 数据
- 建立契约测试，保证 Mock 与真实 API 一致

## 8. 面试追问与回答骨架

### Q1：Mock 和 Stub 有什么区别？

**回答骨架**：

- Mock：验证行为（是否调用、调用次数、参数）
- Stub：返回预设数据，不验证行为
- 实际使用中常混用，但面试时需区分概念

### Q2：什么时候不该用 Mock？

**回答骨架**：

- 集成测试阶段，需要验证真实交互
- 性能测试，需要真实网络开销
- 第三方 API 变更频繁，Mock 可能滞后
- 过度 Mock 会导致测试与实现强耦合

### Q3：如何保证 Mock 数据与真实 API 一致？

**回答骨架**：

- 契约测试（Contract Testing）：如 Pact
- 定期录制真实响应，更新 Mock 数据
- API 文档自动生成 Mock（如 OpenAPI + Prism）
- CI 流程中加入真实环境验证

### Q4：responses 和 unittest.mock 有什么区别？

**回答骨架**：

- `responses`：专门 Mock HTTP 请求，粒度是 URL 级别
- `unittest.mock`：通用 Mock 框架，可 Mock 任意对象
- `responses` 内部使用 `unittest.mock` 实现，是更高层封装

### Q5：单元测试全 Mock 了，怎么保证集成阶段不出问题？

**回答骨架**：

- 分层兜底：单测用 Mock 保证逻辑正确，集成测试在真实环境补关键路径验证，两层各管一段
- 契约先行：第三方接口用 OpenAPI 约定出契约，Mock 和真实实现都对着契约生成与校验
- 预发冒烟：发布前在预发环境对第三方依赖跑一轮真实冒烟（小额支付、真实短信），提前暴露 Mock 感知不到的变更
- 变更订阅：关注第三方 API 的 changelog，版本升级排进回归计划

## 9. 练习任务

1. **基础练习**：使用 responses 库编写测试，覆盖 GET/POST 请求的成功和失败场景

2. **进阶练习**：实现一个支持动态配置的 Mock Server，提供管理 API

3. **综合练习**：
   - 为现有项目添加 Mock 层
   - 编写 Mock 数据管理工具
   - 实现契约测试，验证 Mock 与真实 API 一致性

## 性能与规模化

Mock 数据从十几条涨到上千条之后，维护成本会反噬效率，规模化的方向是"少手写、能同步、可编排"：

1. **录制回放替代手写**：用 vcrpy 或 mitmproxy 录制一次真实流量，自动生成 Mock 响应文件，新增场景的成本从"对着文档手写 JSON"降到"跑一遍真实请求"
2. **契约驱动生成**：有 OpenAPI 文档的服务直接用 Prism 等工具生成 Mock Server，接口变更时重新生成，Mock 与真实实现天然一致，避免"Mock 一直绿、真实接口早改了"
3. **版本化管理 Mock 数据**：Mock 数据文件与被测接口的版本对齐，接口升级的 PR 里同步更新 Mock，评审时一眼看到影响面
4. **Mock Server 独立演进**：网络层 Mock 服务容器化后可独立扩缩容、跨任务复用；多任务共享一个实例时注意数据串扰，用请求头或路径前缀区分场景

执行速度方面，responses 这类代码层 Mock 没有网络 IO，千级用例也只有秒级差异，不需要专门优化；真正拖慢的是 Mock Server 的网络往返和用例里不必要的 sleep，排查顺序是"先去掉 sleep、再合并请求"。

## 10. 关联内容

- [API 断言](/testdev-interview-site/glossary/api-assertion/) - Mock 响应后的断言验证
- [断言封装](/testdev-interview-site/coding/assertion-wrapper/) - 统一的断言工具
- [接口测试](/testdev-interview-site/tech/api-testing/) - 完整的接口测试方案
- [pytest Fixture](/testdev-interview-site/tech/pytest/) - Mock 的 fixture 集成

## 11. 下一步

掌握 Mock 后，建议把它放进真实的测试工程闭环里：

1. **接口实战**：在 [接口测试](/testdev-interview-site/tech/api-testing/) 中用 responses 隔离第三方，专注业务断言
2. **框架集成**：结合 [pytest](/testdev-interview-site/tech/pytest/) 的 fixture 管理 Mock 生命周期，避免用例污染
3. **契约保障**：用 OpenAPI + Prism 或 Pact 让 Mock 与真实接口保持同步
4. **综合实战**：前往 [登录认证场景](/testdev-interview-site/scenario/login-auth/) 用 Mock 模拟短信/支付回调

面试冲刺讲清"Mock 和 Stub 区别""什么时候不该用 Mock"。
