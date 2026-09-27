---
title: "Mock 服务模板"
description: "快速搭建Mock服务的标准化模板，涵盖responses配置、路由设计和数据返回规范"
category: "practice-template"
stage: "interview"
estimatedMinutes: 25
difficulty: "interview"
interviewWeight: 3
tags: ["mock", "api-testing", "responses", "node.js", "测试开发"]
prerequisites:
  - "tech/api-testing"
  - "glossary/mock-stub"
  - "practice-template/api-automation-template"
outcomes:
  - "能用 responses 定义带路由的 Mock 接口"
  - "能模拟超时与 500 等异常返回场景"
  - "能把 Mock 服务接入自动化测试流程"
relatedSlugs:
  [
    "tech/api-testing",
    "practice-template/api-automation-template",
    "glossary/api-assertion",
  ]
selfTests:
  - id: "mock-service-template-q1"
    question: "Mock服务的核心价值是什么？"
    options:
      [
        "隔离依赖、加速测试、模拟异常场景",
        "只是为了偷懒",
        "替代真实接口",
        "只在开发阶段有用",
      ]
    correctIndex: 0
    explanation: "Mock服务的核心价值包括：隔离外部依赖、加速测试执行、模拟各种异常场景、支持前后端并行开发。"
  - id: "mock-service-template-q2"
    question: "responses库中定义路由的正确方式是？"
    options:
      [
        "responses.get('/api/users', ...)",
        "responses.route('GET', '/api/users', ...)",
        "responses.add('GET', '/api/users', ...)",
        "responses.mock('/api/users', ...)",
      ]
    correctIndex: 0
    explanation: "responses库使用装饰器风格的方法定义路由，如responses.get()、responses.post()等HTTP方法装饰器。"
  - id: "mock-service-template-q3"
    question: "Mock数据返回时应该注意什么？"
    options:
      [
        "保持与真实接口结构一致，包含完整的状态码和响应头",
        "只要返回数据就行",
        "随意定义结构",
        "只返回错误信息",
      ]
    correctIndex: 0
    explanation: "Mock数据应与真实接口保持结构一致，包括响应状态码、响应头、响应体格式，这样测试才能真实模拟线上行为。"
  - id: "mock-service-template-q4"
    question: "把 RequestsMock 的 assert_all_requests_are_fired 设为 True 后，注册了但没被调用的 Mock 路由会怎样？"
    options:
      [
        "自动删除，不影响结果",
        "fixture 退出时断言失败，提示存在未触发的路由",
        "路由转为全局生效",
        "只打日志警告，测试照常通过",
      ]
    correctIndex: 1
    explanation: "assert_all_requests_are_fired=True 时，fixture 退出会校验每条注册路由都被命中，否则报断言错误。可以借它清理冗余 Mock；只想注册部分路由时显式设为 False。"
---

## 1. 模板目标

提供一个标准化的Mock服务搭建模板，帮助测试开发者：

- 快速构建可复用的Mock服务
- 规范化responses库的配置和使用
- 掌握路由设计的最佳实践
- 统一Mock数据的返回格式
- 支持多种测试场景（成功、失败、异常、边界）

## 2. 适用场景

| 场景               | 说明                                                 |
| ------------------ | ---------------------------------------------------- |
| **前后端并行开发** | 后端接口未完成时，前端可基于Mock进行开发和测试       |
| **接口测试隔离**   | 隔离第三方依赖，避免外部服务不稳定影响测试结果       |
| **异常场景模拟**   | 模拟超时、错误码、异常响应等难以在真实环境复现的场景 |
| **性能测试基线**   | 使用Mock数据作为性能测试的稳定基线                   |
| **CI/CD流水线**    | 在流水线中稳定运行测试，不依赖外部服务               |

## 3. 使用前提

### 技术要求

- Python 3.8+ 环境
- 了解HTTP协议基础（状态码、请求方法、请求头）
- 熟悉pytest测试框架

### 安装依赖

```bash
pip install responses pytest pytest-asyncio
```

