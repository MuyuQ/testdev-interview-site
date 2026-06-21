# 测试开发面试速成站

帮助用户在短时间内补齐测试开发面试知识，并把知识转化成可表达、可练习、可复盘的面试能力。

## 项目简介

这是一个基于 Astro 6 + Starlight 构建的测试开发面试学习平台，旨在为测试开发岗位求职者提供系统化的学习资源。平台包含新手教程、技术专题、编码练习、项目实战等多个模块，帮助用户全面提升面试能力。

## 技术栈

- **前端框架**: Astro 6 + Starlight
- **开发语言**: TypeScript
- **部署平台**: GitHub Pages
- **测试框架**: Vitest (单元测试) + Playwright (端到端测试)
- **代码质量**: ESLint + Prettier
- **包管理**: npm
- **Node.js**: >=22.0.0

## 内容结构

平台包含 10 个核心模块：

1. **新手教程** (`beginner-course`) - 从零开始的学习路线
2. **术语体系** (`glossary`) - 测试开发专业术语
3. **技术专题** (`tech`) - 深入技术知识点
4. **项目类型** (`project`) - 常见项目类型解析
5. **场景题** (`scenario`) - 实际场景问题解决方案
6. **编码题** (`coding`) - 编码练习与面试题
7. **学习路线** (`roadmap`) - 系统化学习路径
8. **AI 学习指南** (`ai-learning`) - AI 辅助学习资源
9. **练手模板** (`practice-template`) - 实践练习模板
10. **面试追问链** (`interview-chains`) - 面试常见追问问题

## 快速开始

### 环境要求

- Node.js >= 22.0.0
- npm 或 yarn

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/MuyuQ/testdev-interview-site.git
cd testdev-interview-site

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:4321` 查看网站。

## 构建与部署

### 本地构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览构建结果

```bash
npm run preview
```

### 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署。当推送到 `main` 分支时，会自动触发构建并部署到 GitHub Pages。

部署地址: https://muyuq.github.io/testdev-interview-site

## 测试

### 单元测试

```bash
npm run test:unit
```

### 端到端测试

```bash
npm run test:e2e
```

### 内容验证

```bash
npm run validate:content
```

### 代码检查

```bash
# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# 代码检查
npm run lint

# 类型检查
npm run typecheck

# 完整检查流程
npm run check
```

## 项目结构

```
src/
├── components/          # Astro 组件
├── content/docs/        # 文档内容（Markdown）
├── layouts/             # 布局组件
├── lib/                 # 工具函数库
├── pages/               # 页面路由
└── styles/              # 样式文件

tests/
├── unit/                # 单元测试
├── e2e/                 # 端到端测试
└── setup.ts             # 测试配置
```

## 贡献指南

欢迎贡献内容！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 内容贡献规范

- 文档使用 Markdown 格式
- 文件名使用小写字母和连字符
- 新内容需要添加到对应的侧边栏配置中
- 确保内容符合项目整体结构

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

- GitHub: [MuyuQ](https://github.com/MuyuQ)
- 项目地址: [testdev-interview-site](https://github.com/MuyuQ/testdev-interview-site)

## 致谢

感谢所有为测试开发社区做出贡献的开发者们！