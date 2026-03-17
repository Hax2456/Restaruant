import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Input, InputNumber, Popconfirm, message,
  Card, Tag, Segmented, Empty, Spin, Tooltip, Badge
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined, CoffeeOutlined, UserOutlined } from '@ant-design/icons';
import { getTables, createTable, updateTable, deleteTable, toggleTableStatus } from '../../api/table';
import type { DiningTable, CreateTableRequest } from '../../types';

const TABLE_STATUS: Record<number, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; badge: 'default' | 'processing' | 'success' | 'error' | 'warning' }> = {
  0: { label: '维修中', color: '#d4380d', bg: '#fff2e8', border: '#ffbb96', icon: <ToolOutlined />, badge: 'error' },
  1: { label: '空闲', color: '#389e0d', bg: '#f6ffed', border: '#b7eb8f', icon: <CoffeeOutlined />, badge: 'success' },
  2: { label: '使用中', color: '#096dd9', bg: '#e6f4ff', border: '#91caff', icon: <UserOutlined />, badge: 'processing' },
};

const TableManage: React.FC = () => {
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<DiningTable | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<number | 'all'>('all');
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTables();
      setTables(res.data);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (table?: DiningTable) => {
    setEditing(table || null);
    form.setFieldsValue(
      table
        ? { tableNumber: table.tableNumber, seats: table.seats }
        : { tableNumber: '', seats: 4 }
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload: CreateTableRequest = {
        tableNumber: values.tableNumber,
        seats: values.seats,
      };
      if (editing) {
        await updateTable(editing.id, payload);
        messageApi.success('餐桌信息更新成功');
      } else {
        await createTable(payload);
        messageApi.success('餐桌添加成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) return;
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTable(id);
      messageApi.success('已删除餐桌');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '删除失败');
    }
  };

  const handleStatusChange = async (id: number, status: number) => {
    try {
      await toggleTableStatus(id, status);
      messageApi.success('状态更新成功');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const filteredTables = filterStatus === 'all'
    ? tables
    : tables.filter((t) => t.status === filterStatus);

  const stats = {
    total: tables.length,
    idle: tables.filter((t) => t.status === 1).length,
    occupied: tables.filter((t) => t.status === 2).length,
    maintenance: tables.filter((t) => t.status === 0).length,
  };

  const segmentedOptions = [
    { label: `全部 (${stats.total})`, value: 'all' },
    { label: `空闲 (${stats.idle})`, value: 1 },
    { label: `使用中 (${stats.occupied})`, value: 2 },
    { label: `维修中 (${stats.maintenance})`, value: 0 },
  ];

  return (
    <div>
      {contextHolder}

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: '总桌数', value: stats.total, color: '#1890ff' },
          { label: '空闲桌', value: stats.idle, color: '#52c41a' },
          { label: '使用中', value: stats.occupied, color: '#1890ff' },
          { label: '维修中', value: stats.maintenance, color: '#f5222d' },
        ].map(({ label, value, color }) => (
          <Card
            key={label}
            bordered={false}
            style={{
              flex: 1,
              minWidth: '120px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderTop: `3px solid ${color}`,
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color }}>{value}</div>
          </Card>
        ))}
      </div>

      {/* Main Card */}
      <Card
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>餐桌管理</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Segmented
                options={segmentedOptions}
                value={filterStatus}
                onChange={(v) => setFilterStatus(v as number | 'all')}
                size="small"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                style={{ borderRadius: '8px' }}
              >
                添加餐桌
              </Button>
            </div>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Spin size="large" />
          </div>
        ) : filteredTables.length === 0 ? (
          <Empty description="暂无餐桌数据" style={{ padding: '60px' }} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            padding: '4px 0',
          }}>
            {filteredTables.map((table) => {
              const s = TABLE_STATUS[table.status];
              return (
                <div
                  key={table.id}
                  style={{
                    background: s.bg,
                    border: `2px solid ${s.border}`,
                    borderRadius: '14px',
                    padding: '20px',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Table Number */}
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: s.color,
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}>
                      {table.tableNumber}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>号桌</div>
                  </div>

                  {/* Info */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Tag
                      color={table.status === 1 ? 'success' : table.status === 2 ? 'processing' : 'error'}
                      style={{ borderRadius: '8px', padding: '2px 10px', fontSize: '12px', margin: 0 }}
                    >
                      <Badge
                        status={s.badge}
                        text={s.label}
                        style={{ fontSize: '12px' }}
                      />
                    </Tag>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#666',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <span>👥</span>
                    <span>{table.seats} 人座</span>
                  </div>

                  {/* Status Change */}
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '10px' }}>
                    {[
                      { status: 1, label: '设为空闲' },
                      { status: 2, label: '使用中' },
                      { status: 0, label: '维修' },
                    ]
                      .filter((opt) => opt.status !== table.status)
                      .map((opt) => (
                        <Tooltip title={opt.label} key={opt.status}>
                          <button
                            onClick={() => handleStatusChange(table.id, opt.status)}
                            style={{
                              padding: '4px 10px',
                              border: `1px solid ${TABLE_STATUS[opt.status].border}`,
                              borderRadius: '6px',
                              background: TABLE_STATUS[opt.status].bg,
                              color: TABLE_STATUS[opt.status].color,
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '500',
                              transition: 'all 0.15s',
                            }}
                          >
                            {opt.label}
                          </button>
                        </Tooltip>
                      ))
                    }
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    <Tooltip title="编辑">
                      <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(table)}
                        style={{ color: '#1890ff', borderRadius: '6px' }}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="确认删除此餐桌？"
                      onConfirm={() => handleDelete(table.id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Tooltip title="删除">
                        <Button
                          size="small"
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          style={{ borderRadius: '6px' }}
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        title={
          <div style={{ fontSize: '16px', fontWeight: '600', padding: '4px 0' }}>
            {editing ? '编辑餐桌' : '添加餐桌'}
          </div>
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saving}
        okText={editing ? '保存' : '添加'}
        cancelText="取消"
        width={400}
        okButtonProps={{ style: { borderRadius: '8px' } }}
        cancelButtonProps={{ style: { borderRadius: '8px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          style={{ paddingTop: '16px' }}
        >
          <Form.Item
            name="tableNumber"
            label="桌台编号"
            rules={[{ required: true, message: '请输入桌台编号' }]}
            tooltip="如：A01, 01, VIP1 等"
          >
            <Input placeholder="如：01, A01, VIP1..." maxLength={10} />
          </Form.Item>

          <Form.Item
            name="seats"
            label="座位数"
            rules={[
              { required: true, message: '请输入座位数' },
              { type: 'number', min: 1, max: 20, message: '座位数在1-20之间' },
            ]}
          >
            <InputNumber min={1} max={20} style={{ width: '100%' }} addonAfter="人" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableManage;
