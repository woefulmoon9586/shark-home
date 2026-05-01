---
title: "Node.js 版本管理（nvm）和 npm 入门"
date: 2026-05-01
tags: ["Node.js", "nvm", "npm", "开发环境"]
summary: "从零开始配置 Node.js 开发环境：用 nvm 管理多版本 Node.js，掌握 npm 包管理的核心用法。"
draft: false
---

## 为什么需要 nvm？

不同的项目可能依赖不同版本的 Node.js。比如老项目用 Node 16，新项目用 Node 20。手动管理版本很痛苦——卸载、重装、改环境变量……

**nvm**（Node Version Manager）就是解决这个问题的：一行命令切换 Node.js 版本，不同项目互不干扰。

## 安装 nvm

macOS / Linux 一行命令搞定：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

安装完成后，重启终端，或者手动加载：

```bash
source ~/.zshrc
```

验证安装成功：

```bash
nvm --version
# 输出类似：0.40.1
```

> Windows 用户请使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)，安装时建议将安装目录改到 `D:\Program\nvm`，避免占用 C 盘空间。命令略有不同。

## 安装 Node.js

安装最新的 LTS（长期支持）版本：

```bash
nvm install --lts
```

安装指定版本：

```bash
nvm install 20
```

查看已安装的版本：

```bash
nvm ls
# ->       v20.18.0
#           system
# default -> 20 (-> v20.18.0)
```

## 切换版本

切换到已安装的版本：

```bash
nvm use 20
```

设置默认版本（新终端自动使用）：

```bash
nvm alias default 20
```

切换到系统自带的 Node.js（如果有的话）：

```bash
nvm use system
```

## npm 基础

安装 Node.js 时会自动带上 **npm**（Node Package Manager），用来安装和管理项目依赖。

### 初始化项目

```bash
mkdir my-project && cd my-project
npm init -y
```

这会生成一个 `package.json` 文件，记录项目的名称、版本、依赖等信息。

### 安装依赖

安装一个包（添加到 `dependencies`）：

```bash
npm install express
```

安装开发依赖（只在开发时用，比如代码检查工具）：

```bash
npm install -D eslint
```

安装全局工具（命令行工具，所有项目都能用）：

```bash
npm install -g typescript
```

### 常用命令速查

```bash
# 查看已安装的包
npm ls

# 更新所有依赖到最新版本
npm update

# 卸载包
npm uninstall lodash

# 运行 package.json 中定义的脚本
npm run dev
npm run build
```

## npm 换源

国内访问 npm 官方源很慢，推荐换用淘宝镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

验证：

```bash
npm config get registry
# https://registry.npmmirror.com
```

## 推荐：用 pnpm 替代 npm

如果你开始做稍微大一点的项目，推荐试试 [pnpm](https://pnpm.io/)——更快、更省磁盘空间：

```bash
npm install -g pnpm
```

用法和 npm 几乎一样：

```bash
pnpm install express
pnpm run dev
```

## 小结

| 工具 | 作用                  |
| ---- | --------------------- |
| nvm  | 管理多个 Node.js 版本 |
| npm  | 安装和管理项目依赖    |
| pnpm | npm 的更快替代品      |

配置好环境后，下一步就是创建你的第一个 Node.js 项目了。
