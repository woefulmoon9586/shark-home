---
title: "Git使用笔记"
date: "2025-04-10T13:50:30.000Z"
displayDate: "2025-04-10"
tags: ["Git", "笔记"]
summary: "git快速入门笔记 全局配置 设置用户信息 git config --global user.name \"woefulmoon\" git config --global user.email \"woefulmoon@163.com\" 查看配置信息 git config --list 获取Git仓库 在本地初始化一..."
draft: false
---
# git快速入门笔记

## 全局配置

### 设置用户信息

```bash
git config --global user.name "woefulmoon"
```

```bash
git config --global user.email "woefulmoon@163.com"
```

### 查看配置信息

```bash
git config --list
```

### 获取Git仓库

#### 在本地初始化一个Git仓库

1.  在任意目录下创建一个空目录（例如test1）作为我们的本地Git仓库
2.  进入这个目录中，点击右键打开Git bash窗口
3.  执行命令
    
    ```bash
    git init
    ```
    
    _如果有.git文件夹，则创建成功_

#### 从远程仓库克隆

可以通过Git提供的命令从远程仓库进行克隆，将远程仓库克隆到本地

```bash
git clone 远程Git仓库地址
```

### 基本概念

![20250410215335](/assets/blog/2025/04/1744294743-20250410215335.jpg)

```bash
git add 1.txt
```

```bash
git commit -m '新增了1.txt文件'
```

工作区文件状态 Git 工作区中的文件存在两种状态：

-   untracked 未跟踪（未被纳入版本控制）
-   tracked 已跟踪（被纳入版本控制）
    1.  Unmodified 未修改状态
    2.  Modified 已修改状态
    3.  Staged 已暂存状态

查看当前本地仓库状态

```bash
git status
```

### 本地仓库操作

```bash
git status 查看文件状态
git add 将文件的修改加入暂存区
git add .
git reset 将暂存区的文件取消暂存或者是切换到指定版本
git commit 将暂存区的文件修改提交到版本库
git log 查看日志
```

### 远程仓库操作

```bash
git remote -v 查看远程仓库
git remote add origin 添加远程仓库
git clone 从远程仓库克隆
git pull 从远程仓库拉取
git pull origin master
git push 推送到远程仓库
git push origin master
```

### 分支操作

通过git init 命令创建本地仓库时默认会创建一个master分支

```bash
git branch 列出所有本地分支
git branch -r 列出所有远程分支
git branch -a 列出所有本地分支和远程分支
git branch [name] 创建分支
git checkout [name] 切换分支
git push [shortName] [name] 推送至远程仓库分支
git merge [name] 把指定代码合并到当前分支
git branch -d [name] 删除分支
```

### 标签操作

Git 中的标签，指的是某个分支某个特定时间点的状态。通过标签，可以很方便的切换到标记时的状态 比较有代表性的是人们会使用这个功能来标记发布结点(v1.0、v1.2等)。

```bash
git tag 列出已有的标签
git tag [name] 创建标签
git push [shortName] [name] 将标签推送至远程仓库
git checkout -b [branch] [name] 检出标签
```
