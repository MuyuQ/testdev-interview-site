---
title: "接口测试"
description: "掌握 HTTP 协议基础与 requests 库实战，学会设计清晰的断言与数据驱动测试方案，解决前后端联调验证和自动化测试覆盖问题。"
category: "tech"
difficulty: "interview"
interviewWeight: 3
tags: ["接口测试", "HTTP协议", "requests库", "断言设计", "数据驱动", "自动化测试"]
relatedSlugs: ["glossary/api-assertion", "coding/assertion-wrapper", "scenario/login-auth"]
selfTests:
  - id: "api-testing-http-method"
    question: "以下哪个 HTTP 方法通常用于获取资源而不修改服务器状态？"
    options: ["POST", "GET", "DELETE", "PATCH"]
    correctIndex: 1
    explanation: "GET 方法是幂等的，用于获取资源，不会修改服务器状态。POST 用于创建资源，DELETE 用于删除，PATCH 用于部分更新，这些都会改变服务器状态。"
  - id: "api-testing-assertion-design"
    question: "设计接口断言时，以下哪项做法最合理？"
    options: ["只检查状态码是否为 200", "检查响应体中的关键字段和业务逻辑", "不需要断言，只要请求发出就行", "把整个响应体转为字符串比较"]
    correctIndex: 1
    explanation: "合理的断言应覆盖状态码、响应体关键字段（如业务状态码、数据结构）以及业务逻辑验证。只检查 200 可能漏掉业务错误；字符串比较不够灵活且难以维护。"
  - id: "api-testing-data-driven"
    question: "数据驱动测试的核心优势是什么？"
    options: ["减少代码编写量", "测试数据和测试逻辑分离，便于维护和扩展", "让测试运行更快", "避免使用断言"]
    correctIndex: 1
    explanation: "数据驱动测试将测试数据与测试逻辑分离，新增测试场景只需添加数据，无需修改代码。这提高了可维护性，便于覆盖更多边界场景，也适合团队协作。"
---

## 接口测试解决什么问题

接口测试（API Testing）主要解决以下问题：

1. **前后端联调验证**：在后端接口开发完成后，独立验证接口行为是否符合预期，不依赖前端实现
2. **自动化测试覆盖**：相比 UI 自动化，接口测试执行更快、更稳定，适合回归测试和 CI/CD 集成
3. **业务逻辑深度验证**：直接测试业务核心逻辑，绕过 UI 层的干扰，更容易发现深层次问题
4. **契约验证**：确保接口实现与 API 文档（如 Swagger）一致，避免前后端集成时的接口不匹配

接口测试位于测试金字塔的中间层，投入产出比最优：比单元测试更容易编写，比端到端测试更稳定高效。

## 面试为什么会问

接口测试是测试开发岗位的核心技能，面试高频考察原因：

1. **技术栈验证**：确认你是否掌握 HTTP 协议、Python requests 库等基础工具
2. **工程化思维**：考察断言设计、数据驱动、测试分层等实践经验
3. **问题诊断能力**：能否分析接口返回异常、定位前后端问题归属
4. **自动化落地经验**：是否真正做过接口自动化框架，而非纸上谈兵

常见追问方向：HTTP 状态码含义、断言策略、数据驱动实现、Mock 使用场景。

## 学习前置条件

开始接口测试前，建议掌握：

| 前置知识 | 掌握程度 | 说明 |
|---------|---------|------|
| Python 基础 | 熟练 | 函数、模块、异常处理 |
| HTTP 协议概念 | 了解 | 请求方法、状态码、请求头响应体结构 |
| JSON 格式 | 熟悉 | 接口数据交换的主流格式 |
| Pytest 基础 | 了解 | 测试框架组织与运行 |

可先学习 [beginner-course/http-api-basics](../beginner-course/http-api-basics) 补充 HTTP 基础。

## 核心概念拆解

### HTTP 协议基础

HTTP 是接口测试的底层协议，理解以下概念至关重要：

