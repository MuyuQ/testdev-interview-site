---
title: "API 自动化模板"
description: "一套可直接复用的接口自动化项目模板，包含目录结构、配置管理、测试用例编写规范和报告生成，帮助你快速搭建企业级 API 测试框架。"
category: "practice-template"
stage: "interview"
estimatedMinutes: 30
difficulty: "interview"
interviewWeight: 3
tags: ["接口自动化", "Pytest", "项目架构", "配置管理", "Allure报告", "面试实战"]
prerequisites:
  - "beginner-course/pytest-api-first-case"
  - "tech/api-testing"
  - "tech/pytest"
outcomes:
  - "能按模板搭出分层结构的 API 自动化项目骨架"
  - "能用 conftest 定义可复用的 fixtures"
  - "能生成带用例趋势的 Allure 测试报告"
relatedSlugs:
  ["tech/api-testing", "tech/pytest", "beginner-course/http-api-basics"]
selfTests:
  - id: "api-automation-template-q1"
    question: "API 自动化项目中，测试数据应该放在哪个目录？"
    options:
      [
        "tests/ 目录下",
        "data/ 或 fixtures/ 目录统一管理",
        "直接写在测试代码里",
        "放在配置文件中",
      ]
    correctIndex: 1
    explanation: "测试数据应统一放在 data/ 或 fixtures/ 目录，便于维护和复用，避免硬编码在测试代码中。"
  - id: "api-automation-template-q2"
    question: "conftest.py 文件的主要作用是什么？"
    options:
      [
        "存放测试用例",
        "定义全局 fixtures 和钩子函数",
        "配置 pytest.ini",
        "生成测试报告",
      ]
    correctIndex: 1
    explanation: "conftest.py 用于定义共享的 fixtures、钩子函数和测试配置，是 Pytest 项目组织的关键文件。"
  - id: "api-automation-template-q3"
    question: "API 自动化测试报告推荐使用哪种工具？"
    options:
      [
        "仅使用 console 输出",
        "JUnit XML",
        "Allure Report（可视化+历史对比）",
        "手动记录日志",
      ]
    correctIndex: 2
    explanation: "Allure Report 提供丰富的可视化图表、历史对比和附件功能，是 API 自动化报告的主流选择。"
  - id: "api-automation-template-q4"
    question: "让本模板的完整示例离线一条命令跑通的关键设计是？"
    options:
      [
        "连接公网真实接口",
        "conftest 里用 Flask 起本地被测服务，base_url 指向它",
        "删除所有断言只跑流程",
        "每次手工先启动服务",
      ]
    correctIndex: 1
    explanation: "完整示例在 conftest.py 用 session 级 fixture 把 Flask 被测服务起在本地随机端口，base_url 由配置指向它，pytest 一条命令离线跑通。断言照常保留，删断言只会掩盖问题。"
---

## 1. 模板目标

先给结论：这篇模板给你一套"拿去就能用"的接口自动化项目骨架。它不是教你某个孤立知识点，而是教你**怎么把 Pytest、Requests、配置管理、测试数据、报告串成一个工程化项目**。

完成练习后，你将掌握：

- 一个标准 API 自动化项目的目录结构设计（配置层 / 封装层 / 测试层 / 数据层分离）
- 多环境配置管理的最佳实践（YAML 覆盖，dev / prod 不混用）
- 可复用的测试用例编写模板（参数化 + 分层断言）
- 统一 API 客户端封装与 Allure 报告生成

为什么这件事值得专门做模板？面试时面试官常问"你们接口自动化项目怎么组织的"，如果你只能答"用 Pytest 写"，太单薄。一个完整的项目模板能让你：

- 快速搭建新项目的自动化框架（入职新项目一天出骨架）
- 展示你对测试工程化的理解（分层、配置、复用）
- 在面试中自信地描述项目架构，而不是罗列工具名

## 2. 适用场景

| 场景                 | 是否适用 | 说明                                                       |
| -------------------- | -------- | ---------------------------------------------------------- |
| 面试前准备项目作品   | 适用     | 搭一个能放 GitHub 的接口自动化骨架，作为面试谈资与简历素材 |
| 新项目从零搭自动化   | 适用     | 直接套用目录结构和配置层，半天出可运行框架                 |
| 团队统一脚手架规范   | 适用     | 作为团队接口自动化项目的基线结构，降低协作成本             |
| 已有成熟框架只补用例 | 部分适用 | 可只参考"内容结构"里的用例模板与客户端封装写法             |
| 纯 UI / 性能测试     | 不适用   | 本模板只覆盖 HTTP 接口层，UI 看 Playwright 模板、性能另寻  |
| 单接口临时验证       | 不适用   | 用 curl / postman 更快，不必建整套工程                     |

