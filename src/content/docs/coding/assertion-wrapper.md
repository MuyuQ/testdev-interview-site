---
title: "断言封装"
description: "设计通用的断言封装层，统一处理状态码、响应体、业务字段和错误信息的验证逻辑，提升测试代码可维护性。"
category: "coding"
stage: "practice"
estimatedMinutes: 41
difficulty: "interview"
interviewWeight: 3
tags: ["断言设计", "代码封装", "API测试", "可维护性", "面试高频"]
prerequisites:
  - "tech/api-testing"
  - "glossary/api-assertion"
  - "tech/pytest"
outcomes:
  - "能封装统一的状态码与字段断言函数"
  - "能设计携带上下文信息的失败断言"
  - "能判断何时该封装、何时避免过度设计"
relatedSlugs:
  [
    "tech/api-testing",
    "practice-template/api-automation-template",
    "glossary/api-assertion",
  ]
selfTests:
  - id: "assertion-wrapper-q1"
    question: "断言封装的主要目的是什么？"
    options:
      - "减少重复代码，统一断言逻辑，提升可维护性"
      - "让代码看起来更复杂"
      - "增加测试执行时间"
      - "隐藏所有错误信息"
    correctIndex: 0
    explanation: "断言封装的核心目的是减少重复代码、统一断言逻辑和错误处理，从而提升测试代码的可维护性和可读性。"
  - id: "assertion-wrapper-q2"
    question: "以下哪种情况不适合使用断言封装？"
    options:
      - "多个测试用例需要验证相同格式的响应"
      - "需要统一的错误信息提取逻辑"
      - "只有一次性的简单断言场景"
      - "需要验证业务字段的结构和类型"
    correctIndex: 2
    explanation: "对于只有一次性的简单断言场景，过度封装反而会增加复杂度。封装应该基于复用价值，避免过度工程化。"
  - id: "assertion-wrapper-q3"
    question: "断言封装中处理业务字段验证时，最佳实践是什么？"
    options:
      - "硬编码所有字段名，便于理解"
      - "使用字段映射和类型检查，支持灵活配置"
      - "忽略字段类型，只检查值是否存在"
      - "将所有验证逻辑写在一个大函数中"
    correctIndex: 1
    explanation: "使用字段映射和类型检查可以支持灵活配置，便于扩展和维护。同时应避免将所有逻辑耦合在一个函数中。"
  - id: "assertion-wrapper-q4"
    question: "Python 中 isinstance(True, int) 的结果是什么，对断言封装有什么影响？"
    options:
      [
        "False，布尔值会被 int 类型校验拦下",
        "True，布尔值会意外通过 int 类型校验",
        "抛出 TypeError 异常",
        "取决于 Python 版本",
      ]
    correctIndex: 1
    explanation: "Python 中 bool 是 int 的子类，isinstance(True, int) 返回 True。因此基于 isinstance 的字段类型校验无法区分布尔和整数，对布尔字段应改用 type(x) is bool 显式判断，否则会产生漏报。"
---

## 题目描述

设计一个通用的断言封装层，用于统一处理 API 测试中的常见验证场景：

- 状态码验证
- 响应体结构验证
- 业务关键字段验证
- 错误信息提取和验证

封装后，测试代码应简洁清晰，同时保持足够的灵活性和可扩展性。

## 考察点

- **抽象能力**：能否从重复的断言代码中提炼出通用模式
- **接口设计**：封装后的 API 是否简洁易用
- **异常处理**：错误信息是否清晰、有定位价值
- **平衡取舍**：封装粒度是否合适，是否过度设计
- **可扩展性**：设计能否应对未来需求变化

## 输入输出

**输入**：

- HTTP 响应对象（包含状态码、响应体、headers）
- 预期的验证规则（状态码、字段要求等）

**输出**：

- 验证通过：无返回或返回 True
- 验证失败：抛出包含详细信息的 AssertionError

```python
# 调用示例
response = client.get("/api/users/1")

# 断言封装的典型用法
assert_response(response, status=200, schema=user_schema)
assert_business_field(response, "status", "active")
error = extract_error_message(response)
```

## 约束和边界

