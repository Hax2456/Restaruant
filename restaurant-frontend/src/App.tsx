import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Dishes from './pages/admin/Dishes'
import Tables from './pages/admin/Tables'
import Orders from './pages/admin/Orders'
import CustomerOrder from './pages/customer/Order'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="dishes" element={<Dishes />} />
          <Route path="tables" element={<Tables />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/order" element={<CustomerOrder />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
