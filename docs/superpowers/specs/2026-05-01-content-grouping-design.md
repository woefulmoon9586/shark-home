# 内容分组功能设计

## 概述

为项目和博客添加基于目录的分组功能。文件按子目录组织，分类从路径自动提取，无需手动维护。

## 目录结构

```
src/content/
  projects/
    frontend/
      my-vue-app.md
      portfolio-site.md
    backend/
      api-server.md
    工具/
      cli-tool.md
  blog/
    学习笔记/
      astro-guide.md
    随笔/
      hello-world.md
```

## Schema 变更

### content.config.ts

两个 collection 的 schema 各新增一个 `category` 字段：

```ts
category: z.string()
```

`category` 值从文件路径自动提取，取 `base` 之后的第一级目录名。例如 `src/content/projects/frontend/my-vue-app.md` 的 category 为 `"frontend"`。根目录下的文件 category 为空字符串 `""`，归入"未分类"。

### 提取逻辑

在 glob loader 的 schema 函数中，从 `entry.filePath` 解析：

```ts
// 示例：base 为 './src/content/projects'
// entry.filePath 为 './src/content/projects/frontend/my-vue-app.md'
// 提取出 'frontend'
```

## 列表页变更

### /projects/ 和 /blog/

- 页面标题下方新增**分类标签栏**，显示所有分类及每个分类的文章/项目数量
- 默认选中"全部"
- 点击标签跳转到 `/projects/[category]/` 或 `/blog/[category]/`
- 列表按分类分组展示，每组有 `// 分类名` 小标题
- 根目录下未分类的项目/文章放在最后，标题为 `// 未分类`

### 分类标签栏交互

- "全部"标签显示总数量
- 各分类标签显示对应数量
- 当前页对应的标签高亮（active 状态）

## 新增页面

### /projects/[category]/ 和 /blog/[category].astro

- 动态路由，为每个分类生成独立页面
- 页面内容：该分类下的项目/文章列表
- 顶部有同样的分类标签栏，当前分类高亮
- 复用现有的 ProjectCard / PostCard 组件

## 首页变更

首页精选项目和最新文章区域不受影响，仍然展示 featured 项目和最新文章，不做分组。

## 组件复用

- 列表页和分类页共用同一套列表渲染逻辑
- 新增分类标签栏组件 `CategoryTabs.astro`
  - Props：`categories`（分类列表+数量）、`basePath`（/projects/ 或 /blog/）、`current`（当前分类，空表示"全部"）
  - 渲染：标签按钮列表，当前分类高亮

## 不做的事

- 不加搜索/筛选功能
- 不支持多级嵌套目录（只取一级）
- 不改变现有内容的 URL 路径（现有 /projects/sample-project/ 不受影响）