**请求结构**：
```
GET /api/users/123 HTTP/1.1
Host: example.com
Authorization: Bearer token123
Content-Type: application/json

{"page": 1, "size": 10}  # 请求体（GET 通常无）
```

**常见 HTTP 方法**：

| 方法 | 用途 | 特点 |
|-----|------|-----|
| GET | 获取资源 | 幂等，参数在 URL |
| POST | 创建资源 | 非幂等，参数在请求体 |
| PUT | 全量更新 | 幂等，替换整个资源 |
| PATCH | 部分更新 | 非幂等，修改部分字段 |
| DELETE | 删除资源 | 幂等 |

**关键状态码**：
- `200 OK`：成功
- `201 Created`：创建成功
- `400 Bad Request`：请求参数错误
- `401 Unauthorized`：未认证
- `403 Forbidden`：无权限
- `404 Not Found`：资源不存在
- `500 Internal Server Error`：服务器内部错误

### requests 库核心用法

Python 的 requests 库是接口测试的主流工具：

```python
import requests

# GET 请求
response = requests.get(
    "https://api.example.com/users",
    params={"page": 1, "size": 10},
    headers={"Authorization": "Bearer token123"}
)

# POST 请求
response = requests.post(
    "https://api.example.com/users",
    json={"name": "张三", "email": "zhang@example.com"},
    headers={"Content-Type": "application/json"}
)

# 获取响应信息
status_code = response.status_code      # 状态码
json_data = response.json()             # JSON 响应体
headers = response.headers              # 响应头
elapsed = response.elapsed.total_seconds()  # 响应耗时
```

**常用参数说明**：
- `params`：URL 查询参数，自动拼接到 URL
- `json`：请求体 JSON 数据，自动序列化并设置 Content-Type
- `headers`：请求头字典
- `timeout`：超时时间（秒）

### 断言设计

断言是验证接口行为的核心，设计原则：**验证关键，而非全部**。

```python
def test_get_user_success():
    """验证获取用户接口成功场景"""
    response = requests.get("https://api.example.com/users/123")

    # 第一层：状态码断言
    assert response.status_code == 200, f"期望 200，实际 {response.status_code}"

    # 第二层：响应结构断言
    data = response.json()
    assert "id" in data, "响应缺少 id 字段"
    assert "name" in data, "响应缺少 name 字段"

    # 第三层：业务数据断言
    assert data["id"] == 123, f"期望 id=123，实际 {data['id']}"
    assert data["status"] == "active", f"用户状态应为 active"

    # 第四层：响应时间断言（可选）
    assert response.elapsed.total_seconds() < 2, "响应超时"
```

**断言分层策略**：
1. **状态码层**：基础可用性验证
2. **结构层**：响应格式符合契约
3. **业务层**：具体数据值正确
4. **性能层**：响应时间、并发能力（可选）

### 数据驱动测试

数据驱动将测试数据与测试逻辑分离，实现一套代码覆盖多场景：

```python
import pytest

# 测试数据（可从 CSV/JSON/YAML 文件加载）
login_test_data = [
    # (username, password, expected_status, expected_message)
    ("admin", "correct_pwd", 200, "登录成功"),
    ("admin", "wrong_pwd", 401, "密码错误"),
    ("", "any_pwd", 400, "用户名不能为空"),
    ("admin", "", 400, "密码不能为空"),
]

@pytest.mark.parametrize("username,password,expected_status,expected_message", login_test_data)
def test_login_scenarios(username, password, expected_status, expected_message):
    """数据驱动登录接口测试"""
    response = requests.post(
        "https://api.example.com/login",
        json={"username": username, "password": password}
    )

    assert response.status_code == expected_status
    if expected_status == 200:
        assert response.json()["message"] == expected_message
    else:
        assert response.json()["error"] == expected_message
```

**数据驱动优势**：
- 新增测试场景只需添加数据行
- 便于覆盖边界值、异常场景
- 测试逻辑稳定，维护成本低

