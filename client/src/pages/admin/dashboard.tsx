import React from 'react';

const Dashboard: React.FC = () => {
  const totalProducts = JSON.parse(localStorage.getItem('products') || '[]').length;
  const totalOrders = JSON.parse(localStorage.getItem('orders') || '[]').length;
  const totalUsers = JSON.parse(localStorage.getItem('users') || '[]').length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bảng điều khiển</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-gray-600">Tổng sản phẩm</p>
          <p className="text-xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-gray-600">Tổng đơn hàng</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-gray-600">Tổng người dùng</p>
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
