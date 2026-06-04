---
title: "小项目：模拟登录接口测试"
description: "把前面知识串成一个小项目，完成登录接口自动化测试。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "小项目", "接口自动化"]
relatedSlugs:
  - "beginner-course/interview-expression-for-first-project"
  - "practice-template/api-automation-template"
  - "scenario/login-auth"
selfTests:
  - id: "beginner-project-test"
    question: "小项目需要测试几个场景？"
    options:
      - "只要登录成功"
      - "登录成功、密码错误、缺少参数"
      - "测试所有页面"
      - "不需要测试"
    correctIndex: 1
    explanation: "最小项目至少覆盖正常路径和异常路径。"
  - id: "beginner-project-assert"
    question: "接口测试断言清单应该包含什么？"
    options:
      - "状态码、业务码、关键字段"
      - "只检查响应时间"
      - "只看状态码"
      - "不需要断言"
    correctIndex: 0
    explanation: "完整断言包含状态码、业务码和关键字段。"
  - id: "beginner-project-output"
    question: "小项目的最终产出是什么？"
    options:
      - "一组可运行的测试用例"
      - "一份文档"
      - "一个网站"
      - "不需要产出"
    correctIndex: 0
    explanation: "产出是可运行的测试用例。"
---

## 你会学到什么

这节帮你把前面学的知识串成一个完整小项目：

- 登录接口测试
- 成功、失败、异常场景覆盖
- 项目文件组织
- 断言清单

最终产出：一个可运行的登录测试小项目。

## 核心概念

### 项目文件结构

```
login-test/
├── conftest.py        # 配置和夹具
├── test_login.py      # 登录测试
```

### 三个核心场景

| 场景 | 输入 | 预期结果 |
| --- | --- | --- |
| 登录成功 | 正确用户名 + 密码 | 200, code=0, 返回 token |
| 密码错误 | 正确用户名 + 错误密码 | 200, code!=0, 错误消息 |
| 缺少参数 | 空用户名 | 400 或错误消息 |

## 最小示例

```python
import requests

BASE_URL = "https://httpbin.org"

def test_login_success():
    response = requests.post(
        f"{BASE_URL}/post",
        json={"username": "demo", "password": "correct"}
    )
    assert response.status_code == 200

def test_login_wrong_password():
    response = requests.post(
        f"{BASE_URL}/post",
        json={"username": "demo", "password": "wrong"}
    )
    assert response.status_code == 200

def test_login_missing_username():
    response = requests.post(
        f"{BASE_URL}/post",
        json={"password": "correct"}
    )
    assert response.status_code == 200
```

## 手把手练习

**练习：完善登录测试**

1. 新建文件 `test_login.py`
2. 写三个测试函数
3. 运行 `pytest test_login.py -v`
4. 确认三个测试都通过

加练：写第四个测试，验证空密码的场景。

## 检查标准

- 你完成了 3 个登录测试
- 你覆盖了正常和异常路径
- 你运行 pytest 所有测试通过
- 你理解了项目文件组织

## 常见错误

- 只写登录成功，不写异常
- 不验证错误消息
- 测试之间互相依赖

## 下一步

下一节：[面试表达](../interview-expression-for-first-project/)

延伸阅读：
- [练手模板：API 自动化](../../practice-template/api-automation-template/)
- [场景题：登录鉴权](../../scenario/login-auth/)