## 最小可运行示例

完整的最小接口测试示例：

```python
# test_api_minimal.py
import pytest
import requests

class TestUserAPI:
    """用户接口最小测试集"""

    BASE_URL = "https://api.example.com"

    def test_get_user_list_success(self):
        """验证获取用户列表成功"""
        response = requests.get(f"{self.BASE_URL}/users", params={"page": 1})
        assert response.status_code == 200
        assert "data" in response.json()
        assert isinstance(response.json()["data"], list)

    def test_create_user_success(self):
        """验证创建用户成功"""
        new_user = {"name": "测试用户", "email": "test@example.com"}
        response = requests.post(f"{self.BASE_URL}/users", json=new_user)
        assert response.status_code == 201
        assert response.json()["name"] == new_user["name"]

# 运行：pytest test_api_minimal.py -v
```

## 在项目中怎么落地

### 接口测试项目结构

```
api_test_project/
├── config/
│   └── config.yaml          # 环境配置（base_url、认证信息）
├── data/
│   ├── login_cases.yaml     # 登录测试数据
│   ├── user_cases.json      # 用户模块测试数据
├── api/
│   ├── user_api.py          # 用户接口封装
│   ├── auth_api.py          # 认证接口封装
├── tests/
│   ├── test_login.py        # 登录接口测试
│   ├── test_user.py         # 用户接口测试
├── utils/
│   ├── assertion.py         # 断言工具函数
│   ├── logger.py            # 日志封装
├── pytest.ini               # pytest 配置
└── requirements.txt         # 依赖清单
```

### 接口封装层设计

将 requests 调用封装为业务方法，提高可读性和复用性：

```python
# api/user_api.py
import requests

class UserAPI:
    """用户接口封装"""

    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}

    def get_user(self, user_id):
        """获取单个用户"""
        return requests.get(f"{self.base_url}/users/{user_id}", headers=self.headers)

    def create_user(self, name, email):
        """创建用户"""
        return requests.post(
            f"{self.base_url}/users",
            json={"name": name, "email": email},
            headers=self.headers
        )

    def delete_user(self, user_id):
        """删除用户"""
        return requests.delete(f"{self.base_url}/users/{user_id}", headers=self.headers)

# tests/test_user.py
from api.user_api import UserAPI

def test_user_crud_flow():
    """用户增删改查完整流程"""
    api = UserAPI("https://api.example.com", token="test_token")

    # 创建
    create_resp = api.create_user("流程测试", "flow@test.com")
    assert create_resp.status_code == 201
    user_id = create_resp.json()["id"]

    # 查询
    get_resp = api.get_user(user_id)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "流程测试"

    # 删除
    delete_resp = api.delete_user(user_id)
    assert delete_resp.status_code == 204
```

## 常见坑和排查方法

### 陷阱一：只断言状态码

```python
# ❌ 错误示例：只检查 200
def test_login_wrong():
    response = requests.post("https://api.example.com/login", json={"username": "wrong"})
    assert response.status_code == 200  # 业务错误也可能返回 200！

# ✅ 正确做法：检查业务状态码
def test_login_correct():
    response = requests.post("https://api.example.com/login", json={"username": "wrong"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == False, "错误参数不应登录成功"
    assert "用户名或密码错误" in data["message"]
```

**排查思路**：很多业务逻辑错误依然返回 HTTP 200，需检查响应体中的业务状态码或 message 字段。

### 陷阱二：忽略请求编码问题

```python
# ❌ 错误示例：直接传字符串
response = requests.post(url, data='{"name": "张三"}')

# ✅ 正确做法：使用 json 参数自动编码
response = requests.post(url, json={"name": "张三"})
```

**排查思路**：请求体编码不一致会导致 400 错误，优先使用 `json=` 参数而非 `data=`。

### 陷阱三：会话状态未保持

