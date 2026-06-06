---
title: "Java学习day05"
date: "2024-12-18T13:22:55.000Z"
displayDate: "2024-12-18"
tags: ["Java"]
summary: "引言 在Java的学习中，第五天我们深入探讨了继承和多态的概念。以下是对这些概念的总结以及一些代码案例，帮助我们更好地理解和应用这些知识点。 继承 1. 认识继承 继承允许一个类（子类）继承另一个类（父类）的属性和方法。 代码案例： [cc lang=\"java\"]class Animal { void eat(..."
draft: false
---
## 引言

在Java的学习中，第五天我们深入探讨了继承和多态的概念。以下是对这些概念的总结以及一些代码案例，帮助我们更好地理解和应用这些知识点。

## 继承

### 1\. 认识继承

继承允许一个类（子类）继承另一个类（父类）的属性和方法。 **代码案例：** \[cc lang="java"\]class Animal { void eat() { System.out.println("Eating"); } } class Dog extends Animal { void bark() { System.out.println("Barking"); } } public class TestInheritance { public static void main(String\[\] args) { Dog myDog = new Dog(); myDog.eat(); // 继承自Animal类 myDog.bark(); // Dog类特有的方法 } }\[/cc\]

### 2\. 权限修饰符

权限修饰符控制类成员的可见性。 **代码案例：** \[cc lang="java"\]class Parent { public void publicMethod() {} protected void protectedMethod() {} void defaultMethod() {} private void privateMethod() {} } class Child extends Parent { public void test() { publicMethod(); // 可以访问 protectedMethod(); // 可以访问 defaultMethod(); // 可以访问 // privateMethod(); // 编译错误，不能访问私有方法 } }\[/cc\]

### 3\. 继承后的特点

子类继承父类的所有属性和方法（除了构造器）。 **代码案例：** \[cc lang="java"\]class Parent { int number = 5; } class Child extends Parent { int number = 10; void display() { System.out.println("Parent's number: " + number + " Child's number: " + Parent.number); } } public class TestInheritanceFeatures { public static void main(String\[\] args) { Child c = new Child(); c.display(); } }\[/cc\]

### 4\. 方法重写 - 应用场景 - toString方法

方法重写允许子类改变父类方法的行为。 **代码案例：** \[cc lang="java"\]class Animal { public String toString() { return "I am an animal"; } } class Dog extends Animal { public String toString() { return "I am a dog"; } } public class TestOverride { public static void main(String\[\] args) { Animal myDog = new Dog(); System.out.println(myDog); // 输出：I am a dog } }\[/cc\]

### 5\. 子类构造器的特点 - 应用场景

子类构造器需要调用父类构造器。 **代码案例：** \[cc lang="java"\]class Parent { Parent() { System.out.println("Parent constructor"); } } class Child extends Parent { Child() { System.out.println("Child constructor"); } } public class TestConstructors { public static void main(String\[\] args) { new Child(); // 输出：Parent constructor Child constructor } }\[/cc\]

### 6\. 构造器用this()调用兄弟构造器

在同一类中，构造器可以调用其他构造器。 **代码案例：** \[cc lang="java"\]class Example { int x; Example() { this(10); // 调用带参数的构造器 } Example(int x) { this.x = x; } } public class TestThisConstructor { public static void main(String\[\] args) { Example e = new Example(); System.out.println(e.x); // 输出：10 } }\[/cc\]

## 多态

### 7\. 认识多态

多态允许不同类的对象对同一消息做出响应。 **代码案例：** \[cc lang="java"\]class Animal { void makeSound() { System.out.println("Some sound"); } } class Dog extends Animal { void makeSound() { System.out.println("Woof"); } } public class TestPolymorphism { public static void main(String\[\] args) { Animal myAnimal = new Animal(); Animal myDog = new Dog(); myAnimal.makeSound(); // 输出：Some sound myDog.makeSound(); // 输出：Woof } }\[/cc\]

### 8\. 多态的好处和存在的问题

多态提供了代码的灵活性和可扩展性，但也带来了一些挑战。

### 9\. 多态下的类型转换问题

在多态中，类型转换是一个常见问题。 **代码案例：** \[cc lang="java"\]class Animal { void makeSound() { System.out.println("Some sound"); } } class Dog extends Animal { void makeSound() { System.out.println("Woof"); } } public class TestTypeCasting { public static void main(String\[\] args) { Animal myAnimal = new Animal(); Animal myDog = new Dog(); myAnimal.makeSound(); // 输出：Some sound ((Dog)myDog).makeSound(); // 强制类型转换，输出：Woof } }\[/cc\]

### 10\. 综合实战 - 支付模块

通过一个支付模块的实战案例，我们可以将继承和多态的概念应用到实际问题中。 **代码案例：** \[cc lang="java"\]package top.woefulmoon.extendsdemo.demo; import java.util.Scanner; public class Test { public static void main(String\[\] args) { //目标：加油站支付小程序 //1.创建卡片类，以便创建金卡或者银卡对象，封装车主的数据 //2、定义一个卡片父类：Card 定义金卡和银卡的共同属性和方法 //3、定义一个金卡类，继承Card类；金卡必须重写消费方法（八折优惠） //4、定义一个银卡类，继承Card类；银卡必须重写消费方法（九折优惠） //5、办一张金卡：创建金卡对象，交给一个独立的业务（支付机）来完成：存款，消费 Card goldcard = new GoldCard("好HD131","小明","123456789",5000); goldcard.deposit(500); pay(goldcard); //6、办一张银卡：创建金卡对象，交给一个独立的业务（支付机）来完成：存款，消费 Card slivercard = new SliverCard("看P41D3","小红","987654321",1000); pay(slivercard); } //支付机：用一个方法来刷卡 public static void pay(Card c){ System.out.println("请刷卡，请您输入当前消费的金额："); Scanner sc = new Scanner(System.in); double money = sc.nextDouble(); c.consume(money); } } \[/cc\] \[cc lang="java"\] package top.woefulmoon.extendsdemo.demo; import lombok.AllArgsConstructor; import lombok.Data; import lombok.NoArgsConstructor; //lombok可以实现为类自动添加getter setter方法 无参数构造器，toString方法等 @Data //@Data注解可以自动为类添加getter setter方法 无参构造器 toString方法等 @AllArgsConstructor @NoArgsConstructor public class Card { private String carID; private String name; private String phone; private double money; //预存金额 public void deposit(double money){ this.money += money; } //消费金额 public void consume(double money){ this.money -= money; } } \[/cc\] \[cc lang="java"\]package top.woefulmoon.extendsdemo.demo; // public class GoldCard extends Card{ public GoldCard(String card, String name, String phone, double money) { super(card, name, phone, money); } @Override public void consume(double money) { System.out.println("您当前金卡消费了"+money+"元"); System.out.println("优惠后的价格：" + money \* 0.8); if (getMoney() < money \* 0.8) { System.out.println("您的余额不足，消费失败"); return; } //更新金卡的账户余额 setMoney(getMoney()-money\*0.8); //判断消费如果大于200，调用一个独有的功能，打印洗车票 if(money \* 0.8 >= 200){ printTicket(); }else{ System.out.println("本次消费未达到消费200，无需打印洗车票"); } } public void printTicket(){ System.out.println("您本次消费了，请拿好您的洗车票"); } } \[/cc\] \[cc lang="java"\] package top.woefulmoon.extendsdemo.demo; public class SliverCard extends Card{ public SliverCard(String card, String name, String phone, double money) { super(card, name, phone, money); } @Override public void consume(double money) { System.out.println("您当前银卡消费了" + money + "元"); System.out.println("优惠后的价格：" + money \* 0.9); if (getMoney() < money \* 0.9) { System.out.println("您的余额不足，消费失败"); return; } //更新金卡的账户余额 setMoney(getMoney() - money \* 0.9); } } \[/cc\]
