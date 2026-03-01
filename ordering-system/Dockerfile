# 使用多阶段构建
# 阶段1: 构建应用
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# 复制 pom.xml 和源代码
COPY pom.xml .
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 阶段2: 运行应用
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 从构建阶段复制 JAR 文件
COPY --from=build /app/target/ordering-system-*.jar app.jar

# 暴露端口
EXPOSE 8080

# 运行应用
ENTRYPOINT ["java", "-jar", "app.jar"]

