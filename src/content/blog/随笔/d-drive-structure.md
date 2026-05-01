---
title: "Windows 开发者的 D 盘文件结构设计"
date: 2026-05-01
tags: ["Windows", "效率", "随笔"]
summary: "告别 C 盘爆满，给开发工具和项目一个整洁的家。"
draft: false
---

## 为什么要整理 D 盘？

Windows 默认把什么都往 C 盘塞——软件装在 `C:\Program Files`，项目放在桌面，各种缓存也在 C 盘。时间一长，C 盘飘红，系统卡顿。

把开发相关的文件统一放在 D 盘，不仅省空间，还能让目录结构更清晰，重装系统时也不容易丢东西。

## 推荐目录结构

```
D:\
├── Code\                       # 代码仓库（Git 项目）
│   ├── personal\               # 个人项目
│   ├── learning\               # 学习项目
│   └── work\                   # 工作项目（如果有）
│
├── Project\                    # 项目资源（文档、设计稿、参考资料）
│
├── Program\                    # 开发环境和工具
│   ├── Git\                    # Git 安装目录
│   ├── VS Code\                # VS Code 安装目录
│   ├── Node\                   # Node.js（nvm-windows 管理）
│   ├── Java\                   # JDK 安装目录
│   ├── Python\                 # Python 安装目录
│   ├── nvm\                    # nvm-windows 管理的 Node 版本
│   ├── npm\                    # npm 全局包和缓存
│   ├── Maven\                  # Maven 本地仓库
│   └── Docker\                 # Docker 数据目录
│
├── Installed\                  # 非开发软件安装（浏览器、办公软件等）
│
├── Software\                   # 软件安装包（下载的 .exe、.msi 备份）
│
├── Note\                       # 笔记和文档
│
├── Files\                      # 常用文件（工作文档、PDF 等）
│
├── Store\                      # 归档存储（不常用但要留着的东西）
│
└── Tmp\                        # 临时文件（定期清理）
```

## 为什么要这样分？

**Code 放源代码**：所有 Git 项目都在这里，按用途分文件夹。和 `Project` 分开，`Code` 里只有代码，`Project` 放项目相关的文档和资源。

**Program 放开发环境**：所有开发工具和运行时环境集中在这里，路径统一好找，重装系统时备份这个文件夹就能恢复开发环境。

**Installed 放普通软件**：把开发软件和日常软件分开，不会混在一起找不到。

**Software 存安装包**：下载的安装包留一份备份，重装系统时不用重新下载。

**Tmp 放临时文件**：各种临时下载、解压、测试的东西放这里，定期清理不心疼。

## 配合前面的教程

如果按之前的教程来，安装时选择目录：

| 工具 | 安装到 |
|------|--------|
| Git | `D:\Program\Git` |
| VS Code | `D:\Program\VS Code` |
| nvm-windows | `D:\Program\nvm` |
| Node.js | `D:\Program\nvm\v20.x.x`（nvm 自动管理） |
| npm 全局包 | `D:\Program\npm` |

### 设置 npm 全局目录

安装好 Node.js 后，把 npm 全局包也挪到 D 盘：

```bash
npm config set prefix "D:\Program\npm"
npm config set cache "D:\Program\npm-cache"
```

### 设置 Maven 本地仓库

在 Maven 的 `settings.xml` 里指定：

```xml
<localRepository>D:\Program\Maven\repository</localRepository>
```

## 不需要移动的东西

- **系统文件**（Windows、驱动）：老老实实放 C 盘
- **用户配置文件**（`.ssh`、`.gitconfig`）：保持默认位置就好
- **AppData**：很多软件的配置在这里，不建议动

## 小建议

- 路径尽量用英文，避免中文和空格（少踩坑）
- 不要在 Workspace 里嵌套太多层，两级够用
- 定期清理 `Tmp` 和 `Program` 下的缓存（npm cache、Maven 仓库），它们会悄悄吃掉很多空间

整理好目录结构，开发体验会顺畅很多。至少不会再遇到「C 盘空间不足」的焦虑了。
