---
title: "Java基础入门项目一：员工管理系统"
date: "2025-03-29T10:04:08.000Z"
displayDate: "2025-03-29"
tags: ["Java"]
summary: "Java Swing 员工管理系统项目介绍"
draft: false
---
# Java Swing 员工管理系统项目介绍

我要分享一个基于Java Swing开发的员工管理系统。这个系统具有完整的用户登录、员工信息管理功能，界面友好，操作简单。

### 项目亮点

-   基于Java Swing开发的GUI桌面应用
-   代码结构清晰
-   使用Lombok简化Java Bean代码
-   实现了完整的CRUD功能
-   友好的用户交互界面
-   包含登录验证和用户注册功能

## 1\. 系统架构

### 1.1 核心类说明

系统主要由以下几个核心类组成：

-   **Employee.java** - 员工实体类
-   **User.java** - 用户实体类
-   **Login_UI.java** - 登录界面
-   **Register_UI.java** - 注册界面
-   **EmployeeInfoUI.java** - 主界面
-   **AddEmployeeUI.java** - 添加员工界面
-   **EditEmployeeUI.java** - 编辑员工界面

### 1.2 实体类设计

系统的实体类使用了Lombok简化代码：

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    int id;
    String name;
    String sex;
    int age;
    String department;
    String position;
    String entryDate;
    double salary;
    String phone;
    String education;
    String note;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String username;
    private String password;
    private String nickname;
}

## 2\. 功能模块

### 2.1 用户认证模块

系统提供了完整的用户登录和注册功能：

// 登录验证逻辑
loginButton.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());
        boolean isUsernameExist = false;
        for (User user : allUser) {
            if (user.getUsername().equals(username)) {
                isUsernameExist = true;
                if (user.getPassword().equals(password)) {
                    // 登录成功逻辑
                    EmployeeInfoUI employeeInfoUI = new EmployeeInfoUI(user.getNickname());
                    employeeInfoUI.setVisible(true);
                    dispose();
                    break;
                } else {
                    JOptionPane.showMessageDialog(Login_UI.this, "密码错误");
                    break;
                }
            }
        }
        if (!isUsernameExist) {
            JOptionPane.showMessageDialog(Login_UI.this, "用户名不存在");
        }
    }
});

### 2.2 员工管理模块

系统支持完整的员工信息CRUD操作：

-   **添加员工** - 通过表单添加新员工信息
-   **编辑员工** - 双击或右键编辑现有员工信息
-   **删除员工** - 右键删除不需要的员工记录
-   **搜索员工** - 根据关键词快速定位员工

// 员工信息表格渲染方法
public void renderTable() {
    tableModel.setRowCount(0);
    for(Employee employee:employees) {
        tableModel.addRow(new Object\[\]{
            employee.getId(),
            employee.getName(),
            employee.getSex(),
            employee.getAge(),
            employee.getDepartment(),
            employee.getPosition(),
            employee.getEntryDate(),
            employee.getSalary(),
            employee.getPhone(),
            employee.getEducation(),
            employee.getNote()
        });
    }
}

## 3\. 界面设计

### 3.1 登录界面

简洁美观的登录界面，包含用户名密码输入框和登录/注册按钮：

// 登录界面初始化代码
public Login_UI() {
    setTitle("登录");
    setSize(400, 300);
    setLocationRelativeTo(null);
    setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    
    // 主面板使用GridBagLayout实现精细布局
    JPanel mainPanel = new JPanel(new GridBagLayout());
    // 省略布局代码...
}

### 3.2 主界面

主界面采用表格形式展示员工信息，顶部有搜索框和添加按钮：

// 主界面初始化
public EmployeeInfoUI(String nickname) {
    setTitle("欢迎 " + nickname + " 登录员工管理系统");
    setSize(1000, 600);
    
    // 创建表格模型
    String\[\] columnNames = {"工号", "姓名", "性别", "年龄", "部门", "职位", "入职时间", "工资", "手机号", "学历", "备注"};
    tableModel = new DefaultTableModel(columnNames, 0);
    
    // 添加上方面板（搜索框和按钮）
    JPanel topPanel = new JPanel();
    topPanel.add(searchField);
    topPanel.add(searchButton);
    topPanel.add(addButton);
    add(topPanel, BorderLayout.NORTH);
}

### 3.3 右键菜单

为员工表格添加了右键菜单，提供快速的编辑和删除功能：

// 右键菜单实现
JPopupMenu popupMenu = new JPopupMenu();
JMenuItem editMenuItem = new JMenuItem("编辑");
editMenuItem.addActionListener(e -> editEmployee());
JMenuItem deleteMenuItem = new JMenuItem("删除");
deleteMenuItem.addActionListener(e -> deleteEmployee());

employeeTable.addMouseListener(new MouseAdapter() {
    @Override
    public void mouseClicked(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e)) {
            popupMenu.show(employeeTable, e.getX(), e.getY());
        }
    }
});

## 4\. 技术细节

### 4.1 数据存储

系统目前使用内存存储数据（ArrayList）：

// 数据存储在ArrayList中
private static ArrayList employees = new ArrayList<>();

// 添加员工方法
public void addEmployee(Employee employee) {
    employees.add(employee);
    renderTable();
}

### 4.2 UI组件使用

系统充分利用了Swing提供的各种组件：

-   JTable - 展示员工数据
-   JTextField/JPasswordField - 输入框
-   JComboBox - 下拉选择框
-   JButton - 各种功能按钮
-   JPopupMenu - 右键菜单
-   JOptionPane - 消息提示框

### 4.3 布局管理

系统采用多种布局管理器实现精美界面：

-   GridBagLayout - 登录界面精细布局
-   BorderLayout - 主界面整体布局
-   FlowLayout - 按钮面板布局
-   GridLayout - 表单类界面布局

## 6\. 总结

这是一个功能完善、界面友好的员工管理系统项目，涵盖了GUI开发中常用技术的应用，包括：

-   Swing组件的综合使用
-   事件处理机制
-   表格数据展示与操作
-   表单设计与验证
-   界面布局管理

项目适合作为Java GUI开发的参考案例。

[项目源码](https://github.com/woefulmoon9586/EmployeeManage)
