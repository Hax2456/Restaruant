import React, { useEffect, useState, useCallback } from 'react';
import {
  Table, Tag, Button, Space, Tabs, Popconfirm, message,
  Badge, Tooltip, Card, Statistic, Row, Col
} from 'antd';
import type { ColumnsType, ExpandableConfig } from 'antd/es/table';
import { getOrders, getOrdersByStatus, updateOrderStatus, cancelOrder, deleteOrder } from '../../api/order';
import type { Order, OrderItem } from '../../types';

const ORDER_STATUS: Record<number, { label: string; color: string; icon: string }> = {
  0: { label: '待支付', color: 'warning', icon: '⏳' },
  1: { label: '已支付', color: 'processing', icon: '💳' },
  2: { label: '已完成', color: 'success', icon: '✅' },
  3: { label: '已取消', color: 'default', icon: '❌' },
};

const formatTime = (t?: string) => {
  if (!t) return '—';
  return new Date(t).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const OrderManage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [messageApi, contextHolder] = message.useMessage();

  const fetchOrders = useCallback(async (tab = activeTab) => {
    setLoading(true);
    try {
      let res;
      if (tab === 'all') {
        res = await getOrders();
      } else {
        res = await getOrdersByStatus(Number(tab));
      }
      setOrders(res.data);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab, messageApi]);

  useEffect(() => {
    fetchOrders(activeTab);
    const timer = setInterval(() => fetchOrders(activeTab), 10000);
    return () => clearInterval(timer);
  }, [activeTab, fetchOrders]);

  const handleStatusUpdate = async (id: number, status: number) => {
    try {
      await updateOrderStatus(id, status);
      messageApi.success('状态更新成功');
      fetchOrders(activeTab);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder(id);
      messageApi.success('已取消订单');
      fetchOrders(activeTab);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      messageApi.success('已删除订单');
      fetchOrders(activeTab);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 160,
      render: (v: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#333' }}>{v}</span>
      ),
    },
    {
      title: '桌台',
      dataIndex: 'tableId',
      key: 'tableId',
      width: 80,
      render: (v: number) => (
        <Tag color="blue" style={{ borderRadius: '6px' }}>
          {v} 号
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (v: number) => (
        <span style={{ fontWeight: '600', color: '#e94560', fontSize: '15px' }}>
          ¥{Number(v).toFixed(2)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: number) => {
        const s = ORDER_STATUS[v];
        return (
          <Tag
            color={s.color}
            style={{ borderRadius: '8px', padding: '2px 10px', fontSize: '12px' }}
          >
            {s.icon} {s.label}
          </Tag>
        );
      },
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 130,
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      defaultSortOrder: 'descend',
      render: (v: string) => (
        <span style={{ fontSize: '13px', color: '#666' }}>{formatTime(v)}</span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (v: string) => v ? (
        <Tooltip title={v}>
          <span style={{ fontSize: '13px', color: '#999' }}>{v}</span>
        </Tooltip>
      ) : <span style={{ color: '#ddd' }}>—</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: Order) => (
        <Space size={4}>
          {record.status === 0 && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleStatusUpdate(record.id, 1)}
              style={{ borderRadius: '6px', fontSize: '12px' }}
            >
              确认支付
            </Button>
          )}
          {record.status === 1 && (
            <Button
              type="primary"
              size="small"
              ghost
              onClick={() => handleStatusUpdate(record.id, 2)}
              style={{ borderRadius: '6px', fontSize: '12px' }}
            >
              完成
            </Button>
          )}
          {(record.status === 0 || record.status === 1) && (
            <Popconfirm
              title="确认取消此订单？"
              onConfirm={() => handleCancel(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                size="small"
                danger
                style={{ borderRadius: '6px', fontSize: '12px' }}
              >
                取消
              </Button>
            </Popconfirm>
          )}
          {(record.status === 2 || record.status === 3) && (
            <Popconfirm
              title="确认删除此订单？"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                size="small"
                danger
                ghost
                style={{ borderRadius: '6px', fontSize: '12px' }}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const expandable: ExpandableConfig<Order> = {
    expandedRowRender: (record: Order) => {
      if (!record.orderItems || record.orderItems.length === 0) {
        return <div style={{ color: '#999', padding: '8px 12px', fontSize: '13px' }}>暂无菜品明细</div>;
      }
      return (
        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
            订单明细
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {record.orderItems.map((item: OrderItem, idx: number) => (
              <div
                key={idx}
                style={{
                  background: '#f8f8f8',
                  border: '1px solid #e8e8e8',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontWeight: '500' }}>{item.dishName || `菜品${item.dishId}`}</span>
                {item.price && (
                  <span style={{ color: '#999' }}>¥{Number(item.price).toFixed(2)}</span>
                )}
                <Tag color="orange" style={{ borderRadius: '4px', margin: 0 }}>
                  ×{item.quantity}
                </Tag>
                {item.remark && (
                  <span style={{ color: '#aaa', fontSize: '12px' }}>({item.remark})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    },
    rowExpandable: (record: Order) => !!(record.orderItems && record.orderItems.length > 0),
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 0).length,
    paid: orders.filter((o) => o.status === 1).length,
    completed: orders.filter((o) => o.status === 2).length,
    totalRevenue: orders
      .filter((o) => o.status !== 3)
      .reduce((sum, o) => sum + Number(o.totalAmount), 0),
  };

  const tabItems = [
    { key: 'all', label: <span>全部 <Badge count={orders.length} showZero style={{ backgroundColor: '#aaa' }} /></span> },
    { key: '0', label: <span>待支付 {stats.pending > 0 && <Badge count={stats.pending} style={{ backgroundColor: '#faad14' }} />}</span> },
    { key: '1', label: '已支付' },
    { key: '2', label: '已完成' },
    { key: '3', label: '已取消' },
  ];

  return (
    <div>
      {contextHolder}

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        {[
          { title: '全部订单', value: stats.total, color: '#1890ff' },
          { title: '待处理', value: stats.pending, color: '#faad14' },
          { title: '已支付', value: stats.paid, color: '#722ed1' },
          { title: '已完成', value: stats.completed, color: '#52c41a' },
        ].map(({ title, value, color }) => (
          <Col span={6} key={title}>
            <Card
              bordered={false}
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                borderTop: `3px solid ${color}`,
              }}
              bodyStyle={{ padding: '16px 20px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '13px', color: '#666' }}>{title}</span>}
                value={value}
                valueStyle={{ color, fontSize: '28px', fontWeight: '700' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Table Card */}
      <Card
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
        bodyStyle={{ padding: '0' }}
        title={
          <div style={{ padding: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>订单列表</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#999' }}>
                总收入：<span style={{ color: '#e94560', fontWeight: '700' }}>¥{stats.totalRevenue.toFixed(2)}</span>
              </span>
              <Button
                size="small"
                onClick={() => fetchOrders(activeTab)}
                loading={loading}
                style={{ borderRadius: '6px' }}
              >
                刷新
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ padding: '0 24px' }}>
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={(key) => {
              setActiveTab(key);
              fetchOrders(key);
            }}
            style={{ marginBottom: 0 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          expandable={expandable}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 15,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: false,
          }}
          style={{ borderRadius: '0 0 12px 12px' }}
          rowClassName={(record) =>
            record.status === 0 ? 'ant-table-row-pending' : ''
          }
        />
      </Card>

      <style>{`
        .ant-table-row-pending td {
          background: #fffbe6 !important;
        }
        .ant-table-row-pending:hover td {
          background: #fff8d6 !important;
        }
      `}</style>
    </div>
  );
};

export default OrderManage;
