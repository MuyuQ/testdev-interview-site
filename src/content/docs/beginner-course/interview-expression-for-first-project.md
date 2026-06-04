---
title: "面试表达：如何讲第一个接口自动化项目"
description: "把练习项目转成可面试表达，准备一段 2 分钟项目介绍。"
category: "beginner-course"
difficulty: "beginner"
interviewWeight: 3
tags: ["新手教程", "面试表达", "项目介绍"]
relatedSlugs:
  - "practice-template/project-story-template"
  - "interview-chains/api-testing-chain"
selfTests:
  - id: "beginner-expression-struct"
    question: "2 分钟项目介绍的结构是什么？"
    options:
      - "背景 → 目标 → 实现 → 用例 → 结果 → 复盘"
      - "直接背代码"
      - "只说结果"
      - "没有结构"
    correctIndex: 0
    explanation: "2 分钟介绍需要有结构的表达，展示思考过程。"
  - id: "beginner-expression-focus"
    question: "面试讲项目时应该突出什么？"
    options:
      - "代码有多复杂"
      - "解决了什么问题和产出什么"
      - "写了多少行代码"
      - "用了多少工具"
    correctIndex: 1
    explanation: "面试官关注你解决的问题和产出，不是工具本身。"
  - id: "beginner-expression-risk"
    question: "面试讲项目时不应该做什么？"
    options:
      - "说项目难点和解决"
      - "说'这个项目很简单'"
      - "用数据支持"
      - "讲测试策略"
    correctIndex: 1
    explanation: "不要贬低自己项目的价值。"
---

## 你会学到什么

这节帮你：

- 把登录测试小项目转成面试表达
- 掌握 2 分钟项目介绍结构
- 准备常见追问的回答

## 核心概念

### 2 分钟项目介绍结构

| 部分 | 时长 | 内容 |
| --- | --- | --- |
| 背景 | 20s | 为什么做这个项目 |
| 目标 | 20s | 想验证什么能力 |
| 实现 | 40s | 怎么设计测试 |
| 用例 | 20s | 覆盖哪些场景 |
| 结果 | 20s | 产出什么 |
| 复盘 | 20s | 可以改进什么 |

### 示例表达

"我用 Pytest 写了一个登录接口的自动化测试小项目。项目背景是想把前面学的 Python、Pytest、HTTP 知识串起来。我设计了 3 个场景：登录成功、密码错误、缺少参数。每个场景覆盖了状态码和业务码断言。最终产出是可运行的测试用例，运行 pytest 就能自动执行。复盘时我觉得可以加数据驱动和报告生成。"

## 手把手练习

**练习：准备你的 2 分钟介绍**

1. 打开录音或对着镜子
2. 按结构练习
3. 控制在 2 分钟内
4. 重复 3 遍

## 下一步

恭喜完成新手路线！

延伸阅读：
- [项目故事模板](../../practice-template/project-story-template/)
- [接口测试追问链](../../interview-chains/api-testing-chain/)
- [3 天面试路线](../../roadmap/3-day-interview-map/)