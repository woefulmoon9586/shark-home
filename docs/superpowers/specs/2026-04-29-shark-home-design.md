# Shark Home - 个人主页设计文档

## 概述

构建一个技术博客+作品集个人主页，采用极客暗黑风终端美学，内容全中文，使用 Astro 框架静态生成。

## 技术栈

- **框架**：Astro 5（最新稳定版，Content Collections API v2）
- **样式**：Tailwind CSS 4，暗色主题，`class` 策略
- **部署目标**：纯静态生成（SSG），零客户端 JS
- **语言**：TypeScript

## 站点结构

### 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 个人简介 + 精选项目 + 最新文章 |
| `/projects` | 项目列表 | 卡片网格展示所有项目 |
| `/projects/[slug]` | 项目详情 | 单个项目完整介绍 |
| `/blog` | 文章列表 | 按时间倒序，显示标题、日期、标签、摘要 |
| `/blog/[slug]` | 文章详情 | 单篇文章完整内容 |
| `/about` | 关于我 | 详细介绍 + 技能 + 联系方式 |

### 导航

顶部固定导航栏，终端标签页风格：`~/shark  |  项目  |  博客  |  关于`

## 视觉设计

### 配色方案

| 用途 | 色值 |
|------|------|
| 背景主色 | `#0d1117` |
| 卡片/面板 | `#161b22` |
| 边框线 | `#30363d` |
| 主文字 | `#c9d1d9` |
| 次文字 | `#8b949e` |
| 强调色（链接/高亮） | `#58a6ff` |
| 标签绿 | `#7ee787` |
| 标签紫 | `#d2a8ff` |

### 终端美学元素

- 首页顶部用终端窗口样式呈现自我介绍，带 `$` 提示符
- 页面标题用代码注释风格（`// 项目列表`、`/** 关于我 */`）
- 技术栈标签用类似代码语法高亮的配色
- 卡片悬停时有微妙的边框发光效果

### 排版

- 中文：系统默认无衬线字体
- 英文/代码：JetBrains Mono 或 Fira Code 等宽字体
- 行高：1.7

### 响应式断点

- 桌面（≥1024px）：双栏/三栏布局
- 平板（768px–1023px）：双栏
- 手机（<768px）：单栏，汉堡菜单

## 内容模型

### 博客文章（`src/content/blog/`）

```yaml
---
title: "文章标题"
date: 2025-01-15
tags: ["TypeScript", "Astro"]
summary: "一句话摘要"
draft: false
---
```

- `draft: true` 的文章不发布
- 按 `date` 倒序排列

### 项目（`src/content/projects/`）

```yaml
---
title: "项目名称"
description: "项目简介"
techStack: ["TypeScript", "React", "Node.js"]
github: "https://github.com/shark/awesome-tool"
demo: "https://demo.example.com"
featured: true
order: 1
---
```

- `featured: true` 展示在首页
- `order` 控制展示顺序
- `github` 和 `demo` 为可选字段

## 首页布局

```
┌─────────────────────────────────┐
│ ~/shark  │ 项目 │ 博客 │ 关于   │  ← 导航栏
├─────────────────────────────────┤
│  ┌─ terminal window ──────────┐ │
│  │ $ whoami                    │ │
│  │ > 你好，我是 Shark          │ │
│  │ > 全栈开发者，热爱开源      │ │
│  └─────────────────────────────┘ │
│                                  │
│  // 精选项目                      │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ 项目1 │ │ 项目2 │ │ 项目3 │    │
│  └──────┘ └──────┘ └──────┘    │
│                                  │
│  // 最新文章                      │
│  ┌──────────────────────────┐   │
│  │ 文章标题  日期  标签       │   │
│  │ 文章标题  日期  标签       │   │
│  │ 文章标题  日期  标签       │   │
│  └──────────────────────────┘   │
├─────────────────────────────────┤
│  GitHub · 邮箱 · © 动态年份       │  ← 页脚
└─────────────────────────────────┘
```

## 项目目录结构

```
shark-home/
├── src/
│   ├── content/
│   │   ├── blog/              # 博客文章 .md 文件
│   │   └── projects/          # 项目 .md 文件
│   ├── layouts/
│   │   ├── BaseLayout.astro   # 基础布局（head、导航、页脚）
│   │   └── PostLayout.astro   # 文章/项目详情布局
│   ├── components/
│   │   ├── Navbar.astro       # 顶部导航
│   │   ├── Footer.astro       # 页脚
│   │   ├── ProjectCard.astro  # 项目卡片
│   │   ├── PostCard.astro     # 文章卡片
│   │   ├── TagBadge.astro     # 标签徽章
│   │   └── TerminalIntro.astro # 首页终端风格介绍
│   ├── pages/
│   │   ├── index.astro        # 首页
│   │   ├── projects/
│   │   │   ├── index.astro    # 项目列表
│   │   │   └── [slug].astro   # 项目详情
│   │   ├── blog/
│   │   │   ├── index.astro    # 博客列表
│   │   │   └── [slug].astro   # 文章详情
│   │   └── about.astro        # 关于我
│   └── styles/
│       └── global.css         # 全局样式 + Tailwind 入口
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 站点配置（`src/config.ts`）

集中管理全站可复用数据：

```ts
export const siteConfig = {
  title: "Shark's Space",
  description: "全栈开发者 · 热爱开源",
  author: "Shark",
  github: "https://github.com/shark",
  email: "shark@example.com",
}
```

导航栏、页脚、SEO meta 均从此配置读取。

## SEO 配置

- 每个页面配置中文 `<title>` 和 `<meta name="description">`
- `<html lang="zh-CN">`
- 首页包含结构化数据（Person schema）

## 非功能要求

- 页面加载速度：Lighthouse Performance ≥ 95
- 无障碍：语义化 HTML，合理的 heading 层级
- 可维护性：新增博客文章或项目只需添加一个 Markdown 文件
