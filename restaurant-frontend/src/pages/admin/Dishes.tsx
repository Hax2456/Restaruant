import { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { dishApi } from '../../api/dish'
import { categoryApi } from '../../api/category'
import type { Category, Dish } from '../../types'

export default function Dishes() {
  const [data, setData] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Dish | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    const [dishRes, catRes] = await Promise.all([dishApi.listAll(), categoryApi.listAll()])
    setData(dishRes.data.data)
    setCategories(catRes.data.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name ?? '-'

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editItem) {
      await dishApi.update(editItem.id, values)
      message.success('更新成功')
    } else {
      await dishApi.create(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    form.resetFields()
    setEditItem(null)
    fetchData()
  }

  const handleEdit = (record: Dish) => {
    setEditItem(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await dishApi.delete(id)
    message.success('删除成功')
    fetchData()
  }

  const handleStatusChange = async (id: number, status: number) => {
    await dishApi.updateStatus(id, status === 1 ? 0 : 1)
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '菜品名称', dataIndex: 'name', key: 'name' },
    { title: '所属分类', dataIndex: 'categoryId', key: 'categoryId', render: (v: number) => getCategoryName(v) },
    { title: '价格', dataIndex: 'price', key: 'price', render: (v: number) => <Tag color="green">¥{v}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 110,
      render: (status: number, record: Dish) => (
        <Switch checked={status === 1} onChange={() => handleStatusChange(record.id, status)} checkedChildren="在售" unCheckedChildren="停售" />
      ),
    },
    {
      title: '操作', key: 'action',
      render: (_: unknown, record: Dish) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>菜品管理</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditItem(null); form.resetFields(); setModalOpen(true) }}>
          新增菜品
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
      <Modal
        title={editItem ? '编辑菜品' : '新增菜品'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditItem(null) }}
        okText="确定"
        cancelText="取消"
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="菜品名称" name="name" rules={[{ required: true, message: '请输入菜品名称' }]}>
            <Input placeholder="请输入菜品名称" />
          </Form.Item>
          <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类">
              {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="价格（元）" name="price" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} placeholder="请输入价格" />
          </Form.Item>
          <Form.Item label="图片URL" name="images">
            <Input placeholder="请输入图片地址" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入菜品描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
