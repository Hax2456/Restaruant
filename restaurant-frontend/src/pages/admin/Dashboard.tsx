import { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic, Table, Tag } from 'antd'
import {
  AppstoreOutlined,
  CoffeeOutlined,
  TableOutlined,
  OrderedListOutlined,
} from '@ant-design/icons'
import { categoryApi } from '../../api/category'
import { dishApi } from '../../api/dish'
import { tableApi } from '../../api/table'
import { orderApi } from '../../api/order'
import type { Order } from '../../types'

const orderStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待支付', color: 'gold' },
  1: { label: '已支付', color: 'blue' },
  2: { label: '已完成', color: 'green' },
  3: { label: '已取消', color: 'default' },
}

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, dishes: 0, tables: 0, orders: 0 })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    Promise.all([
      categoryApi.listAll(),
      dishApi.listAll(),
      tableApi.listAll(),
      orderApi.listAll(),
    ]).then(([c, d, t, o]) => {
      setStats({
        categories: c.data.data.length,
        dishes: d.data.data.length,
        tables: t.data.data.length,
        orders: o.data.data.length,
      })
      setRecentOrders(o.data.data.slice(0, 5))
    })
  }, [])

  const columns = [
    { title: '订单号', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: '桌号', dataIndex: 'tableId', key: 'tableId', render: (v: number) => `${v}号桌` },
    { title: '金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => `¥${v}` },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (v: number) => <Tag color={orderStatusMap[v]?.color}>{orderStatusMap[v]?.label}</Tag>
    },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', render: (v: string) => v?.slice(0, 16) },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="菜品分类" value={stats.categories} prefix={<AppstoreOutlined />} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="菜品数量" value={stats.dishes} prefix={<CoffeeOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="餐桌数量" value={stats.tables} prefix={<TableOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总订单数" value={stats.orders} prefix={<OrderedListOutlined />} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
      </Row>
      <Card title="最近订单">
        <Table dataSource={recentOrders} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  )
}
