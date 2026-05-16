---
title: "测试隔离"
description: "让测试之间互不依赖、互不污染，保证失败可以准确定位到当前用例。"
category: "glossary"
difficulty: "interview"
interviewWeight: 2
tags: ["测试隔离", "稳定性", "Mock", "测试数据"]
relatedSlugs: ["mock-stub", "fixture", "unit-testing"]
selfTests:
  - id: "test-isolation-1"
    question: "测试隔离要避免什么问题？"
    options:
      - "用例之间共享脏数据导致相互影响"
      - "每个用例都有清晰断言"
      - "测试可以独立运行"
      - "失败容易定位"
    correctIndex: 0
    explanation: "测试隔离的目标是避免共享状态、脏数据和执行顺序依赖。"
  - id: "test-isolation-2"
    question: "提升测试隔离性的常见手段是什么？"
    options:
      - "依赖固定执行顺序"
      - "使用独立数据、清理机制、Mock 和 Fixture"
      - "把所有测试写进一个文件"
      - "只在本地运行测试"
    correctIndex: 1
    explanation: "独立数据、资源清理、Mock 和 Fixture 都能减少用例之间的耦合。"
---

测试隔离是指每个测试用例都能独立运行，执行结果不受其他用例影响。它解决的是自动化测试中最常见的稳定性问题：单独运行通过，整批运行失败；今天通过，明天失败；换个执行顺序就失败。

造成隔离问题的原因通常包括共享账号、共享数据库记录、缓存未清理、全局配置被修改、异步任务未结束、Mock 未恢复、时间状态不固定等。测试开发要能识别这些隐性依赖，并用工程手段降低它们。

常用做法有四类：第一，测试数据独立，每个用例创建自己的数据或使用唯一标识；第二，资源生命周期清晰，通过 Fixture、before/after 或事务回滚清理环境；第三，外部依赖可控，用 Mock、Stub 或测试替身隔离第三方服务；第四，执行顺序无关，不能依赖“上一个用例先登录”或“某条数据已经存在”。

面试回答测试隔离时，可以举例：接口自动化中每个订单用例生成唯一订单号，执行后清理测试订单；UI 自动化中每个用例使用独立浏览器上下文，避免 cookies 和 localStorage 互相污染。这样能体现你关注自动化长期稳定性。
