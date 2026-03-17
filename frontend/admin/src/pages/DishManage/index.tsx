import React, { useEffect, useState } from 'react';
import {
  Table, Button, Switch, Tag, Space, Modal, Form, Input,
  InputNumber, Select, Popconfirm, message, Card, Image, Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDishes, createDish, updateDish, deleteDish, toggleDishStatus } from '../../api/dish';
import { getCategories } from '../../api/category';
import type { Dish, Category, CreateDishRequest } from '../../types';

const PLACEHOLDER = 'https://via.placeholder.com/60x60/e94560/ffffff?text=🍜';

const DishManage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<number | 'all'>('all');
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dishRes, catRes] = await Promise.all([getDishes(), getCategories()]);
      setDishes(dishRes.data);
      setCategories(catRes.data);
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || '未知分类';
  };

  const handleOpenModal = (dish?: Dish) => {
    setEditingDish(dish || null);
    form.setFieldsValue(
      dish
        ? { name: dish.name, categoryId: dish.categoryId, price: dish.price, images: dish.images, description: dish.description }
        : { name: '', categoryId: undefined, price: undefined, images: '', description: '' }
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload: CreateDishRequest = {
        name: values.name,
        categoryId: values.categoryId,
        price: values.price,
        images: values.images || '',
        description: values.description || '',
      };
      if (editingDish) {
        await updateDish(editingDish.id, payload);
        messageApi.success('菜品更新成功');
      } else {
        await createDish(payload);
        messageApi.success('菜品添加成功');
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
      await deleteDish(id);
      messageApi.success('删除成功');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '删除失败');
    }
  };

  const handleToggleStatus = async (id: number, current: number) => {
    try {
      await toggleDishStatus(id, current === 1 ? 0 : 1);
      messageApi.success('状态更新成功');
      fetchData();
    } catch (e: unknown) {
      messageApi.error(e instanceof Error ? e.message : '操作失败');
    }
  };

  const filteredDishes = filterCat === 'all'
    ? dishes
    : dishes.filter((d) => d.categoryId === filterCat);

  const columns: ColumnsType<Dish> = [
    {
      title: '菜品图片',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (v: string) => (
        <Image
          src={v || PLACEHOLDER}
          alt="dish"
          width={52}
          height={52}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
          fallback={PLACEHOLDER}
          preview={!!v}
        />
      ),
    },
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <span style={{ fontWeight: '600', fontSize: '14px' }}>{v}</span>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 110,
      render: (v: number) => (
        <Tag color="blue" style={{ borderRadius: '6px' }}>
          {getCategoryName(v)}
        </Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (v: number) => (
        <span style={{ color: '#e94560', fontWeight: '700', fontSize: '15px' }}>
          ¥{Number(v).toFixed(2)}
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v: string) => v ? (
        <Tooltip title={v}>
          <span style={{ fontSize: '13px', color: '#666' }}>{v}</span>
        </Tooltip>
      ) : <span style={{ color: '#ddd' }}>—</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (v: number, record: Dish) => (
        <Switch
          checked={v === 1}
          onChange={() => handleToggleStatus(record.id, v)}
          checkedChildren="在售"
          unCheckedChildren="停售"
          style={{ backgroundColor: v === 1 ? '#52c41a' : undefined }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Dish) => (
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
            title="确认删除此菜品？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
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
        style={{ borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>菜品管理</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Select
                value={filterCat}
                onChange={(v) => setFilterCat(v)}
                style={{ width: 140 }}
                options={[
                  { value: 'all', label: '全部分类' },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                style={{ borderRadius: '8px' }}
              >
                添加菜品
              </Button>
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredDishes}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 12,
            showTotal: (total) => `共 ${total} 道菜品`,
            showSizeChanger: false,
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ fontSize: '16px', fontWeight: '600', padding: '4px 0' }}>
            {editingDish ? '编辑菜品' : '添加菜品'}
          </div>
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        confirmLoading={saving}
        okText={editingDish ? '保存' : '添加'}
        cancelText="取消"
        width={500}
        styles={{ body: { padding: '24px 0 8px' } }}
        okButtonProps={{ style: { borderRadius: '8px' } }}
        cancelButtonProps={{ style: { borderRadius: '8px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="菜品名称"
            rules={[{ required: true, message: '请输入菜品名称' }]}
          >
            <Input placeholder="如：招牌红烧牛肉面" maxLength={30} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select
              placeholder="请选择分类"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格（元）"
            rules={[
              { required: true, message: '请输入价格' },
              { type: 'number', min: 0.01, message: '价格必须大于0' },
            ]}
          >
            <InputNumber
              placeholder="0.00"
              min={0.01}
              max={9999}
              precision={2}
              prefix="¥"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="images" label="图片URL（可选）">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="description" label="描述（可选）">
            <Input.TextArea
              placeholder="菜品描述，如配料、口味等..."
              maxLength={200}
              rows={3}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DishManage;
