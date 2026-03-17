import React, { useEffect, useState } from 'react';
import {
  Table, Button, Switch, Space, Modal, Form, Input,
  InputNumber, Popconfirm, message, Card, Tag, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from '../../api/category';
import type { Category, CreateCategoryRequest } from '../../types';

const CategoryManage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.sort((a, b) => a.sort - b.sort));
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (cat?: Category) => {
    setEditing(cat || null);
    form.setFieldsValue(
      cat
        ? { name: cat.name, sort: cat.sort, status: cat.status === 1 }
        : { name: '', sort: 1, status: true }
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload: CreateCategoryRequest = {
        name: values.name,
        sort: values.sort,
        status: values.status ? 1 : 0,
      };
      if (editing) {
        await updateCategory(editing.id, payload);
        messageApi.success('分类更新成功');
      } else {
        await createCategory(payload);
        messageApi.success('分类添加成功');
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
      await deleteCategory(id);
      messageApi.success('删除成功');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '删除失败，该分类下可能还有菜品');
    }
  };

  const handleToggleStatus = async (id: number, current: number) => {
    try {
      await toggleCategoryStatus(id, current === 1 ? 0 : 1);
      messageApi.success('状态更新成功');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a, b) => a.sort - b.sort,
      defaultSortOrder: 'ascend',
      render: (v: number) => (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e94560, #c73652)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: '700',
          margin: '0 auto',
        }}>
          {v}
        </div>
      ),
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>{v}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: number, record: Category) => (
        <Switch
          checked={v === 1}
          onChange={() => handleToggleStatus(record.id, v)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          style={{ backgroundColor: v === 1 ? '#52c41a' : undefined }}
        />
      ),
    },
    {
      title: '菜品数',
      key: 'dishCount',
      width: 100,
      render: () => (
        <Tag color="geekblue" style={{ borderRadius: '6px' }}>
          —
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Category) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除此分类？"
            description="删除后该分类下的菜品将失去分类关联"
            onConfirm={() => handleDelete(record.id)}
            okText="确认删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Card
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', maxWidth: 700 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
            <div>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>分类管理</span>
              <span style={{ marginLeft: '10px', fontSize: '13px', color: '#999' }}>
                共 {categories.length} 个分类
              </span>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenModal()}
              style={{ borderRadius: '8px' }}
            >
              添加分类
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="middle"
        />
      </Card>

      <Modal
        title={
          <div style={{ fontSize: '16px', fontWeight: '600', padding: '4px 0' }}>
            {editing ? '编辑分类' : '添加分类'}
          </div>
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saving}
        okText={editing ? '保存' : '添加'}
        cancelText="取消"
        width={420}
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
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="如：汤面、干拌面、小吃..." maxLength={20} showCount />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序序号"
            rules={[{ required: true, message: '请输入排序序号' }]}
            tooltip="数字越小排越靠前"
          >
            <InputNumber min={1} max={999} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManage;
