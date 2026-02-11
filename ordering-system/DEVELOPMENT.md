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

6. ✅ **核心实体类创建**
   - 创建 Dish 实体类 (菜品)
     - 字段：id, name, categoryId, price(BigDecimal), image, description, status, createTime, updateTime
   - 创建 DiningTable 实体类 (餐桌)
     - 字段：id, tableNumber, seats, status, qrCode, createTime, updateTime
     - 唯一约束：tableNumber, qrCode
   - 创建 Order 实体类 (订单)
     - 字段：id, orderNumber, tableId, totalAmount, status, remark, createTime, updateTime
     - 表名使用 orders（避免SQL关键字冲突）
   - 创建 OrderItem 实体类 (订单明细)
     - 字段：id, orderId, dishId, dishName, dishPrice, quantity, subtotal, createTime
     - 冗余字段设计：dishName和dishPrice记录下单时的历史数据

7. ✅ **Repository层创建**
   - 创建 DishRepository 接口
   - 创建 DiningTableRepository 接口
   - 创建 OrderRepository 接口
   - 创建 OrderItemRepository 接口
   - 所有Repository继承 JpaRepository，自动获得CRUD方法
   - Spring扫描到5个Repository接口

8. ✅ **项目推送到GitHub**
   - 仓库地址：https://github.com/Hax2456/Restaruant
   - 包含MVP文档和ordering-system后端项目

### 遇到的问题及解决
1. **问题**: CategoryRepository 导入错误
   - 错误：导入了 `java.util.Locale.Category`
   - 解决：改为导入 `com.restaurant.ordering_system.entity.Category`

2. **问题**: Hibernate Dialect配置
   - 在Spring Boot 4.x中，旧的MySQL8Dialect已废弃
   - 解决：删除dialect配置，让Hibernate自动检测

### 下一步计划

#### 明天要做的事情：

1. ~~**创建其他核心实体类**~~ ✅ 已完成
   - [x] Dish (菜品)
   - [x] DiningTable (餐桌)
   - [x] Order (订单)
   - [x] OrderItem (订单明细)

2. ~~**创建对应的Repository**~~ ✅ 已完成
   - [x] DishRepository
   - [x] DiningTableRepository
   - [x] OrderRepository
   - [x] OrderItemRepository

3. **创建统一返回结果类**
   - [ ] common/Result.java (统一返回结果)
   - [ ] common/ResultCode.java (返回码枚举)
   - [ ] common/PageResult.java (分页结果，可选)

4. **创建第一个Service**
   - [ ] CategoryService (分类服务)
   - [ ] 实现基本CRUD操作
   - [ ] 添加业务逻辑验证

5. **创建第一个Controller**
   - [ ] CategoryController
   - [ ] 实现分类的增删改查API
   - [ ] 添加请求参数验证

6. **创建DTO类**
   - [ ] CategoryDTO (分类数据传输对象)
   - [ ] CategoryRequest (分类请求参数)

7. **测试API**
   - [ ] 使用 Postman 测试接口
   - [ ] 验证CRUD功能是否正常

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

### 数据库表结构（已创建）
```
restaurant_db
├── category         (菜品分类表)
├── dish            (菜品表)
├── dining_table    (餐桌表)
├── orders          (订单表)
└── order_item      (订单明细表)
```

---

## 2026-02-05 通用工具类完成

### 今日完成
1. ✅ **创建通用响应类**
   - 创建 [Result.java](ordering-system/src/main/java/com/restaurant/ordering_system/common/Result.java)（统一响应结果封装）
     - 支持泛型 `Result<T>`
     - 提供静态方法：success()、error()、build()
     - 标准格式：{code, msg, data}
   - 创建 [ResultCode.java](ordering-system/src/main/java/com/restaurant/ordering_system/common/ResultCode.java)（响应状态码枚举）
     - 定义HTTP标准码：200, 400, 401, 403, 404, 500
     - 定义业务错误码：1001-1005
     - 包含：分类、菜品、餐桌、订单相关错误
   - 创建 [PageResult.java](ordering-system/src/main/java/com/restaurant/ordering_system/common/PageResult.java)（分页结果封装）
     - 字段：records, total, size, current, pages
     - 提供静态工厂方法 of()

2. ✅ **Git提交**
   - 提交消息：feat: 添加通用响应类和分页结果类
   - 新增3个文件，181行代码

### 项目整体进度总结

#### 已完成模块（100%）
- ✅ **Entity层**（5个实体类，~200行）
  - Category（菜品分类）
  - Dish（菜品）
  - DiningTable（餐桌）
  - Order（订单）
  - OrderItem（订单明细）

- ✅ **Repository层**（5个接口，~60行）
  - CategoryRepository
  - DishRepository
  - DiningTableRepository
  - OrderRepository
  - OrderItemRepository

- ✅ **Common层**（3个工具类，~150行）
  - Result<T>（统一响应）
  - ResultCode（状态码枚举）
  - PageResult<T>（分页结果）

- ✅ **配置文件**
  - application.yml（数据库、JPA配置）
  - 启动类 OrderingSystemApplication.java