### 知识储备

- RESTful API设计规范
- JSON数据格式
- 测试金字塔理念

## 4. 最终产物长什么样

完成本模板后，你将得到：

```
mock_service/
├── conftest.py              # pytest配置，Mock服务fixtures
├── mock_config.py           # Mock数据配置中心
├── routes/
│   ├── user_routes.py       # 用户相关路由
│   ├── order_routes.py      # 订单相关路由
│   └── common_routes.py     # 通用路由（健康检查等）
├── responses/
│   ├── success_responses.py # 成功响应数据
│   ├── error_responses.py   # 错误响应数据
│   └── edge_responses.py    # 边界场景响应
└── tests/
    ├── test_user_api.py     # 用户接口测试
    └── test_order_api.py    # 订单接口测试
```

### 核心代码示例

```python
# conftest.py - Mock服务核心配置
import responses
import pytest

@pytest.fixture
def mock_service():
    """Mock服务fixture，自动启用和清理"""
    with responses.RequestsMock() as rsps:
        yield rsps

# 使用示例
def test_get_user(mock_service):
    mock_service.get(
        "https://api.example.com/users/1",
        json={"id": 1, "name": "测试用户"},
        status=200
    )
    # 测试代码...
```

## 5. 文件结构或内容结构

### 5.1 Mock配置中心 (mock_config.py)

```python
"""Mock服务配置中心 - 统一管理所有Mock配置"""

# 基础配置
BASE_URL = "https://api.example.com"
DEFAULT_TIMEOUT = 30

# 状态码常量
class StatusCode:
    SUCCESS = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    SERVER_ERROR = 500
    SERVICE_UNAVAILABLE = 503

# 响应头模板
DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "X-Request-ID": "mock-request-001"
}
```

### 5.2 路由设计规范

```python
"""路由设计 - 按业务模块组织"""

def register_user_routes(mock_service, base_url):
    """注册用户相关路由"""

    # GET /users/:id - 获取用户详情
    mock_service.get(
        f"{base_url}/users/1",
        json={"id": 1, "name": "张三", "email": "zhangsan@example.com"},
        status=200
    )

    # POST /users - 创建用户
    mock_service.post(
        f"{base_url}/users",
        json={"id": 2, "name": "新用户"},
        status=201
    )

    # 支持动态响应
    def dynamic_user_callback(request):
        import json
        body = json.loads(request.body)
        return (201, {}, json.dumps({"id": 100, **body}))

    mock_service.add_callback(
        method=responses.POST,
        url=f"{base_url}/users/dynamic",
        callback=dynamic_user_callback
    )
```

### 5.3 响应数据模板

```python
"""响应数据模板 - 统一数据结构"""

# 成功响应模板
def success_response(data, message="操作成功"):
    return {
        "code": 0,
        "message": message,
        "data": data,
        "timestamp": "2024-01-15T10:30:00Z"
    }

# 分页响应模板
def paginated_response(items, page=1, page_size=10, total=100):
    return {
        "code": 0,
        "data": {
            "items": items,
            "pagination": {
                "page": page,
                "pageSize": page_size,
                "total": total,
                "totalPages": (total + page_size - 1) // page_size
            }
        }
    }

# 错误响应模板
def error_response(code, message, details=None):
    response = {
        "code": code,
        "message": message
    }
    if details:
        response["details"] = details
    return response
```

## 6. 分步骤完成方式

### Step 1: 创建基础框架

```bash
mkdir -p mock_service/{routes,responses,tests}
touch mock_service/conftest.py mock_service/mock_config.py
```

### Step 2: 编写conftest.py

```python
import pytest
import responses
from unittest.mock import patch

@pytest.fixture
def mock_api():
    """Mock API服务fixture"""
    with responses.RequestsMock(assert_all_requests_are_fired=False) as rsps:
        yield rsps

@pytest.fixture
def mock_config():
    """Mock配置fixture"""
    return {
        "base_url": "https://api.example.com",
        "timeout": 30
    }
```

