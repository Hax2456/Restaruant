import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Badge } from 'antd';
import { getOrdersByStatus } from '../../api/order';

const menuItems = [
  { key: '/orders', icon: '📋', label: '订单管理' },
  { key: '/dishes', icon: '🍜', label: '菜品管理' },
  { key: '/categories', icon: '🏷️', label: '分类管理' },
  { key: '/tables', icon: '🪑', label: '餐桌管理' },
];

const LayoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await getOrdersByStatus(0);
        setPendingCount(res.data.length);
      } catch {
        // ignore
      }
    };
    fetchPending();
    const timer = setInterval(fetchPending, 10000);
    return () => clearInterval(timer);
  }, []);

  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f2f5', width: '100%' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarWidth,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '24px 16px' : '28px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          flexShrink: 0,
        }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span style={{ fontSize: '28px', flexShrink: 0 }}>🍜</span>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', letterSpacing: '1px' }}>
                香记面馆
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
                后台管理系统
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.key ||
              (item.key !== '/' && location.pathname.startsWith(item.key));
            return (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: collapsed ? '13px 20px' : '13px 24px',
                  margin: '3px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(135deg, rgba(233,69,96,0.9), rgba(233,69,96,0.7))'
                    : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s',
                  boxShadow: active ? '0 4px 15px rgba(233,69,96,0.35)' : 'none',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ fontSize: '14px', fontWeight: active ? '600' : '400', flex: 1 }}>
                      {item.label}
                    </span>
                    {item.key === '/orders' && pendingCount > 0 && (
                      <Badge
                        count={pendingCount}
                        style={{ backgroundColor: '#faad14' }}
                        size="small"
                      />
                    )}
                  </>
                )}
                {collapsed && item.key === '/orders' && pendingCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#faad14',
                  }} />
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '11px',
            textAlign: 'center',
          }}>
            香记面馆 © 2024
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top Bar */}
        <header style={{
          height: '60px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: '#999', fontSize: '13px' }}>
              {menuItems.find(m => m.key === location.pathname || location.pathname.startsWith(m.key))?.label || '管理后台'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {pendingCount > 0 && (
              <div style={{
                background: '#fff7e6',
                border: '1px solid #ffd591',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '12px',
                color: '#d46b08',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
                onClick={() => navigate('/orders')}
              >
                <span>⚡</span>
                <span>{pendingCount} 个待处理订单</span>
              </div>
            )}
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e94560, #c73652)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}>
              👤
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          background: '#f0f2f5',
        }}>
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;