- **性能约束**：封装层不应显著增加测试执行时间
- **兼容性**：支持常见的 HTTP 客户端（requests、httpx、pytest-response）
- **可读性**：失败信息必须清晰，能快速定位问题
- **适度原则**：不封装一次性的断言逻辑
- **边界情况**：
  - 响应体为空或非 JSON
  - 嵌套字段的验证
  - 数组类型的字段验证
  - 可选字段的处理

## 设计思路

### 分析痛点

原始断言代码的典型问题：

```python
# 重复且分散的断言代码
assert response.status_code == 200
assert response.json()["code"] == 0
assert response.json()["data"]["user"]["name"] is not None
assert "message" in response.json()
```

痛点：

1. 每个测试都要写相似的状态码检查
2. 嵌套字段访问代码冗长
3. 错误信息不够友好
4. 结构验证和数据验证混杂

### 封装分层

采用分层封装策略：

```
┌─────────────────────────────────────┐
│     业务断言（组合调用下层）          │
├─────────────────────────────────────┤
│     字段断言（单字段验证）           │
├─────────────────────────────────────┤
│     基础断言（状态码、结构验证）      │
└─────────────────────────────────────┘
```

### 核心设计原则

1. **单一职责**：每层只做一件事
2. **失败信息优先**：提供足够的上下文定位问题
3. **链式友好**：支持流畅的断言链
4. **可配置默认值**：常用场景开箱即用

## 最小实现

```python
"""
通用断言封装模块
提供状态码、响应体、业务字段的统一验证
"""
from typing import Any, Dict, Optional, Union
import json


class AssertionError(BaseException):
    """自定义断言异常，携带更多上下文信息"""
    def __init__(self, message: str, context: Optional[Dict] = None):
        self.message = message
        self.context = context or {}
        super().__init__(self.format_message())

    def format_message(self) -> str:
        if self.context:
            ctx_str = ", ".join(f"{k}={v}" for k, v in self.context.items())
            return f"{self.message} [{ctx_str}]"
        return self.message


def assert_status_code(response, expected: int, message: str = "") -> None:
    """
    验证 HTTP 状态码

    Args:
        response: HTTP 响应对象，需有 status_code 属性
        expected: 预期的状态码
        message: 自定义失败消息

    Raises:
        AssertionError: 状态码不匹配时抛出
    """
    actual = getattr(response, 'status_code', None)
    if actual != expected:
        raise AssertionError(
            f"状态码不匹配: 期望 {expected}, 实际 {actual}",
            {"message": message} if message else {}
        )


def assert_response_body(
    response,
    schema: Optional[Dict[str, type]] = None,
    required_fields: Optional[list] = None
) -> None:
    """
    验证响应体结构和必需字段

    Args:
        response: HTTP 响应对象，需有 json() 方法
        schema: 字段名到类型的映射，如 {"id": int, "name": str}
        required_fields: 必需存在的字段列表

    Raises:
        AssertionError: 结构或字段验证失败时抛出
    """
    try:
        body = response.json()
    except ValueError:
        # JSONDecodeError 是 ValueError 的子类；requests/httpx 的解析异常也继承 ValueError，
        # 捕 ValueError 覆盖面最稳
        raise AssertionError("响应体不是有效的 JSON 格式")

    if not isinstance(body, dict):
        raise AssertionError(f"响应体期望为 dict，实际为 {type(body).__name__}")

    # 检查必需字段
    if required_fields:
        missing = [f for f in required_fields if f not in body]
        if missing:
            raise AssertionError(f"缺少必需字段: {missing}")

    # 检查字段类型
    if schema:
        for field, expected_type in schema.items():
            if field in body and not isinstance(body[field], expected_type):
                actual_type = type(body[field]).__name__
                raise AssertionError(
                    f"字段类型不匹配: '{field}' 期望 {expected_type.__name__}, 实际 {actual_type}"
                )


def assert_business_field(
    response,
    field_path: str,
    expected: Any,
    allow_none: bool = False
) -> None:
    """
    验证业务字段值（支持嵌套路径）

    Args:
        response: HTTP 响应对象
        field_path: 字段路径，用点分隔嵌套层级，如 "data.user.name"
        expected: 预期的字段值
        allow_none: 是否允许字段值为 None

    Raises:
        AssertionError: 字段验证失败时抛出
    """
    body = response.json()
    current = body

    # 按路径逐层访问
    for key in field_path.split('.'):
        if isinstance(current, dict):
            if key not in current:
                raise AssertionError(f"字段路径不存在: '{field_path}' (缺失 '{key}')")
            current = current[key]
        else:
            raise AssertionError(f"路径 '{field_path}' 中间值不是 dict 类型")

    # 检查值
    if current is None and not allow_none:
        raise AssertionError(f"字段 '{field_path}' 值为 None")

    if expected is not None and current != expected:
        raise AssertionError(
            f"字段值不匹配: '{field_path}' 期望 {expected!r}, 实际 {current!r}"
        )


def extract_error_message(response) -> Optional[str]:
    """
    从响应中提取错误信息

    支持常见的错误信息字段：message, error, msg, error_message

    Args:
        response: HTTP 响应对象

    Returns:
        错误信息字符串，未找到则返回 None
    """
    try:
        body = response.json()
    except (ValueError, AttributeError):
        # ValueError 覆盖各类 JSON 解析异常，AttributeError 覆盖没有 json() 方法的响应对象
        return None

    # 按优先级尝试常见错误字段
    error_fields = ['message', 'error', 'msg', 'error_message', 'errorMessage']

    for field in error_fields:
        value = body.get(field)
        if value and isinstance(value, str):
            return value

    # 检查嵌套的 error 对象
    error_obj = body.get('error', {})
    if isinstance(error_obj, dict):
        for field in ['message', 'msg']:
            value = error_obj.get(field)
            if value and isinstance(value, str):
                return value

    return None


# 组合断言：常见 API 成功响应验证
def assert_api_success(response, data_fields: Optional[list] = None) -> None:
    """
    验证标准 API 成功响应

    适用于：{"code": 0, "data": {...}, "message": "success"} 格式

    Args:
        response: HTTP 响应对象
        data_fields: data 对象中必需的字段列表
    """
    assert_status_code(response, 200)
    assert_business_field(response, "code", 0)

    if data_fields:
        body = response.json()
        data = body.get('data', {})
        missing = [f for f in data_fields if f not in data]
        if missing:
            raise AssertionError(f"data 中缺少字段: {missing}")
```

