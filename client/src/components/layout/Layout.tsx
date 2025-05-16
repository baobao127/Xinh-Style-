import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">
          <Link to="/">XinhStyle</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/products" className="hover:underline">Sản phẩm</Link>
          <Link to="/cart" className="hover:underline">Giỏ hàng</Link>
          <Link to="/orders" className="hover:underline">Đơn hàng</Link>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        © 2025 XinhStyle. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
