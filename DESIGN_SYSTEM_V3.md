# 测试开发面试速成站 - 设计系统 v3.0

## 设计系统概述

**设计理念：有机现代主义（Organic Modernism）**

有机现代主义是一种融合了现代主义的简洁与有机形态的柔和的设计风格。它强调：

- **柔和的形状**：圆润的边角、有机的曲线
- **精致的细节**：微妙的渐变、精致的阴影
- **充足的白空间**：呼吸感、不拥挤
- **自然的色彩**：温暖、亲和的色调
- **高可读性**：清晰的层次、舒适的阅读体验

---

## 一、色彩系统

### 1.1 主色调 - 紫罗兰蓝（Violet Blue）

主色调采用紫罗兰蓝，传达专业、创新、可信赖的品牌形象。

```
--primary-50:  #f5f3ff  (最浅)
--primary-100: #ede9fe
--primary-200: #ddd6fe
--primary-300: #c4b5fd
--primary-400: #a78bfa
--primary-500: #8b5cf6  (主色)
--primary-600: #7c3aed  (强调)
--primary-700: #6d28d9
--primary-800: #5b21b6
--primary-900: #4c1d95
--primary-950: #2e1065  (最深)
```

### 1.2 辅助色 - 青绿色（Teal）

用于信息提示、成功状态等场景。

```
--secondary-50:  #f0fdfa
--secondary-100: #ccfbf1
--secondary-200: #99f6e4
--secondary-300: #5eead4
--secondary-400: #2dd4bf
--secondary-500: #14b8a6
--secondary-600: #0d9488
--secondary-700: #0f766e
--secondary-800: #115e59
--secondary-900: #134e4a
--secondary-950: #042f2e
```

### 1.3 功能色

#### 成功色 - 翡翠绿

```
--success-500: #10b981
--success-600: #059669
```

#### 警告色 - 琥珀橙

```
--warning-500: #f59e0b
--warning-600: #d97706
```

#### 错误色 - 玫瑰红

```
--error-500: #f43f5e
--error-600: #e11d48
```

### 1.4 中性色 - 暖灰调

采用暖色调的灰色，比冷灰色更具亲和力。

#### 亮色模式

```
--gray-50:  #fafaf9  (背景)
--gray-100: #f5f5f4
--gray-200: #e7e5e4
--gray-300: #d6d3d1
--gray-400: #a8a29e
--gray-500: #78716c
--gray-600: #57534e
--gray-700: #44403c
--gray-800: #292524
--gray-900: #1c1917  (文字)
--gray-950: #0c0a09
```

#### 暗色模式

```
--gray-50:  #0c0a09  (背景)
--gray-100: #1c1917
--gray-200: #292524
--gray-300: #44403c
--gray-400: #57534e
--gray-500: #78716c
--gray-600: #a8a29e
--gray-700: #d6d3d1
--gray-800: #e7e5e4
--gray-900: #f5f5f4  (文字)
--gray-950: #fafaf9
```

### 1.5 语义化颜色令牌

#### 背景层

```
--color-bg:           #fafaf9 (亮色) / #0c0a09 (暗色)
--color-bg-elevated:  #ffffff (亮色) / #1c1917 (暗色)
--color-bg-sunken:    #f5f5f4 (亮色) / #0c0a09 (暗色)
--color-bg-hover:     #f0eeed (亮色) / #292524 (暗色)
--color-bg-active:    #e7e5e4 (亮色) / #44403c (暗色)
```

#### 文字颜色

```
--color-text:           #1c1917 (亮色) / #f5f5f4 (暗色)
--color-text-secondary: #44403c (亮色) / #e7e5e4 (暗色)
--color-text-tertiary:  #78716c (亮色) / #a8a29e (暗色)
--color-text-disabled:  #a8a29e (亮色) / #78716c (暗色)
```

#### 边框颜色

```
--color-border:       #e7e5e4 (亮色) / rgba(68, 64, 60, 0.5) (暗色)
--color-border-hover: #d6d3d1 (亮色) / rgba(87, 83, 78, 0.6) (暗色)
--color-border-active: #8b5cf6 (亮色) / #8b5cf6 (暗色)
```

---

## 二、字体系统

### 2.1 字体族

```css
--font-sans:
  "Noto Sans SC", "Inter", "PingFang SC", "Microsoft YaHei", system-ui,
  sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;
```

### 2.2 字体大小比例（Major Third - 1.2比例尺）