一句话判断：**当你需要的是"一个长期维护的接口自动化工程"，而不是"一次性的接口调试"，就用本模板。**

## 3. 使用前提

动手前确认你具备：

- **Pytest 基础使用**：fixture、mark、参数化（`@pytest.mark.parametrize`）
- **HTTP API 基本概念**：请求方法、状态码、JSON 报文结构
- **Python 基础编程**：类、装饰器、文件读写（YAML 解析会用上）

如果 Pytest 还不熟，先走 [Pytest 基础](/testdev-interview-site/tech/pytest/)；如果 HTTP 概念模糊，先补 [HTTP API 基础](/testdev-interview-site/beginner-course/http-api-basics/)。

## 4. 最终产物长什么样

完成练习后，你会得到一个**可运行的接口自动化项目骨架**，目录结构如下：

```
api-automation-project/
├── config/                 # 配置文件目录
│   ├── config.yaml         # 主配置（环境、超时等）
│   ├── dev.yaml            # 开发环境配置
│   └── prod.yaml           # 生产环境配置
├── data/                   # 测试数据目录
│   ├── user_data.json      # 用户相关测试数据
│   └── product_data.json   # 产品相关测试数据
├── fixtures/               # Pytest fixtures 目录
│   ├── auth.py             # 认证相关 fixture
│   └── api_client.py       # API 客户端封装
├── tests/                  # 测试用例目录
│   ├── conftest.py         # 全局 fixtures 和钩子
│   ├── user/               # 用户模块测试
│   │   ├── test_login.py
│   │   └── test_register.py
│   └── product/            # 产品模块测试
│       ├── test_create.py
│       └── test_query.py
├── utils/                  # 工具类目录
│   ├── request_helper.py   # 请求封装
│   ├── assertion_helper.py # 断言封装
│   └── logger.py           # 日志工具
├── reports/                # 报告输出目录
├── pytest.ini              # Pytest 配置
├── requirements.txt        # 依赖清单
└── README.md               # 项目说明
```

除了目录，你还会拿到三样可交付物：

1. **能跑通的用例**：至少覆盖登录成功 / 失败 / 缺参等场景
2. **Allure 报告**：可视化结果，含失败用例详情
3. **README**：说明如何安装、运行、切换环境

判定标准：在干净环境 `pip install -r requirements.txt && pytest` 能跑通，并生成报告。

## 5. 内容结构（文件结构与模板）

下面逐项给出每个核心文件的骨架和说明，直接复制即可落地。

### 5.1 配置层：多环境 YAML

使用 YAML 管理配置，环境差异通过独立文件覆盖，避免把 host / token 写死在代码里：

```yaml
# config/config.yaml
base_url: "https://api.example.com"
timeout: 10
retry_times: 3

# 环境特定配置在 dev.yaml / prod.yaml 中覆盖
```

配置加载器统一读取，优先取环境配置、再取基础配置：

```python
# utils/config_loader.py
import yaml
from pathlib import Path

class ConfigLoader:
    """配置加载器，支持多环境切换"""

    def __init__(self, env: str = "dev"):
        self.config_dir = Path("config")
        self.base_config = self._load_yaml("config.yaml")
        self.env_config = self._load_yaml(f"{env}.yaml")

    def _load_yaml(self, filename: str) -> dict:
        filepath = self.config_dir / filename
        with open(filepath, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}

    def get(self, key: str, default=None):
        """优先取环境配置，其次取基础配置"""
        return self.env_config.get(key) or self.base_config.get(key, default)
```

### 5.2 测试层：用例模板

用例按模块分目录，用参数化处理多场景，断言分层写清楚：

```python
# tests/user/test_login.py
import pytest
from utils.assertion_helper import assert_status_code, assert_json_field

class TestLogin:
    """登录接口测试"""

    @pytest.mark.parametrize("username,password,expected_code", [
        ("valid_user", "valid_pass", 200),
        ("invalid_user", "valid_pass", 401),
        ("valid_user", "invalid_pass", 401),
    ])
    def test_login_scenarios(self, api_client, username, password, expected_code):
        """测试不同登录场景"""
        response = api_client.post(
            "/auth/login",
            json={"username": username, "password": password}
        )
        assert_status_code(response, expected_code)

        if expected_code == 200:
            assert_json_field(response, "data.token", expected_type=str)

    def test_login_missing_fields(self, api_client):
        """测试缺少必填字段"""
        response = api_client.post("/auth/login", json={})
        assert_status_code(response, 400)
```

