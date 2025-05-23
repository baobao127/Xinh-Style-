import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProductsView from "../pages/ProductsView";
import Compare from "../pages/Compare";
import ProductDetail from "../pages/ProductDetail";
import OrderHistory from "../pages/OrderHistory";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ProductManager from "../pages/Admin/ProductManager";
import DiscountManager from "../pages/Admin/DiscountManager";
import OrderList from "../pages/Admin/OrderList";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/products" element={<ProductsView />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/compare" element={<Compare />} />
    <Route path="/order-history" element={<OrderHistory />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<ProductManager />} />
    <Route path="/admin/discounts" element={<DiscountManager />} />
    <Route path="/admin/orders" element={<OrderList />} />
  </Routes>
);
export default AppRoutes;