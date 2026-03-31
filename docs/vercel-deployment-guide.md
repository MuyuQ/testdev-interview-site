# Vercel 自动部署配置指南

本文档记录了如何配置 Vercel 实现每次推送到 GitHub 自动重新部署。

## 项目信息

- **GitHub 仓库**: https://github.com/MuyuQ/testdev-interview-site
- **生产域名**: https://temp-site-ivory.vercel.app
- **技术栈**: Next.js 16 + React 19 + Tailwind CSS 4
- **项目子目录**: `temp-site`

## 部署状态

✅ **已成功部署到 Vercel 生产环境**

| 环境 | 域名 |
|------|------|
| Production | https://temp-site-ivory.vercel.app |
| Vercel Dashboard | https://vercel.com/mcodes-projects-37b8a4cb/temp-site |

## 自动部署配置步骤

### 步骤 1: 连接 GitHub 仓库到 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New...** → **Project**
3. 在 **Import Git Repository** 页面：
   - 选择 GitHub 作为源
   - 找到并选择 `MuyuQ/testdev-interview-site` 仓库
   - 点击 **Import**

### 步骤 2: 配置项目设置

在 **Configure Project** 页面设置以下选项：

| 设置项 | 值 | 说明 |
|--------|-----|------|
| Framework Preset | Next.js | Vercel 会自动检测 |
| Root Directory | `temp-site` | **重要**: Next.js 项目位于此子目录 |
| Build Command | `npm run build` | 默认值，无需修改 |
| Output Directory | `.next` | 默认值，无需修改 |
| Install Command | `npm install` | 默认值，无需修改 |

点击 **Deploy** 开始首次部署。

### 步骤 3: 配置生产分支

部署完成后，在项目设置中配置自动部署分支：

1. 进入项目 → **Settings** → **Git**
2. 在 **Production Branch** 部分：
   - 设置生产分支为 `main`（或你希望的主分支）
   - 当前分支 `codex/testdev-interview-site` 可设置为预览分支

### 步骤 4: 自动部署机制说明

配置完成后，Vercel 会自动监听以下事件：

| 事件类型 | 触发条件 | 部署类型 |
|----------|----------|----------|
| Production Deploy | 推送到生产分支（如 `main`） | 生产环境部署 |
| Preview Deploy | 推送到其他分支或创建 PR | 预览环境部署 |

**自动部署流程**:

```
Git Push → GitHub Webhook → Vercel 触发构建 → 执行 npm install → 执行 npm run build → 部署完成
```

### 步骤 5: 验证 Webhook 配置

Vercel 连接 GitHub 时会自动配置 Webhook，可在 GitHub 仓库中验证：

1. 进入 GitHub 仓库 → **Settings** → **Webhooks**
2. 应能看到 Vercel 创建的 Webhook，Payload URL 格式为：
   `https://api.vercel.com/v1/integrations/github/...`

## 使用 Vercel CLI 部署（可选）

如果需要本地手动部署或测试：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署到预览环境
cd temp-site
vercel

# 部署到生产环境
vercel --prod
```

## 常见问题

### Q: 推送后部署没有触发？

检查以下几点：
1. GitHub Webhook 是否正常配置
2. Vercel 项目 Git 设置中的生产分支是否正确
3. 推送的分支是否在自动部署范围内

### Q: 如何查看部署日志？

1. 进入 Vercel Dashboard → 项目 → **Deployments**
2. 点击具体部署查看详细日志

### Q: 如何设置部署通知？

在 **Settings** → **Notifications** 中可配置：
- Email 通知
- Slack 集成
- GitHub PR 评论（自动）

## 参考链接

- [Vercel Git Integration 文档](https://vercel.com/docs/git)
- [Next.js on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)