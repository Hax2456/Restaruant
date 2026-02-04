# 餐厅点餐系统 - 开发日志

## 2026-02-04 项目初始化

### 今日完成
1. ✅ **环境搭建**
   - 安装 Java 21.0.9 (通过sdkman)
   - 安装 MySQL 8.0.43
   - 配置环境变量

2. ✅ **项目创建**
   - 使用 VSCode Spring Initializr 创建项目
   - Spring Boot 4.0.2
   - 依赖：Spring Web, Spring Data JPA, MySQL Driver, Lombok
   - Group: com.restaurant
   - Artifact: ordering-system

3. ✅ **数据库配置**
   - 创建数据库：restaurant_db
   - 配置 `application.yml` 连接MySQL
   - 设置 Hibernate ddl-auto: update

4. ✅ **项目结构搭建**
   - 创建包结构：
     - entity (实体层)
     - repository (数据访问层)
     - service (业务逻辑层)
     - controller (控制器层)
     - dto/request (请求DTO)
     - dto/response (响应DTO)
     - common (通用类)
     - config (配置类)
     - exception (异常处理)
     - utils (工具类)

5. ✅ **第一个功能实现**
   - 创建 Category 实体类 (菜品分类)
     - 字段：id, name, sort, status, createTime, updateTime
     - 使用 @PrePersist 和 @PreUpdate 自动管理时间
   - 创建 CategoryRepository 接口
     - 继承 JpaRepository<Category, Long>
   - 测试：应用成功启动，Hibernate自动管理表结构

### 遇到的问题及解决
1. **问题**: CategoryRepository 导入错误
   - 错误：导入了 `java.util.Locale.Category`
   - 解决：改为导入 `com.restaurant.ordering_system.entity.Category`

2. **问题**: Hibernate Dialect配置
   - 在Spring Boot 4.x中，旧的MySQL8Dialect已废弃
   - 解决：删除dialect配置，让Hibernate自动检测

### 下一步计划

#### 明天要做的事情：

1. **创建其他核心实体类**
   - [ ] Dish (菜品)
   - [ ] DiningTable (餐桌)
   - [ ] Order (订单)
   - [ ] OrderItem (订单明细)

2. **创建对应的Repository**
   - [ ] DishRepository
   - [ ] DiningTableRepository
   - [ ] OrderRepository
   - [ ] OrderItemRepository

3. **创建统一返回结果类**
   - [ ] common/Result.java (统一返回结果)
   - [ ] common/ResultCode.java (返回码枚举)
   - [ ] common/PageResult.java (分页结果)

4. **创建第一个Service**
   - [ ] CategoryService (分类服务)
   - 实现基本CRUD操作

5. **创建第一个Controller**
   - [ ] CategoryController
   - 实现分类的增删改查API

6. **测试API**
   - 使用 Postman 或浏览器测试接口

### 技术栈
- **后端框架**: Spring Boot 4.0.2
- **Java版本**: 21.0.9
- **数据库**: MySQL 8.0.43
- **ORM**: Hibernate 7.2.1
- **构建工具**: Maven 3.9.11
- **IDE**: VSCode

### 项目路径
```
/Users/xuhaoyang/Desktop/餐厅点餐平台/ordering-system/
```

### 运行命令
```bash
# 启动应用
./mvnw spring-boot:run

# 访问
http://localhost:8080
```

### 数据库连接信息
```
URL: jdbc:mysql://localhost:3306/restaurant_db
用户名: root
密码: [已配置在application.yml]
```

---

**备注**:
- 项目采用三层架构：Controller → Service → Repository
- 使用JPA实体类自动管理数据库表结构
- 所有实体类使用 `jakarta.persistence.*` (不是 javax)
- Entity到DTO的转换在Service层完成
