---
title: "Git 从入门到日常使用"
date: 2026-05-01
tags: ["Git", "开发环境", "版本控制"]
summary: "Git 安装配置、核心概念、日常命令，一篇搞定版本控制入门。"
draft: false
---

## Git 是什么？

Git 是一个**版本控制工具**，帮你记录代码的每一次修改。写错了可以回退，多人协作不会互相覆盖。

简单理解：代码的"存档系统"，但比复制文件夹强一万倍。

## 安装

### macOS

装了 Xcode Command Line Tools 就自带了：

```bash
xcode-select --install
```

### Windows

下载安装包：https://git-scm.com/download/win

安装时一路默认即可。安装完成后右键桌面，看到「Git Bash Here」就说明成功了。

> Windows 用户建议使用 **Git Bash** 作为终端，命令和 macOS/Linux 一致。

### 验证

```bash
git --version
# git version 2.39.5
```

## 初始配置

安装后第一件事，设置你的身份信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "your@email.com"
```

查看当前配置：

```bash
git config --list
```

## 核心概念

开始之前，理解三个区域：

| 区域 | 说明 |
|------|------|
| 工作区 | 你正在编辑的文件 |
| 暂存区 | 准备提交的修改（`git add` 后进入） |
| 仓库 | 已提交的历史记录（`git commit` 后进入） |

流程就是：**编辑 → add 到暂存区 → commit 到仓库**

## 基本操作

### 创建仓库

```bash
mkdir my-project && cd my-project
git init
```

### 查看状态

```bash
git status
```

这是你最常用的命令，随时看看当前什么状态。

### 添加和提交

```bash
# 添加单个文件到暂存区
git add index.js

# 添加所有修改
git add .

# 提交
git commit -m "feat: 添加首页"
```

### 查看历史

```bash
# 简洁模式
git log --oneline

# 带图形的分支历史
git log --oneline --graph
```

## 分支

分支是 Git 最强大的功能之一。你在自己的分支上开发，不影响主线。

```bash
# 查看分支
git branch

# 创建并切换到新分支
git checkout -b feature/login

# 切换分支
git checkout main

# 合并分支到当前分支
git merge feature/login

# 删除已合并的分支
git branch -d feature/login
```

推荐的工作流：

```
main        ──●──────●─────●──
               \    /      ↑
feature/login   ●──●──     merge
```

在分支上开发，完成后合并回 main。

## 远程仓库

### 关联远程仓库

```bash
git remote add origin git@github.com:yourname/project.git
```

### 推送

```bash
# 首次推送（设置上游分支）
git push -u origin main

# 之后直接
git push
```

### 拉取远程更新

```bash
git pull
```

`git pull` = `git fetch`（下载更新）+ `git merge`（合并到本地）

### 克隆仓库

```bash
# SSH 方式（需要配置 SSH key）
git clone git@github.com:yourname/project.git

# HTTPS 方式（更简单，适合 Windows 用户）
git clone https://github.com/yourname/project.git
```

## 撤销操作

### 撤销工作区的修改（还没 add）

```bash
git checkout -- filename.js
```

### 从暂存区移除（已经 add 了，想撤回）

```bash
git restore --staged filename.js
```

### 修改上一次 commit 的信息

```bash
git commit --amend -m "新的提交信息"
```

### 回退到某次 commit

```bash
# 回退但保留修改（推荐）
git reset --soft HEAD~1

# 彻底回退，丢弃修改（慎用）
git reset --hard HEAD~1
```

## .gitignore

有些文件不需要提交（比如 `node_modules/`、`.env`），在项目根目录创建 `.gitignore` 文件：

```bash
node_modules/
dist/
.env
.DS_Store
*.log
```

## 提交信息规范

好的提交信息能让历史清晰可读。推荐格式：

```
类型: 简短描述

feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
chore:    构建/工具变更
```

示例：

```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复首页加载白屏问题"
git commit -m "docs: 更新 README 安装说明"
```

## 常用命令速查

```bash
git init                    # 初始化仓库
git clone <url>             # 克隆远程仓库
git status                  # 查看状态
git add .                   # 添加所有修改到暂存区
git commit -m "msg"         # 提交
git log --oneline           # 查看历史
git branch                  # 查看分支
git checkout -b <name>      # 创建并切换分支
git merge <branch>          # 合并分支
git push                    # 推送到远程
git pull                    # 拉取远程更新
```

## Windows 用户注意事项

### 换行符问题

Windows 用 `CRLF`（`\r\n`），macOS/Linux 用 `LF`（`\n`）。团队协作时建议统一用 LF：

```bash
git config --global core.autocrlf input
```

- macOS/Linux 设置为 `input`：提交时自动转为 LF
- Windows 设置为 `true`：检出时转为 CRLF，提交时转为 LF

### 中文文件名乱码

如果 `git status` 显示中文文件名为 `\xxx\ xxx`，执行：

```bash
git config --global core.quotepath false
```

## 小结

Git 的核心就三件事：**记录修改**（commit）、**分支开发**（branch）、**远程协作**（push/pull）。

刚开始用记住 `add → commit → push` 这个流程就够了。遇到问题随时用 `git status` 看看状态，大部分情况都能找到答案。
