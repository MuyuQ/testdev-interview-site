---
title: "Mock 工具封装题"
description: "重点展示 Mock 场景划分、响应控制和依赖隔离能力。"
category: "coding"
difficulty: "interview"
interviewWeight: 2
tags: ["Mock", "依赖隔离", "接口测试", "封装"]
---

## 回答要点

- Mock 要区分场景：外部依赖不可用、异常响应模拟、性能测试和特定业务状态。
- 响应控制要支持延迟、错误码、异常结构和字段缺失。
- Mock 规则要参数化，支持按请求参数匹配不同响应。
- Mock 状态要可查询和清理，避免污染后续测试。

## 常见失分点

- Mock 只模拟正常响应，不覆盖异常和边界场景。
- Mock 规则写死，无法适配不同测试用例。
- Mock 没有清理机制，导致测试之间相互干扰。