### Step 3: 注册基础路由

```python
# 在测试文件中注册路由
def test_user_flow(mock_api, mock_config):
    # 注册成功响应
    mock_api.get(
        f"{mock_config['base_url']}/users/1",
        json={"id": 1, "name": "测试用户"},
        status=200
    )

    # 注册错误响应
    mock_api.get(
        f"{mock_config['base_url']}/users/999",
        json={"error": "用户不存在"},
        status=404
    )
```

### Step 4: 编写测试用例

```python
import requests
import pytest

def test_get_user_success(mock_api, mock_config):
    """测试获取用户成功场景"""
    # Given: 准备Mock数据
    mock_api.get(
        f"{mock_config['base_url']}/users/1",
        json={"id": 1, "name": "张三"},
        status=200
    )

    # When: 发起请求
    response = requests.get(f"{mock_config['base_url']}/users/1")

    # Then: 验证结果
    assert response.status_code == 200
    assert response.json()["name"] == "张三"

def test_get_user_not_found(mock_api, mock_config):
    """测试用户不存在场景"""
    mock_api.get(
        f"{mock_config['base_url']}/users/999",
        json={"error": "用户不存在"},
        status=404
    )

    response = requests.get(f"{mock_config['base_url']}/users/999")

    assert response.status_code == 404
```

### Step 5: 添加高级Mock功能

```python
# 模拟超时
def test_timeout_scenario(mock_api, mock_config):
    mock_api.get(
        f"{mock_config['base_url']}/slow-api",
        body=responses.ConnectionError()
    )

    with pytest.raises(requests.ConnectionError):
        requests.get(f"{mock_config['base_url']}/slow-api")

# 模拟延迟响应
def test_delayed_response(mock_api, mock_config):
    import time

    def slow_callback(request):
        time.sleep(2)  # 模拟2秒延迟
        return (200, {}, '{"status": "ok"}')

    mock_api.add_callback(
        method=responses.GET,
        url=f"{mock_config['base_url']}/delayed",
        callback=slow_callback
    )
```

### 运行与验证

按 Step 1~5 建好文件后，在 `mock_service/` 目录下执行：

```bash
pip install -r requirements.txt
pytest mock_service/tests/ -v
```

验证要点：

- 成功 / 失败 / 超时三类用例都应跑通，且失败用例能被稳定复现（改 Mock 数据后用例随之失败）
- 删除某个 `mock_api.get(...)` 注册后，对应请求应报"未注册"错误，说明 Mock 真实生效而非命中真实接口
- 把 `assert_all_requests_are_fired` 改为 `True` 再跑，可检查是否有"注册了但没被调用"的冗余 Mock

## 7. 验收清单

完成以下检查项，确保Mock服务符合规范：

- [ ] **基础配置完成**
  - [ ] conftest.py正确配置pytest fixture
  - [ ] mock_config.py包含基础URL、状态码常量
  - [ ] 依赖正确安装（responses、pytest）

- [ ] **路由设计规范**
  - [ ] 按业务模块组织路由文件
  - [ ] 每个路由有清晰的注释说明
  - [ ] 支持多种HTTP方法（GET/POST/PUT/DELETE）

- [ ] **响应数据完整**
  - [ ] 成功响应有标准格式
  - [ ] 错误响应包含错误码和描述
  - [ ] 分页响应包含完整分页信息

- [ ] **测试覆盖全面**
  - [ ] 覆盖成功场景
  - [ ] 覆盖失败场景（4xx错误）
  - [ ] 覆盖服务端错误（5xx错误）
  - [ ] 覆盖异常场景（超时、网络错误）
  - [ ] Mock 真实生效（断网也能跑通，不命中真实接口）
  - [ ] 失败用例可稳定复现（改 Mock 数据用例随之失败）

- [ ] **代码质量**
  - [ ] 无硬编码的敏感信息
  - [ ] 配置可通过环境变量覆盖
  - [ ] 代码有完整的中文注释

## 8. 加练任务

