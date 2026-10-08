# 测试开发面试速成站

帮助学习者找到下一步，并把测试开发知识练成可表达的能力。基于 Astro 6 + Starlight 构建的纯静态学习站，部署在 GitHub Pages。

**线上地址**: https://muyuq.github.io/testdev-interview-site

## 站点概况

- **67 篇结构化内容**,覆盖 10 个模块,总量约 1.2MB
- **200 道自测题**,随文交互判定并给出解析
- **每篇文章带学习元数据**:阶段、预计用时、前置知识、可验证产出、相关阅读、学习路径位置
- **深浅双主题**:跟随系统偏好,首页与文档页共享同一份主题约定(切换状态互通)
- **真实数据首页**:内容统计在构建时从内容集合实时计算,不会过期

## 技术栈

- **框架**: Astro 6 + Starlight 0.39(纯静态输出)
- **语言**: TypeScript(strict 模式)
- **测试**: Vitest(单元)+ Playwright(端到端冒烟)
- **质量**: ESLint(flat config)+ Prettier + 内容结构校验 + 构建产物链接检查
- **部署**: GitHub Actions → GitHub Pages
- **运行环境**: Node.js >= 22

## 10 个内容模块

| 模块        | 目录                | 定位                                                |
| ----------- | ------------------- | --------------------------------------------------- |
| 新手教程    | `beginner-course`   | 从零开始的 8 步学习路线,教学优先结构                |
| 术语体系    | `glossary`          | 12 个高频术语,含易混淆对比与面试追问                |
| 技术专题    | `tech`              | API 测试、pytest、Playwright、CI/CD 等技术深讲      |
| 编码题      | `coding`            | 夹具、断言封装、重试机制与限时进阶训练              |
| 项目类型    | `project`           | 4 类可包装项目,含简历表述与追问应对                 |
| 场景题      | `scenario`          | 7 个高频场景:登录、支付回调、分布式事务、库存扣减等 |
| 学习路线    | `roadmap`           | 3 天/7 天时间盒计划与自我介绍模板                   |
| 面试追问链  | `interview-chains`  | 连环追问训练,含压力应对策略                         |
| 练手模板    | `practice-template` | 可直接跑通的自动化/Mock/项目故事模板                |
| AI 学习指南 | `ai-learning`       | AI 时代的用例设计、脚本生成与能力边界               |

## 快速开始

```bash
git clone https://github.com/MuyuQ/testdev-interview-site.git
cd testdev-interview-site
npm install
npm run dev        # http://localhost:4321/testdev-interview-site
```

## 常用命令

| 命令                                 | 作用                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| `npm run dev`                        | 启动开发服务器(带 base path)                          |
| `npm run build`                      | 构建到 `dist/`                                        |
| `npm run preview`                    | 本地预览构建产物                                      |
| `npm run check`                      | 一键全链路:格式化 + lint + 类型检查 + 构建 + 链接检查 |
| `npm run validate:content`           | 校验 frontmatter 与新手教程必需章节                   |
| `npm run check:links`                | 校验构建产物与 markdown 源的内部链接                  |
| `npm run test:unit`                  | Vitest 单元测试                                       |
| `npm run test:e2e:smoke`             | Playwright 端到端冒烟(chromium)                       |
| `npm run lint` / `npm run typecheck` | 代码检查 / 类型检查                                   |

## 项目结构

```
src/
├── components/          # Starlight 组件覆盖(PageTitle/MarkdownContent/SelfTests 等)
├── content/docs/        # 全部内容(10 个分类目录 + difficulty/tags)
├── lib/                 # 数据层:site-config、home-page、learning-paths、进度/收藏存储
├── pages/index.astro    # 自定义首页(独立于 Starlight 布局,深浅双主题)
└── styles/              # 设计令牌 + Starlight 主题覆盖 + 文档工作台主题

tests/
├── unit/                # Vitest:首页数据/标记、内容主题、内容校验
├── e2e/smoke.spec.ts    # Playwright 冒烟:首页、文章页、自测交互、分类页
└── setup.ts             # localStorage 等测试环境准备

scripts/
├── validate-content.ts  # 内容结构校验(CI 门禁)
└── check-links.mjs      # 链接完整性校验(CI 门禁)
```

## CI/CD

推送或 PR 到 `main` 时,GitHub Actions 依次执行:

1. **quality**:内容校验 → 格式检查 → lint → 类型检查 → 单元测试 → 构建 → 链接检查
2. **e2e**:chromium 端到端冒烟
3. **deploy**(仅 push main):上传构建产物并发布到 GitHub Pages

## 内容贡献规范

- frontmatter 遵循 `src/content.config.ts` 的 schema(category/stage/estimatedMinutes/prerequisites/outcomes/selfTests 等)
- 新手教程正文必须包含 10 个必需章节(validate:content 会强制检查)
- 站内链接统一使用 `/testdev-interview-site/<slug>/` 形式,slug 必须真实存在
- beginner-course 保持教学优先结构;中文行文,代码注释用中文
- 新增分类文章后,同步更新 `src/lib/paths/` 下对应分类的学习路径

## 许可证

MIT

---
*最后更新: 2026-10-08*