### 5.3 封装层：统一 API 客户端

把所有请求收敛到一个客户端里，统一处理 base_url、超时、请求头，测试代码只写业务：

```python
# fixtures/api_client.py
import requests
from utils.config_loader import ConfigLoader

class APIClient:
    """统一的 API 请求客户端"""

    def __init__(self, env="dev"):
        self.config = ConfigLoader(env)
        self.base_url = self.config.get("base_url")
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def request(self, method: str, endpoint: str, **kwargs):
        """统一请求方法，自动处理超时和日志"""
        url = f"{self.base_url}{endpoint}"
        timeout = self.config.get("timeout", 10)

        response = self.session.request(method, url, timeout=timeout, **kwargs)
        # 可添加日志记录
        return response

    def get(self, endpoint, **kwargs):
        return self.request("GET", endpoint, **kwargs)

    def post(self, endpoint, **kwargs):
        return self.request("POST", endpoint, **kwargs)
```

### 5.4 报告层：Allure 配置

`pytest.ini` 里声明测试路径、命名规范和 markers，并把结果写入 Allure 目录：

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --alluredir=reports/allure-results
markers =
    smoke: 冒烟测试
    regression: 回归测试
    slow: 慢速测试
```

生成与查看报告：

```bash
# 运行测试并生成 Allure 数据
pytest tests/ --alluredir=reports/allure-results

# 启动 Allure 报告服务
allure serve reports/allure-results
```

## 6. 分步完成方式

按下面 5 步搭出可运行骨架，每一步都有可验证的产物。

### 步骤 1：创建目录结构

```bash
mkdir -p api-automation/{config,data,fixtures,tests/user,utils,reports}
touch api-automation/{pytest.ini,requirements.txt,README.md}
```

**完成标志**：目录树与第 4 节一致，`config/`、`tests/user/` 等均已创建。

### 步骤 2：安装依赖

```txt
# requirements.txt
pytest>=7.0
requests>=2.28
PyYAML>=6.0
allure-pytest>=2.12
```

```bash
pip install -r requirements.txt
```

### 步骤 3：创建 conftest.py

```python
# tests/conftest.py
import pytest
from fixtures.api_client import APIClient

@pytest.fixture(scope="session")
def api_client():
    """会话级别的 API 客户端"""
    return APIClient(env="dev")

@pytest.fixture(scope="function")
def auth_token(api_client):
    """每个测试独立的认证 token"""
    response = api_client.post("/auth/login", json={
        "username": "test_user",
        "password": "test_pass"
    })
    yield response.json()["data"]["token"]
    # 清理：可以调用 logout 接口
```

**完成标志**：`api_client` 可被用例直接注入，`auth_token` 在每个用例前后正确生成与清理。

### 步骤 4：编写第一个测试

```python
# tests/user/test_login.py
import pytest

class TestLogin:
    def test_login_success(self, api_client):
        """正常登录"""
        response = api_client.post("/auth/login", json={
            "username": "valid_user",
            "password": "valid_pass"
        })
        assert response.status_code == 200
        assert "token" in response.json()["data"]
```

**完成标志**：`pytest tests/user/test_login.py -v` 通过。

### 步骤 5：运行并生成报告

```bash
pytest tests/ -v --alluredir=reports/allure-results
allure serve reports/allure-results
```

**完成标志**：Allure 服务启动，能看到用例列表与通过情况。

### 常见错误与避坑

迁移自常见错误一节，写代码时对照避免：

**错误 1：硬编码 URL 和数据**

```python
# 错误做法
response = requests.post("https://api.example.com/auth/login", ...)
```

正确做法是通过配置管理：

```python
# 正确做法
response = api_client.post("/auth/login", ...)
```

**错误 2：fixture 作用域设置不当**

```python
# 错误：认证 token 用 session 作用域，但 token 可能过期
@pytest.fixture(scope="session")
def auth_token():
    ...
