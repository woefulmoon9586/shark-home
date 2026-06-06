---
title: "java学习day07"
date: "2025-03-23T07:53:20.000Z"
displayDate: "2025-03-23"
tags: ["Java"]
summary: "今天的学习内容非常丰富，涉及类中的代码块、内部类、匿名内部类、Lambda 表达式、String、ArrayList、GUI 编程以及事件处理。 一、类中的成分：代码块 1. 静态代码块 静态代码块用 static 修饰，属于类，在类加载时自动执行一次，通常用于初始化静态变量。 示例代码： public clas..."
draft: false
---
今天的学习内容非常丰富，涉及类中的代码块、内部类、匿名内部类、Lambda 表达式、String、ArrayList、GUI 编程以及事件处理。

## 一、类中的成分：代码块

### 1\. 静态代码块

静态代码块用 `static` 修饰，属于类，在类加载时自动执行一次，通常用于初始化静态变量。

#### 示例代码：

```

public class CodeDemo1 {
    public static String schoolName;
    public static String[] cards = new String[54];

    // 静态代码块
    static {
        System.out.println("===静态代码块执行了===");
        schoolName = "黑马程序员";
        cards[0] = "A";
        cards[1] = "2";
        cards[2] = "3";
    }

    public static void main(String[] args) {
        System.out.println("===main方法执行了===");
        System.out.println("schoolName = " + schoolName);
        System.out.println(Arrays.toString(cards));
    }
}
```

#### 运行结果：

```

===静态代码块执行了===
===main方法执行了===
schoolName = 黑马程序员
[A, 2, 3, null, null, ..., null]
```

**说明：**

-   静态代码块优先于 `main` 方法执行，用于初始化静态资源。

### 2\. 实例代码块

实例代码块没有 `static` 修饰，属于对象，每次创建对象时都会执行一次，用于初始化实例资源。

#### 示例代码：

```

public class CodeDemo2 {
    private String name;
    private String[] direction = new String[4];

    // 实例代码块
    {
        System.out.println("=========实例代码块执行了=========");
        name = "itheima";
        direction[0] = "北";
        direction[1] = "南";
        direction[2] = "东";
        direction[3] = "西";
    }

    public static void main(String[] args) {
        System.out.println("=======main方法执行了==========");
        new CodeDemo2();
        new CodeDemo2();
        new CodeDemo2();
    }
}
```

#### 运行结果：

```

=======main方法执行了==========
=========实例代码块执行了=========
=========实例代码块执行了=========
=========实例代码块执行了=========
```

**说明：**

-   实例代码块在每次创建对象时都会执行，优先于构造方法。

## 二、内部类

### 1\. 成员内部类

成员内部类是定义在类中的类，可以访问外部类的成员。

#### 示例代码：

```

public class Outer {
    private String name = "外部类";

    // 成员内部类
    class Inner {
        public void show() {
            System.out.println("访问外部类的 name：" + name);
        }
    }

    public static void main(String[] args) {
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
        inner.show();
    }
}
```

#### 运行结果：

```

访问外部类的 name：外部类
```

### 2\. 静态内部类

静态内部类用 `static` 修饰，只能访问外部类的静态成员。

#### 示例代码：

```

public class Outer {
    private static String name = "外部类";

    // 静态内部类
    static class Inner {
        public void show() {
            System.out.println("访问外部类的 name：" + name);
        }
    }

    public static void main(String[] args) {
        Outer.Inner inner = new Outer.Inner();
        inner.show();
    }
}
```

#### 运行结果：

```

访问外部类的 name：外部类
```

### 3\. 局部内部类

局部内部类定义在方法中，作用域仅限于该方法。

#### 示例代码：

```

public class Outer {
    public void method() {
        class Inner {
            public void show() {
                System.out.println("局部内部类");
            }
        }

        Inner inner = new Inner();
        inner.show();
    }

    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.method();
    }
}
```

#### 运行结果：

```

局部内部类
```

### 4\. 匿名内部类

匿名内部类是一种没有名字的内部类，通常用于简化代码。

#### 示例代码：

```

public abstract class Animal {
    public abstract void cry();
}

public class Test {
    public static void main(String[] args) {
        // 使用匿名内部类
        Animal a = new Animal() {
            @Override
            public void cry() {
                System.out.println("喵喵喵-----!!~~");
            }
        };
        a.cry();
    }
}
```

#### 运行结果：

```

喵喵喵-----!!~~
```

## 三、GUI 编程与事件处理

### 1\. 创建 GUI 窗口

使用 `JFrame` 创建一个简单的窗口。

#### 示例代码：

```

import javax.swing.*;

public class JFrameDemo1 {
    public static void main(String[] args) {
        JFrame jf = new JFrame("登录窗口");
        jf.setSize(400, 300);
        jf.setLocationRelativeTo(null);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        jf.add(panel);

        JButton btn = new JButton("登录");
        panel.add(btn);

        jf.setVisible(true);
    }
}
```

### 2\. 事件处理

通过 `ActionListener` 监听按钮点击事件。

#### 示例代码：

```

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Test {
    public static void main(String[] args) {
        JFrame jf = new JFrame("登录窗口");
        jf.setSize(400, 300);
        jf.setLocationRelativeTo(null);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        jf.add(panel);

        JButton btn = new JButton("登录");
        panel.add(btn);

        // 添加事件监听器
        btn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                JOptionPane.showMessageDialog(jf, "登录成功！");
            }
        });

        jf.setVisible(true);
    }
}
```

## 四、总结

今天主要学习了类中的代码块、内部类、匿名内部类、GUI 编程以及事件处理。通过这些知识点，我们可以更好地组织代码，编写出简洁高效的 Java 程序。接下来，我会继续深入学习 Java 的更多高级特性，欢迎大家持续关注！
