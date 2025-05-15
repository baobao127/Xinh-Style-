import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '@/components/layout/Layout';

import Home from '@/pages/Home';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Success from '@/pages/Success';
import NotFound from '@/pages/NotFound';

import Products from '@/pages/Products';
import ProductsView from '@/pages/ProductsView';
import Orders from '@/pages/Orders';
import Wishlist from '@/pages/wishlist';
import Account from '@/pages/account';
import Login from '@/pages/login';
import Register from '@/pages/register';
import ProductDetail from '@/pages/product-detail';

import AdminProducts from '@/pages/admin/Products';
import ProductsEditor from '@/pages/admin/ProductsEditor';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminOrders from '@/pages/admin/orders';
import AdminUsers from '@/pages/admin/users';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="all-products" element={<ProductsView />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="success" element={<Success />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Route Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/product-editor" element={<ProductsEditor />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Routes>
  );
};

export default AppRoutes;
