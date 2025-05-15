import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import NotFound from '@/pages/NotFound';
import Checkout from '@/pages/Checkout';
import Success from '@/pages/Success';
import Cart from '@/pages/Cart';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';

// Khách
import Products from '@/pages/Products';
import ProductsView from '@/pages/ProductsView';

// Admin
import AdminProducts from '@/pages/admin/Products';
import ProductsEditor from '@/pages/admin/ProductsEditor';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route khách */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="all-products" element={<ProductsView />} />
        {/* các route khác của khách */}
      </Route>

      {/* Route admin */}
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/product-editor" element={<ProductsEditor />} />
    </Routes>
  );
};

export default AppRoutes;