```

对于可能过期或需要隔离的资源，使用 `function` 作用域。

**错误 3：测试用例缺乏分层断言**

```python
# 错误：只用一个 assert
assert response.json() == expected
```

正确做法是分层断言，失败信息更清晰：

```python
# 正确：分层断言
assert response.status_code == 200
assert response.json()["code"] == 0
assert response.json()["data"]["user_id"] is not None
```

## 7. 验收清单

完成练习后，逐项核对（打勾才算过关）：

- [ ] **目录结构符合规范**：各模块职责清晰，无"所有代码堆在 tests/ 根目录"
- [ ] **配置支持多环境**：至少 dev / prod 可切换，host 不写死在用例里
- [ ] **conftest.py 定义可复用 fixtures**：`api_client` 等能被多个用例共享
- [ ] **用例命名与文档清晰**：类名 `Test*`、方法 `test_*`、有中文 docstring
- [ ] **断言分层**：状态码、业务码、关键字段分条断言
- [ ] **参数化覆盖多场景**：成功 / 失败 / 缺参至少三态
- [ ] **能跑通并出报告**：`pytest` 绿，Allure 可打开
- [ ] **README 可复现**：别人按 README 能装依赖并运行

可执行的验证命令：

```bash
pip install -r requirements.txt
pytest tests/ -v --alluredir=reports/allure-results
allure serve reports/allure-results   # 应能看到用例列表且无报错
```

## 8. 加练任务

基础骨架跑通后，按下面任务提升"工程化含量"（这些是面试加分项）：

1. **多环境一键切换**：新增 `stage.yaml`，用环境变量 `ENV=prod pytest` 控制 `ConfigLoader` 读取哪个文件，验证不改动代码即可切环境。
2. **数据驱动落地**：把 `data/user_data.json` 读入，用 `@pytest.mark.parametrize` 从文件加载用例，体会"数据 / 代码分离"。
3. **数据库断言**：用例执行后查库校验（如登录后 `user.last_login` 更新），引入 `utils/db_helper.py`，注意测试前后数据清理。
4. **CI 接入**：写 GitHub Actions / Jenkinsfile，push 即跑 `pytest` 并上传 Allure 报告，体验"自动化工程"闭环。
5. **失败重试与日志**：为不稳定接口加 `pytest-rerunfailures` 重试，并在 `utils/logger.py` 记录请求/响应，便于排错。

## 9. 如何转成简历或面试表达

**面试官问**："你们接口自动化项目是怎么组织的？"

**建议回答**：

> 我们的项目采用分层架构。顶层是配置层，用 YAML 管理多环境配置；中间是封装层，把 requests 封装成统一的 API 客户端，处理认证、超时、日志；底层是测试层，按业务模块划分目录，用 conftest.py 共享 fixtures。
>
> 测试数据统一放在 data 目录，避免硬编码。报告用 Allure，可以看历史对比和失败截图。这套结构让我入职新项目时，一天就能把自动化框架搭起来。

**关键点总结**：

- 分层架构思想（配置层、封装层、测试层）
- conftest.py 的核心作用（共享 fixture、统一前置）
- Allure 报告的优势（可视化、历史对比、附件）
- 一句话量化价值（快速搭建能力）

**简历写法**：不要写"会用 Pytest 做接口自动化"，要写"基于 Pytest 搭建分层接口自动化框架，配置/封装/测试分离，集成 Allure 报告与 CI，接口回归效率提升 X%"。

## 完整可运行示例（端到端跑通）

第 4-6 节给的是骨架，部分文件只写了关键片段。这一节给一份**零修改、离线能跑**的完整版：conftest 里用 Flask 起一个本地被测服务，`pytest` 一条命令全部跑通，不依赖任何真实环境。这里用本地 Flask 服务而不是进程内 Mock，因为本模板要练的是客户端封装、配置管理和报告这些工程层；进程内 Mock 的做法见 [Mock 服务模板](/testdev-interview-site/practice-template/mock-service-template/)。

### 示例目录结构

```
api-automation/
├── config/
│   ├── config.yaml          # 主配置（默认值）
│   ├── dev.yaml             # 开发环境：指向本地被测服务
│   └── prod.yaml            # 生产环境：仅演示占位
├── fixtures/
│   └── api_client.py        # API 客户端封装
├── server/
│   └── app.py               # 本地被测服务（Flask）
├── tests/
│   ├── conftest.py          # 起服务 + 定义 fixtures
│   └── user/
│       ├── test_login.py    # 登录接口用例
│       └── test_query.py    # 用户查询用例
├── utils/
│   ├── assertion_helper.py  # 分层断言
│   └── config_loader.py     # 多环境配置加载
├── reports/                 # Allure 结果输出目录
├── pytest.ini
└── requirements.txt
```

说明：示例为保持最简没有放 `data/` 目录，数据驱动的加法见第 8 节加练任务 2。

### 关键文件全文

**requirements.txt 与 pytest.ini**

```txt
# requirements.txt
pytest>=7.0
requests>=2.28
PyYAML>=6.0
Flask>=2.2
allure-pytest>=2.12
```

```ini
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
# pythonpath=. 让根目录下的 utils/ fixtures/ server/ 能被 import（需 pytest>=7）
pythonpath = .
addopts = -v --alluredir=reports/allure-results
markers =
    smoke: 冒烟测试
    regression: 回归测试
    slow: 慢速测试
