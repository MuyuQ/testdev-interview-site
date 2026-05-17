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

## 标准回答框架

面试里讲 Selenium，可以从“能力、架构、稳定性、适用边界”四点展开。能力上，它通过 WebDriver 驱动真实浏览器，支持点击、输入、跳转、窗口切换、文件上传、截图和页面断言。架构上，测试代码通过 Selenium Client 调用 WebDriver，再由浏览器驱动控制 Chrome、Firefox、Edge 等浏览器。稳定性上，重点是定位策略、等待策略、数据隔离、失败诊断和用例分层。适用边界上，Selenium 适合覆盖核心 Web 回归路径，但不适合把大量业务组合都堆在 UI 层。

这样回答会比“我会 find_element 和 click”更有层次。面试官通常不是只问 API，而是想看你是否理解 UI 自动化为什么不稳定、如何维护、如何和接口测试分层配合。

## 测试开发落地

Selenium 自动化项目里，元素定位要尽量使用稳定语义，而不是脆弱 XPath。能用 data-testid、id、name、aria role 或业务语义就不要依赖页面层级。等待策略要用显式等待，等待元素可见、可点击、请求完成或状态变化，少用固定 sleep。数据上，每个用例要准备独立账号、订单或配置，避免用例之间互相污染。诊断上，失败时自动保存截图、HTML、浏览器日志、网络日志和当前 URL，方便定位是产品问题、脚本问题还是环境问题。

维护上可以使用 Page Object 或 Screenplay 思路，把页面元素和操作封装起来。测试用例层只表达业务动作，例如“登录、创建订单、支付、断言订单成功”，而不直接写一堆定位细节。页面变化时优先修改页面对象，减少用例层的大面积改动。对于频繁变动页面，应该降低 UI 自动化覆盖，把业务组合下沉到接口层。

## 面试追问

如果被问“Selenium 用例不稳定怎么办”，可以回答：先分类定位原因。元素定位变动就改成稳定选择器；等待不合理就用状态等待替代 sleep；数据污染就做独立数据和清理；环境波动就隔离浏览器会话、控制依赖和重试非产品问题；脚本诊断不足就补截图、日志和 trace。不要简单说“加等待”。

如果被问“Selenium 和 Playwright 怎么选”，可以回答：已有成熟 Selenium 体系、浏览器兼容面很广、团队语言栈固定时可以继续用 Selenium；新项目如果更重视自动等待、Trace、上下文隔离和现代前端支持，Playwright 通常体验更好。选型不是追新，而是看团队维护成本、浏览器矩阵和现有资产。
