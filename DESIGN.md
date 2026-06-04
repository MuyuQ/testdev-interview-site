---
name: 测试开发面试速成站
description: 帮助学习者找到下一步，并把测试开发知识练成可表达的能力
colors:
  action-blue: "#3b82f6"
  action-blue-deep: "#1d4ed8"
  action-blue-soft: "#eff6ff"
  prompt-amber: "#f59e0b"
  prompt-amber-soft: "#fffbeb"
  progress-green: "#10b981"
  error-red: "#ef4444"
  reading-white: "#ffffff"
  surface-subtle: "#f9fafb"
  surface-muted: "#f3f4f6"
  structure-border: "#e5e7eb"
  body-ink: "#111827"
  secondary-ink: "#6b7280"
typography:
  display:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "clamp(2.5rem, 4.4vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.reading-white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.body-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.reading-white}"
    textColor: "{colors.body-ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  tag-primary:
    backgroundColor: "{colors.action-blue-soft}"
    textColor: "{colors.action-blue-deep}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
---

# Design System: 测试开发面试速成站

## Overview

**Creative North Star: "工程师的学习工作台"**

这个系统把学习站设计成一张清楚、可靠、可执行的工作台。用户进入页面后，首先看到的是适合自己的下一步，而不是十个并列分类。视觉层级服务于学习决策，内容结构服务于能力成长。

界面保持专业可信、清晰有序、实战务实。它不模仿培训机构招生页，不停留在默认文档模板，不使用游戏化奖励制造热闹，也不把学习体验做成企业后台系统。

**Key Characteristics:**

- 学习路径和当前建议行动优先于完整内容目录。
- 大面积阅读白与结构灰保证长内容可读性。
- 行动蓝只承担主要操作、链接和当前状态。
- 提示琥珀用于面试冲刺等少量次级强调。
- 卡片仅用于需要独立点击或对比的内容，不能成为默认布局。

## Colors

色彩像工程师的标记系统：蓝色指向行动，琥珀色提示重点，绿色确认进度，中性色承载阅读。

### Primary

- **行动蓝**：用于主要按钮、链接、当前学习步骤和关键焦点状态。
- **深行动蓝**：用于需要更高对比度的蓝色文字和悬停状态。
- **浅行动蓝**：用于当前项、选中项和轻量提示背景。

### Secondary

- **提示琥珀**：用于面试冲刺、重要提醒和次级强调，不能与主要行动竞争。
- **浅提示琥珀**：用于温和提醒背景，不用于大面积装饰。

### Tertiary

- **进度绿**：只表示完成、正确和可确认的成功状态。
- **错误红**：只表示错误、失败和需要修正的状态。

### Neutral

- **阅读白**：主要页面和长内容背景。
- **浅表面灰**：侧栏、轻量容器和分组区域。
- **结构灰**：边框、分隔线和非交互结构。
- **正文墨色**：标题和正文主色。
- **次要墨色**：辅助说明、元信息和次级标签。

### Named Rules

**The One Action Rule.** 每个视觉区域只能有一个最强的行动蓝目标。

**The Meaningful Color Rule.** 颜色必须表达行动、提示、进度或错误，禁止把色彩当作无意义装饰。

## Typography

**Display Font:** PingFang SC（Hiragino Sans GB、Microsoft YaHei 回退）
**Body Font:** PingFang SC（Hiragino Sans GB、Microsoft YaHei 回退）
**Label/Mono Font:** 系统等宽字体仅用于代码和技术字面量

**Character:** 中文排版应像一位表达清楚的工程师，句子直接，层级明确，阅读节奏稳定。通过字号、字重和留白建立层级，不通过过多字体或装饰性字形制造个性。

### Hierarchy