### 代码走查：面试官看这段代码的打分点

1. **异常类型设计（最容易被追问）**：自定义 `AssertionError` 继承的是 `BaseException` 而不是 `Exception`——用户代码里任何 `except Exception` 兜底都拦不住它，断言失败会直接穿透到最外层；类名还遮蔽了内置 `AssertionError`，同一文件里 import 顺序不同行为就不同。更稳的设计是改名为 `ApiAssertionError` 并继承 `Exception`。写完代码能主动指出这一点，比封装本身更加分——面试官想看的正是「对自己写的东西有审视」。
2. **except 覆盖面**：`assert_response_body` 和 `extract_error_message` 里捕获解析异常用 `except ValueError`（`json.JSONDecodeError` 是它的子类，requests/httpx 的解析异常同样继承自它），比只捕 `JSONDecodeError` 覆盖面更稳；`extract_error_message` 额外捕 `AttributeError`，兼容没有 `json()` 方法的响应对象。
3. **失败信息的上下文质量**：`assert_business_field` 的报错会说明「路径断在哪一层 key」「期望值和实际值的 repr」，这是封装层最有价值的部分——面试官会专门检查失败信息能否让人不看代码就定位问题。
4. **分层与职责**：四个基础函数各管一件事，`assert_api_success` 组合下层函数而不是复制其逻辑，改动状态码规则时只需要动一处。
5. **主动交代的边界（加分点）**：`assert_business_field` 的路径解析不支持数组下标（如 `data.items.0.id`）；`extract_error_message` 只查固定几个字段不递归。被问到时答「路径解析里给 list 加下标分支」即可，不必现场重写。

### 常见错误实现与修正

错误实现一：所有检查压成一个布尔断言，失败时零信息

```python
# 反面教材：合并成一个布尔返回值
def check_response_ok(response):
    return (response.status_code == 200
            and response.json()["code"] == 0
            and response.json()["data"]["user"]["name"] is not None)

assert check_response_ok(response), "响应不对"
```

问题：