| 令牌        | 大小            | 用途           |
| ----------- | --------------- | -------------- |
| --text-2xs  | 0.625rem (10px) | 极小标签       |
| --text-xs   | 0.75rem (12px)  | 标签、辅助文字 |
| --text-sm   | 0.875rem (14px) | 正文小字       |
| --text-base | 1rem (16px)     | 正文           |
| --text-lg   | 1.125rem (18px) | 引言、大正文   |
| --text-xl   | 1.25rem (20px)  | 小标题         |
| --text-2xl  | 1.5rem (24px)   | 章节标题       |
| --text-3xl  | 1.875rem (30px) | 页面标题       |
| --text-4xl  | 2.25rem (36px)  | 大标题         |
| --text-5xl  | 3rem (48px)     | Hero标题       |
| --text-6xl  | 3.75rem (60px)  | 超大标题       |

### 2.3 字重

```
--font-light:     300
--font-normal:    400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
--font-extrabold: 800
```

### 2.4 行高

```
--leading-none:    1      (标题)
--leading-tight:   1.2    (大标题)
--leading-snug:    1.375  (小标题)
--leading-normal:  1.5    (正文)
--leading-relaxed: 1.65   (长文本)
--leading-loose:   2      (宽松)
```

### 2.5 字间距

```
--tracking-tight:  -0.025em  (大标题)
--tracking-normal: 0         (正文)
--tracking-wide:   0.025em   (标签)
--tracking-wider:  0.05em    (大写标签)
```

---

## 三、间距系统

### 3.1 间距令牌（8px基准）

| 令牌        | 大小           | 用途       |
| ----------- | -------------- | ---------- |
| --space-0   | 0              | 无间距     |
| --space-px  | 1px            | 细线       |
| --space-0-5 | 0.125rem (2px) | 极小       |
| --space-1   | 0.25rem (4px)  | 图标间距   |
| --space-2   | 0.5rem (8px)   | 紧凑间距   |
| --space-3   | 0.75rem (12px) | 小间距     |
| --space-4   | 1rem (16px)    | 标准间距   |
| --space-5   | 1.25rem (20px) | 中等间距   |
| --space-6   | 1.5rem (24px)  | 大间距     |
| --space-8   | 2rem (32px)    | 章节间距   |
| --space-10  | 2.5rem (40px)  | 大章节间距 |
| --space-12  | 3rem (48px)    | 区域间距   |
| --space-16  | 4rem (64px)    | 大区域间距 |
| --space-20  | 5rem (80px)    | 超大间距   |
| --space-24  | 6rem (96px)    | Hero间距   |

---

## 四、圆角系统

```
--radius-none:  0        (直角)
--radius-sm:    0.375rem (6px)  (小元素)
--radius-md:    0.5rem   (8px)  (按钮、输入框)
--radius-lg:    0.75rem  (12px) (卡片)
--radius-xl:    1rem     (16px) (大卡片)
--radius-2xl:   1.5rem   (24px) (模块)
--radius-3xl:   2rem     (32px) (Hero)
--radius-full:  9999px   (圆形)
```

---

## 五、阴影系统

### 5.1 亮色模式阴影

```
--shadow-xs:  0 1px 2px 0 rgba(28, 25, 23, 0.03)
--shadow-sm:  0 1px 3px 0 rgba(28, 25, 23, 0.06), 0 1px 2px -1px rgba(28, 25, 23, 0.06)
--shadow-md:  0 4px 6px -1px rgba(28, 25, 23, 0.07), 0 2px 4px -2px rgba(28, 25, 23, 0.07)
--shadow-lg:  0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.08)
--shadow-xl:  0 20px 25px -5px rgba(28, 25, 23, 0.09), 0 8px 10px -6px rgba(28, 25, 23, 0.09)
--shadow-2xl: 0 25px 50px -12px rgba(28, 25, 23, 0.15)
--shadow-inner: inset 0 2px 4px 0 rgba(28, 25, 23, 0.04)
--shadow-glow:  0 0 20px rgba(124, 58, 237, 0.15)
--shadow-glow-lg: 0 0 40px rgba(124, 58, 237, 0.2)
```

### 5.2 暗色模式阴影

```
--shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.8)
--shadow-glow:  0 0 20px rgba(139, 92, 246, 0.25)
--shadow-glow-lg: 0 0 40px rgba(139, 92, 246, 0.35)
```

---

## 六、过渡动画

### 6.1 持续时间

```
--duration-instant: 0ms
--duration-fast:    150ms
--duration-normal:  200ms
--duration-slow:    300ms
--duration-slower:  500ms
--duration-slowest: 700ms
```

### 6.2 缓动函数

```
--ease-linear:    linear
--ease-in:        cubic-bezier(0.4, 0, 1, 1)
--ease-out:       cubic-bezier(0, 0, 0.2, 1)
--ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-bounce:    cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 七、组件样式规范

### 7.1 按钮

#### 主按钮

```css
.btn-primary {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
  box-shadow: var(--shadow-sm), var(--shadow-glow);
  border-radius: var(--radius-lg);
}