- **Display**（700，流体字号，1.08）：仅用于首页首屏等少量品牌标题。
- **Headline**（600，24px，1.25）：用于主要章节标题。
- **Title**（600，18px，1.375）：用于组件标题和内容小节。
- **Body**（400，16px，1.625）：用于正文，长内容行宽控制在 65 至 75 个字符。
- **Label**（500，14px，1.5）：用于按钮、导航和元信息，不使用全大写句子。

### Named Rules

**The Teaching First Rule.** 新手教程的标题必须帮助用户理解学习顺序和产出，不能只复述技术名词。

**The Readable Measure Rule.** 长正文必须保持稳定行宽和舒展行高，不能为了信息密度牺牲阅读。

## Elevation

系统默认保持平面，通过背景层级、分隔线和间距表达结构。阴影只在悬停、可点击浮层或需要明确提升交互反馈时出现，不能同时叠加宽阴影和装饰性边框。

### Shadow Vocabulary

- **轻反馈阴影**（`0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`）：用于可点击卡片的悬停反馈。
- **强调反馈阴影**（`0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`）：仅用于少量强交互区域，不用于默认静态卡片。

### Named Rules

**The Flat By Default Rule.** 静态内容默认无阴影，深度必须来自真实交互或结构层级。

## Components

### Buttons

- **Shape:** 清晰、克制的圆角矩形（8px 至 12px）。
- **Primary:** 行动蓝背景、白色文字、12px × 24px 内边距，每个区域最多一个。
- **Hover / Focus:** 悬停时颜色加深或轻微上移；键盘焦点必须有可见轮廓；减少动态偏好下取消位移。
- **Secondary / Ghost:** 使用结构灰背景或透明背景，不能与主要按钮争夺视觉优先级。

### Chips

- **Style:** 小尺寸、轻背景、明确语义。蓝色表示当前或中级，琥珀色表示重点，绿色表示完成。
- **State:** 文字必须独立表达状态，不能只依赖颜色。

### Cards / Containers

- **Corner Style:** 适度圆角（8px 至 12px），禁止超大圆角。
- **Background:** 阅读白或浅表面灰。
- **Shadow Strategy:** 默认平面，交互时才使用轻反馈阴影。
- **Border:** 结构灰细边框仅在需要明确点击边界时使用。
- **Internal Padding:** 16px 至 24px，内容密度随用途变化。

### Inputs / Fields

- **Style:** 阅读白背景、结构灰边框、8px 圆角。
- **Focus:** 使用行动蓝边框和清晰焦点环。
- **Error / Disabled:** 错误红必须配合文字说明；禁用状态仍需保持可读。

### Navigation

导航使用清楚的中文标签和稳定的层级。当前项通过字重、文字颜色和轻背景表达，移动端必须保持足够触控面积，不能依赖悬停。

### Learning Path

学习路径是站点的签名组件。它显示阶段、当前建议、预计时间和可验证产出，必须让用户理解“我在哪里、下一步做什么、完成后得到什么”。

## Do's and Don'ts

### Do:

- **Do** 先帮助用户判断下一步，再展示完整模块范围。
- **Do** 保持行动蓝稀缺，让主要操作具有明确优先级。
- **Do** 为新手教程保留教学顺序、练习产出和进入后续内容的连接。
- **Do** 使用背景层级、分隔线和间距组织复杂内容。
- **Do** 为键盘焦点、移动端触控和减少动态偏好提供完整支持。

### Don't:

- **Don't** 把页面做成培训机构招生页，不使用焦虑营销、夸张承诺或强推销式表达。
- **Don't** 把页面做成默认文档模板，不满足于可靠但平淡的分类目录。
- **Don't** 把页面做成游戏化打卡应用，不依赖鲜艳奖励、积分或过度娱乐化推动学习。
- **Don't** 把页面做成企业后台系统，不以密集数据和控制面板取代内容温度与教学节奏。
- **Don't** 使用重复的相同卡片网格、装饰性渐变文字、玻璃拟态或超大圆角。
- **Don't** 让重要状态只依赖颜色表达。