#### 后端代码统计
- **总文件数**: 15个
- **总代码量**: ~450行
- **后端完成度**: 约40%（基础层完成）

### 下一步计划

#### 第一优先级（P0 - 核心功能）

**1. Service业务层开发**（预计2-3天）
- [ ] CategoryService（分类服务）
  - 实现分类的增删改查
  - 添加业务验证（名称重复检查等）
  - 分类排序功能
- [ ] DishService（菜品服务）
  - 实现菜品的增删改查
  - 按分类查询菜品
  - 菜品上下架管理
- [ ] OrderService（订单服务）
  - 订单创建（计算总金额）
  - 订单状态更新
  - 订单查询（分页、筛选）
- [ ] DiningTableService（餐桌服务）
  - 餐桌管理
  - 二维码生成

**2. Controller控制器层开发**（预计1-2天）
- [ ] CustomerController（顾客端API）
  - GET /api/customer/categories - 获取分类列表
  - GET /api/customer/dishes - 获取菜品列表
  - POST /api/customer/orders - 提交订单
  - GET /api/customer/orders/{orderNumber} - 查询订单
- [ ] AdminController（管理端API）
  - 分类管理接口（增删改查）
  - 菜品管理接口（增删改查）
  - 订单管理接口（查询、更新状态）

**3. DTO数据传输对象**（预计0.5-1天）
- [ ] request包
  - CategoryRequest（分类请求）
  - DishRequest（菜品请求）
  - OrderSubmitRequest（订单提交）
- [ ] response包
  - CategoryResponse（分类响应）
  - DishResponse（菜品响应）
  - OrderResponse（订单响应）

**4. 全局异常处理**（预计0.5天）
- [ ] GlobalExceptionHandler
  - 统一异常拦截
  - 返回标准错误格式
- [ ] 自定义业务异常
  - BusinessException
  - ResourceNotFoundException

**5. 配置和工具类**（预计0.5天）
- [ ] WebMvcConfig（CORS跨域配置）
- [ ] 工具类
  - StringUtils（字符串工具）
  - DateUtils（日期工具）
  - OrderNumberGenerator（订单号生成器）
  - QRCodeUtils（二维码生成工具）

**6. 前端应用开发**（预计5-6天）
- [ ] 顾客端（H5/移动端）
  - 菜单展示页面
  - 购物车功能
  - 订单提交页面
  - 订单查询页面
- [ ] 管理端（PC/Web）
  - 订单管理页面
  - 菜品管理页面
  - 分类管理页面

**7. 测试与联调**（预计2天）
- [ ] 单元测试
- [ ] 集成测试
- [ ] 前后端联调
- [ ] 功能测试

#### 第二优先级（P1 - 增强功能）
- [ ] 数据统计功能
- [ ] 订单实时推送（WebSocket）
- [ ] 文件上传（菜品图片）
- [ ] API文档生成（Swagger/SpringFox）
- [ ] 数据库初始化脚本

#### 第三优先级（P2 - 优化）
- [ ] 缓存优化（Redis）
- [ ] 性能优化
- [ ] 日志完善（SLF4J）
- [ ] 监控告警
- [ ] 部署文档

### 技术架构总结

#### 当前技术栈
**后端**:
- Spring Boot 4.0.2
- Java 21.0.9 LTS
- Spring Data JPA
- Hibernate 7.2.1
- MySQL 8.0.43
- Lombok
- Maven 3.9.11

**前端**（规划中）:
- React 18.2.0
- Vite 5.0.0
- Ant Design 5.12.0（PC管理端）
- Ant Design Mobile 5.34.0（移动端）
- TypeScript 5.3.0

#### 系统架构
```
顾客端(H5) + 管理端(PC)
        ↓
   REST API (Port 8080)
        ↓
Controller Layer (待开发)
        ↓
Service Layer (待开发)
        ↓
Repository Layer (已完成)
        ↓
MySQL 8.0 (restaurant_db)
```

### 关键设计决策

1. **统一响应格式**
   - 所有API返回统一的Result<T>格式
   - 包含code、msg、data三个字段
   - 便于前端统一处理

2. **分页响应格式**
   - 使用PageResult<T>封装分页数据
   - 包含records、total、size、current、pages

3. **金额精度处理**
   - 所有金额字段使用BigDecimal
   - 数据库定义DECIMAL(10,2)

4. **时间戳管理**
   - 使用@PrePersist自动设置createTime
   - 使用@PreUpdate自动更新updateTime
   - 统一使用LocalDateTime类型

5. **冗余字段设计**
   - OrderItem表冗余存储dishName和dishPrice
   - 保证历史订单数据不受菜品更新影响

### Git提交历史
```
789db1f (HEAD -> main) feat: 添加通用响应类和分页结果类
b98fa39 (origin/main) feat: 创建核心实体类和Repository层
4e2b1f2 Initial commit: 餐厅点餐系统完整项目
```

