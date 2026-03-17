import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/Menu';
import CartPage from './pages/Cart';
import OrderQueryPage from './pages/OrderQuery';

const NavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: '#fff',
      borderTop: '1px solid #f0e8e0',
      display: 'flex',
      zIndex: 100,
      boxShadow: '0 -4px 16px rgba(255,107,53,0.1)',
    }}>
      {[
        { to: '/', label: '菜单', icon: '🍜' },
        { to: '/cart', label: '购物车', icon: '🛒' },
        { to: '/order', label: '查询订单', icon: '📋' },
      ].map(({ to, label, icon }) => {
        const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 4px',
              textDecoration: 'none',
              color: active ? '#FF6B35' : '#999',
              fontSize: '10px',
              fontWeight: active ? '600' : '400',
              transition: 'color 0.2s',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
          {/* Header */}
          <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7C59F 100%)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(255,107,53,0.3)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '2px' }}>
                香记面馆
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginTop: '1px', letterSpacing: '1px' }}>
                正宗手工面 · 新鲜美味
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderQueryPage />} />
          </Routes>

          <NavBar />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