### 任务一：Mock服务增强

- 添加请求验证：验证请求头、请求参数
- 实现请求计数：统计每个路由被调用的次数
- 添加请求日志：记录完整的请求响应日志

### 任务二：复杂场景Mock

- 实现基于请求参数的动态响应
- 模拟接口限流（429 Too Many Requests）
- 实现JWT Token验证的Mock

### 任务三：集成实践

- 将Mock服务集成到CI/CD流水线
- 使用Docker容器化Mock服务
- 编写Mock服务的性能测试脚本

## 9. 如何转成简历或面试表达

### 简历描述模板

**Mock服务框架开发**（2024年）

- 设计并实现标准化Mock服务框架，支持10+业务模块的接口模拟
- 通过responses库实现路由配置，覆盖成功/失败/异常等20+测试场景
- Mock服务集成至CI/CD流水线，测试执行效率提升40%
- 支持动态响应、请求验证、延迟模拟等高级特性

### 面试问答示例

**Q: 为什么需要Mock服务？**

> Mock服务的核心价值是隔离依赖。在实际项目中，我们经常需要测试与第三方服务的交互，但这些服务可能不稳定、收费、或难以模拟特定场景。通过Mock服务，我可以：
>
> 1. **隔离依赖**：不依赖外部服务，测试更稳定
> 2. **加速测试**：本地响应，毫秒级返回
> 3. **模拟异常**：轻松复现超时、错误码等场景
> 4. **并行开发**：前后端可以基于Mock同时开发

**Q: 你的Mock服务是如何设计的？**

> 我采用了分层设计：
>
> 1. **配置层**：统一管理基础URL、状态码、响应模板
> 2. **路由层**：按业务模块组织，每个路由有清晰注释
> 3. **响应层**：标准化成功、错误、分页等响应格式
> 4. **测试层**：使用pytest fixture管理Mock生命周期
>
> 这样设计的好处是：易维护、可扩展、配置集中管理。

## 完整可运行示例（端到端跑通）

第 4-6 节按步骤给的是片段。这一节给一份**零修改、离线能跑**的完整版：不依赖任何真实接口，`pytest` 一条命令全部跑通，专门用来验证"Mock 真的生效"。

### 示例目录结构

```
mock_service/
├── mock_config.py            # 配置中心：URL、状态码、响应头
├── response_templates.py     # 统一响应模板
├── conftest.py               # Mock 生命周期 fixtures
├── requirements.txt
└── tests/
    ├── test_user_api.py      # 用户接口：成功 / 404 / 动态响应
    └── test_order_api.py     # 订单接口：成功 / 限流 / 超时
```

注意：完整示例把响应模板放在 `response_templates.py` 单文件里，而不是建一个叫 `responses/` 的目录——目录名和 `responses` 库同名会引发 import 冲突（见下方避坑第 1 条）。

### 关键文件全文

**requirements.txt**

```txt
# requirements.txt
pytest>=7.0
requests>=2.28
responses>=0.23
```

**mock_config.py**

```python
# mock_config.py
"""Mock 配置中心：URL、状态码、响应头统一放这里"""

BASE_URL = "https://api.example.com"
DEFAULT_TIMEOUT = 30


class StatusCode:
    """高频状态码集中定义，避免魔法数字散落各处"""
    SUCCESS = 200
    CREATED = 201
    NOT_FOUND = 404
    TOO_MANY_REQUESTS = 429
    SERVER_ERROR = 500


DEFAULT_HEADERS = {"Content-Type": "application/json"}
```

**response_templates.py**

```python
# response_templates.py
"""统一响应模板：Mock 数据与真实接口的结构保持一致"""


def success_response(data, message="操作成功"):
    """业务成功：HTTP 200 + code=0，data 里放资源本体"""
    return {"code": 0, "message": message, "data": data}


def error_response(code, message, details=None):
    """业务失败：HTTP 状态码区分大类，code 表达业务错误码"""
    body = {"code": code, "message": message}
    if details:
        body["details"] = details
    return body
```