```

**config 三个文件**

```yaml
# config/config.yaml —— 主配置：所有环境共享的默认值
base_url: "http://127.0.0.1:5000"
timeout: 10
retry_times: 3
```

```yaml
# config/dev.yaml —— 开发环境：指向本地被测服务，pytest 离线可跑
base_url: "http://127.0.0.1:5000"
```

```yaml
# config/prod.yaml —— 生产环境：仅演示占位，真实地址不要提交进仓库
base_url: "https://api.example.com"
```

**utils/config_loader.py**

```python
# utils/config_loader.py
import os
from pathlib import Path

import yaml


class ConfigLoader:
    """配置加载器，支持多环境切换"""

    def __init__(self, env: str = None):
        # 环境优先取参数，其次取环境变量 ENV，默认 dev
        self.env = env or os.getenv("ENV", "dev")
        # 用文件自身位置定位 config/，在任何目录下启动 pytest 都不会找错路径
        self.config_dir = Path(__file__).resolve().parent.parent / "config"
        self.base_config = self._load_yaml("config.yaml")
        self.env_config = self._load_yaml(f"{self.env}.yaml")

    def _load_yaml(self, filename: str) -> dict:
        filepath = self.config_dir / filename
        with open(filepath, encoding="utf-8") as f:
            return yaml.safe_load(f) or {}

    def get(self, key: str, default=None):
        """优先取环境配置，其次取基础配置"""
        value = self.env_config.get(key)
        return value if value is not None else self.base_config.get(key, default)
```

**utils/assertion_helper.py**

```python
# utils/assertion_helper.py
"""分层断言：状态码、JSON 字段分开断，失败信息直接指向问题"""


def assert_status_code(response, expected: int):
    """断言 HTTP 状态码，失败时带出响应体，方便定位"""
    assert response.status_code == expected, (
        f"状态码不符：期望 {expected}，实际 {response.status_code}，响应体：{response.text[:200]}"
    )


def assert_json_field(response, field_path: str, expected=None, expected_type=None):
    """按 a.b.c 路径断言 JSON 字段，可校验类型或具体值"""
    data = response.json()
    for key in field_path.split("."):
        assert isinstance(data, dict) and key in data, (
            f"响应缺少字段 {field_path}，实际：{data}"
        )
        data = data[key]
    if expected_type is not None:
        assert isinstance(data, expected_type), (
            f"字段 {field_path} 类型应为 {expected_type.__name__}，实际 {type(data).__name__}"
        )
    if expected is not None:
        assert data == expected, f"字段 {field_path} 期望 {expected}，实际 {data}"
    return data
```

**server/app.py —— 本地被测服务**

```python
# server/app.py
"""本地被测服务：一个极简用户系统，供自动化用例打真实 HTTP 请求"""
from flask import Flask, jsonify, request

app = Flask(__name__)

# 模拟账号库：只有 valid_user / valid_pass 能登录成功
VALID_USERS = {"valid_user": "valid_pass"}


def make_resp(code: int, message: str, data=None):
    """统一响应结构：业务码 + 提示 + 数据，和真实项目保持同构"""
    return jsonify({"code": code, "message": message, "data": data or {}})


@app.post("/auth/login")
def login():
    body = request.get_json(silent=True) or {}
    # 缺参：400
    if not body.get("username") or not body.get("password"):
        return make_resp(1, "用户名或密码不能为空"), 400
    # 账号或密码错误：401
    if VALID_USERS.get(body["username"]) != body["password"]:
        return make_resp(1, "用户名或密码错误"), 401
    # 登录成功：200 + token
    return make_resp(0, "登录成功", {"token": f"fake-token-{body['username']}"}), 200


