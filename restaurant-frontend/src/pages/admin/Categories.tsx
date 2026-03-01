import { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Switch, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { categoryApi } from '../../api/category'
import type { Category } from '../../types'

export default function Categories() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    const res = await categoryApi.listAll()
    setData(res.data.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editItem) {
      await categoryApi.update(editItem.id, values)
      message.success('更新成功')
    } else {
      await categoryApi.create(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    form.resetFields()
    setEditItem(null)
    fetchData()
  }

  const handleEdit = (record: Category) => {
    setEditItem(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await categoryApi.delete(id)
    message.success('删除成功')
    fetchData()
  }

  const handleStatusChange = async (id: number, status: number) => {
    await categoryApi.updateStatus(id, status ? 0 : 1)
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status: number, record: Category) => (
        <Switch checked={status === 1} onChange={() => handleStatusChange(record.id, status)} checkedChildren="启用" unCheckedChildren="禁用" />
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: (v: string) => v?.slice(0, 16) },
    {
      title: '操作', key: 'action',
      render: (_: unknown, record: Category) => (
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
        <span style={{ fontSize: 16, fontWeight: 500 }}>分类管理</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditItem(null); form.resetFields(); setModalOpen(true) }}>
          新增分类
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
      <Modal
        title={editItem ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditItem(null) }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item label="排序" name="sort" rules={[{ required: true, message: '请输入排序值' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="数字越小排越前" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
