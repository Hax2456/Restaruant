# Docker 使用说明

## 前置要求

1. 安装 Docker Desktop for Mac
2. 确保 Docker Desktop 正在运行（菜单栏应显示 Docker 图标）

## 快速开始

### 方法一：使用测试脚本（推荐）

```bash
cd ordering-system
./test-docker.sh
```

### 方法二：手动执行

#### 1. 构建并启动所有服务

```bash
cd ordering-system
docker-compose up -d
```

#### 2. 查看服务状态

```bash
docker-compose ps
```

#### 3. 查看应用日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 只查看应用日志
docker-compose logs -f app

# 只查看数据库日志
docker-compose logs -f mysql
```

#### 4. 测试应用

应用启动后，访问：
- 应用地址: http://localhost:8080
- MySQL 地址: localhost:3306

#### 5. 停止服务

```bash
# 停止服务（保留数据）
docker-compose down

# 停止服务并删除数据卷（清除数据库数据）
docker-compose down -v
```

## 服务说明

### MySQL 数据库
- 容器名: `restaurant-mysql`
- 端口: `3306`
- 数据库名: `restaurant_db`
- 用户名: `root`
- 密码: `5253`
- 数据持久化: Docker volume `mysql_data`

### Spring Boot 应用
- 容器名: `restaurant-app`
- 端口: `8080`
- 自动连接 MySQL 数据库
- 等待数据库就绪后启动

## 常见问题

### Docker daemon 未运行

如果看到错误：`Cannot connect to the Docker daemon`

**解决方法：**
1. 打开 Docker Desktop 应用
2. 等待 Docker 完全启动（菜单栏图标不再显示"正在启动"）
3. 重新运行命令

### 端口被占用

如果 8080 或 3306 端口已被占用：

**解决方法：**
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8081:8080"  # 改为其他端口
```

### 应用启动失败

**检查步骤：**
1. 查看应用日志：`docker-compose logs app`
2. 检查数据库是否就绪：`docker-compose logs mysql`
3. 检查容器状态：`docker-compose ps`

### 重新构建镜像

如果修改了代码，需要重新构建：

```bash
docker-compose build --no-cache
docker-compose up -d
```

## 开发建议

- 开发时可以使用 `docker-compose up`（不加 `-d`）来实时查看日志
- 数据库数据会持久化，除非使用 `docker-compose down -v`
- 修改代码后需要重新构建镜像才能生效

