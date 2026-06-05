---
title: "Mock 框架"
description: "模拟外部依赖，隔离测试环境，提升测试效率和稳定性"
category: "tech"
difficulty: "interview"
interviewWeight: 3
tags: ["接口测试", "测试隔离", "Python"]
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper", "tech/api-test"]
selfTests:
  - id: "mock-framework-q1"
    question: "Mock 框架的核心作用是什么？"
    options: ["模拟外部依赖，隔离测试环境", "只做文档展示", "替代真实服务器", "只用于性能测试"]
    correctIndex: 0
    explanation: "Mock 框架用于模拟外部依赖，隔离测试环境，提升测试效率和稳定性。"
  - id: "mock-framework-q2"
    question: "responses 库基于哪个库实现 Mock 功能？"
    options: ["requests", "urllib3", "http.client", "aiohttp"]
    correctIndex: 0
    explanation: "responses 库基于 requests 库实现 Mock 功能，通过拦截 requests 的 HTTP 调用来模拟响应。"
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

| 前置知识 | 重要程度 | 说明 |
|---------|---------|------|
| Python 基础 | 必需 | 语法、函数、装饰器 |
| requests 库 | 必需 | 发送 HTTP 请求、处理响应 |
| pytest 测试框架 | 必需 | 测试用例编写、fixture 机制 |
| HTTP 协议基础 | 重要 | 请求方法、状态码、请求头 |
| JSON 数据处理 | 重要 | 序列化、反序列化 |

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
    "json": {"id": 1, "name": "张三"},
    "status": 200
  },
  {
    "method": "POST",
    "url": "https://api.example.com/users",
    "json": {"id": 100, "name": "新用户"},
    "status": 201
  }
]
```

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

## 9. 练习任务

1. **基础练习**：使用 responses 库编写测试，覆盖 GET/POST 请求的成功和失败场景

2. **进阶练习**：实现一个支持动态配置的 Mock Server，提供管理 API

3. **综合练习**：
   - 为现有项目添加 Mock 层
   - 编写 Mock 数据管理工具
   - 实现契约测试，验证 Mock 与真实 API 一致性

## 10. 关联内容

- [API 断言](/glossary/api-assertion) - Mock 响应后的断言验证
- [断言封装](/coding/assertion-wrapper) - 统一的断言工具
- [接口测试](/tech/api-test) - 完整的接口测试方案
- [pytest Fixture](/tech/pytest-fixture) - Mock 的 fixture 集成