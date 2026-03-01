import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  CoffeeOutlined,
  TableOutlined,
  OrderedListOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: '分类管理' },
  { key: '/admin/dishes', icon: <CoffeeOutlined />, label: '菜品管理' },
  { key: '/admin/tables', icon: <TableOutlined />, label: '餐桌管理' },
  { key: '/admin/orders', icon: <OrderedListOutlined />, label: '订单管理' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {collapsed ? '餐厅' : '餐厅管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>
            {menuItems.find(m => m.key === location.pathname)?.label ?? '管理后台'}
          </span>
          <span style={{ color: '#999', fontSize: 13 }}>餐厅点餐系统 v1.0</span>
        </Header>
        <Content style={{ margin: 24, background: '#f5f5f5', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
