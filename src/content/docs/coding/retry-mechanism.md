---
title: "请求重试机制"
description: "实现可靠的请求重试逻辑"
category: "coding"
difficulty: "interview"
interviewWeight: 2
tags: ["编码题", "重试", "网络"]
---

## 题目

实现一个请求重试函数，支持配置重试次数、退避策略和异常过滤。

## 实现要点

- 指数退避算法
- 最大重试次数限制
- 可配置的异常类型过滤
- 重试日志记录
