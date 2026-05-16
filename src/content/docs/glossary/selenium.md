---
title: "Selenium"
description: "经典 Web UI 自动化工具，通过 WebDriver 协议驱动浏览器完成页面操作验证。"
category: "glossary"
difficulty: "beginner"
interviewWeight: 1
tags: ["Selenium", "UI 自动化", "WebDriver", "浏览器测试"]
relatedSlugs: ["page-object-pattern", "ui-automation", "playwright"]
selfTests:
  - id: "selenium-1"
    question: "Selenium 主要用于哪类测试？"
    options:
      - "Web UI 自动化测试"
      - "数据库备份"
      - "服务器采购"
      - "代码格式化"
    correctIndex: 0
    explanation: "Selenium 通过 WebDriver 驱动浏览器，是经典的 Web UI 自动化工具。"
  - id: "selenium-2"
    question: "Selenium 自动化中常见稳定性问题是什么？"
    options:
      - "元素定位和等待策略不稳定"
      - "没有任何浏览器兼容性"
      - "不能打开网页"
      - "只能测试后端接口"
    correctIndex: 0
    explanation: "UI 自动化最常见的问题是定位脆弱、等待不合理和环境波动。"
---

Selenium 是经典的 Web UI 自动化测试工具，它通过 WebDriver 协议控制浏览器，模拟用户点击、输入、跳转和断言页面状态。它支持多语言和多浏览器，在很多传统自动化体系中仍然常见。

面试中提到 Selenium，不需要只停留在“我会用”。更好的回答是讲清 UI 自动化的工程问题：元素定位如何稳定、等待策略如何设计、测试数据如何准备、失败截图和日志如何收集、浏览器兼容如何覆盖、用例如何分层维护。

Selenium 项目中常见设计模式是 Page Object，把页面元素定位和页面操作封装到页面对象中，测试用例只表达业务流程。这样能减少定位变化对用例层的影响，也能提升可读性。

现在很多新项目会选择 Playwright，但 Selenium 的核心思想仍然有价值。比较两者时可以说：Selenium 生态成熟、兼容广；Playwright 在自动等待、浏览器上下文隔离、Trace 和现代 Web 支持上更强。测试开发岗位更看重你是否理解 UI 自动化稳定性，而不是只会背工具名。

