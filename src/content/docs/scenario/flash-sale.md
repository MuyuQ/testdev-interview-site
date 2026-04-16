---
title: "秒杀场景测试"
description: "高并发秒杀系统的测试策略"
category: "scenario"
difficulty: "interview"
interviewWeight: 3
tags: ["秒杀", "高并发", "性能测试"]
---

## 场景描述

秒杀系统面临极高的并发压力，需要重点测试库存一致性、防超卖、限流等机制。

## 测试要点

- 库存扣减的原子性
- 防超卖机制
- 限流和降级策略
- 缓存一致性