```python
# ❌ 错误示例：每个请求独立 session，登录态丢失
requests.post("https://api.example.com/login", json=login_data)  # 登录
requests.get("https://api.example.com/profile")  # 未携带登录态，返回 401

# ✅ 正确做法：使用 Session 保持状态
session = requests.Session()
session.post("https://api.example.com/login", json=login_data)
response = session.get("https://api.example.com/profile")  # 自动携带登录态
assert response.status_code == 200
```

### 陷阱四：超时未设置导致阻塞

```python
# ❌ 危险：无超时设置，可能永久阻塞
response = requests.get("https://slow-api.example.com/data")

# ✅ 安全：设置超时
response = requests.get("https://slow-api.example.com/data", timeout=5)
```

## 面试追问与回答骨架

**Q1：你们项目接口测试覆盖了哪些场景？**

回答骨架：
> 我们主要覆盖三类场景：一是正向场景，验证接口在合法参数下的正确响应；二是异常场景，包括参数缺失、格式错误、权限不足等；三是边界场景，如空值、超长字符串、特殊字符等。登录模块覆盖率最高，达到 90%以上。

**Q2：HTTP 401 和 403 有什么区别？遇到怎么排查？**

回答骨架：
> 401 表示未认证，需要提供身份凭证；403 表示已认证但无权限访问该资源。排查时先检查 token 是否正确携带，再看 token 是否过期，最后确认用户角色是否有对应操作权限。

**Q3：数据驱动测试的数据怎么管理？**

回答骨架：
> 我们用 YAML 文件管理测试数据，按模块组织。每个测试类对应一个数据文件，包含正向、异常、边界三类数据组。运行时通过 pytest parametrize 加载，新增场景只需加数据行，不改测试代码。

**Q4：接口测试怎么集成到 CI/CD？**

回答骨架：
> 在流水线的构建阶段后、部署阶段前执行。用 pytest 运行接口测试集，失败则阻断部署。关键接口失败会触发告警，非关键接口失败标记为不稳定用例供后续分析。

## 练习任务

### 任务一：设计登录接口断言

为登录接口 `POST /api/login` 设计至少 3 条断言：

```python
# 练习模板
def test_login_assertion_design():
    response = requests.post(
        "https://api.example.com/login",
        json={"username": "admin", "password": "123456"}
    )
    # TODO: 设计你的断言
    # 提示：状态码、响应结构、业务数据、token 存在性
```

### 任务二：实现数据驱动登录测试

使用 pytest parametrize 实现 4 种登录场景的数据驱动测试：
- 正确用户名密码
- 错误密码
- 用户名为空
- 密码为空

### 任务三：封装一个接口类

选择一个熟悉的公开 API（如 GitHub API），封装一个包含 3 个方法的接口类：
- `get_repo_info(repo_name)`：获取仓库信息
- `list_user_repos(username)`：获取用户仓库列表
- `create_issue(repo, title)`：创建 issue（需认证）

## 关联内容

### 术语补充
- [glossary/api-assertion](../../glossary/api-assertion) - API 断言术语详解
- [glossary/http-status-code](../../glossary/http-status-code) - HTTP 状态码速查

### 练习模板
- [coding/assertion-wrapper](../../coding/assertion-wrapper) - 断言工具函数封装练习

### 应用场景
- [scenario/login-auth](../../scenario/login-auth) - 登录认证完整测试方案

### 技术深入
- [tech/mock-framework](../mock-framework) - Mock 框架与接口 Mock 策略
- [tech/ci-cd](../ci-cd) - CI/CD 流水线集成

## 下一步

掌握接口测试基础后，建议学习：
1. **Mock 框架**：学会隔离外部依赖，独立测试接口逻辑
2. **接口契约测试**：使用 Swagger/OpenAPI 进行契约验证
3. **接口性能测试**：扩展到并发、压测场景

完成本页练习后，可前往 [scenario/login-auth](../../scenario/login-auth) 进行综合实战。