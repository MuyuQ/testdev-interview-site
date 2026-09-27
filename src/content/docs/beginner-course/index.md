---
title: "新手教程"
description: "从零开始建立测试开发基础能力，再进入面试冲刺。"
category: "beginner-course"
---

## 你适不适合这条路线

这条路线适合：

- 刚开始学习测试开发，不知道怎么入门
- 功能测试想转测开，但不会写代码
- 学过一些零散知识，但不会串成项目

三种情况的共同点是：缺的不是"更多资料"，而是一条**把知识串成产出的路径**。用三个问题快速自查，确认这条路线是否适合你：

- 你能用一句话说清 Pytest 怎么发现测试吗？（不能 → 重点补 Day 4）
- 你能解释状态码 200 和业务码的区别吗？（不能 → 重点补 Day 5）
- 你有一段能讲 2 分钟的项目介绍吗？（没有 → 走完全程，特别是 Day 7-8）

如果你已经能独立设计测试框架，可以直接去[技术专题](/testdev-interview-site/tech/)或[面试追问链](/testdev-interview-site/interview-chains/)。

## 7 天能学到什么

| 天  | 课程                                                                                                          | 目标                   | 产出                   | 预计时间 |
| --- | ------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------- | -------- |
| 1   | [从零开始：测试开发学习路线](/testdev-interview-site/beginner-course/start-here/)                             | 理解路线和目标         | 写下 7 天学习计划      | 25 分钟  |
| 2   | [测试开发是什么：岗位能力地图](/testdev-interview-site/beginner-course/testdev-role-map/)                     | 理解测开岗位职责       | 3 句话讲清测开职责     | 35 分钟  |
| 3   | [Python 测试最小基础](/testdev-interview-site/beginner-course/python-testing-minimum/)                        | 掌握最小 Python 知识   | 能读懂函数、字典、断言 | 50 分钟  |
| 4   | [Pytest 第一个测试用例](/testdev-interview-site/beginner-course/pytest-first-test/)                           | 写出第一个可运行测试   | 运行通过和失败的用例   | 50 分钟  |
| 5   | [HTTP 和接口测试基础](/testdev-interview-site/beginner-course/http-api-basics/)                               | 理解请求、响应、状态码 | 能解释一次接口调用     | 55 分钟  |
| 6   | [用 Pytest 写第一个接口测试](/testdev-interview-site/beginner-course/pytest-api-first-case/)                  | 用代码请求并断言接口   | 写出一个最小接口用例   | 60 分钟  |
| 7   | [小项目：模拟登录接口测试](/testdev-interview-site/beginner-course/mock-login-mini-project/)                  | 串成一个完整小项目     | 完成 3 条登录测试用例  | 90 分钟  |
| 8   | [面试表达：如何讲第一个项目](/testdev-interview-site/beginner-course/interview-expression-for-first-project/) | 把项目转成面试语言     | 准备 2 分钟项目介绍    | 45 分钟  |

怎么用这张表：

- **按行推进，不跳行**。每一行的产出是下一行的输入：Day 4 的 Pytest 依赖 Day 3 的 Python，Day 6 的接口用例依赖 Day 5 的 HTTP 概念。跳行省下的时间，通常会在后面成倍还回去。
- **以"产出列"为完成标准**。某天学没学完，不看看了多少内容，只看产出列的东西你做出来没有。比如 Day 3 的产出是"能读懂函数、字典、断言"——拿一段真实测试代码试着读一遍，读不顺就还没完。
- **落后一天没关系**。宁可某天只完成七成再滚动到第二天，也不要为了赶进度只看不练。每个练习都服务于 Day 7 的小项目组装，缺一个练习，到时候就会卡住。

## 学完后的最小能力清单

完成这条路线后，你应该能：

- 用 3 句话解释测试开发岗位的职责
- 读懂 Python 测试代码中的函数、列表、字典和断言
- 用 Pytest 写一个接口测试，断言状态码和响应体
- 完成一个登录接口的自动化测试小项目
- 用 2 分钟向面试官介绍这个项目

每一条都有对应的自查方法：

- 前 4 条对着代码验：把 Day 7 的项目重新跑一遍 `pytest`，边跑边说出每条用例断言了什么、为什么这么断
- 最后 1 条对着录音验：录一段 2 分钟介绍，回听结构是否完整、有没有"呃""然后"堆砌

如果某一条卡住，回到对应天重做练习，而不是硬着头皮往下走——这份清单就是"能不能进入面试冲刺"的检查门（关于质量门的概念，可先看[术语：质量门](/testdev-interview-site/glossary/quality-gate/)）。

## 如何进入后续内容

学完新手路线后，建议进入：

- [术语体系](/testdev-interview-site/glossary/) - 补全测试基础概念
- [技术专题](/testdev-interview-site/tech/) - 深入学习 Pytest、接口测试等
- [练手模板](/testdev-interview-site/practice-template/) - 做更完整的项目
- [3 天面试速记](/testdev-interview-site/roadmap/3-day-interview-map/) - 冲刺面试表达

四项的推荐顺序：

1. 先去[术语体系](/testdev-interview-site/glossary/)把路线里听过但没深究的词补上（fixture、断言、测试金字塔），这些是面试追问的高频词
2. 再按需要进[技术专题](/testdev-interview-site/tech/)：想加深 Pytest 看 [Pytest 专题](/testdev-interview-site/tech/pytest/)，想系统学接口测试看[接口测试专题](/testdev-interview-site/tech/api-testing/)
3. 然后做[API 自动化模板](/testdev-interview-site/practice-template/api-automation-template/)这类更完整的项目，把"3 条用例的小项目"扩成带报告、带数据驱动的工程
4. 面试前一两天再用[3 天面试速记](/testdev-interview-site/roadmap/3-day-interview-map/)过表达

顺序背后的逻辑：术语和专题补的是"被追问时的深度"，模板补的是"项目完整度"，速记补的是"临场表达"。前两步做扎实了，最后一步只是组织语言。
