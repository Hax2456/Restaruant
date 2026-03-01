import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Divider, Drawer, Empty, InputNumber, Row, Select, Tag, Typography, message } from 'antd'
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { categoryApi } from '../../api/category'
import { dishApi } from '../../api/dish'
import { orderApi } from '../../api/order'
import { tableApi } from '../../api/table'
import type { Category, Dish, DiningTable } from '../../types'

interface CartItem {
  dish: Dish
  quantity: number
  remark: string
}

export default function CustomerOrder() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [tables, setTables] = useState<DiningTable[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<number | undefined>()
  const [remark, setRemark] = useState('')

  useEffect(() => {
    Promise.all([categoryApi.listAll(), dishApi.listAll(), tableApi.listAll()]).then(([c, d, t]) => {
      const enabledCategories = c.data.data.filter((cat: Category) => cat.status === 1)
      setCategories(enabledCategories)
      setDishes(d.data.data.filter((dish: Dish) => dish.status === 1))
      setTables(t.data.data.filter((table: DiningTable) => table.status === 1))
      if (enabledCategories.length > 0) setSelectedCategory(enabledCategories[0].id)
    })
  }, [])

  const filteredDishes = selectedCategory ? dishes.filter(d => d.categoryId === selectedCategory) : dishes

  const getCartQuantity = (dishId: number) => cart.find(c => c.dish.id === dishId)?.quantity ?? 0

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const exists = prev.find(c => c.dish.id === dish.id)
      if (exists) return prev.map(c => c.dish.id === dish.id ? { ...c, quantity: c.quantity + 1 } : c)
      return [...prev, { dish, quantity: 1, remark: '' }]
    })
  }

  const removeFromCart = (dishId: number) => {
    setCart(prev => {
      const exists = prev.find(c => c.dish.id === dishId)
      if (!exists) return prev
      if (exists.quantity === 1) return prev.filter(c => c.dish.id !== dishId)
      return prev.map(c => c.dish.id === dishId ? { ...c, quantity: c.quantity - 1 } : c)
    })
  }

  const totalPrice = cart.reduce((sum, c) => sum + c.dish.price * c.quantity, 0)
  const totalCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  const handleSubmit = async () => {
    if (!selectedTable) return message.error('请选择桌号')
    if (cart.length === 0) return message.error('请先选择菜品')
    await orderApi.create({
      tableId: selectedTable,
      remark,
      items: cart.map(c => ({ dishId: c.dish.id, quantity: c.quantity, remark: c.remark })),
    })
    message.success('下单成功！')
    setCart([])
    setCartOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>点餐菜单</Typography.Title>
        <Badge count={totalCount} size="small">
          <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => setCartOpen(true)}>
            购物车 {totalCount > 0 && `¥${totalPrice.toFixed(2)}`}
          </Button>
        </Badge>
      </div>

      <div style={{ display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '16px 12px' }}>
        <div style={{ width: 120, marginRight: 16, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', position: 'sticky', top: 80 }}>
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderLeft: selectedCategory === cat.id ? '3px solid #1677ff' : '3px solid transparent',
                  background: selectedCategory === cat.id ? '#e6f4ff' : 'transparent',
                  color: selectedCategory === cat.id ? '#1677ff' : '#333',
                  fontWeight: selectedCategory === cat.id ? 600 : 400,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <Row gutter={[12, 12]}>
            {filteredDishes.length === 0
              ? <Col span={24}><Empty description="暂无菜品" style={{ marginTop: 60 }} /></Col>
              : filteredDishes.map(dish => {
                const qty = getCartQuantity(dish.id)
                return (
                  <Col key={dish.id} xs={24} sm={12} md={8}>
                    <Card
                      hoverable
                      cover={dish.images && <img src={dish.images} alt={dish.name} style={{ height: 150, objectFit: 'cover' }} />}
                      bodyStyle={{ padding: '12px' }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{dish.name}</div>
                      {dish.description && <div style={{ color: '#999', fontSize: 12, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dish.description}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag color="volcano" style={{ fontSize: 14, fontWeight: 700 }}>¥{dish.price}</Tag>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {qty > 0 && <>
                            <Button size="small" icon={<MinusOutlined />} onClick={() => removeFromCart(dish.id)} shape="circle" />
                            <span style={{ fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                          </>}
                          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => addToCart(dish)} shape="circle" />
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
              })}
          </Row>
        </div>
      </div>

      <Drawer
        title="购物车"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        width={400}
        footer={
          <div>
            <div style={{ marginBottom: 12 }}>
              <Select placeholder="选择桌号" style={{ width: '100%' }} value={selectedTable} onChange={setSelectedTable}>
                {tables.map(t => <Select.Option key={t.id} value={t.id}>{t.tableNumber}（{t.seats}位）</Select.Option>)}
              </Select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>合计：¥{totalPrice.toFixed(2)}</span>
              <Button type="primary" size="large" onClick={handleSubmit} disabled={cart.length === 0}>提交订单</Button>
            </div>
          </div>
        }
      >
        {cart.length === 0
          ? <Empty description="购物车为空" style={{ marginTop: 60 }} />
          : cart.map(item => (
            <div key={item.dish.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{item.dish.name}</span>
                <span style={{ color: '#f5222d', fontWeight: 600 }}>¥{(item.dish.price * item.quantity).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <Button size="small" icon={<MinusOutlined />} onClick={() => removeFromCart(item.dish.id)} shape="circle" />
                <InputNumber size="small" min={1} value={item.quantity} readOnly style={{ width: 50, textAlign: 'center' }} />
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => addToCart(item.dish)} shape="circle" />
                <span style={{ color: '#999', fontSize: 12 }}>¥{item.dish.price}/份</span>
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </div>
          ))}
      </Drawer>
    </div>
  )
}
