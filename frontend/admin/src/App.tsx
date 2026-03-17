import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LayoutPage from './pages/Layout';
import OrderManage from './pages/OrderManage';
import DishManage from './pages/DishManage';
import CategoryManage from './pages/CategoryManage';
import TableManage from './pages/TableManage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#e94560',
          borderRadius: 8,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<Navigate to="/orders" replace />} />
            <Route path="orders" element={<OrderManage />} />
            <Route path="dishes" element={<DishManage />} />
            <Route path="categories" element={<CategoryManage />} />
            <Route path="tables" element={<TableManage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
