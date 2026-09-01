import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CustomerDashboard from './pages/CustomerDashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import VendorDashboard from './pages/VendorDashboard'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorProducts from './pages/vendor/VendorProducts'
import VendorAddProduct from './pages/vendor/VendorAddProduct'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminAddUser from './pages/admin/AdminAddUser'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<Navigate to="/customer/products" replace />} />
        <Route path="/customer/products" element={<Products />} />
        <Route path="/customer/orders" element={<Orders />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/vendor" element={<Navigate to="/vendor/products" replace />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/add-product" element={<VendorAddProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/add-user" element={<AdminAddUser />} />
        <Route path="/admin/add-vendor" element={<Navigate to="/admin/add-user" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
