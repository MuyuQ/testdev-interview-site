---
title: "HTTP 和接口测试基础"
description: "理解请求、响应、状态码、JSON 和接口断言的基本概念。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "HTTP", "接口测试"]
relatedSlugs:
  - "beginner-course/pytest-api-first-case"
  - "tech/api-testing"
selfTests:
  - id: "beginner-http-method"
    question: "常用的 HTTP 请求方法有哪些？"
    options:
      - "GET 和 POST"
      - "只有 GET"
      - "SEND 和 RECEIVE"
      - "READ 和 WRITE"
    correctIndex: 0
    explanation: "GET 用于获取数据，POST 用于提交数据，是最常用的两个方法。"
  - id: "beginner-http-status"
    question: "HTTP 状态码 200 表示什么？"
    options:
      - "请求失败"
      - "请求成功"
      - "服务器错误"
      - "重定向"
    correctIndex: 1
    explanation: "200 表示请求成功处理完成。"
---

## 你会学到什么

理解 HTTP 请求的基本结构：方法、URL、请求体、响应、状态码、JSON。

## 核心概念

- **请求方法**：GET 获取数据，POST 提交数据
- **URL**：接口地址
- **请求体**：POST 请求携带的数据（JSON）
- **响应**：服务器返回的数据
- **状态码**：200 成功，4xx 客户端错误，5xx 服务端错误
- **JSON**：接口数据最常用的格式

## 最小示例

一个登录接口的请求和响应：

请求：
```json
POST /api/login
{"username": "demo", "password": "123456"}
```

响应：
```json
{"code": 0, "message": "success", "data": {"token": "abc"}}
```

## 下一步

下一节：[用 Pytest 写第一个接口测试](../pytest-api-first-case/)