@app.get("/users/<int:user_id>")
def get_user(user_id: int):
    if user_id != 1:
        return make_resp(1, "用户不存在"), 404
    return make_resp(0, "ok", {"id": 1, "name": "张三"}), 200
```

**fixtures/api_client.py**

```python
# fixtures/api_client.py
import requests

from utils.config_loader import ConfigLoader


class APIClient:
    """统一的 API 请求客户端：base_url、超时、请求头全在这里收敛"""

    def __init__(self, env="dev"):
        self.config = ConfigLoader(env)
        self.base_url = self.config.get("base_url")
        self.timeout = self.config.get("timeout", 10)
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def request(self, method: str, endpoint: str, **kwargs):
        """统一请求入口：拼 URL、套超时；排查问题时在这里加日志"""
        url = f"{self.base_url}{endpoint}"
        return self.session.request(method, url, timeout=self.timeout, **kwargs)

    def get(self, endpoint, **kwargs):
        return self.request("GET", endpoint, **kwargs)

    def post(self, endpoint, **kwargs):
        return self.request("POST", endpoint, **kwargs)
```

**tests/conftest.py —— 起服务 + 定义 fixtures**

```python
# tests/conftest.py
import threading

import pytest
from werkzeug.serving import make_server

from fixtures.api_client import APIClient
from server.app import app


class ServerThread:
    """在后台线程里跑 Flask：随机端口、进程退出自动停止"""

    def __init__(self, flask_app):
        # 端口传 0，由操作系统随机分配，避免本地端口冲突
        self.server = make_server("127.0.0.1", 0, flask_app)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)

    def start(self) -> str:
        self.thread.start()
        return f"http://127.0.0.1:{self.server.port}"

    def stop(self):
        self.server.shutdown()
        self.thread.join()


@pytest.fixture(scope="session")
def base_url():
    """整个测试会话只起一次被测服务"""
    runner = ServerThread(app)
    url = runner.start()
    yield url
    runner.stop()


@pytest.fixture(scope="session")
def api_client(base_url):
    """会话级 API 客户端：把 base_url 覆盖成本会话起的服务地址"""
    client = APIClient(env="dev")
    client.base_url = base_url
    return client


@pytest.fixture(scope="function")
def auth_token(api_client):
    """每个用例独立获取 token；当前用例没用到也能当参考实现"""
    response = api_client.post(
        "/auth/login",
        json={"username": "valid_user", "password": "valid_pass"},
    )
    yield response.json()["data"]["token"]
    # 清理动作：真实项目里可在这里调用 logout 接口
```

**tests/user/test_login.py 与 test_query.py**

```python
# tests/user/test_login.py
import pytest

from utils.assertion_helper import assert_status_code, assert_json_field


class TestLogin:
    """登录接口测试"""

    @pytest.mark.parametrize("username,password,expected_code", [
        ("valid_user", "valid_pass", 200),    # 正常登录
        ("invalid_user", "valid_pass", 401),  # 用户不存在
        ("valid_user", "wrong_pass", 401),    # 密码错误
    ], ids=["success", "wrong-user", "wrong-pass"])
    def test_login_scenarios(self, api_client, username, password, expected_code):
        """登录接口三态：成功 / 用户不存在 / 密码错误"""
        response = api_client.post(
            "/auth/login",
            json={"username": username, "password": password},
        )
        assert_status_code(response, expected_code)
        if expected_code == 200:
            assert_json_field(response, "data.token", expected_type=str)

    def test_login_missing_fields(self, api_client):
        """登录接口：缺参返回 400"""
        response = api_client.post("/auth/login", json={})
        assert_status_code(response, 400)
```

```python
# tests/user/test_query.py
from utils.assertion_helper import assert_status_code, assert_json_field


class TestUserQuery:
    """用户查询接口测试"""

    def test_get_user_success(self, api_client):
        """查询存在的用户：200 + 姓名正确"""
        response = api_client.get("/users/1")
        assert_status_code(response, 200)
        assert_json_field(response, "data.name", expected="张三")

    def test_get_user_not_found(self, api_client):
        """查询不存在的用户：404"""
        response = api_client.get("/users/999")
        assert_status_code(response, 404)
