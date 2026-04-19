# 测试开发面试速成站

一个面向测试开发面试准备的中文内容站，帮助用户在较短时间内快速搭建知识框架，并把概念、项目、场景和方案整理成更适合面试表达的内容结构。

这个项目的目标不是堆砌零散知识点，而是把高频面试题拆成可复习、可跳转、可追问、可表达的学习路径。无论是测试开发初学者、转岗用户，还是正在准备中大厂测试开发面试的候选人，都可以用它更快补齐核心知识骨架。

## 在线访问

- 站点地址：[https://muyuq.github.io/testdev-interview-site/](https://muyuq.github.io/testdev-interview-site/)

## 你可以在这里获得什么

- 术语体系：把常见测试开发术语拆成定义、重要性、易错点和混淆概念，方便快速记忆和表达。
- 技术专题：围绕 Python、Pytest、Playwright、接口测试、CI/CD、数据驱动测试等高频面试主题组织内容。
- 项目类型：按电商、支付、管理后台、SaaS、数据平台等真实业务场景整理项目经验表达方式。
- 场景题：针对高频追问场景沉淀回答骨架，比如支付回调、权限变更、搜索功能、异步任务和第三方失败处理。
- 编码题：覆盖断言封装、重试机制、日志包装、测试数据生成、配置读取等常见测试开发代码题。
- 学习路线：提供 3 天 / 7 天冲刺路线、复盘方法、自我介绍模板和常见追问整理。
- AI 学习指南：聚焦 AI 时代测试开发的工具使用、边界意识和效率提升方向。
- 练手模板：提供项目故事模板、接口自动化模板、性能测试模板、Playwright 模板等可复用内容。
- 面试追问链：把单点知识延展成更接近真实面试节奏的连续追问链。

## 项目亮点

- 结构化内容设计：不只讲“是什么”，还强调“为什么重要”“面试中怎么说”“容易答错什么”。
- 首页速成地图：把学习路线和高频入口集中到首页，适合短期冲刺式复习。
- 内容页增强交互：支持最近浏览、学习进度、本地收藏、自测题和分享能力。
- 文档站阅读体验：基于 Astro + Starlight 构建，内容组织稳定、跳转清晰、静态性能友好。
- 无账号依赖：核心交互使用 `localStorage` 持久化，本地即可使用，不需要登录系统。

## 内容结构

当前站点内容按以下 9 个模块组织：

- `glossary`
- `tech`
- `project`
- `scenario`
- `coding`
- `roadmap`
- `ai-learning`
- `practice-template`
- `interview-chains`

内容源码位于 `src/content/docs/`，由 Starlight 自动生成分类导航和文档页面。

## 技术栈

- `Astro 4`
- `@astrojs/starlight`
- `TypeScript`
- `Vitest`
- `Playwright`
- `GitHub Pages`

## 本地启动

```bash
npm install
npm run dev
```

默认会启动 Astro 开发服务器，本地访问地址通常为 `http://localhost:4321`。

## 质量检查

```bash
npm run check
```

这个命令会依次执行：

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

如果需要运行端到端测试：

```bash
npm run test:e2e
```

首次运行 Playwright 时，如本机缺少浏览器依赖，可执行：

```bash
npx playwright install
```

## 部署

项目当前面向 `GitHub Pages` 部署，站点基地址配置为 `/testdev-interview-site`。CI 会在部署前执行 `lint`、`typecheck`、`test` 和 `build`，避免把明显损坏的版本直接发布出去。

## 相关文档

- 项目说明：[PROJECT_DOC.md](./PROJECT_DOC.md)
- 协作说明：[AGENTS.md](./AGENTS.md)
- 评审报告：[docs/review/2026-04-19-project-review-report.md](./docs/review/2026-04-19-project-review-report.md)
