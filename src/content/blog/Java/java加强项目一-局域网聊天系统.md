---
title: "Java加强项目一：局域网聊天系统"
date: "2025-04-25T07:57:41.000Z"
displayDate: "2025-04-25"
tags: ["Java"]
summary: "Java局域网聊天系统开发详解 项目概述 本项目实现了一个基于Java Swing和Socket编程的局域网聊天室系统，具备以下功能： 用户通过昵称登录聊天室 实时显示在线用户列表 支持多用户同时聊天 消息广播功能 美观的聊天界面设计 [系统架构图] 系统架构 本系统采用C/S（客户端/服务器）架构，主要分为两部..."
draft: false
---
body {<br /> font-family: 'Microsoft YaHei', Arial, sans-serif;<br /> line-height: 1.6;<br /> color: #333;<br /> max-width: 1000px;<br /> margin: 0 auto;<br /> padding: 20px;<br /> background-color: #f9f9f9;<br /> }<br /> h1, h2, h3 {<br /> color: #2c3e50;<br /> }<br /> h1 {<br /> border-bottom: 2px solid #3498db;<br /> padding-bottom: 10px;<br /> }<br /> h2 {<br /> border-left: 5px solid #3498db;<br /> padding-left: 10px;<br /> margin-top: 30px;<br /> }<br /> code {<br /> background-color: #f0f0f0;<br /> padding: 2px 5px;<br /> border-radius: 3px;<br /> font-family: Consolas, Monaco, 'Andale Mono', monospace;<br /> }<br /> pre {<br /> background-color: #282c34;<br /> color: #abb2bf;<br /> padding: 15px;<br /> border-radius: 5px;<br /> overflow-x: auto;<br /> line-height: 1.5;<br /> }<br /> .note {<br /> background-color: #e7f5ff;<br /> border-left: 4px solid #3498db;<br /> padding: 10px;<br /> margin: 10px 0;<br /> border-radius: 0 4px 4px 0;<br /> }<br /> .warning {<br /> background-color: #fff3bf;<br /> border-left: 4px solid #ffd43b;<br /> padding: 10px;<br /> margin: 10px 0;<br /> border-radius: 0 4px 4px 0;<br /> }<br /> .image-container {<br /> text-align: center;<br /> margin: 20px 0;<br /> }<br /> img {<br /> max-width: 100%;<br /> height: auto;<br /> border: 1px solid #ddd;<br /> border-radius: 4px;<br /> padding: 5px;<br /> background-color: white;<br /> }<br /> table {<br /> border-collapse: collapse;<br /> width: 100%;<br /> margin: 20px 0;<br /> }<br /> th, td {<br /> border: 1px solid #ddd;<br /> padding: 8px;<br /> text-align: left;<br /> }<br /> th {<br /> background-color: #f2f2f2;<br /> }<br />  

# Java局域网聊天系统开发详解

## 项目概述

本项目实现了一个基于Java Swing和Socket编程的局域网聊天室系统，具备以下功能：

-   用户通过昵称登录聊天室
-   实时显示在线用户列表
-   支持多用户同时聊天
-   消息广播功能
-   美观的聊天界面设计

\[系统架构图\]

## 系统架构

本系统采用C/S（客户端/服务器）架构，主要分为两部分：

| 组件 | 功能 |
| --- | --- |
| **客户端** | 
-   LoginWindow.java：登录界面
-   ChatWindow.java：聊天主界面
-   ClientChatThread.java：消息接收线程

 |
| **服务端** | 

-   ChatServer.java：主服务器
-   SocketChatThread.java：客户端连接处理线程

 |

**通信协议：**客户端和服务端通过自定义的简单协议进行通信，使用整数标识消息类型(1表示用户登录，2表示聊天消息)。

## 客户端实现详解

### 1\. 登录界面 (LoginWindow.java)

登录界面采用Swing构建，包含昵称输入框和登录按钮：

```
public LoginWindow() {
    setTitle("聊天室登录");
    setSize(400, 250);
    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    setLocationRelativeTo(null); // 居中显示
    
    // 昵称输入框
    nicknameField = new JTextField(15);
    nicknameField.setFont(new Font("微软雅黑", Font.PLAIN, 14));
    
    // 登录按钮事件处理
    loginButton.addActionListener(e -> {
        String nickname = nicknameField.getText().trim();
        if (nickname.isEmpty()) {
            JOptionPane.showMessageDialog(this, "昵称不能为空！", "提示", JOptionPane.WARNING_MESSAGE);
            return;
        }
        // 建立连接并发送昵称
        socket = new Socket(Constant.SERVER_IP, Constant.SERVER_PORT);
        dos = new DataOutputStream(socket.getOutputStream());
        dos.writeInt(1); // 类型1表示登录消息
        dos.writeUTF(nickname);
        new ChatWindow(nickname, socket).setVisible(true);
        dispose(); // 关闭登录窗口
    });
}
```

### 2\. 聊天主界面 (ChatWindow.java)

聊天主界面采用JSplitPane实现左右分栏布局：

-   左侧：消息展示区
-   右侧：在线用户列表
-   底部：消息输入框和发送按钮

**UI亮点：**

1.  支持多行消息显示
2.  消息自动滚动到底部
3.  鼠标悬停显示完整消息
4.  美观的用户列表显示

### 3\. 消息处理 (ClientChatThread.java)

独立的线程处理来自服务器的消息：

```
public void run() {
    DataInputStream dis = new DataInputStream(is);
    int type;
    while (true) {
        type = dis.readInt();
        switch (type) {
            case 1: // 更新用户列表
                jf.updateUserList();
                break;
            case 2: // 新消息
                String msg = dis.readUTF();
                jf.addMsg(msg);
                break;
        }
    }
}
```

## 服务端实现详解

### 1\. 主服务器 (ChatServer.java)

服务端使用多线程处理多个客户端连接：

```
public class ChatServer {
    public static final Map<Socket, String> userMap = new HashMap<>();
    
    public static void main(String[] args) {
        try {
            ServerSocket ss = new ServerSocket(Constant.PORT);
            while (true) {
                Socket socket = ss.accept();
                new SocketChatThread(socket).start(); // 为每个连接创建线程
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 2\. 客户端线程处理 (SocketChatThread.java)

每个客户端连接由一个独立线程处理：

```
public void run() {
    DataInputStream dis = new DataInputStream(socket.getInputStream());
    int type;
    while (true) {
        type = dis.readInt();
        switch (type) {
            case 1: // 新用户登录
                nickname = dis.readUTF();
                ChatServer.userMap.put(socket, nickname);
                toUpdataUserList(); // 更新所有用户的在线列表
                break;
            case 2: // 新消息
                String msg = dis.readUTF();
                toBroadcast(nickname, msg); // 广播消息给所有用户
                break;
        }
    }
}
```

### 3\. 消息广播 (toBroadcast)

服务端实现消息广播功能：

```
private void toBroadcast(String nickname, String msg) {
    // 添加时间戳
    String resmsg = nickname + " " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
             + "\n" + msg;
    // 遍历所有在线用户发送消息
    for (Socket socket : ChatServer.userMap.keySet()) {
        DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
        dos.writeInt(2); // 消息类型2
        dos.writeUTF(resmsg);
    }
}
```

## 核心技术分析

### 1\. 线程安全处理

系统涉及多个线程操作共享的`userMap`，使用`synchronized`确保线程安全：

```
private synchronized void toUpdataUserList() throws Exception {
    // 用户列表更新操作
}
```

### 2\. UI与网络线程分离

网络消息更新UI通过`SwingUtilities.invokeLater()`解决线程安全问题：

```
public void addMsg(String msg) {
    SwingUtilities.invokeLater(() -> {
        messageModel.addElement(msg);
        messageList.ensureIndexIsVisible(messageModel.getSize() - 1);
    });
}
```

### 3\. 消息协议设计

使用简单的整数标识消息类型：

| 类型 | 描述 |
| --- | --- |
| 1 | 用户登录/用户列表更新 |
| 2 | 聊天消息 |

## 运行效果展示

### 1\. 登录界面

![登录界面截图](/assets/blog/2025/04/1745568120-LoginWindow.png)

### 2\. 聊天主界面

![聊天界面截图](/assets/blog/2025/04/1745568117-ChatWindow.png)

## 扩展思路

-   添加私聊功能
-   支持文件传输
-   增加聊天表情支持
-   添加消息历史记录
-   增加数据库支持

## 总结

本局域网聊天系统实现了基本的即时通讯功能，涵盖了Swing UI设计、多线程编程、Socket通信等Java核心技术。 项目亮点：

1.  简洁直观的用户界面
2.  高效的消息处理机制
3.  严谨的线程安全处理
4.  良好的扩展性

**学习收获：**通过本项目，可以深入理解Java网络编程技术。

[项目源码](https://github.com/woefulmoon9586/LanTalk)
