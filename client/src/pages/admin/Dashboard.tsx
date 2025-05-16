import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 text-center space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="space-x-4">
        <Link to="/admin/products" className="bg-blue-600 text-white px-4 py-2 rounded">Quản lý sản phẩm</Link>
        <Link to="/admin/orders" className="bg-green-600 text-white px-4 py-2 rounded">Quản lý đơn hàng</Link>
        <Link to="/admin/users" className="bg-gray-600 text-white px-4 py-2 rounded">Quản lý người dùng</Link>
      </div>
    </div>
  );
};

export default Dashboard;
