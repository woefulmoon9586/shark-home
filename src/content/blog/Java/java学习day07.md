---
title: "Java学习day06"
date: "2025-02-25T08:59:18.000Z"
displayDate: "2025-02-25"
tags: ["Java"]
summary: "引入"
draft: false
---
# 引入

在最近的学习中，我系统地掌握了 Java 的几个重要知识点，包括 `final` 关键字、单例设计模式、枚举、抽象类、接口等。为了巩固这些知识，我通过大量的代码实例进行了练习，并最终将这些知识应用到了一个智能家居控制系统的项目中。在这篇博客中，我将分享我的学习过程和代码实例，希望对大家有所帮助。

## 1\. final 关键字

`final` 关键字可以修饰变量、方法和类，表示它们是“最终的”，不能被修改或继承。

### 代码实例

```java
// 常量
final int MAX_VALUE = 100;

// 最终方法
class Parent {
    final void display() {
        System.out.println("这是父类的最终方法");
    }
}

// 最终类
final class FinalClass {
    void show() {
        System.out.println("这是最终类的方法");
    }
}
```
## 2\. 单例设计模式

单例模式确保一个类只有一个实例，并提供一个全局访问点。

### 代码实例

```java
public class Singleton {
    private static final Singleton instance = new Singleton();
    private Singleton() {} // 私有构造器
    public static Singleton getInstance() {
        return instance; // 全局访问点
    }
    public void showMessage() {
        System.out.println("这是单例模式的一个实例");
    }
}
```
## 3\. 枚举

枚举是一种特殊的类，用于定义一组常量。

### 代码实例

```java
enum Status {
    ON, OFF // 定义两个状态
}

class Device {
    private Status status;
    public void setStatus(Status status) {
        this.status = status;
    }
    public void printStatus() {
        System.out.println("设备状态：" + status);
    }
}
```
## 4\. 抽象类

抽象类是一种不能实例化的类，通常用于定义子类的通用行为。它可以包含抽象方法（没有具体实现的方法）和具体方法。

### 设计思想

抽象类的核心思想是**定义模板**。它提供了一个基础的框架，子类必须实现抽象方法，同时可以复用父类中已经定义好的方法。

### 代码实例

```java
// 定义抽象类
abstract class Animal {
    // 抽象方法
    abstract void makeSound();
  
    // 具体方法
    void sleep() {
        System.out.println("睡觉中...");
    }
}

// 子类实现抽象方法
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("汪汪汪！");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("喵喵喵！");
    }
}
```
### 使用场景

-   当多个类有共同的行为，但具体实现不同时，可以将这些行为定义在抽象类中。
-   抽象类适合作为基类，提供一个统一的模板。

## 5\. 接口

接口是一种契约，定义了类必须实现的方法。从 Java 8 开始，接口还可以包含默认方法和静态方法。

### 设计思想

接口的核心思想是**定义行为规范**。它不关心具体的实现，而是强调类必须具备哪些能力。

### 代码实例

```java
// 定义接口
interface Switch {
    void press(); // 抽象方法
    default void connect() { // 默认方法
        System.out.println("设备已连接");
    }
    static void printVersion() { // 静态方法
        System.out.println("版本号：1.0");
    }
}

// 类实现接口
class TV implements Switch {
    private boolean status = false;
    @Override
    public void press() {
        status = !status;
        System.out.println("电视机状态：" + (status ? "开" : "关"));
    }
}

class Lamp implements Switch {
    private boolean status = false;
    @Override
    public void press() {
        status = !status;
        System.out.println("灯状态：" + (status ? "开" : "关"));
    }
}

// 测试代码
public class Test {
    public static void main(String[] args) {
        Switch tv = new TV();
        tv.press(); // 切换电视机状态
        tv.connect(); // 调用默认方法
        Switch.printVersion(); // 调用静态方法
    }
}
```
### 使用场景

-   当需要定义一组行为规范，但具体的实现由不同的类完成时，适合使用接口。
-   接口可以实现多继承，一个类可以实现多个接口。

## 6\. 抽象类 vs 接口

为了更好地理解抽象类和接口的区别，我总结了以下几个方面：

| 特性 | 抽象类 | 接口 |
| --- | --- | --- |
| 实例化 | 不能实例化 | 不能实例化 |
| 方法类型 | 可以包含抽象方法和具体方法 | 只能包含抽象方法、默认方法和静态方法 |
| 多继承 | 不支持多继承 | 支持多继承（一个类可以实现多个接口） |
| 设计思想 | 定义模板 | 定义行为规范 |
| 使用场景 | 适合作为基类，提供通用行为 | 适合定义行为规范，强调灵活性 |

### 对比代码实例

```java
// 抽象类
abstract class Vehicle {
    abstract void start();
    void stop() {
        System.out.println("已停止");
    }
}

// 接口
interface Electric {
    void charge();
}

// 子类继承抽象类并实现接口
class Car extends Vehicle implements Electric {
    @Override
    void start() {
        System.out.println("汽车启动");
    }
    @Override
    public void charge() {
        System.out.println("电动车充电中");
    }
}
```
## 7\. 项目实战：智能家居控制系统

在学习完上述知识点后，我将它们应用到了一个智能家居控制系统中。以下是项目的完整源代码：

### 类设计

-   `JD`类：是所有家电的父类，实现了`Switch`接口。
-   `TV`、`WashMachine`、`Lamp`、`Air`类：继承`JD`，代表具体的家电。
-   `SmartHomeControl`类：单例模式，控制所有家电的开关状态。

### 完整代码

```java
@Data
public class JD implements Switch {
    private String name;
    private boolean status; // false 默认是关闭
    @Override
    public void press() {
        status = !status; // 切换设备状态
    }
}

public class TV extends JD {
    public TV(String name, boolean status) {
        super(name, status);
    }
}

public class WashMachine extends JD {
    public WashMachine(String name, boolean status) {
        super(name, status);
    }
}

public class Lamp extends JD {
    public Lamp(String name, boolean status) {
        super(name, status);
    }
}

public class Air extends JD {
    public Air(String name, boolean status) {
        super(name, status);
    }
}

public class SmartHomeControl {
    private static final SmartHomeControl smartHomeControl = new SmartHomeControl();
    private SmartHomeControl() {}
    public static SmartHomeControl getInstance() {
        return smartHomeControl;
    }
    public void control(JD jd) {
        jd.press();
    }
    public void printAllStatus(JD[] jds) {
        for (int i = 0; i < jds.length; i++) {
            System.out.println((i + 1) + "," + jds[i].getName() + "状态目前是：" + (jds[i].isStatus() ? "开" : "关"));
        }
    }
}

public static void main(String[] args) {
    JD[] jds = new JD[] {
        new TV("小米电视", true),
        new WashMachine("美的洗衣机", false),
        new Lamp("欧灯", true),
        new Air("美的空调", false)
    };
    SmartHomeControl smartHomeControl = SmartHomeControl.getInstance();
    while (true) {
        smartHomeControl.printAllStatus(jds);
        System.out.println("请输入您要操作的设备序号：");
        Scanner sc = new Scanner(System.in);
        String command = sc.next();
        switch (command) {
            case "1": smartHomeControl.control(jds[0]); break;
            case "2": smartHomeControl.control(jds[1]); break;
            case "3": smartHomeControl.control(jds[2]); break;
            case "4": smartHomeControl.control(jds[3]); break;
            case "exit": System.out.println("退出系统！"); return;
            default: System.out.println("输入有误！");
        }
    }
}
```
## 总结

以上就是关于final关键字，单例，枚举，抽象以及接口的学习