.btn-primary:hover {
  box-shadow: var(--shadow-md), var(--shadow-glow-lg);
  transform: translateY(-1px);
}
```

#### 次按钮

```css
.btn-secondary {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
```

#### 幽灵按钮

```css
.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

.btn-ghost:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}
```

### 7.2 卡片

```css
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-interactive:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}
```

### 7.3 徽章

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2-5);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-full);
}

.badge-primary {
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  border: 1px solid var(--primary-200);
}
```

### 7.4 输入框

```css
.input {
  width: 100%;
  padding: var(--space-2-5) var(--space-3-5);
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}
```

### 7.5 提示框（Callout）

```css
.callout {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border-left: 4px solid;
}

.callout-info {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
}

.callout-success {
  background: var(--color-success-bg);
  border-color: var(--color-success);
}

.callout-warning {
  background: var(--color-warning-bg);
  border-color: var(--color-warning);
}

.callout-error {
  background: var(--color-error-bg);
  border-color: var(--color-error);
}
```

---

## 八、渐变定义

### 8.1 亮色模式

```css
--gradient-primary: linear-gradient(
  135deg,
  #8b5cf6 0%,
  #7c3aed 50%,
  #6d28d9 100%
);
--gradient-secondary: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
--gradient-hero: linear-gradient(135deg, #f5f3ff 0%, #fafaf9 50%, #f0fdfa 100%);
--gradient-subtle: linear-gradient(180deg, #ffffff 0%, #fafaf9 100%);
--gradient-card: linear-gradient(180deg, #ffffff 0%, #fafaf9 100%);
--gradient-border: linear-gradient(90deg, transparent, #e7e5e4, transparent);
```

### 8.2 暗色模式

```css
--gradient-primary: linear-gradient(
  135deg,
  #8b5cf6 0%,
  #a78bfa 50%,
  #c4b5fd 100%
);
--gradient-secondary: linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%);
--gradient-hero: linear-gradient(135deg, #1c1917 0%, #0c0a09 50%, #1c1917 100%);
--gradient-subtle: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%);
--gradient-card: linear-gradient(180deg, #292524 0%, #1c1917 100%);
--gradient-border: linear-gradient(
  90deg,
  transparent,
  rgba(68, 64, 60, 0.5),
  transparent
);
```

---

## 九、无障碍设计

### 9.1 对比度标准

所有文字与背景的对比度符合 WCAG AA 标准（4.5:1），关键内容符合 AAA 标准（7:1）。

### 9.2 焦点样式

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### 9.3 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 十、响应式断点

| 断点 | 宽度   | 用途            |
| ---- | ------ | --------------- |
| sm   | 640px  | 手机横屏        |
| md   | 768px  | 平板竖屏        |
| lg   | 1024px | 平板横屏/小桌面 |
| xl   | 1280px | 桌面            |
| 2xl  | 1536px | 大桌面          |

---

## 十一、使用指南

### 11.1 文件结构

```
src/styles/
├── design-system-v3.css    # 设计令牌和基础样式
├── components-v3.css         # 组件样式
├── layout-v3.css           # 布局样式
├── home-page-v3.css        # 首页样式
└── starlight-overrides-v3.css  # Starlight 主题覆盖
```

### 11.2 在 Astro 配置中引入

```javascript
// astro.config.mjs
customCss: [
  "./src/styles/design-system-v3.css",
  "./src/styles/components-v3.css",
  "./src/styles/layout-v3.css",
  "./src/styles/home-page-v3.css",
  "./src/styles/starlight-overrides-v3.css",
],
```

### 11.3 使用设计令牌

```css
.my-component {
  /* 颜色 */
  background: var(--color-bg-elevated);
  color: var(--color-text);
  border-color: var(--color-border);

  /* 间距 */
  padding: var(--space-4);
  margin-bottom: var(--space-6);

  /* 圆角 */
  border-radius: var(--radius-lg);

  /* 阴影 */
  box-shadow: var(--shadow-sm);

  /* 过渡 */
  transition: all var(--duration-normal) var(--ease-out);
}
```

---

## 十二、设计原则

1. **一致性**：使用设计令牌确保全站风格统一
2. **层次清晰**：通过颜色、大小、间距建立清晰的视觉层次
3. **呼吸感**：充足的白空间让内容更易阅读
4. **精致细节**：微妙的渐变、阴影和过渡提升品质感
5. **无障碍**：确保所有用户都能舒适地使用网站
6. **响应式**：在不同设备上都能获得良好的体验

---

## 十三、版本历史

- **v3.0** (2026-05-17): 全新设计系统，有机现代主义风格
  - 全新紫罗兰蓝主色调
  - 暖灰调中性色
  - 有机现代主义设计语言
  - 更精致的阴影和渐变
  - 更完善的组件系统

---

_本文档用于记录当前站点的 V3 设计系统约束，后续视觉与组件调整应优先保持与此处的令牌和组件规范一致。_
