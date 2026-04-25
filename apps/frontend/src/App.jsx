import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FashionHome from './pages/customer/homepage'
import Login from './pages/customer/login'
import Signup from './pages/customer/signup'
import Profile from './pages/customer/profile'
import About from './pages/customer/about'
import Products from './pages/customer/products'
import Contact from './pages/customer/contact'
import Cart from './pages/customer/cart'
import SellerRegister from './pages/seller/seller-register'
import SellerLogin from './pages/seller/seller-login'
import AdminDashboard from './pages/admin/admin-dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FashionHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/seller-register" element={<SellerRegister />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
