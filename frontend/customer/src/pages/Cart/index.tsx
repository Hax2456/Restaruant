import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/order';
import { getAvailableTables } from '../../api/table';
import type { DiningTable } from '../../types';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch, totalItems, totalAmount, addItem, removeItem } = useCart();
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | ''>('');
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const res = await getAvailableTables();
        setTables(res.data);
      } catch {
        // Try all tables if status filter fails
        try {
          const { getAllTables } = await import('../../api/table');
          const res2 = await getAllTables();
          setTables(res2.data.filter((t) => t.status === 1));
        } catch {
          setTables([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const handleSubmit = async () => {
    if (state.items.length === 0) {
      setError('购物车为空，请先选择菜品');
      return;
    }
    if (!selectedTableId) {
      setError('请选择用餐桌台');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await createOrder({
        tableId: selectedTableId as number,
        remark,
        items: state.items.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          remark: item.remark,
        })),
      });
      const num = res.data?.orderNumber || String(res.data?.id) || '未知';
      setOrderNumber(num);
      setSuccess('订单提交成功！');
      dispatch({ type: 'CLEAR_CART' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
          animation: 'bounceIn 0.5s ease',
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>下单成功！</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>请等待工作人员为您服务</p>
        <div style={{
          background: '#FFF0E8',
          border: '1.5px dashed #FF6B35',
          borderRadius: '10px',
          padding: '12px 24px',
          marginTop: '16px',
          marginBottom: '28px',
        }}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>订单编号</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35', letterSpacing: '1px' }}>{orderNumber}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/order')}
            style={{
              padding: '11px 22px',
              border: '2px solid #FF6B35',
              borderRadius: '22px',
              background: '#fff',
              color: '#FF6B35',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            查看订单
          </button>
          <button
            onClick={() => { setSuccess(''); navigate('/'); }}
            style={{
              padding: '11px 22px',
              border: 'none',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(255,107,53,0.4)',
            }}
          >
            继续点餐
          </button>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}>🛒</div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>购物车是空的</h3>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '24px' }}>快去挑选心仪的面食吧</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 3px 14px rgba(255,107,53,0.4)',
          }}
        >
          去点餐
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Cart Items */}
      <div style={{ background: '#fff', marginBottom: '8px' }}>
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid #f5ede8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
            已选菜品
            <span style={{
              marginLeft: '8px',
              background: '#FF6B35',
              color: '#fff',
              borderRadius: '12px',
              padding: '1px 8px',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {totalItems}
            </span>
          </span>
          <button
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            清空
          </button>
        </div>

        {state.items.map((item) => (
          <div
            key={item.dish.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderBottom: '1px solid #f5ede8',
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#FFF0E8',
            }}>
              <img
                src={(item.dish.images || item.dish.image) || 'https://via.placeholder.com/52x52/FF6B35/ffffff?text=🍜'}
                alt={item.dish.name}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/52x52/FF6B35/ffffff?text=🍜'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>
                {item.dish.name}
              </div>
              <div style={{ fontSize: '14px', color: '#FF6B35', fontWeight: '600' }}>
                ¥{Number(item.dish.price).toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={() => removeItem(item.dish.id)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '2px solid #FF6B35',
                  background: '#fff',
                  color: '#FF6B35',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <span style={{ fontSize: '15px', fontWeight: '600', minWidth: '16px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => addItem(item.dish)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255,107,53,0.4)',
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Info */}
      <div style={{ background: '#fff', padding: '16px', marginBottom: '8px' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#1a1a1a' }}>
          用餐信息
        </div>

        {/* Table Selector */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            选择桌台 <span style={{ color: '#FF6B35' }}>*</span>
          </label>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value ? Number(e.target.value) : '')}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1.5px solid #f0e8e0',
              borderRadius: '10px',
              fontSize: '14px',
              color: selectedTableId ? '#1a1a1a' : '#999',
              background: '#fff',
              outline: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
          >
            <option value="">{loading ? '加载中...' : '请选择桌台'}</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.tableNumber} 号桌（{table.seats} 人座）
              </option>
            ))}
          </select>
        </div>

        {/* Remark */}
        <div>
          <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '6px' }}>
            备注（可选）
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="如：不要辣、少放盐..."
            maxLength={100}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1.5px solid #f0e8e0',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#1a1a1a',
              background: '#fff',
              outline: 'none',
              resize: 'none',
              height: '80px',
              lineHeight: '1.5',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: '#fff', padding: '14px 16px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#999' }}>合计 ({totalItems} 份)</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B35' }}>
            ¥{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          margin: '0 16px 8px',
          padding: '10px 14px',
          background: '#FFF0F0',
          border: '1px solid #FFD0D0',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#E53935',
        }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div style={{ position: 'fixed', bottom: '68px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '448px', zIndex: 90 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '15px',
            background: submitting ? '#ccc' : 'linear-gradient(135deg, #FF6B35, #E5501A)',
            color: '#fff',
            border: 'none',
            borderRadius: '28px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: submitting ? 'none' : '0 4px 20px rgba(255,107,53,0.45)',
            transition: 'all 0.2s',
            letterSpacing: '1px',
          }}
        >
          {submitting ? '提交中...' : `提交订单 · ¥${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
