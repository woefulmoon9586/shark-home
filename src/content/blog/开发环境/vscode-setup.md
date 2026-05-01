---
title: "VS Code 配置与必装插件"
date: 2026-05-01
tags: ["VS Code", "开发环境", "效率工具"]
summary: "从零配置 VS Code：必装插件、快捷键、终端集成，打造趁手的开发环境。"
draft: false
---

## 为什么选 VS Code？

免费、轻量、插件丰富。不管写前端、后端还是 Python 脚本，VS Code 都能搞定。再加上内置终端和 Git 集成，基本不用离开编辑器。

## 安装

### macOS

```bash
# 用 Homebrew 安装
brew install --cask visual-studio-code
```

或者直接去 https://code.visualstudio.com 下载。

### Windows

去 https://code.visualstudio.com 下载安装包。

> **安装路径**：安装时选择「自定义安装」，建议改到 `D:\Program\VS Code`，避免占用 C 盘空间。

安装完成后，终端输入 `code` 就能打开 VS Code（macOS 需要先配置：打开 VS Code → `Cmd+Shift+P` → 输入 `Shell Command` → 选择 `Install code command in PATH`）。

## 必装插件

### 通用（所有人都装）

| 插件 | 说明 |
|------|------|
| **Chinese (Simplified)** | 中文界面 |
| **GitLens** | Git 历史可视化， blame 注释 |
| **Error Lens** | 行内显示错误和警告，不用看底栏 |
| **TODO Highlight** | 高亮 TODO、FIXME 注释 |
| **Path Intellisense** | 文件路径自动补全 |
| **Auto Rename Tag** | 改 HTML 标签时自动改配对的闭合标签 |

### 前端开发

| 插件 | 说明 |
|------|------|
| **Vue - Official** | Vue 3 语法支持（官方插件） |
| **ESLint** | JavaScript/TypeScript 代码检查 |
| **Prettier** | 自动格式化代码 |
| **Tailwind CSS IntelliSense** | Tailwind 类名自动补全 |
| **TypeScript Vue Plugin (Volar)** | Vue + TypeScript 支持 |

### 后端开发

| 插件 | 说明 |
|------|------|
| **Extension Pack for Java** | Java 开发全家桶 |
| **Python** | Python 语法支持 + 调试 |
| **Thunder Client** | API 测试工具（替代 Postman） |
| **SQLTools** | 数据库客户端（支持 MySQL、PostgreSQL） |

### 其他实用

| 插件 | 说明 |
|------|------|
| **Docker** | Docker 容器管理 |
| **Remote - SSH** | 远程服务器开发 |
| **Markdown All in One** | Markdown 编辑增强 |

## 推荐配置

打开设置（`Cmd+,` / `Ctrl+,`），搜索并修改以下项：

```json
{
  // 编辑器
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",

  // 终端
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.defaultProfile.osx": "zsh",

  // 文件
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,

  // 关闭烦人的提示
  "extensions.ignoreRecommendations": false
}
```

## 快捷键速查

### 最常用

| 快捷键 | 作用 |
|--------|------|
| `Cmd+P` / `Ctrl+P` | 快速打开文件 |
| `Cmd+Shift+P` / `Ctrl+Shift+P` | 命令面板（万能入口） |
| `Cmd+B` / `Ctrl+B` | 切换侧边栏 |
| `` Ctrl+` `` | 切换终端 |
| `Cmd+/` / `Ctrl+/` | 注释/取消注释 |
| `Cmd+D` / `Ctrl+D` | 选中下一个相同文本 |
| `Option+Up/Down` / `Alt+Up/Down` | 上下移动行 |
| `Option+Shift+Up/Down` | 上下复制行 |

### 搜索和导航

| 快捷键 | 作用 |
|--------|------|
| `Cmd+Shift+F` / `Ctrl+Shift+F` | 全局搜索 |
| `Cmd+G` / `Ctrl+G` | 跳转到指定行 |
| `F12` | 跳转到定义 |
| `Shift+F12` | 查看所有引用 |

## 内置终端

VS Code 自带终端，不用切出去。按 `` Ctrl+` `` 打开，支持多终端、分屏。

常用操作：

```
Ctrl+`          打开/关闭终端
Cmd+Shift+`     新建终端
Cmd+Shift+5     左右分屏终端
```

终端里可以直接用 Git、npm 等所有命令行工具，和独立终端完全一样。

## 代码片段

自定义代码片段可以大幅提高效率。`Cmd+Shift+P` → `Configure User Snippets`，选择语言，添加：

```json
{
  "Vue SFC": {
    "prefix": "vue",
    "body": [
      "<script setup lang=\"ts\">",
      "$0",
      "</script>",
      "",
      "<template>",
      "  ",
      "</template>",
      "",
      "<style scoped>",
      "",
      "</style>"
    ],
    "description": "Vue 3 SFC template"
  }
}
```

输入 `vue` 按 Tab 就能展开。

## 主题推荐

配色因人而异，这几个口碑不错：

- **GitHub Dark** — GitHub 风格暗色主题
- **One Dark Pro** — Atom 风格，经典耐看
- **Catppuccin** — 柔和的暗色主题
- **Tokyo Night** — 日系配色

在插件市场搜索安装，然后 `Cmd+Shift+P` → `Color Theme` 切换。

## 小结

VS Code 的核心是**插件 + 配置 + 快捷键**。先把必装插件装上，改几个配置，记住 `Cmd+P`（快速打开）和 `Cmd+Shift+P`（命令面板）就够了。用熟了再慢慢探索更多功能。

遇到问题？`Cmd+Shift+P` 输入你要做的事，大概率能找到对应的命令。