1. 失败信息只有「响应不对」四个字——是状态码不对还是字段缺失？排查只能靠人肉重现
2. 任一层 key 缺失时直接抛 `KeyError`/`TypeError`，测试报告里归类成 error 而不是断言失败，统计和聚合全被打乱
3. 同一响应体被 `json()` 解析三遍，响应一大就白白烧 CPU

修正：拆成独立断言函数，每个检查自己抛带上下文的异常——这正是本文最小实现的思路。失败信息必须回答三件事：哪个字段、期望什么、实际什么。

错误实现二：断言函数里混入副作用

```python
# 反面教材：断言层里混入打印、默认值、伪装的失败
def assert_user_name(response):
    body = response.json()
    name = body.get("data", {}).get("user", {}).get("name", "unknown")
    print(f"user name = {name}")          # 副作用：几千个用例把报告刷成噪声
    if name != "张三":
        assert False, "名字不对"           # 丢掉了实际值，断言退化成口号
```

问题：

1. `print` 混进断言层，规模化后报告里全是无关输出，真正的异常被淹没
2. `assert False, "名字不对"` 丢弃了实际值，与错误实现一是同一种病
3. `.get(..., "unknown")` 把「字段缺失」悄悄偷换成「值不等」，失败原因被扭曲，排查方向从「接口为什么没返回字段」被带偏到「名字为什么不一样」

修正：断言层只做「取值、比较、报错」三件事；输出交给 pytest 的捕获机制或 fixture 级日志；报错永远用异常携带 `expected/actual`，而不是 `assert False`。

## 测试用例

```python
"""断言封装模块的单元测试"""
import pytest
from unittest.mock import Mock
from assertion_wrapper import (
    assert_status_code,
    assert_response_body,
    assert_business_field,
    extract_error_message,
    assert_api_success,
    AssertionError as CustomAssertionError
)


class TestAssertStatusCode:
    """状态码断言测试"""

    def test_status_code_match(self):
        """正常路径：状态码匹配"""
        response = Mock(status_code=200)
        # 不应抛出异常
        assert_status_code(response, 200)

    def test_status_code_mismatch(self):
        """异常路径：状态码不匹配"""
        response = Mock(status_code=404)
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_status_code(response, 200)
        assert "状态码不匹配" in str(exc_info.value)
        assert "404" in str(exc_info.value)

    def test_status_code_with_custom_message(self):
        """边界情况：自定义消息"""
        response = Mock(status_code=500)
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_status_code(response, 200, "获取用户列表")
        assert "获取用户列表" in str(exc_info.value)


class TestAssertResponseBody:
    """响应体断言测试"""

    def test_valid_json_body(self):
        """正常路径：有效的 JSON 响应"""
        response = Mock(json=lambda: {"id": 1, "name": "test"})
        assert_response_body(response, required_fields=["id", "name"])

    def test_schema_validation(self):
        """正常路径：类型验证"""
        response = Mock(json=lambda: {"id": 1, "name": "test"})
        assert_response_body(response, schema={"id": int, "name": str})

    def test_schema_type_mismatch(self):
        """异常路径：类型不匹配"""
        response = Mock(json=lambda: {"id": "wrong_type"})
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_response_body(response, schema={"id": int})
        assert "类型不匹配" in str(exc_info.value)

    def test_missing_required_fields(self):
        """异常路径：缺少必需字段"""
        response = Mock(json=lambda: {"id": 1})
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_response_body(response, required_fields=["id", "name"])
        assert "缺少必需字段" in str(exc_info.value)


class TestAssertBusinessField:
    """业务字段断言测试"""

    def test_simple_field(self):
        """正常路径：简单字段验证"""
        response = Mock(json=lambda: {"status": "active"})
        assert_business_field(response, "status", "active")

    def test_nested_field(self):
        """正常路径：嵌套字段验证"""
        response = Mock(json=lambda: {"data": {"user": {"name": "张三"}}})
        assert_business_field(response, "data.user.name", "张三")

    def test_field_not_found(self):
        """异常路径：字段不存在"""
        response = Mock(json=lambda: {"data": {}})
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_business_field(response, "data.user.name", "张三")
        assert "字段路径不存在" in str(exc_info.value)

    def test_allow_none(self):
        """边界情况：允许 None 值"""
        response = Mock(json=lambda: {"name": None})
        assert_business_field(response, "name", None, allow_none=True)


class TestExtractErrorMessage:
    """错误信息提取测试"""

    def test_extract_message_field(self):
        """正常路径：提取 message 字段"""
        response = Mock(json=lambda: {"message": "用户不存在"})
        assert extract_error_message(response) == "用户不存在"

    def test_extract_nested_error(self):
        """正常路径：提取嵌套 error 对象"""
        response = Mock(json=lambda: {"error": {"message": "参数错误"}})
        assert extract_error_message(response) == "参数错误"

    def test_no_error_field(self):
        """边界情况：无错误字段"""
        response = Mock(json=lambda: {"data": {"id": 1}})
        assert extract_error_message(response) is None

    def test_invalid_json(self):
        """边界情况：非 JSON 响应"""
        response = Mock(json=lambda: (_ for _ in ()).throw(ValueError()))
        assert extract_error_message(response) is None


class TestAssertApiSuccess:
    """组合断言测试"""

    def test_api_success_response(self):
        """正常路径：标准成功响应"""
        response = Mock(
            status_code=200,
            json=lambda: {"code": 0, "data": {"id": 1, "name": "test"}}
        )
        assert_api_success(response, data_fields=["id", "name"])

    def test_api_with_missing_data_fields(self):
        """异常路径：data 缺少必需字段"""
        response = Mock(
            status_code=200,
            json=lambda: {"code": 0, "data": {"id": 1}}
        )
        with pytest.raises(CustomAssertionError) as exc_info:
            assert_api_success(response, data_fields=["id", "name"])
        assert "缺少字段" in str(exc_info.value)
```

