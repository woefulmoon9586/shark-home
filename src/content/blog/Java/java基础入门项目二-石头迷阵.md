---
title: "Java基础入门项目二：石头迷阵"
date: "2025-03-29T10:16:23.000Z"
displayDate: "2025-03-29"
tags: ["Java"]
summary: "Java Swing 石头迷阵游戏开发详解"
draft: false
---
# Java Swing 石头迷阵游戏开发详解

今天我要向大家介绍基于Java Swing开发的经典数字拼图游戏——石头迷阵。这是一款有趣又烧脑的游戏，玩家需要通过移动数字方块来恢复初始的有序状态。 ![石头迷阵游戏截图](/assets/blog/2025/03/1743243636-stone-maze-game.png)

### 游戏特色

-   经典的4×4数字拼图游戏
-   使用键盘方向键控制移动
-   自动计步功能记录玩家移动次数
-   随机生成可解的游戏初始状态
-   简洁直观的游戏界面
-   包含重新开始游戏和退出游戏的菜单选项

## 1\. 游戏实现原理

### 1.1 游戏数据模型

游戏使用一个4×4的二维数组来存储当前数字方块的状态，其中数字0表示空白格：

private int\[\]\[\] maze = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12},
    {13, 14, 15, 0}
};
private int x = 3, y = 3;  // 记录空白格的位置

### 1.2 游戏目标

玩家需要通过移动数字方块，将打乱的数组恢复到最初的有序状态：

private int\[\]\[\] WINmaze = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12},
    {13, 14, 15, 0}
};

### 1.3 游戏初始状态生成

游戏采用了一种可靠的初始化方法，确保了初始状态是可解的：

private void newInitmaze() {
    for (int i = 0; i < 1000; i++) {
        int select = (int) (Math.random() \* 4);
        switch (select) {
            case 0: moveDown(); break;
            case 1: moveUp(); break;
            case 2: moveLeft(); break;
            case 3: moveRight(); break;
        }
    }
    count = 0;  // 重置步数计数器
}

## 2\. 游戏核心功能实现

### 2.1 键盘控制移动

游戏通过键盘监听器实现方向键控制数字方块的移动：

this.addKeyListener(new KeyAdapter() {
    @Override
    public void keyPressed(KeyEvent e) {
        int keyCode = e.getKeyCode();
        if (keyCode == KeyEvent.VK_UP) {
            moveUp();
        }
        else if (keyCode == KeyEvent.VK_DOWN) {
            moveDown();
        }
        else if (keyCode == KeyEvent.VK_LEFT) {
            moveLeft();
        }
        else if (keyCode == KeyEvent.VK_RIGHT) {
            moveRight();
        }
    }
});

### 2.2 移动逻辑实现

以"向上移动"为例，以下是移动逻辑的具体实现：

private void moveUp() {
    if(x != 3) {  // 确保空白格不在最下面一行
        maze\[x\]\[y\] = maze\[x+1\]\[y\];  // 将下方的数字移到空白格
        maze\[x+1\]\[y\] = 0;  // 下方变为空白格
        x++;  // 更新空白格位置
        count++;  // 增加步数
    }
    initImage();  // 刷新界面
}

### 2.3 胜利条件判断

每当玩家移动后，系统会检查当前状态是否达到胜利条件：

private boolean isWin() {
    for (int i = 0; i < maze.length; i++) {
        for (int j = 0; j < maze\[i\].length; j++) {
            if (maze\[i\]\[j\] != WINmaze\[i\]\[j\]) {
                return false;
            }
        }
    }
    return true;
}

## 3\. 游戏界面设计

### 3.1 游戏主界面

游戏界面主要由数字方块图片和背景图片组成，使用绝对布局定位：

private void initImage() {
    this.getContentPane().removeAll();
    if (isWin()) {
        // 显示胜利图片
        JLabel Winlabel = new JLabel();
        Winlabel.setIcon(new ImageIcon("image/win.png"));
        Winlabel.setBounds(100, 200, 270, 90);
        this.add(Winlabel);
    }
    
    // 绘制所有数字方块
    for (int i = 0; i < maze.length; i++) {
        for (int j = 0; j < maze\[i\].length; j++) {
            String imageName = maze\[i\]\[j\] + ".png";
            JLabel label = new JLabel();
            label.setIcon(new ImageIcon("image/" + imageName));
            label.setBounds(100 \* j + 20, 100 \* i + 105, 100, 100);
            this.add(label);
        }
    }
    
    // 添加背景和步数显示
    JLabel bgLabel = new JLabel();
    bgLabel.setIcon(new ImageIcon("image/background.png"));
    bgLabel.setBounds(0, 0, 465, 540);
    this.add(bgLabel);
    
    JLabel stepsLabel = new JLabel("步数：" + count);
    stepsLabel.setBounds(0, 0, 100, 30);
    this.add(stepsLabel);
    
    this.repaint();
}

### 3.2 游戏菜单

游戏提供了简单的菜单功能：

private void initMenu() {
    JMenuBar menuBar = new JMenuBar();
    JMenu menu = new JMenu("游戏");
    
    JMenuItem restart = new JMenuItem("重新开始");
    restart.addActionListener(e -> {
        this.newInitmaze();
        this.initImage();
    });
    
    JMenuItem close = new JMenuItem("关闭");
    close.addActionListener(e -> dispose());
    
    menu.add(restart);
    menu.add(close);
    menuBar.add(menu);
    this.setJMenuBar(menuBar);
}

## 4\. 游戏运行效果

### 4.1 游戏界面

游戏启动后显示如下初始界面： ![游戏初始界面](/assets/blog/2025/03/1743243636-stone-maze-game.png)

### 4.2 胜利画面

当玩家成功完成了拼图，游戏会显示胜利画面： ![游戏胜利界面](/assets/blog/2025/03/1743243637-stone-maze-win.png)

## 5\. 项目扩展思路

### 可能的扩展方向

-   添加难度选择（3×3、4×4、5×5等）
-   实现计时功能
-   添加最佳成绩记录
-   支持图片拼图模式
-   添加提示功能
-   实现撤消功能

## 6\. 总结

这款石头迷阵游戏完整展示了Java Swing GUI开发的核心技术要点，包括：

-   二维数组的数据组织与操作
-   键盘事件处理
-   Swing组件（JFrame、JLabel、JMenu等）的综合使用
-   游戏状态的自动检测与响应
-   图片资源的加载与显示
-   绝对布局的应用

通过这个小项目，可以学习和掌握Java游戏开发的基本思路。项目代码简洁明了，适合作为Java GUI开发的入门参考。

[项目源码](https://github.com/woefulmoon9586/stone-maze)
