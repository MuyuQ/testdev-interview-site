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

## 核心概念

### requests 库

Python 最常用的 HTTP 请求库：

```python
import requests

response = requests.get("https://httpbin.org/get")
print(response.status_code)  # 200
print(response.json())       # JSON 响应体
```

### 最小接口测试

```python
import requests

def test_get_endpoint():
    response = requests.get("https://httpbin.org/get")
    assert response.status_code == 200
    assert "url" in response.json()
```

一个接口测试需要：
- 发起请求
- 断言状态码
- 断言业务字段

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

## 检查标准

- 你安装了 requests
- 你写了至少一个接口测试
- 你断言了状态码和业务字段

## 常见错误

- 只断言 200，不验证业务
- 用 sleep 等待异步接口
- 不处理异常情况

## 下一步

下一节：[小项目：模拟登录接口测试](../mock-login-mini-project/)

延伸阅读：
- [技术专题：接口测试](../../tech/api-testing/)
- [编码题：断言封装](../../coding/assertion-wrapper/)