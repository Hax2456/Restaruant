import { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { tableApi } from '../../api/table'
import type { DiningTable } from '../../types'

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '维修中', color: 'red' },
  1: { label: '空闲', color: 'green' },
  2: { label: '使用中', color: 'blue' },
}

export default function Tables() {
  const [data, setData] = useState<DiningTable[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<DiningTable | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    const res = await tableApi.listAll()
    setData(res.data.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editItem) {
      await tableApi.update(editItem.id, values)
      message.success('更新成功')
    } else {
      await tableApi.create(values)
      message.success('创建成功')
    }
    setModalOpen(false)
    form.resetFields()
    setEditItem(null)
    fetchData()
  }

  const handleEdit = (record: DiningTable) => {
    setEditItem(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await tableApi.delete(id)
    message.success('删除成功')
    fetchData()
  }

  const handleStatusChange = async (id: number, status: number) => {
    await tableApi.updateStatus(id, status)
    message.success('状态已更新')
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '桌号', dataIndex: 'tableNumber', key: 'tableNumber' },
    { title: '座位数', dataIndex: 'seats', key: 'seats', render: (v: number) => `${v} 位` },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: number, record: DiningTable) => (
        <Select value={status} style={{ width: 110 }} onChange={(v) => handleStatusChange(record.id, v)}>
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={Number(k)}>
              <Tag color={v.color}>{v.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: (v: string) => v?.slice(0, 16) },
    {
      title: '操作', key: 'action',
      render: (_: unknown, record: DiningTable) => (
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
        <span style={{ fontSize: 16, fontWeight: 500 }}>餐桌管理</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditItem(null); form.resetFields(); setModalOpen(true) }}>
          新增餐桌
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />
      <Modal
        title={editItem ? '编辑餐桌' : '新增餐桌'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditItem(null) }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="桌号" name="tableNumber" rules={[{ required: true, message: '请输入桌号' }]}>
            <Input placeholder="如：A01、B02" />
          </Form.Item>
          <Form.Item label="座位数" name="seats" rules={[{ required: true, message: '请输入座位数' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入座位数" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
