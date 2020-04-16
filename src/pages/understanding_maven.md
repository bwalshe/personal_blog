---
title: "Minimum Maven"
date: "2020-04-15"
featuredImage: "../images/maven.png"
---
No one ever chooses to start working with Apache Maven - it's one of those things you get stuck with because of factors outside your control. I think Maven is probably one of the most frustrating aspects for people moving over to the Java world - the errors are cryptic, the documentation is dry, and the whole thing just seems way more complicated than it should be. I think part of the problem is that most people's first encounter with Maven is when they start working on an existing project, with an existing Maven config that has lots of moving parts. It's a lot to take in at once. In this post I'm going to try and keep it simple. I'll give a bit of background on Maven and talk about the absolute minimum Maven project you could create.

## Why is Maven so complicated?
If you come from a Python background, turning java code into a running application can seem a lot more effort than it needs to be. Part of this is because Java makes fewer assumptions about the environment it is going to run in - this means that you need to supply this information when building the the app. 

Maven was created as a way of simplifying and standardising the way that this build information is specified. The most obvious benefit it provides is package management - automatically pulling the libraries you need from the web - but that is only part of what it does. Maven provides a very flexible way of packaging code up so it can be used elsewhere. It can be used to build desktop applications, components that run as part of a web-service, android applications, and all sorts of other forms of applications. It can be used to compile Scala, Clojure, different versions of java than the one running. It can run your unit tests and deploy your artefacts to remote locations.

Maven achieves this flexibility by having most components implemented as plugins. When you configure it you specify which plugins to use and how each of *those* plugins are configured in turn. The two main plugins you will encounter are the **compiler** plugin and the **surefire** - the unit-test plugin. You might also have to deal with the **resources** plugin if your application or tests use data files, and some variant of packaging plugin if you are creating fat jars, executable jars or even fat executable jars.

## Configuring a Maven Project
Maven is configured using a file called `pom.xml`. When you run the `mvn` command, it will automatically load this file and use it. For full details of the contents of `pom.xml` please see [this document](http://maven.apache.org/pom.html). It's well worth the read and contains exciting words like "Jarmageddon".

### Minimum Config
According to the link above, the the absolute minimum you can have in your `pom.xml` is:
* `modelVersion` - This specifies the type of POM you are using, it **has** to be `4.0.0`. Don't confuse this with the version of your project.
* `groupId` - Some unique group that this project belongs to. This doesn't have to have any relationship to your java packages (it doesn't even need to be dot notation) but it helps if they are similar.
* `artifactId`- The name of your project.
* `version` - The version number of your project.

The `groupId`, `artifactId`, `version` values are referred to as the Maven Coordinates of the project. They are the values that people will use to locate your project if you release it into the wild - they're like latitude and longitude for software components.

Here is a complete, minimal `pom.xml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>io.github.bwalshe</groupId>
    <artifactId>mini-project</artifactId>
    <version>1.0</version>
</project>
```

It's pretty useless, but you could actually get this to package up a project, provided you have no dependencies and you are OK with the default settings for all of your Maven plugins.

## Packaging a project
For a laugh, let's try using the minimal config to package up a very simple project. By default, Maven's compiler plugin will expect your source files to be under `src/main/java` and your test files to be under `src/test/java` - which is pretty reasonable. It's also going to expect them to be Java 5 - which is pretty unreasonable. If there are no issues with the compilation, the build process moves on to the test phase which is handled by the Surefire plugin.

Surefire is going to run every function that starts with the word "test", in any class in the test directory that contains the word "Test", and will stop the build process if any of these functions throw an exception. If there are no issues with the tests then the Jar plugin will package all of the classes in the main directory into a `.jar` file.

OK, set your files up with the following structure:
```
.
├── pom.xml
└── src
    ├── main
    |   └── java
    |       └── HelloWorld.java
    └── test
        └── java
            └── DummyTest.java
```

In the file `HelloWorld.java` paste the following:
```java
public final class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

In the file `DummyTest.java`, copy in the following:
```Java
public class DummyTest {
    public void testOne() {
        System.out.println("This test does nothing.");
    }
    public void testTwo() {
        System.out.println("This test also does nothing.");
    }
}
```

Let's run it...

```bash{height: 200px; overflow: scroll}
brian@DESKTOP:~/maven_mini_example$ mvn package
...
```

I actually got an error here. I have OpenJDK 11 on my system, and that won't compile anything earlier than Java 6. Maven's default is to compile Java 5, so they're not going to work together. The correct thing would be to set the Java version on the Maven compiler plugin, but I don't want to touch that just now, so let's just use OpenJDK 8 temporarily.

```
brian@DESKTOP:~/maven_mini_example$ JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/ mvn package
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building mini-example 1.0
[INFO] ------------------------------------------------------------------------
[INFO]
...
...
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running DummyTest 
This test does nothing. 
This test also does nothing. 
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.012 sec 

Results :

Tests run: 2, Failures: 0, Errors: 0, Skipped: 0

[INFO]
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ mini-example ---
[INFO] Building jar: /home/brian/maven_mini_example/target/mini-example-1.0.jar 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.523 s
[INFO] Finished at: 2020-04-15T22:39:32+01:00
[INFO] Final Memory: 17M/304M
[INFO] ------------------------------------------------------------------------
```

That was pretty verbose (I left out a few of the more boring lines) but you can see that after compiling everything, it ran both of our tests which just printed some text to the console. They didn't really test anything, but they didn't throw any exceptions - so as far as the Surefire plugin is concerned, they were fine.

After running the tests without any failures, you can see that a file named `mini-example-1.0.jar` was produced in the `target` directory. Note that the name of the jar file is a combination of the `artifactId` and `version` values we set in the POM. 

Let's see what the jar contains...

```
brian@DESKTOP:~/maven_mini_example$ jar tf target/mini-example-1.0.jar
META-INF/
META-INF/MANIFEST.MF
HelloWorld.class
META-INF/maven/
META-INF/maven/org.codehaus.mojo/
META-INF/maven/org.codehaus.mojo/mini-example/
META-INF/maven/org.codehaus.mojo/mini-example/pom.xml
META-INF/maven/org.codehaus.mojo/mini-example/pom.properties
```

There are a lot of extra files in there, but among them you should be able to see `HelloWorld.class`. We can run it from the jar
```
brian@DESKTOP:~/maven_mini_example$ java -cp target/mini-example-1.0.jar HelloWorld
Hello World!
```
We could have also just run the tests or run the `HelloWorld` class directly using Maven without having to package it, but this is something I will have to cover in another article.

## Summary
The only information that you **have** to give to Maven is the `groupId`, `artifactId` and `version` of your project. Everything else needed to package up a project has a default value, but it's almost certain that you will want to change those defaults. You will at least want to change the Java standard being used, and probably add some dependencies. (I didn't do that in this article.)

When you package a project, by default Maven goes through several phases. These include:
* Compiling the source code
* Running the test cases
* Packaging the classes into a jar

If any of the phases fails then the build process stops. Also, you don't have to run all the phases, you could just compile or run the tests.