## 可扩展点

### 1. 支持 JSON Schema 验证

```python
from jsonschema import validate, ValidationError as JsonSchemaError

def assert_json_schema(response, schema: dict) -> None:
    """使用 JSON Schema 进行严格的结构验证"""
    try:
        validate(instance=response.json(), schema=schema)
    except JsonSchemaError as e:
        raise AssertionError(f"JSON Schema 验证失败: {e.message}")
```

### 2. 支持断言链

```python
class ResponseAsserter:
    """流式断言构建器"""
    def __init__(self, response):
        self.response = response

    def has_status(self, code: int) -> 'ResponseAsserter':
        assert_status_code(self.response, code)
        return self

    def has_field(self, path: str, value: Any = None) -> 'ResponseAsserter':
        assert_business_field(self.response, path, value, allow_none=(value is None))
        return self

    def success(self) -> 'ResponseAsserter':
        assert_api_success(self.response)
        return self

# 使用示例
# ResponseAsserter(response).has_status(200).has_field("data.id").success()
```

### 3. 支持软断言（收集所有错误）

```python
class SoftAsserter:
    """收集所有断言错误，最后统一报告"""
    def __init__(self):
        self.errors = []

    def check(self, condition: bool, message: str) -> 'SoftAsserter':
        if not condition:
            self.errors.append(message)
        return self

    def assert_all(self) -> None:
        if self.errors:
            raise AssertionError(f"发现 {len(self.errors)} 个错误:\n" + "\n".join(self.errors))
```

### 4. 复杂度与规模化：断言量和字段数上来之后哪里先崩

1. **一次只报一个错（最先崩的点）**：当前实现遇到第一个失败就 raise，一个 20 个字段的接口要跑 20 轮才能集齐全部问题。规模化后第一优先级是软断言（扩展点 3 的 `SoftAsserter`）或错误聚合——一轮跑出全部字段差异，联调效率差一个量级。合理的组合策略：结构断言保持硬断言（结构错了后面没意义），字段值断言用软断言。
2. **`response.json()` 被反复解析**：每个断言函数各自解析一遍响应体，单次开销可忽略，但一个用例十几个断言叠加、响应几十 KB 时就不再可忽略。规模化做法是最外层解析一次传 dict，或在 `ResponseAsserter` 里缓存 body。
3. **类型校验的语义坑会被复用放大**：`isinstance(True, int)` 为 `True`（bool 是 int 子类），`{"flag": True}` 能通过 `{"flag": int}` 校验——几百个接口复用同一封装时，这个坑会变成批量漏报。对布尔字段要用 `type(v) is bool` 显式判断，或在 schema 校验前先做布尔分流。
4. **失败聚合决定排障速度**：5000 个用例的 CI 里，断言错误如果带结构化上下文（用例 ID、接口路径、字段路径、expected/actual 的 JSON），就能按字段聚合失败率、直接定位是哪次发版引入；如果只有散落的中文句子，只能靠人翻日志。断言层设计的产出物不只是「报错」，更是「可被机器消费的错误数据」。

