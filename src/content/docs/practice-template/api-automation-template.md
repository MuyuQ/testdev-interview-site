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

| 场景 | 是否适用 | 说明 |
|------|---------|------|
| 面试前准备项目作品 | 适用 | 搭一个能放 GitHub 的接口自动化骨架，作为面试谈资与简历素材 |
| 新项目从零搭自动化 | 适用 | 直接套用目录结构和配置层，半天出可运行框架 |
| 团队统一脚手架规范 | 适用 | 作为团队接口自动化项目的基线结构，降低协作成本 |
| 已有成熟框架只补用例 | 部分适用 | 可只参考"内容结构"里的用例模板与客户端封装写法 |
| 纯 UI / 性能测试 | 不适用 | 本模板只覆盖 HTTP 接口层，UI 看 Playwright 模板、性能另寻 |
| 单接口临时验证 | 不适用 | 用 curl / postman 更快，不必建整套工程 |

一句话判断：**当你需要的是"一个长期维护的接口自动化工程"，而不是"一次性的接口调试"，就用本模板。**

## 3. 使用前提

动手前确认你具备：

- **Pytest 基础使用**：fixture、mark、参数化（`@pytest.mark.parametrize`）
- **HTTP API 基本概念**：请求方法、状态码、JSON 报文结构
- **Python 基础编程**：类、装饰器、文件读写（YAML 解析会用上）

如果 Pytest 还不熟，先走 [Pytest 基础](/docs/tech/pytest)；如果 HTTP 概念模糊，先补 [HTTP API 基础](/docs/beginner-course/http-api-basics)。

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

## 10. 关联内容

- [API 测试技术](/docs/tech/api-testing) - 深入学习接口断言与测试技巧
- [Pytest 进阶](/docs/tech/pytest) - 掌握 fixture、marker 等高级特性
- [HTTP API 基础](/docs/beginner-course/http-api-basics) - 补充 API 测试理论底座
- [Mock 服务模板](/docs/practice-template/mock-service-template) - 学习如何用 Mock 隔离外部依赖
- [项目故事模板](/docs/practice-template/project-story-template) - 把本项目包装成面试可讲的项目故事