**conftest.py**

```python
# conftest.py
"""Mock 生命周期管理：每个用例一个干净的 Mock 容器"""
import pytest
import responses

from mock_config import BASE_URL


@pytest.fixture
def mock_api():
    """RequestsMock 自动启用与清理。

    assert_all_requests_are_fired=False：允许注册了但本轮没被调用的路由；
    想清理冗余 Mock 时临时改成 True，未命中的路由会让用例失败。
    """
    with responses.RequestsMock(assert_all_requests_are_fired=False) as rsps:
        yield rsps


@pytest.fixture
def base_url():
    """被 Mock 的服务地址，测试代码只需要关心协议和路径"""
    return BASE_URL
```

**tests/test_user_api.py**

```python
# tests/test_user_api.py
"""用户接口的 Mock 测试：成功、404、动态响应"""
import json

import requests
import responses

from response_templates import error_response, success_response


def test_get_user_success(mock_api, base_url):
    """获取用户成功：HTTP 200 + 业务码 0"""
    mock_api.get(
        f"{base_url}/users/1",
        json=success_response({"id": 1, "name": "张三"}),
        status=200,
    )

    resp = requests.get(f"{base_url}/users/1")

    assert resp.status_code == 200
    body = resp.json()
    assert body["code"] == 0
    assert body["data"]["name"] == "张三"


def test_get_user_not_found(mock_api, base_url):
    """用户不存在：HTTP 404 + 业务错误码 1001"""
    mock_api.get(
        f"{base_url}/users/999",
        json=error_response(1001, "用户不存在"),
        status=404,
    )

    resp = requests.get(f"{base_url}/users/999")

    assert resp.status_code == 404
    assert resp.json()["code"] == 1001


def test_create_user_dynamic(mock_api, base_url):
    """动态响应：回调函数按请求体生成返回值，回显用户名并分配 id"""
    def create_user_callback(request):
        body = json.loads(request.body)
        return (201, {}, json.dumps({
            "code": 0,
            "data": {"id": 100, "name": body["name"]},
        }))

    mock_api.add_callback(
        method=responses.POST,
        url=f"{base_url}/users",
        callback=create_user_callback,
    )

    resp = requests.post(f"{base_url}/users", json={"name": "新用户"})

    assert resp.status_code == 201
    assert resp.json()["data"]["name"] == "新用户"
```

**tests/test_order_api.py**

```python
# tests/test_order_api.py
"""订单接口的 Mock 测试：成功、限流、第三方超时"""
import pytest
import requests
import responses

from mock_config import StatusCode
from response_templates import error_response, success_response


def test_pay_order_success(mock_api, base_url):
    """正常支付：HTTP 200，状态流转为 PAID"""
    mock_api.post(
        f"{base_url}/orders/1/pay",
        json=success_response({"status": "PAID"}, message="支付成功"),
        status=200,
    )

    resp = requests.post(f"{base_url}/orders/1/pay")

    assert resp.status_code == 200
    assert resp.json()["data"]["status"] == "PAID"


def test_pay_order_rate_limited(mock_api, base_url):
    """触发限流：HTTP 429"""
    mock_api.post(
        f"{base_url}/orders/1/pay",
        json=error_response(1500, "请求过于频繁"),
        status=StatusCode.TOO_MANY_REQUESTS,
    )

    resp = requests.post(f"{base_url}/orders/1/pay")

    assert resp.status_code == 429


def test_third_party_timeout(mock_api, base_url):
    """第三方渠道超时：Mock 抛连接错误，调用方应感知异常"""
    mock_api.post(
        f"{base_url}/orders/1/pay",
        body=responses.ConnectionError(),
    )

    with pytest.raises(requests.ConnectionError):
        requests.post(f"{base_url}/orders/1/pay")
```

### 运行命令与预期输出

```bash
pip install -r mock_service/requirements.txt
pytest mock_service/tests/ -v
```

预期输出（6 条用例全绿）：

