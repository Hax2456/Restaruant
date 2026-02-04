# 面馆点餐系统 MVP 设计方案

> 项目名称：面馆智能点餐系统
> 版本：v1.0 MVP
> 创建日期：2026-02-03
> 技术栈：React + Spring Boot + MySQL

---

## 目录

1. [项目概述](#1-项目概述)
2. [开发环境配置](#2-开发环境配置)
3. [核心功能需求](#3-核心功能需求)
4. [技术架构](#4-技术架构)
5. [数据库设计](#5-数据库设计)
6. [API接口设计](#6-api接口设计)
7. [前端设计](#7-前端设计)
8. [后端设计](#8-后端设计)
9. [项目结构](#9-项目结构)
10. [开发计划](#10-开发计划)
11. [部署方案](#11-部署方案)
12. [风险与应对](#12-风险与应对)

---

## 1. 项目概述

### 1.1 项目背景
为面馆提供一套简单高效的数字化点餐解决方案，替代传统纸质菜单和人工点餐方式，提升点餐效率，减少人力成本。

### 1.2 项目目标
- 顾客可通过移动设备自助浏览菜单并下单
- 后厨实时接收订单，高效处理
- 简化点餐流程，提升顾客体验
- MVP阶段专注核心功能，快速上线验证

### 1.3 目标用户
- **主要用户**：到店顾客（使用手机扫码点餐）
- **次要用户**：后厨人员、店铺管理员

### 1.4 核心价值
- 减少顾客等待时间
- 降低点餐错误率
- 提高翻台率
- 数字化订单管理

---

## 2. 开发环境配置

### 2.1 当前环境
```
操作系统：macOS (Apple Silicon)
Node.js：v24.10.0
npm：11.6.0
Java：OpenJDK 21.0.10
Maven：3.9.11
```

### 2.2 推荐工具版本

#### 前端开发
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "antd": "^5.12.0",
  "antd-mobile": "^5.34.0",
  "vite": "^5.0.0",
  "typescript": "^5.3.0"
}
```

#### 后端开发
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.2</version>
</parent>

<java.version>21</java.version>
```

#### 数据库
- MySQL 8.0+
- 安装命令：`brew install mysql`

#### IDE推荐
- 前端：VS Code
- 后端：IntelliJ IDEA Community Edition

---

## 3. 核心功能需求

### 3.1 顾客端功能（移动端优先）

#### 3.1.1 浏览菜单
- 按分类展示菜品（面食、小菜、饮料等）
- 显示菜品图片、名称、价格、描述
- 标识停售/售罄状态
- 支持搜索菜品

#### 3.1.2 购物车管理
- 添加/删除菜品
- 调整数量
- 实时计算总价
- 显示菜品缩略信息

#### 3.1.3 提交订单
- 输入桌号（必填）
- 添加备注（选填，如"不要辣"）
- 确认订单信息
- 显示订单号

#### 3.1.4 订单查询
- 输入订单号查看状态
- 显示订单详情
- 实时状态更新（待处理→制作中→已完成）

### 3.2 后厨/管理端功能（PC端）

#### 3.2.1 订单管理
- 实时接收新订单（声音+视觉提醒）
- 订单列表展示（按时间排序）
- 订单状态筛选
- 更新订单状态
- 查看订单详情

#### 3.2.2 菜品管理
- 菜品列表（支持分页）
- 添加新菜品
- 编辑菜品信息
- 上架/下架菜品
- 删除菜品

#### 3.2.3 分类管理
- 分类列表
- 添加/编辑/删除分类
- 调整分类排序

#### 3.2.4 数据统计（可选）
- 今日订单数
- 今日营业额
- 热门菜品排行

### 3.3 功能优先级

| 功能模块 | 优先级 | 开发周期 |
|---------|--------|---------|
| 菜品分类展示 | P0 | 1天 |
| 购物车功能 | P0 | 1天 |
| 提交订单 | P0 | 1天 |
| 订单状态管理 | P0 | 1天 |
| 菜品管理 | P0 | 2天 |
| 订单查询 | P1 | 0.5天 |
| 数据统计 | P2 | MVP后迭代 |

---

## 4. 技术架构

### 4.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                    客户端层                          │
│  ┌──────────────┐          ┌──────────────┐        │
│  │  顾客端(H5)   │          │  管理端(Web)  │        │
│  │   React      │          │    React     │        │
│  └──────────────┘          └──────────────┘        │
└────────────┬───────────────────────┬────────────────┘
             │                       │
             │    HTTP/HTTPS (REST)  │
             │                       │
┌────────────┴───────────────────────┴────────────────┐
│                   API网关层                          │
│            Spring Boot (Port: 8080)                 │
│    ┌─────────────────────────────────────┐         │
│    │          Controller Layer            │         │
│    └─────────────────┬───────────────────┘         │
│    ┌─────────────────┴───────────────────┐         │
│    │          Service Layer               │         │
│    └─────────────────┬───────────────────┘         │
│    ┌─────────────────┴───────────────────┐         │
│    │       Repository Layer (JPA)         │         │
│    └─────────────────┬───────────────────┘         │
└──────────────────────┴─────────────────────────────┘
                       │
┌──────────────────────┴─────────────────────────────┐
│                  数据持久层                          │
│               MySQL 8.0 (Port: 3306)               │
└─────────────────────────────────────────────────────┘
```

### 4.2 技术选型理由

#### 前端：React + Vite
- **React 18**：成熟稳定，组件化开发
- **Vite**：构建速度快，开发体验好
- **Ant Design Mobile**：适合移动端的UI组件库
- **Ant Design**：管理端PC组件库

#### 后端：Spring Boot 3.4.2
- **最新稳定版**：支持Java 21 LTS长期支持版本
- **性能优化**：虚拟线程支持，性能更好
- **开发效率高**：约定大于配置
- **生态成熟**：丰富的starter组件
- **易于部署**：内嵌Tomcat，打成jar直接运行
- **原生镜像**：支持GraalVM原生镜像，启动更快

#### 数据库：MySQL 8.0
- **轻量级**：适合中小型应用
- **成熟稳定**：广泛使用，资料丰富
- **易于部署**：macOS上brew一键安装
- **成本低**：开源免费

### 4.3 数据流转

```
顾客点餐流程：
浏览菜单 → 添加购物车 → 提交订单 → 后端生成订单号 → 保存数据库 → 返回订单信息

后厨处理流程：
接收订单列表 → 查看订单详情 → 更新订单状态 → 数据库状态变更 → 前端实时刷新
```

---

## 5. 数据库设计

### 5.1 ER图

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Category   │         │    Dish     │         │   Orders    │
│  (分类表)    │1───────n│   (菜品表)   │n───────1│  (订单表)    │
└─────────────┘         └─────────────┘         └─────────────┘
                                                        │1
                                                        │
                                                        │n
                                                ┌─────────────┐
                                                │ OrderDetail │
                                                │ (订单明细表) │
                                                └─────────────┘
```

### 5.2 表结构设计

#### 5.2.1 分类表 (category)
```sql
CREATE TABLE `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `sort` INT DEFAULT 0 COMMENT '排序字段，数字越小越靠前',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品分类表';
```

**字段说明：**
- `id`：主键，自增
- `name`：分类名称，如"招牌面食"、"凉菜"、"饮料"
- `sort`：排序字段，用于前端展示顺序
- `status`：启用状态，便于临时隐藏分类

#### 5.2.2 菜品表 (dish)
```sql
CREATE TABLE `dish` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格（元）',
  `image` VARCHAR(500) DEFAULT NULL COMMENT '图片URL',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '菜品描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-停售，1-在售',
  `sort` INT DEFAULT 0 COMMENT '排序字段',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';
```

**字段说明：**
- `category_id`：关联分类表
- `price`：使用DECIMAL类型避免浮点精度问题
- `image`：图片URL，可存放OSS路径或本地路径
- `status`：在售/停售状态

#### 5.2.3 订单表 (orders)
```sql
CREATE TABLE `orders` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_number` VARCHAR(50) NOT NULL COMMENT '订单号',
  `table_number` VARCHAR(20) NOT NULL COMMENT '桌号',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` TINYINT DEFAULT 1 COMMENT '订单状态：1-待处理，2-制作中，3-已完成，4-已取消',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '订单备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_number` (`order_number`),
  INDEX `idx_create_time` (`create_time`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

**字段说明：**
- `order_number`：订单号，格式建议：`yyyyMMddHHmmss + 4位随机数`
- `table_number`：桌号，支持字符串（如"A01"）
- `status`：订单状态流转
- `remark`：顾客备注，如"不要香菜"

#### 5.2.4 订单明细表 (order_detail)
```sql
CREATE TABLE `order_detail` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `dish_id` BIGINT NOT NULL COMMENT '菜品ID',
  `dish_name` VARCHAR(100) NOT NULL COMMENT '菜品名称（冗余存储）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '购买时单价（冗余存储）',
  `quantity` INT NOT NULL COMMENT '数量',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_order_id` (`order_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';
```

**字段说明：**
- `dish_name`、`price`：冗余存储，避免菜品修改后历史订单信息错乱
- `amount`：小计 = price × quantity
- 级联删除：订单删除时自动删除明细

### 5.3 初始化数据

```sql
-- 插入默认分类
INSERT INTO `category` (`name`, `sort`, `status`) VALUES
('招牌面食', 1, 1),
('特色小菜', 2, 1),
('饮料酒水', 3, 1);

-- 插入示例菜品
INSERT INTO `dish` (`category_id`, `name`, `price`, `description`, `status`, `sort`) VALUES
(1, '红烧牛肉面', 28.00, '精选牛腩，慢炖3小时，汤浓肉烂', 1, 1),
(1, '酸菜肉丝面', 22.00, '东北酸菜，酸爽开胃', 1, 2),
(1, '番茄鸡蛋面', 18.00, '新鲜番茄，营养健康', 1, 3),
(2, '五香牛肉', 15.00, '卤制牛肉，香而不腻', 1, 1),
(2, '凉拌黄瓜', 8.00, '清爽开胃', 1, 2),
(3, '可乐', 5.00, '冰镇可乐', 1, 1),
(3, '王老吉', 6.00, '罐装凉茶', 1, 2);
```

### 5.4 索引设计说明

- **主键索引**：所有表的`id`字段
- **唯一索引**：订单号`order_number`
- **普通索引**：
  - 分类排序：`category.sort`
  - 菜品分类：`dish.category_id`
  - 菜品状态：`dish.status`
  - 订单状态：`orders.status`
  - 订单时间：`orders.create_time`（用于排序查询）
  - 订单详情：`order_detail.order_id`

---

## 6. API接口设计

### 6.1 接口规范

#### 6.1.1 请求格式
- **Content-Type**: `application/json`
- **字符编码**: `UTF-8`

#### 6.1.2 响应格式（统一封装）
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**状态码说明：**
- `200`：成功
- `400`：请求参数错误
- `404`：资源不存在
- `500`：服务器内部错误

#### 6.1.3 分页格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],
    "total": 100,
    "current": 1,
    "size": 10
  }
}
```

### 6.2 顾客端接口

#### 6.2.1 获取分类列表
```
GET /api/customer/categories
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "招牌面食",
      "sort": 1
    },
    {
      "id": 2,
      "name": "特色小菜",
      "sort": 2
    }
  ]
}
```

#### 6.2.2 获取菜品列表
```
GET /api/customer/dishes?categoryId=1
```

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| categoryId | Long | 否 | 分类ID，不传则查询全部 |

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "红烧牛肉面",
      "price": 28.00,
      "image": "/images/dish/001.jpg",
      "description": "精选牛腩，慢炖3小时",
      "status": 1
    }
  ]
}
```

#### 6.2.3 提交订单
```
POST /api/customer/orders
```

**请求体：**
```json
{
  "tableNumber": "A01",
  "remark": "不要香菜",
  "items": [
    {
      "dishId": 1,
      "dishName": "红烧牛肉面",
      "price": 28.00,
      "quantity": 2
    },
    {
      "dishId": 3,
      "dishName": "可乐",
      "price": 5.00,
      "quantity": 1
    }
  ]
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "下单成功",
  "data": {
    "orderId": 1001,
    "orderNumber": "20260203143520001",
    "amount": 61.00,
    "createTime": "2026-02-03 14:35:20"
  }
}
```

#### 6.2.4 查询订单详情
```
GET /api/customer/orders/{orderNumber}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderNumber": "20260203143520001",
    "tableNumber": "A01",
    "amount": 61.00,
    "status": 2,
    "statusText": "制作中",
    "remark": "不要香菜",
    "createTime": "2026-02-03 14:35:20",
    "items": [
      {
        "dishName": "红烧牛肉面",
        "price": 28.00,
        "quantity": 2,
        "amount": 56.00
      }
    ]
  }
}
```

### 6.3 管理端接口

#### 6.3.1 获取订单列表（分页）
```
GET /api/admin/orders?status=1&page=1&size=10
```

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| status | Integer | 否 | 订单状态筛选 |
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页数量，默认10 |

**响应示例：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": 1001,
        "orderNumber": "20260203143520001",
        "tableNumber": "A01",
        "amount": 61.00,
        "status": 1,
        "statusText": "待处理",
        "createTime": "2026-02-03 14:35:20"
      }
    ],
    "total": 50,
    "current": 1,
    "size": 10
  }
}
```

#### 6.3.2 更新订单状态
```
PUT /api/admin/orders/{id}/status
```

**请求体：**
```json
{
  "status": 2
}
```

**响应示例：**
```json
{
  "code": 200,
  "message": "状态更新成功",
  "data": null
}
```

#### 6.3.3 获取菜品列表（分页）
```
GET /api/admin/dishes?page=1&size=10&categoryId=1
```

#### 6.3.4 添加菜品
```
POST /api/admin/dishes
```

**请求体：**
```json
{
  "categoryId": 1,
  "name": "担担面",
  "price": 25.00,
  "image": "/images/dish/008.jpg",
  "description": "四川特色担担面",
  "status": 1,
  "sort": 10
}
```

#### 6.3.5 更新菜品
```
PUT /api/admin/dishes/{id}
```

#### 6.3.6 删除菜品
```
DELETE /api/admin/dishes/{id}
```

#### 6.3.7 分类管理接口
```
GET    /api/admin/categories        # 获取分类列表
POST   /api/admin/categories        # 添加分类
PUT    /api/admin/categories/{id}   # 更新分类
DELETE /api/admin/categories/{id}   # 删除分类
```

### 6.4 接口鉴权（V2版本）
MVP阶段可暂不实现鉴权，后续迭代可加入：
- 管理端：JWT Token认证
- 顾客端：微信授权登录（可选）

---

## 7. 前端设计

### 7.1 页面结构

```
前端应用
├── 顾客端（移动端H5）
│   ├── 首页/菜单页
│   ├── 购物车页
│   ├── 订单确认页
│   └── 订单查询页
│
└── 管理端（PC Web）
    ├── 订单管理页
    ├── 菜品管理页
    └── 分类管理页
```

### 7.2 顾客端设计

#### 7.2.1 首页/菜单页
```
┌─────────────────────────────┐
│  【面馆点餐系统】              │
├─────────────────────────────┤
│ [招牌面食] [小菜] [饮料]      │  ← 分类Tab
├─────────────────────────────┤
│ ┌───┬───────────────┐        │
│ │图 │ 红烧牛肉面      │        │
│ │片 │ 精选牛腩...    │ ¥28   │
│ └───┴───────────────┘ [+]   │
│ ┌───┬───────────────┐        │
│ │图 │ 酸菜肉丝面      │        │
│ │片 │ 东北酸菜...    │ ¥22   │
│ └───┴───────────────┘ [+]   │
├─────────────────────────────┤
│ 购物车 (3) | 共计: ¥78       │  ← 底部购物车
└─────────────────────────────┘
```

**功能点：**
- 顶部固定分类切换
- 菜品卡片展示（图片+名称+价格）
- 快速加入购物车按钮
- 底部购物车悬浮栏

#### 7.2.2 购物车页
```
┌─────────────────────────────┐
│  购物车                      │
├─────────────────────────────┤
│ 红烧牛肉面         ¥28       │
│ [-] 2 [+]         小计: ¥56 │
├─────────────────────────────┤
│ 可乐              ¥5        │
│ [-] 1 [+]         小计: ¥5  │
├─────────────────────────────┤
│ 桌号: [_____]               │
│ 备注: [_______________]     │
├─────────────────────────────┤
│         总计: ¥61           │
│      [提交订单]              │
└─────────────────────────────┘
```

**功能点：**
- 商品数量增减
- 输入桌号（必填）
- 添加备注
- 金额实时计算

#### 7.2.3 订单查询页
```
┌─────────────────────────────┐
│  订单查询                    │
├─────────────────────────────┤
│ 订单号: [____________] [查询]│
├─────────────────────────────┤
│ 订单号: 20260203143520001   │
│ 桌号: A01                   │
│ 状态: 🟢 制作中              │
│                             │
│ 红烧牛肉面 x2       ¥56     │
│ 可乐 x1            ¥5       │
│                             │
│ 总计: ¥61                   │
│ 下单时间: 14:35             │
└─────────────────────────────┘
```

### 7.3 管理端设计

#### 7.3.1 订单管理页
```
┌────────────────────────────────────────────────────┐
│  订单管理                                           │
├────────────────────────────────────────────────────┤
│ [全部] [待处理] [制作中] [已完成]    🔔 新订单提醒  │
├────────────────────────────────────────────────────┤
│ 订单号           桌号  金额   状态    下单时间  操作 │
│ 20260203143520001  A01  ¥61  待处理  14:35  [处理]│
│ 20260203142010002  B03  ¥45  制作中  14:20  [完成]│
├────────────────────────────────────────────────────┤
│                                      [上一页][下一页]│
└────────────────────────────────────────────────────┘
```

**功能点：**
- Tab切换状态筛选
- 新订单桌面通知+声音提醒
- 快速操作按钮
- 点击行展开订单详情

#### 7.3.2 菜品管理页
```
┌────────────────────────────────────────────────────┐
│  菜品管理                            [+ 添加菜品]    │
├────────────────────────────────────────────────────┤
│ 分类: [全部▼]  搜索: [_____]  [查询]               │
├────────────────────────────────────────────────────┤
│ 图片  名称         分类     价格   状态      操作   │
│ [图]  红烧牛肉面   招牌面食  ¥28   在售  [编辑][删除]│
│ [图]  酸菜肉丝面   招牌面食  ¥22   在售  [编辑][删除]│
├────────────────────────────────────────────────────┤
│                                      [上一页][下一页]│
└────────────────────────────────────────────────────┘
```

**功能点：**
- 分类筛选下拉框
- 搜索菜品
- 状态切换（在售/停售）
- 弹窗编辑表单

### 7.4 前端技术实现

#### 7.4.1 路由设计
```javascript
// 顾客端路由
const customerRoutes = [
  { path: '/', component: MenuPage },           // 菜单页
  { path: '/cart', component: CartPage },       // 购物车
  { path: '/order-query', component: OrderQueryPage }  // 订单查询
];

// 管理端路由
const adminRoutes = [
  { path: '/admin/orders', component: OrderManagePage },      // 订单管理
  { path: '/admin/dishes', component: DishManagePage },       // 菜品管理
  { path: '/admin/categories', component: CategoryManagePage } // 分类管理
];
```

#### 7.4.2 状态管理
使用React Context + useReducer管理全局状态：
```javascript
// 购物车状态
const CartContext = createContext();

// 订单状态映射
const ORDER_STATUS = {
  1: { text: '待处理', color: 'orange' },
  2: { text: '制作中', color: 'blue' },
  3: { text: '已完成', color: 'green' },
  4: { text: '已取消', color: 'gray' }
};
```

#### 7.4.3 核心组件
```
components/
├── DishCard.jsx          # 菜品卡片
├── ShoppingCart.jsx      # 购物车组件
├── OrderCard.jsx         # 订单卡片
├── DishModal.jsx         # 菜品编辑弹窗
└── StatusTag.jsx         # 状态标签
```

---

## 8. 后端设计

### 8.1 项目分层架构

```
com.restaurant
├── RestaurantApplication.java       # 启动类
├── config/                         # 配置类
│   ├── CorsConfig.java            # 跨域配置
│   └── WebConfig.java             # Web配置
├── controller/                     # 控制器层
│   ├── CustomerController.java    # 顾客端接口
│   └── AdminController.java       # 管理端接口
├── service/                        # 服务层
│   ├── CategoryService.java
│   ├── DishService.java
│   └── OrderService.java
├── repository/                     # 数据访问层
│   ├── CategoryRepository.java
│   ├── DishRepository.java
│   ├── OrderRepository.java
│   └── OrderDetailRepository.java
├── entity/                         # 实体类
│   ├── Category.java
│   ├── Dish.java
│   ├── Order.java
│   └── OrderDetail.java
├── dto/                            # 数据传输对象
│   ├── OrderSubmitDTO.java
│   ├── OrderVO.java
│   └── DishDTO.java
├── common/                         # 公共类
│   ├── Result.java                # 统一响应封装
│   ├── PageResult.java            # 分页响应
│   └── GlobalExceptionHandler.java # 全局异常处理
└── utils/                          # 工具类
    └── OrderNumberGenerator.java   # 订单号生成器
```

### 8.2 核心类设计

#### 8.2.1 实体类示例
```java
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "table_number", nullable = false)
    private String tableNumber;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "status")
    private Integer status;  // 1-待处理 2-制作中 3-已完成 4-已取消

    @Column(name = "remark")
    private String remark;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> details;
}
```

#### 8.2.2 统一响应封装
```java
@Data
@AllArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }
}
```

#### 8.2.3 订单号生成器
```java
public class OrderNumberGenerator {
    public static String generate() {
        // 格式: yyyyMMddHHmmss + 4位随机数
        String timePrefix = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.format("%04d",
            new Random().nextInt(10000));
        return timePrefix + randomSuffix;
    }
}
```

### 8.3 核心业务逻辑

#### 8.3.1 订单提交流程
```java
@Service
public class OrderService {

