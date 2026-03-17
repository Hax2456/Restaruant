import React, { useState } from 'react';
import { getOrderByNumber } from '../../api/order';
import type { Order } from '../../types';

const STATUS_MAP: Record<number, { label: string; color: string; bg: string; icon: string }> = {
  0: { label: '待支付', color: '#E65100', bg: '#FFF3E0', icon: '⏳' },
  1: { label: '已支付', color: '#1565C0', bg: '#E3F2FD', icon: '✅' },
  2: { label: '已完成', color: '#2E7D32', bg: '#E8F5E9', icon: '🎉' },
  3: { label: '已取消', color: '#757575', bg: '#F5F5F5', icon: '❌' },
};

const OrderQueryPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const num = orderNumber.trim();
    if (!num) {
      setError('请输入订单编号');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);
    setOrder(null);
    try {
      const res = await getOrderByNumber(num);
      setOrder(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '查询失败');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const status = order ? STATUS_MAP[order.status] : null;

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Title */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '6px' }}>📋</div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>查询订单</h2>
        <p style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>输入订单编号查看订单状态</p>
      </div>

      {/* Search Box */}
      <div style={{
        background: '#fff',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 2px 12px rgba(255,107,53,0.1)',
        marginBottom: '16px',
        border: '1px solid #f5ede8',
      }}>
        <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          订单编号
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入订单编号..."
            style={{
              flex: 1,
              padding: '11px 14px',
              border: '1.5px solid #f0e8e0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
              color: '#1a1a1a',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#FF6B35'; }}
            onBlur={(e) => { e.target.style.borderColor = '#f0e8e0'; }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '11px 20px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #FF6B35, #FF8C5A)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(255,107,53,0.35)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {loading ? '查询中' : '查询'}
          </button>
        </div>
        {error && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            background: '#FFF0F0',
            border: '1px solid #FFD0D0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#E53935',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <div style={{
            display: 'inline-block',
            width: '36px',
            height: '36px',
            border: '3px solid #f0e8e0',
            borderTop: '3px solid #FF6B35',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '10px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: '14px' }}>查询中...</div>
        </div>
      )}

      {/* Order Result */}
      {!loading && order && status && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Status Card */}
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(255,107,53,0.1)',
            border: '1px solid #f5ede8',
            marginBottom: '12px',
          }}>
            {/* Status Banner */}
            <div style={{
              background: `linear-gradient(135deg, ${status.color}22, ${status.color}11)`,
              borderBottom: `2px solid ${status.color}33`,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{ fontSize: '28px' }}>{status.icon}</span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: status.color }}>{status.label}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>订单状态</div>
              </div>
            </div>

            {/* Order Details */}
            <div style={{ padding: '16px 20px' }}>
              {[
                { label: '订单编号', value: order.orderNumber },
                { label: '桌台编号', value: order.tableId ? `${order.tableId} 号桌` : '—' },
                { label: '订单金额', value: `¥${Number(order.totalAmount).toFixed(2)}`, highlight: true },
                { label: '下单时间', value: order.createTime ? new Date(order.createTime).toLocaleString('zh-CN') : '—' },
                ...(order.remark ? [{ label: '备注', value: order.remark }] : []),
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5ede8',
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#999' }}>{label}</span>
                  <span style={{
                    fontSize: highlight ? '16px' : '14px',
                    fontWeight: highlight ? '700' : '500',
                    color: highlight ? '#FF6B35' : '#1a1a1a',
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(255,107,53,0.1)',
              border: '1px solid #f5ede8',
            }}>
              <div style={{
                padding: '14px 20px',
                borderBottom: '1px solid #f5ede8',
                fontSize: '15px',
                fontWeight: '600',
                color: '#1a1a1a',
              }}>
                订单明细
              </div>
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 20px',
                    borderBottom: idx < order.orderItems!.length - 1 ? '1px solid #f5ede8' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                      {item.dishName || `菜品 ${item.dishId}`}
                    </div>
                    {item.remark && (
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>备注: {item.remark}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.price && (
                      <span style={{ fontSize: '13px', color: '#999' }}>¥{Number(item.price).toFixed(2)}</span>
                    )}
                    <span style={{
                      background: '#FFF0E8',
                      color: '#FF6B35',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}>
                      ×{item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Result */}
      {!loading && searched && !order && !error && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#ccc' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontSize: '15px', color: '#999' }}>未找到该订单</div>
          <div style={{ fontSize: '13px', color: '#ccc', marginTop: '6px' }}>请确认订单编号是否正确</div>
        </div>
      )}

      {/* Initial hint */}
      {!searched && !loading && (
        <div style={{
          background: '#FFF8F5',
          borderRadius: '12px',
          padding: '16px',
          border: '1px dashed #F7C59F',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💡</div>
          <div style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
            下单成功后会显示订单编号<br />
            输入订单编号即可查询实时状态
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderQueryPage;
