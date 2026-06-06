---
title: "Java学习day02"
date: "2024-11-24T05:30:44.000Z"
displayDate: "2024-11-24"
tags: ["Java"]
summary: "引言 继昨日的基础语法学习之后，今天我们将进一步探索Java的方法、类型转换、输入输出以及运算符的高级使用。通过这些知识点的学习，我们将能够进行更复杂的编程任务，并最终实现一个综合实战项目——计算身体健康指数（BMI）和基础代谢率（BMR）。 基础语法-方法详解 Java中的方法（Method）是一段完成特定功能..."
draft: false
---
## 引言

继昨日的基础语法学习之后，今天我们将进一步探索Java的方法、类型转换、输入输出以及运算符的高级使用。通过这些知识点的学习，我们将能够进行更复杂的编程任务，并最终实现一个综合实战项目——计算身体健康指数（BMI）和基础代谢率（BMR）。

## 基础语法-方法详解

Java中的方法（Method）是一段完成特定功能的代码块。每个方法都有一个返回类型，可以是基本数据类型、对象类型，或者是void（无返回值）。

### 代码示例：BMI计算方法

\[cc lang="java"\]public static double calculateBMI(double height, double weight) { return weight / (height \* height); }\[/cc\]

## 基础语法-方法的注意事项

在编写方法时，需要注意以下几点：

1.  方法的返回类型必须与方法体内返回语句的值类型一致。
2.  方法的参数列表必须正确匹配调用时提供的参数。
3.  使用`void`作为返回类型的方法不应该有返回语句。

## 基础语法-自动-强制类型转换

Java支持自动类型转换（从小范围类型到大范围类型）和强制类型转换（从大范围类型到小范围类型）。自动类型转换不需要程序员显式指定，而强制类型转换需要使用类型转换语法。

### 代码示例：自动类型转换

\[cc lang="java"\]int a = 10; long b = a; // 自动类型转换\[/cc\]

## 基础语法-表达式的自动类型提升

在表达式中，如果存在不同类型的操作数，Java会自动将较小的数据类型转换为较大的数据类型，以确保计算的准确性。

## 基础语法-输入-输出

Java中的输入输出操作主要通过`Scanner`类和`System.out`对象来实现。`Scanner`类用于从控制台读取输入，而`System.out`用于向控制台输出。

### 代码示例：用户输入处理

\[cc lang="java"\]import java.util.Scanner; public class InputExample { public static void main(String\[\] args) { Scanner scanner = new Scanner(System.in); System.out.print("请输入一个数字："); int number = scanner.nextInt(); System.out.println("你输入的数字是：" + number); scanner.close(); } }\[/cc\]

## 运算符-基本运算符-自增自减运算符

Java提供了自增（`++`）和自减（`--`）运算符，它们可以用于快速增加或减少变量的值。

### 代码示例：自增自减运算符

\[cc lang="java"\]int count = 0; count++; // count 变为 1 count--; // count 变为 0\[/cc\]

## 运算符-赋值运算符-三元运算符

Java中的赋值运算符用于将值赋给变量，而三元运算符是一种简洁的条件表达式，用于在两个值之间选择一个。

### 代码示例：三元运算符

\[cc lang="java"\]int max = (a > b) ? a : b;\[/cc\]

## 运算符-逻辑运算符

逻辑运算符用于执行布尔逻辑运算，包括与（`&&`）、或（`||`）和非（`!`）。

### 代码示例：逻辑运算符

\[cc lang="java"\]boolean isAdult = age >= 18; boolean isEmployed = isAdult && hasJob;\[/cc\]

## 综合实战-身体健康指数计算

结合以上知识点，我们可以进行一个综合实战项目——计算身体健康指数（BMI）和基础代谢率（BMR）。

### 代码示例：BMI和BMR计算

\[cc lang="java"\]import java.util.Scanner; public class HealthIndexCalculator { public static void main(String\[\] args) { Scanner scanner = new Scanner(System.in); System.out.print("请输入年龄："); int age = scanner.nextInt(); System.out.print("请输入身高（米）："); double height = scanner.nextDouble(); System.out.print("请输入体重（千克）："); double weight = scanner.nextDouble(); System.out.print("请输入性别（男/女）："); String sex = scanner.next(); System.out.println("BMI：" + calculateBMI(height, weight)); System.out.println("BMR：" + calculateBMR(height, weight, age, sex)); scanner.close(); } public static double calculateBMI(double height, double weight) { return weight / (height \* height); } public static double calculateBMR(double height, double weight, int age, String sex) { double bmr; if ("男".equals(sex)) { bmr = 13.7 \* weight + 5 \* height - 6.8 \* age + 66; } else { bmr = 9.6 \* weight + 1.8 \* height - 4.7 \* age + 655; } return bmr; } }\[/cc\]