```
============================= test session starts =============================
collected 6 items

mock_service/tests/test_order_api.py::test_pay_order_success PASSED           [ 16%]
mock_service/tests/test_order_api.py::test_pay_order_rate_limited PASSED      [ 33%]
mock_service/tests/test_order_api.py::test_third_party_timeout PASSED         [ 50%]
mock_service/tests/test_user_api.py::test_get_user_success PASSED             [ 66%]
mock_service/tests/test_user_api.py::test_get_user_not_found PASSED           [ 83%]
mock_service/tests/test_user_api.py::test_create_user_dynamic PASSED          [100%]

============================== 6 passed in 0.42s ==============================
```

自检"Mock 真的生效"的两个动作：

```bash
# 1. 在任一用例里多注册一条不会被调用的路由，并把 conftest 里
#    assert_all_requests_are_fired 临时改成 True：该用例应在 teardown 阶段报断言错误
# 2. 断网（或把 BASE_URL 改成一个不存在的域名）再跑：结果不变，证明请求从未出进程
```

## 二次开发指南与使用避坑

### 改造顺序：接到自己的项目里

1. **先换 BASE_URL 和响应结构**：`mock_config.py` 的 `BASE_URL` 改成你们系统的域名；`response_templates.py` 按真实接口的外层结构调整（以抓包或接口文档为准，不要自己编结构）。
2. **再补路由**：每个真实接口先配"成功 + 一个主失败"两条路由，按业务模块拆文件；先覆盖自动化用例真正会打到的路径，不追求一次配全。
3. **再接自动化框架**：把 [API 自动化模板](/testdev-interview-site/practice-template/api-automation-template/) 的 `APIClient` 指向 Mock 域名跑断言用例；Mock 路由注册放 fixture 或统一 setup，不写死在用例里。
4. **最后钉依赖、接 CI**：在 requirements 里锁 responses 版本（如 `responses==0.23.1`），避免库升级悄悄改行为；CI 里把 Mock 测试与真实环境测试分成两个 job，Mock 那份负责稳定快跑。

### 直接抄模板最容易踩的 4 个坑

1. **目录或模块名叫 `responses`**：本地 `responses/` 目录会和 `responses` 库抢 import 解析，报出 `AttributeError`、库功能缺失这类看似玄学的错误。响应数据文件统一叫 `mock_responses.py` / `response_templates.py`，目录同理。
2. **Mock 数据结构自己随手编**：字段名、嵌套层级和真实接口对不上，Mock 用例全绿、联调全崩。以抓包或接口文档为准，且真实接口改版时要同步更新 Mock——这是 Mock 维护的最大成本，面试里要主动提。
3. **`assert_all_requests_are_fired` 永远 False**：图省事关掉校验后，"注册了但从没被调用"的冗余 Mock 会一直堆积，最后没人敢删。定期临时开 True 清理一轮。
4. **只 Mock 成功路径**：成功场景谁都会配，但 Mock 的核心价值在异常场景。每个接口至少覆盖"成功 + 一个 4xx + 一个 5xx/超时"，否则真实故障一来用例层毫无感知，和没建 Mock 差不多。

## 10. 关联内容

### 相关技术文档

- [API测试技术](/testdev-interview-site/tech/api-testing/) - 深入理解API测试方法论
- [API 自动化模板](/testdev-interview-site/practice-template/api-automation-template/) - 接口自动化项目骨架模板
- [API断言术语](/testdev-interview-site/glossary/api-assertion/) - 断言最佳实践

### 进阶学习路径

1. **基础阶段**：掌握responses库基础用法（本文档）
2. **进阶阶段**：学习WireMock、MockServer等专业工具
3. **高级阶段**：实现契约测试（Pact）、流量回放
4. **实践阶段**：在真实项目中落地Mock服务

### 推荐资源

- [responses官方文档](https://github.com/getsentry/responses)
- [Mock服务最佳实践](https://martinfowler.com/articles/mocksArentStubs.html)
- [契约测试指南](https://docs.pact.io/)
