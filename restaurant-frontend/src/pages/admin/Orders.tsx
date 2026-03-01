import { useEffect, useState } from 'react'
import { Button, Descriptions, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import { orderApi } from '../../api/order'
import type { Order } from '../../types'

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待支付', color: 'gold' },
  1: { label: '已支付', color: 'blue' },
  2: { label: '已完成', color: 'green' },
  3: { label: '已取消', color: 'default' },
}

export default function Orders() {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined)

  const fetchData = async () => {
    setLoading(true)
    const res = filterStatus !== undefined
      ? await orderApi.listByStatus(filterStatus)
      : await orderApi.listAll()
    setData(res.data.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [filterStatus])

  const handleStatusChange = async (id: number, status: number) => {
    await orderApi.updateStatus(id, status)
    message.success('状态已更新')
    fetchData()
  }

  const handleCancel = async (id: number) => {
    await orderApi.cancel(id)
    message.success('订单已取消')
    fetchData()
  }

  const handleDelete = async (id: number) => {
    await orderApi.delete(id)
    message.success('删除成功')
    fetchData()
  }

  const columns = [
    { title: '订单号', dataIndex: 'orderNumber', key: 'orderNumber', ellipsis: true },
    { title: '桌号', dataIndex: 'tableId', key: 'tableId', render: (v: number) => `${v}号桌` },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: number) => <Tag color="green">¥{v}</Tag> },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: number, record: Order) => (
        <Select
          value={status}
          style={{ width: 110 }}
          onChange={(v) => handleStatusChange(record.id, v)}
          disabled={status === 2 || status === 3}
        >
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={Number(k)}>
              <Tag color={v.color}>{v.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: (v: string) => v?.slice(0, 16) },
    {
      title: '操作', key: 'action',
      render: (_: unknown, record: Order) => (
        <Space>
          <Button type="link" onClick={() => setDetailOrder(record)}>详情</Button>
          {record.status !== 3 && record.status !== 2 && (
            <Popconfirm title="确定取消该订单吗？" onConfirm={() => handleCancel(record.id)}>
              <Button type="link" danger>取消</Button>
            </Popconfirm>
          )}
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
        <span style={{ fontSize: 16, fontWeight: 500 }}>订单管理</span>
        <Select
          allowClear
          placeholder="按状态筛选"
          style={{ width: 150 }}
          onChange={(v) => setFilterStatus(v)}
        >
          {Object.entries(statusMap).map(([k, v]) => (
            <Select.Option key={k} value={Number(k)}>{v.label}</Select.Option>
          ))}
        </Select>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={`订单详情 - ${detailOrder?.orderNumber}`}
        open={!!detailOrder}
        onCancel={() => setDetailOrder(null)}
        footer={null}
        width={600}
      >
        {detailOrder && (
          <>
            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="桌号">{detailOrder.tableId}号桌</Descriptions.Item>
              <Descriptions.Item label="总金额">¥{detailOrder.totalAmount}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[detailOrder.status]?.color}>{statusMap[detailOrder.status]?.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="备注">{detailOrder.remark || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>{detailOrder.createTime?.slice(0, 16)}</Descriptions.Item>
            </Descriptions>
            <Table
              dataSource={detailOrder.orderItems}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: '菜品', dataIndex: 'dishName', key: 'dishName' },
                { title: '单价', dataIndex: 'dishPrice', key: 'dishPrice', render: (v: number) => `¥${v}` },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '小计', dataIndex: 'subtotal', key: 'subtotal', render: (v: number) => `¥${v}` },
                { title: '备注', dataIndex: 'remark', key: 'remark' },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  )
}
