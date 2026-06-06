---
title: "Java学习day01"
date: "2024-11-23T05:07:13.000Z"
displayDate: "2024-11-23"
tags: ["Java"]
summary: "引言"
draft: false
---
## 引言

Java是一种强类型、面向对象的编程语言，广泛应用于企业级应用、Android开发和互联网服务。作为学习Java的第一天，我们将从基础语法开始，探索Java的常见字面量、变量声明以及基本数据类型。本文将带你一步步了解Java编程的基础知识。

## 常见字面量与变量声明

在Java中，字面量是直接在代码中表示的值，例如数字、字符串和字符。变量则是存储数据值的容器，我们需要先声明变量，然后才能使用它们。

### 代码示例

```java
public class Day1 { public static void main(String[] args) { System.out.println("Hello World!"); printLiteral(); varDefine(); } public static void printLiteral() { int a = 1; // 整型 String b = "hello"; // 字符串 char c = 'a'; // 字符 float d = 1.1f; // 浮点型 double e = 1.2; // 浮点型 boolean f = true; // 布尔型 // 特殊字符 \\n 换行 \\t tab缩进 System.out.println(a); System.out.println(b); System.out.println(c); System.out.println(d); System.out.println(e); System.out.println(f); } public static void varDefine() { // 为什么要用变量记住数据呢？可以提高处理数据的灵活性与维护性 int a = 1; System.out.println("================================"); System.out.println(a); System.out.println(a); System.out.println(a); System.out.println(a); System.out.println(a); System.out.println("================================"); // 研究变量的特点：变量里的数据是可以替换的 int age = 18; age = 19; System.out.println(age); age = age + 1; System.out.println(age); System.out.println("================================"); // 需求：微信钱包目前有9.9，发出去了5元，又收到6元，请实时输出钱包金额 double money = 9.9; money = money - 5; money = money + 6; System.out.println(money); System.out.println("================================"); } }
```
## 数据存储原理：二进制与ASCII码

在计算机中，所有的数据都是以二进制形式存储的。ASCII码是字符的编码方式，每个字符对应一个唯一的数字。

### 代码示例

```java
public static void dataStorage() { char ch = 'A'; // 65的二进制 System.out.println(ch + 1); // 66 char ch2 = 'a'; // 97的二进制 System.out.println(ch2 + 1); // 98 int i1 = 0B01100001; // 97的二进制 System.out.println(i1); int i2 = 0141; // 97的八进制 System.out.println(i2); int i3 = 0x61; // 97的十六进制 int i4 = 0xFA; // 250的十六进制 System.out.println(i3); }
```
## 基本数据类型

Java有8种基本数据类型，包括整型（byte, short, int, long）、浮点型（float, double）、字符型（char）和布尔型（boolean）。

### 代码示例

```java
public static void intType() { byte b = 127; System.out.println(b); short s = 32767; System.out.println(s); int i = 2147483647; System.out.println(i); long l = 9223372036854775807L; System.out.println(l); } public static void floatType() { float f = 1.1f; System.out.println(f); double d = 1.2; System.out.println(d); } public static void charType() { char c = 'a'; System.out.println(c); } public static void booleanType() { boolean b = true; System.out.println(b); }
```
## 标识符与关键字

在Java中，标识符用于命名变量、方法、类和包，而关键字是Java语言预定义的，有特殊含义的词。

### 命名规范

-   变量名：小驼峰命名法、全小写、下划线连接、常量全大写、常量下划线连接
-   方法名：小驼峰命名法、全小写、下划线连接
-   类名：大驼峰命名法、全大写、下划线连接
