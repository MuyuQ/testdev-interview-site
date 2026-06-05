---
title: "API 自动化模板"
description: "一套可直接复用的接口自动化项目模板，包含目录结构、配置管理、测试用例编写规范和报告生成，帮助你快速搭建企业级 API 测试框架。"
category: "practice-template"
difficulty: "interview"
interviewWeight: 3
tags: ["接口自动化", "Pytest", "项目架构", "配置管理", "Allure报告", "面试实战"]
relatedSlugs: ["tech/api-testing", "tech/pytest", "beginner-course/http-api-basics"]
selfTests:
  - id: "api-automation-template-q1"
    question: "API 自动化项目中，测试数据应该放在哪个目录？"
    options: ["tests/ 目录下", "data/ 或 fixtures/ 目录统一管理", "直接写在测试代码里", "放在配置文件中"]
    correctIndex: 1
    explanation: "测试数据应统一放在 data/ 或 fixtures/ 目录，便于维护和复用，避免硬编码在测试代码中。"
  - id: "api-automation-template-q2"
    question: "conftest.py 文件的主要作用是什么？"
    options: ["存放测试用例", "定义全局 fixtures 和钩子函数", "配置 pytest.ini", "生成测试报告"]
    correctIndex: 1
    explanation: "conftest.py 用于定义共享的 fixtures、钩子函数和测试配置，是 Pytest 项目组织的关键文件。"
  - id: "api-automation-template-q3"
    question: "API 自动化测试报告推荐使用哪种工具？"
    options: ["仅使用 console 输出", "JUnit XML", "Allure Report（可视化+历史对比）", "手动记录日志"]
    correctIndex: 2
    explanation: "Allure Report 提供丰富的可视化图表、历史对比和附件功能，是 API 自动化报告的主流选择。"
---

## 你会学到什么

读完这篇，你将掌握：
- 一个标准 API 自动化项目的目录结构设计
- 配置文件的最佳实践（环境、数据、请求）
- 可复用的测试用例编写模板
- 如何生成专业的测试报告

## 为什么要学

面试时，面试官经常会问："你们公司的接口自动化项目是怎么组织的？" 如果你只能回答"用 Pytest 写"，那太单薄了。一个完整的项目模板能让你：
- 快速搭建新项目的自动化框架
- 展示你对测试工程化的理解
- 在面试中自信地描述项目架构

## 前置知识

- Pytest 基础使用
- HTTP API 基本概念（请求方法、状态码、JSON）
- Python 基础编程

## 核心概念

### 目录结构设计

一个标准的 API 自动化项目目录：

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
│   │   ├── test_create.py
│   │   └── test_query.py
├── utils/                  # 工具类目录
│   ├── request_helper.py   # 请求封装
│   ├── assertion_helper.py # 断言封装
│   └── logger.py           # 日志工具
├── reports/                # 报告输出目录
├── pytest.ini              # Pytest 配置
├── requirements.txt        # 依赖清单
└── README.md               # 项目说明
```

### 配置文件设计

使用 YAML 格式管理配置，清晰易读：

```yaml
# config/config.yaml
base_url: "https://api.example.com"
timeout: 10
retry_times: 3

# 环境特定配置在 dev.yaml / prod.yaml 中覆盖
```

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

### 测试用例模板

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

### API 客户端封装

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

### Allure 报告配置

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

生成报告命令：

```bash
# 运行测试并生成 Allure 数据
pytest tests/ --alluredir=reports/allure-results

# 启动 Allure 报告服务
allure serve reports/allure-results
```

## 手把手练习

### 练习：搭建一个登录接口自动化项目

按照以下步骤，创建一个完整的 API 自动化项目骨架：

**步骤 1：创建目录结构**

```bash
mkdir -p api-automation/{config,data,fixtures,tests/user,utils,reports}
touch api-automation/{pytest.ini,requirements.txt,README.md}
```

**步骤 2：安装依赖**

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

**步骤 3：创建 conftest.py**

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

**步骤 4：编写第一个测试**

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

**步骤 5：运行并生成报告**

```bash
pytest tests/ -v --alluredir=reports/allure-results
allure serve reports/allure-results
```

## 检查标准

完成练习后，检查以下要点：
- [ ] 目录结构符合规范，各模块职责清晰
- [ ] 配置文件支持多环境切换（至少 dev/prod）
- [ ] conftest.py 定义了可复用的 fixtures
- [ ] 测试用例有清晰的命名和文档字符串
- [ ] 能成功生成 Allure 报告并查看

## 常见错误

### 错误 1：硬编码 URL 和数据

```python
# 错误做法
response = requests.post("https://api.example.com/auth/login", ...)
```

正确做法是通过配置管理：

```python
# 正确做法
response = api_client.post("/auth/login", ...)
```

### 错误 2：fixture 作用域设置不当

```python
# 错误：认证 token 用 session 作用域，但 token 可能过期
@pytest.fixture(scope="session")
def auth_token():
    ...
```

对于可能过期或需要隔离的资源，使用 `function` 作用域。

### 错误 3：测试用例缺乏断言结构

```python
# 错误：只用一个 assert
assert response.json() == expected
```

正确做法是分层断言：

```python
# 正确：分层断言，失败信息更清晰
assert response.status_code == 200
assert response.json()["code"] == 0
assert response.json()["data"]["user_id"] is not None
```

## 面试怎么说

**面试官问**："你们接口自动化项目是怎么组织的？"

**建议回答**：

"我们的项目采用分层架构。顶层是配置层，用 YAML 管理多环境配置；中间是封装层，把 requests 封装成统一的 API 客户端，处理认证、超时、日志；底层是测试层，按业务模块划分目录，用 conftest.py 共享 fixtures。

测试数据统一放在 data 目录，避免硬编码。报告用 Allure，可以看历史对比和失败截图。这套结构让我入职新项目时，一天就能把自动化框架搭起来。"

**关键点总结**：
- 分层架构思想（配置层、封装层、测试层）
- conftest.py 的核心作用
- Allure 报告的优势
- 一句话量化价值（快速搭建能力）

## 下一步

- [API 测试技术详解](/tech/api-testing) - 深入学习接口断言技巧
- [Pytest Fixtures 进阶](/tech/pytest) - 掌握 fixture 的高级用法
- [数据驱动测试模板](/practice-template/data-driven-template) - 学习参数化测试最佳实践