```

### 运行命令与预期输出

```bash
cd api-automation
python -m venv .venv && source .venv/bin/activate   # 建议用干净虚拟环境验证
pip install -r requirements.txt
pytest tests/ -v
```

预期输出（6 条用例全绿）：

```
============================= test session starts =============================
collected 6 items

tests/user/test_login.py::TestLogin::test_login_scenarios[success] PASSED     [ 16%]
tests/user/test_login.py::TestLogin::test_login_scenarios[wrong-user] PASSED  [ 33%]
tests/user/test_login.py::TestLogin::test_login_scenarios[wrong-pass] PASSED  [ 50%]
tests/user/test_login.py::TestLogin::test_login_missing_fields PASSED         [ 66%]
tests/user/test_query.py::TestUserQuery::test_get_user_success PASSED         [ 83%]
tests/user/test_query.py::TestUserQuery::test_get_user_not_found PASSED       [100%]

============================== 6 passed in 1.05s ==============================
```

再确认报告产物可用：

```bash
allure serve reports/allure-results   # 浏览器自动打开，能看到 6 条用例及参数化明细
```

注意：`--alluredir` 只追加结果数据，本地反复调试时先 `rm -rf reports/allure-results` 再跑，避免报告里混入旧用例。

## 二次开发指南与使用避坑

### 改造顺序：从模板到你的项目

拿去对接自己系统时，按这个顺序改，每改一步跑一次 `pytest`，绿了再改下一步，出问题能立刻定位是哪一步改坏的：

1. **换被测对象**：改 `config/dev.yaml` 的 `base_url` 指向你的测试环境。本地演示用的 `server/` 目录可以保留当冒烟环境，也可以删掉并同步删除 conftest 里的 `base_url` fixture。
2. **换业务模块**：把 `tests/user/` 换成你的业务模块（如 `order/`、`payment/`），每个模块先写一条成功用例跑通，再补失败和异常场景。
3. **换认证方式**：conftest 里的 `auth_token` 按你们系统的真实认证改（token / cookie / 签名），注意作用域——会过期的凭证用 `function` 级，长会话用 `session` 级并加重登逻辑。
4. **换断言结构**：`assertion_helper` 的字段路径按你们接口的业务码结构调整（有的项目是 `code/data/message`，有的直接返回资源本体）。
5. **接流水线**：最后才动 CI——pytest.ini 的 addopts、Allure 目录、触发命令，本地全绿再上流水线。

改完每一层，把改动记进 README 的「改造记录」：改了哪几处、为什么改。这份记录就是面试时讲"项目是怎么演化的"的原始素材。

### 直接抄模板最容易踩的 4 个坑

1. **base_url 还是指向本地演示服务**：改造后忘了把 `dev.yaml` 的地址从 `127.0.0.1:5000` 换成真实测试环境，用例全绿但全打在本地 Flask 上，一个真实接口都没测到。改完配置后跑 `pytest -v`，从日志确认请求目标地址。
2. **token 作用域与过期策略不匹配**：直接抄 `session` 级 token，跑长回归时后半段全 401；反过来，token 不过期却用 `function` 级，每条用例都多一次登录，白拖慢执行。先确认你们 token 的有效期，再定作用域。
3. **断言过松：只断状态码不断业务码**：国内不少网关风格接口永远返回 HTTP 200，成败只看 body 里的 `code`。只抄 `assert_status_code` 不校验业务码的用例，接口挂了照样绿。至少保留"状态码 + 业务码 + 一个关键字段"三层断言。
4. **本地服务验证通过就当真实环境也通过**：conftest 里的 Flask 演示服务没有网关、鉴权、限流，用它跑绿只能证明"框架本身通了"。对接真实系统后，先手工抽 2-3 条用例对测试环境复核结果一致，再放进回归集。

## 10. 关联内容

- [API 测试技术](/testdev-interview-site/tech/api-testing/) - 深入学习接口断言与测试技巧
- [Pytest 进阶](/testdev-interview-site/tech/pytest/) - 掌握 fixture、marker 等高级特性
- [HTTP API 基础](/testdev-interview-site/beginner-course/http-api-basics/) - 补充 API 测试理论底座
- [Mock 服务模板](/testdev-interview-site/practice-template/mock-service-template/) - 学习如何用 Mock 隔离外部依赖
- [项目故事模板](/testdev-interview-site/practice-template/project-story-template/) - 把本项目包装成面试可讲的项目故事