    @Transactional
    public Order submitOrder(OrderSubmitDTO dto) {
        // 1. 生成订单号
        String orderNumber = OrderNumberGenerator.generate();

        // 2. 计算总金额
        BigDecimal totalAmount = dto.getItems().stream()
            .map(item -> item.getPrice().multiply(
                BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. 创建订单
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setTableNumber(dto.getTableNumber());
        order.setAmount(totalAmount);
        order.setStatus(1);  // 待处理
        order.setRemark(dto.getRemark());
        order = orderRepository.save(order);

        // 4. 创建订单明细
        final Order savedOrder = order;
        List<OrderDetail> details = dto.getItems().stream()
            .map(item -> {
                OrderDetail detail = new OrderDetail();
                detail.setOrder(savedOrder);
                detail.setDishId(item.getDishId());
                detail.setDishName(item.getDishName());
                detail.setPrice(item.getPrice());
                detail.setQuantity(item.getQuantity());
                detail.setAmount(item.getPrice().multiply(
                    BigDecimal.valueOf(item.getQuantity())));
                return detail;
            })
            .collect(Collectors.toList());

        orderDetailRepository.saveAll(details);

        return order;
    }
}
```

### 8.4 配置文件

#### 8.4.1 application.yml
```yaml
spring:
  application:
    name: restaurant-ordering-system

  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/restaurant_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    com.restaurant: debug
```

---

## 9. 项目结构

### 9.1 完整目录结构

```
restaurant-ordering-system/
│
├── frontend/                           # 前端项目
│   ├── customer/                       # 顾客端（移动端H5）
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Menu/
│   │   │   │   │   ├── index.jsx
│   │   │   │   │   └── index.module.css
│   │   │   │   ├── Cart/
│   │   │   │   │   ├── index.jsx
│   │   │   │   │   └── index.module.css
│   │   │   │   └── OrderQuery/
│   │   │   │       ├── index.jsx
│   │   │   │       └── index.module.css
│   │   │   ├── components/
│   │   │   │   ├── DishCard/
│   │   │   │   ├── ShoppingCart/
│   │   │   │   └── CategoryTabs/
│   │   │   ├── api/
│   │   │   │   ├── request.js          # axios封装
│   │   │   │   ├── dish.js
│   │   │   │   └── order.js
│   │   │   ├── context/
│   │   │   │   └── CartContext.jsx     # 购物车状态
│   │   │   ├── utils/
│   │   │   │   └── constants.js
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── public/
│   │   │   └── images/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── index.html
│   │
│   └── admin/                          # 管理端（PC Web）
│       ├── src/
│       │   ├── pages/
│       │   │   ├── OrderManage/
│       │   │   ├── DishManage/
│       │   │   └── CategoryManage/
│       │   ├── components/
│       │   │   ├── OrderTable/
│       │   │   ├── DishModal/
│       │   │   └── StatusTag/
│       │   ├── api/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
├── backend/                            # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/restaurant/
│   │   │   │   ├── RestaurantApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── WebConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── CustomerController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CategoryService.java
│   │   │   │   │   ├── DishService.java
│   │   │   │   │   └── OrderService.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CategoryRepository.java
│   │   │   │   │   ├── DishRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   └── OrderDetailRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Category.java
│   │   │   │   │   ├── Dish.java
│   │   │   │   │   ├── Order.java
│   │   │   │   │   └── OrderDetail.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── OrderSubmitDTO.java
│   │   │   │   │   ├── OrderVO.java
│   │   │   │   │   └── DishDTO.java
│   │   │   │   ├── common/
│   │   │   │   │   ├── Result.java
│   │   │   │   │   ├── PageResult.java
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   └── utils/
│   │   │   │       └── OrderNumberGenerator.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       └── db/
│   │   │           ├── schema.sql      # 建表脚本
│   │   │           └── data.sql        # 初始数据
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── database/                           # 数据库文档
│   ├── init.sql                       # 完整初始化脚本
│   └── ER图.png
│
├── docs/                              # 项目文档
│   ├── API文档.md
│   ├── 部署文档.md
│   └── 开发日志.md
│
├── .gitignore
└── README.md                          # 项目说明
```

### 9.2 启动脚本

#### 9.2.1 数据库初始化脚本 (database/init.sql)
```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS restaurant_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE restaurant_db;

-- 创建表结构（见第5节）
-- 插入初始数据（见第5节）
```

#### 9.2.2 后端启动命令
```bash
cd backend
mvn clean package
java -jar target/restaurant-ordering-system-1.0.0.jar
```

#### 9.2.3 前端启动命令
```bash
# 顾客端
cd frontend/customer
npm install
npm run dev

# 管理端
cd frontend/admin
npm install
npm run dev
```

---

## 10. 开发计划

### 10.1 阶段划分

#### 第一阶段：环境搭建（1天）
- [ ] 安装配置MySQL数据库
- [ ] 创建数据库并执行初始化脚本
- [ ] 创建Spring Boot项目骨架
- [ ] 创建React项目（顾客端+管理端）
- [ ] 配置跨域、数据库连接
- [ ] 验证前后端能否正常通信

#### 第二阶段：后端开发（3天）

**Day 1：基础架构**
- [ ] 搭建项目分层结构
- [ ] 创建实体类（Entity）
- [ ] 创建Repository接口
- [ ] 配置JPA和数据库连接
- [ ] 编写统一响应封装类

**Day 2：核心接口（顾客端）**
- [ ] 分类查询接口
- [ ] 菜品查询接口
- [ ] 订单提交接口
- [ ] 订单查询接口
- [ ] 接口单元测试

**Day 3：管理端接口**
- [ ] 订单列表接口（分页）
- [ ] 订单状态更新接口
- [ ] 菜品CRUD接口
- [ ] 分类CRUD接口
- [ ] 全局异常处理

#### 第三阶段：前端开发（3天）

**Day 1：顾客端-菜单页**
- [ ] 页面布局搭建
- [ ] 分类Tab组件
- [ ] 菜品卡片组件
- [ ] 接口联调

**Day 2：顾客端-购物车和订单**
- [ ] 购物车状态管理
- [ ] 购物车页面
- [ ] 订单提交功能
- [ ] 订单查询页面

**Day 3：管理端**
- [ ] 订单管理页（表格+筛选）
- [ ] 菜品管理页（表格+弹窗）
- [ ] 分类管理页
- [ ] 新订单提醒功能

#### 第四阶段：联调与测试（1天）
- [ ] 前后端完整流程联调
- [ ] 功能测试（正常流程）
- [ ] 异常测试（网络错误、数据校验）
- [ ] 性能测试（并发订单）
- [ ] Bug修复

#### 第五阶段：部署上线（1天）
- [ ] 准备生产环境配置
- [ ] 打包前端静态资源
- [ ] 打包后端jar包
- [ ] 部署到服务器
- [ ] 域名绑定（如有）
- [ ] 线上验证

### 10.2 开发周期总计
**总耗时：8-10个工作日**

### 10.3 人员分工（如团队协作）
| 角色 | 负责模块 | 人数 |
|-----|---------|-----|
| 后端开发 | Spring Boot接口 | 1人 |
| 前端开发 | React页面 | 1人 |
| 测试 | 功能测试、联调 | 可兼任 |

### 10.4 里程碑

| 时间节点 | 里程碑 | 交付物 |
|---------|--------|--------|
| Day 1 | 环境搭建完成 | 数据库创建、项目初始化 |
| Day 4 | 后端接口完成 | API文档、Postman测试通过 |
| Day 7 | 前端页面完成 | 可演示的完整流程 |
| Day 8 | 联调测试完成 | 测试报告 |
| Day 9-10 | 部署上线 | 可访问的线上地址 |

---

## 11. 部署方案

### 11.1 本地开发部署

#### 11.1.1 数据库启动
```bash
# macOS启动MySQL
brew services start mysql

# 登录MySQL
mysql -u root -p

# 执行初始化脚本
source /path/to/database/init.sql
```

#### 11.1.2 后端启动
```bash
cd backend
mvn spring-boot:run

# 或打包后运行
mvn clean package
java -jar target/restaurant-ordering-system-1.0.0.jar
```

访问：http://localhost:8080

#### 11.1.3 前端启动
```bash
# 顾客端
cd frontend/customer
npm run dev
# 访问：http://localhost:5173

# 管理端
cd frontend/admin
npm run dev
# 访问：http://localhost:5174
```

### 11.2 生产环境部署

#### 11.2.1 服务器要求
- **操作系统**：Ubuntu 20.04+ / CentOS 7+
- **配置**：2核4G内存（最低）
- **软件**：
  - Java 21+ (LTS版本)
  - MySQL 8.0+
  - Nginx 1.18+

#### 11.2.2 后端部署
```bash
# 1. 打包jar
mvn clean package -DskipTests

# 2. 上传到服务器
scp target/restaurant-ordering-system-1.0.0.jar user@server:/opt/app/

# 3. 后台运行
nohup java -jar restaurant-ordering-system-1.0.0.jar > app.log 2>&1 &

# 4. 使用systemd管理（推荐）
sudo nano /etc/systemd/system/restaurant.service
```

**systemd配置：**
```ini
[Unit]
Description=Restaurant Ordering System
After=syslog.target

[Service]
User=root
ExecStart=/usr/bin/java -jar /opt/app/restaurant-ordering-system-1.0.0.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl start restaurant
sudo systemctl enable restaurant
sudo systemctl status restaurant
```

#### 11.2.3 前端部署
```bash
# 1. 构建生产版本
cd frontend/customer
npm run build

cd frontend/admin
npm run build

# 2. 将dist目录上传到服务器
scp -r dist user@server:/var/www/customer/
scp -r dist user@server:/var/www/admin/
```

#### 11.2.4 Nginx配置
```nginx
# /etc/nginx/sites-available/restaurant

# 顾客端
server {
    listen 80;
    server_name order.example.com;

    root /var/www/customer/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 管理端
server {
    listen 80;
    server_name admin.example.com;

    root /var/www/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/restaurant /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 11.3 Docker部署（可选）

#### 11.3.1 Dockerfile（后端）
```dockerfile
FROM openjdk:21-jre-slim
WORKDIR /app
COPY target/restaurant-ordering-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 11.3.2 docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: restaurant_db
    volumes:
      - ./database:/docker-entrypoint-initdb.d
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/restaurant_db

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend/customer/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"

volumes:
  mysql_data:
```

启动：
```bash
docker-compose up -d
```

---

## 12. 风险与应对

### 12.1 技术风险

| 风险 | 可能性 | 影响 | 应对措施 |
|-----|-------|------|---------|
| 数据库并发写入冲突 | 中 | 中 | 使用事务隔离级别，订单号唯一索引 |
| 前端跨域问题 | 高 | 低 | 后端配置CORS，开发时使用代理 |
| 订单号重复 | 低 | 高 | 时间戳+随机数+数据库唯一约束 |
| 图片加载慢 | 中 | 中 | 图片压缩，使用CDN，懒加载 |

### 12.2 业务风险

| 风险 | 应对措施 |
|-----|---------|
| 恶意刷单 | 限制单桌号单日订单数量 |
| 订单金额错误 | 后端重新计算金额，不信任前端 |
| 菜品突然缺货 | 管理端快速停售功能 |
| 订单遗漏 | 订单列表定时自动刷新，声音提醒 |

### 12.3 性能风险

| 指标 | 目标 | 应对方案 |
|-----|------|---------|
| 并发订单 | 支持50单/分钟 | 数据库索引优化，连接池配置 |
| 页面加载 | <2秒 | 代码分割，静态资源CDN |
| API响应 | <500ms | SQL优化，添加缓存（Redis） |

### 12.4 迭代优化方向（V2+）

1. **用户体验优化**
   - 扫码点餐（生成桌号二维码）
   - 订单实时推送（WebSocket）
   - 语音播报新订单

2. **功能扩展**
   - 会员系统
   - 优惠券/折扣
   - 外卖配送
   - 数据报表

3. **技术升级**
   - 引入Redis缓存热门菜品
   - 使用MinIO存储图片
   - 部署Elasticsearch搜索
   - 微服务拆分

---

## 附录

### A. 快速启动命令汇总

```bash
# 1. 数据库初始化
mysql -u root -p < database/init.sql

# 2. 启动后端
cd backend
mvn spring-boot:run

# 3. 启动顾客端
cd frontend/customer
npm install
npm run dev

# 4. 启动管理端
cd frontend/admin
npm install
npm run dev
```

### B. 常用Git命令

```bash
# 克隆项目
git clone <repository-url>

# 创建分支
git checkout -b feature/order-management

# 提交代码
git add .
git commit -m "feat: 实现订单管理功能"
git push origin feature/order-management
```

### C. 开发规范

#### C.1 代码规范
- **Java**：遵循阿里巴巴Java开发手册
- **JavaScript**：使用ESLint + Prettier
- **命名规范**：
  - 类名：大驼峰 `OrderService`
  - 方法名：小驼峰 `submitOrder`
  - 常量：大写下划线 `ORDER_STATUS`

#### C.2 Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建配置

示例：
feat: 添加订单状态更新接口
fix: 修复购物车金额计算错误
```

#### C.3 数据库规范
- 表名小写下划线：`order_detail`
- 字段名小写下划线：`create_time`
- 必须字段：`id`, `create_time`, `update_time`
- 金额字段使用DECIMAL
- 时间字段使用DATETIME

### D. 联系与支持

**问题反馈**：
- GitHub Issues：[项目地址]
- 邮箱：support@example.com

**技术文档**：
- Spring Boot官方文档：https://spring.io/projects/spring-boot
- React官方文档：https://react.dev
- Ant Design文档：https://ant.design

---

**文档版本**：v1.0
**最后更新**：2026-02-03
**维护者**：[你的名字]