### 开发环境信息
```bash
# 项目路径
/Users/xuhaoyang/Desktop/餐厅点餐平台/ordering-system/

# 启动命令
./mvnw spring-boot:run

# 访问地址
http://localhost:8080

# 数据库连接
jdbc:mysql://localhost:3306/restaurant_db
用户名: root
```

### 数据库表结构（已自动创建）
```
restaurant_db
├── category         (菜品分类表) - 6字段
├── dish            (菜品表) - 9字段
├── dining_table    (餐桌表) - 7字段
├── orders          (订单表) - 8字段
└── order_item      (订单明细表) - 8字段
```

---

## 2026-02-05 Service业务层完成

### 今日完成
1. ✅ **异常处理层创建**
   - 创建 `exception` 包
   - 创建 `BusinessException.java`（自定义业务异常类）
     - 继承 RuntimeException
     - 支持错误码和错误消息
     - 提供3个构造函数重载

2. ✅ **Repository层扩展**
   - 扩展 `CategoryRepository`
     - existsByName() - 检查分类名称是否存在
     - existsByNameAndIdNot() - 更新时检查名称重复（排除自己）
     - findByStatus() - 根据状态查询
     - findByStatusOrderBySortAsc() - 按状态查询并排序
   - 扩展 `DishRepository`
     - countByCategoryId() - 统计分类下的菜品数量

3. ✅ **Service业务层创建**
   - 创建 `CategoryService.java`（分类业务服务类）
   - 实现7个业务方法：
     - `create(name, sort)` - 创建分类
       - 验证名称不能为空
       - 检查名称是否重复
       - 设置默认状态为启用
     - `update(id, name, sort)` - 更新分类
       - 验证分类是否存在
       - 检查新名称是否重复（排除自己）
       - 更新分类信息
     - `delete(id)` - 删除分类
       - 验证分类是否存在
       - 检查分类下是否有菜品（有菜品不能删除）
     - `getById(id)` - 查询单个分类
       - 根据ID查询，不存在抛出异常
     - `list()` - 查询所有启用的分类
       - 只返回启用状态的分类
       - 按sort字段升序排列
     - `listAll()` - 查询所有分类
       - 不限制状态，用于管理后台
     - `updateStatus(id, status)` - 启用/禁用分类
       - 验证status值（0或1）
       - 更新分类状态

4. ✅ **事务管理**
   - 对修改数据的方法添加 `@Transactional` 注解
   - 确保数据一致性，出错自动回滚

5. ✅ **应用启动验证**
   - 编译成功：16个源文件
   - Repository扫描：成功扫描到5个JPA接口
   - 数据库连接：HikariPool启动成功
   - 应用启动：1.457秒成功启动
   - 端口：8080

### 遇到的问题及解决
1. **问题**: Repository方法放错位置
   - 错误：`countByCategoryId` 方法被放在 CategoryRepository 中
   - 原因：Category实体类没有 categoryId 字段
   - 错误信息：`No property 'categoryId' found for type 'Category'`
   - 解决：将 `countByCategoryId` 方法移到 DishRepository 中

### Service层设计亮点

1. **业务验证完整**
   - 所有方法都有完善的参数验证
   - 防止脏数据进入数据库

2. **异常处理规范**
   - 统一使用 BusinessException
   - 错误消息清晰明确

3. **事务管理**
   - 增删改操作都使用 @Transactional
   - 保证数据一致性

4. **Optional处理**
   - 使用 `orElseThrow()` 优雅处理Optional
   - 代码简洁易读

### 项目进度更新

#### 已完成模块（60%）
- ✅ **Entity层**（5个实体类）
- ✅ **Repository层**（5个接口 + 自定义查询方法）
- ✅ **Common层**（3个工具类）
- ✅ **Exception层**（1个异常类）
- ✅ **Service层**（1个服务类）← **今天完成**

#### 待完成模块（40%）
- ⏳ **Controller层**（待开发）
- ⏳ **DTO层**（待开发）
- ⏳ **全局异常处理器**（待开发）
- ⏳ **配置类**（待开发）

### 代码统计
- **总文件数**: 18个（+3）
- **总代码量**: ~650行（+200行）
- **Service层代码**: ~150行
- **后端完成度**: 约60%

### 下一步计划

**立即要做**：
1. **创建Controller层**
   - CategoryController（分类控制器）
   - 实现RESTful API接口
   - 添加请求参数验证

2. **创建DTO类**
   - CategoryRequest（分类请求DTO）
   - 用于接收前端参数

3. **测试API**
   - 使用Postman测试所有接口
   - 验证业务逻辑是否正确

**本周计划**：
- 完成 CategoryController 和 DTO
- 完成 DishService 和 DishController
- 完成全局异常处理器
- 完成所有基础API的开发和测试

---

**备注**:
- 项目采用三层架构：Controller → Service → Repository
- 使用JPA实体类自动管理数据库表结构
- 所有实体类使用 `jakarta.persistence.*` (不是 javax)
- Entity到DTO的转换在Service层完成
- 价格字段统一使用 BigDecimal 类型，避免精度问题
- 订单明细表采用冗余字段设计，保留历史价格和名称信息
- 项目GitHub地址：https://github.com/Hax2456/Restaruant
