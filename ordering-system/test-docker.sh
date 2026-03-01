#!/bin/bash

echo "=== Docker 配置测试脚本 ==="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

echo "✅ Docker 已安装: $(docker --version)"

# 检查 Docker daemon 是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon 未运行"
    echo "   请启动 Docker Desktop 或 Docker 服务"
    exit 1
fi

echo "✅ Docker daemon 正在运行"
echo ""

# 检查 docker-compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装"
    exit 1
fi

echo "✅ docker-compose 已安装: $(docker-compose --version)"
echo ""

# 验证配置文件
echo "📋 验证 docker-compose.yml 配置..."
if docker-compose config &> /dev/null; then
    echo "✅ docker-compose.yml 配置有效"
else
    echo "❌ docker-compose.yml 配置有误"
    docker-compose config
    exit 1
fi

echo ""
echo "=== 开始构建和启动服务 ==="
echo ""

# 停止可能存在的旧容器
echo "🧹 清理旧容器..."
docker-compose down -v 2>/dev/null

# 构建镜像
echo "🔨 构建 Docker 镜像..."
if docker-compose build; then
    echo "✅ 镜像构建成功"
else
    echo "❌ 镜像构建失败"
    exit 1
fi

echo ""
echo "🚀 启动服务..."
if docker-compose up -d; then
    echo "✅ 服务启动成功"
    echo ""
    echo "📊 服务状态:"
    docker-compose ps
    echo ""
    echo "📝 查看日志: docker-compose logs -f"
    echo "🛑 停止服务: docker-compose down"
    echo ""
    echo "等待服务就绪..."
    sleep 10
    
    # 检查服务健康状态
    echo ""
    echo "🔍 检查服务状态..."
    docker-compose ps
    
    # 测试应用是否响应
    echo ""
    echo "🌐 测试应用连接..."
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ 应用已启动，可以访问 http://localhost:8080"
    else
        echo "⏳ 应用正在启动中，请稍候..."
        echo "   查看日志: docker-compose logs -f app"
    fi
else
    echo "❌ 服务启动失败"
    exit 1
fi

