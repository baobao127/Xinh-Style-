import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductsView from '@/pages/ProductsView';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Success from '@/pages/Success';
import Orders from '@/pages/Orders';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="all-products" element={<ProductsView />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="success" element={<Success />} />
        <Route path="orders" element={<Orders />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductsEditor />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;