## 面试讲解方式

**面试官可能问**：「你在项目中如何设计断言封装？」

**建议回答结构**：

1. **先讲问题背景**：「在 API 自动化测试中，我们发现大量重复的断言代码，比如状态码检查、响应体结构验证，这些重复代码维护成本高，错误信息也不够友好。」

2. **再讲设计思路**：「我设计了分层封装策略：底层是基础断言（状态码、结构），中层是字段断言（业务字段验证），上层是组合断言（常见场景一键验证）。每层单一职责，错误信息携带完整上下文。」

3. **举例说明**：「比如验证一个获取用户信息的接口，封装前需要写 5-6 行断言，封装后只需一行 `assert_api_success(response, data_fields=["id", "name"])`。」

4. **强调权衡**：「封装粒度很重要，不是所有断言都需要封装。对于一次性的复杂断言逻辑，保持原样比强行封装更好。」

## 常见追问

### Q1: 封装会不会让调试变难？

**回答要点**：

- 不会，因为错误信息经过优化，携带更多上下文（期望值、实际值、字段路径）
- 可以在断言函数中添加日志记录，方便追踪
- 提供 `verbose` 参数控制输出详细程度

### Q2: 如何处理动态字段或条件断言？

**回答要点**：

- 使用 `allow_none` 参数处理可选字段
- 提供 `condition` 参数支持条件断言
- 对于动态字段名，可传入字段名提取函数

```python
def assert_business_field(response, field_path, expected,
                          allow_none=False, condition=None):
    if condition is not None and not condition:
        return  # 条件不满足时跳过
    # ... 其余逻辑
```

### Q3: 断言封装和测试框架断言（如 pytest.assume）如何配合？

**回答要点**：

- 封装层专注于业务逻辑验证，底层仍使用框架断言
- 可以结合 pytest-assume 实现软断言
- 封装函数返回布尔值或抛异常，便于与不同框架集成

### Q4: 如何避免过度封装？

**回答要点**：

- **三遍原则**：同一断言逻辑出现三次以上才考虑封装
- **价值判断**：封装能否减少代码量、提升可读性、统一错误信息
- **避免万能函数**：一个函数只做一件事，参数不超过 4 个
- **保持透明**：封装不应隐藏过多细节，调试时能看清每一步

### Q5: 断言失败时，怎么做到「一次看到所有差异」而不是逐轮修？

**回答要点**：

- 硬断言遇错即抛，适合「结构级」检查——结构不对，后续字段断言没有意义
- 字段值断言用软断言（`SoftAsserter` 收集全部错误，最后统一抛），或直接上 pytest-assume
- 注意软断言的适用边界：后续代码依赖前面字段时（比如先取 `data.token` 再调下一个接口），不能用软断言，否则错误会以更隐蔽的方式延迟爆发
- 实际工程里的组合：结构硬断言 + 字段软断言，一轮用例跑完输出完整的字段差异清单

### Q6: 类型校验里 `isinstance` 有什么坑，你们怎么处理的？

**回答要点**：

- `isinstance(True, int)` 返回 `True`——Python 的 bool 是 int 子类，布尔字段会意外通过 `int` 类型校验，产生漏报
- 对布尔字段显式用 `type(v) is bool` 判断，或 schema 里单列 `bool` 类型并在校验前分流
- 反向的坑也存在：`isinstance(1, bool)` 是 `False`，所以不能拿 bool 校验去接整型字段
- 能主动讲出这个细节，说明类型校验真的在生产里跑过，而不是照抄文档

## 关联技术和场景

- **tech/api-testing**：断言封装是 API 测试的核心能力
- **practice-template/api-automation-template**：模板中使用断言封装简化测试代码
- **glossary/api-assertion**：断言相关术语与概念对照，配合本文理解断言语义

**相关技术**：

- JSON Schema 验证
- pytest-assume（软断言）
- Hamcrest 匹配器
- AssertJ（Java 流式断言）

**应用场景**：

- API 接口自动化测试
- 契约测试
- 回归测试中的数据验证
