import React, { useState } from 'react';
import DiscountManager from './DiscountManager';

const AdminDashboard: React.FC = () => {
  const [showDiscount, setShowDiscount] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Trang quản trị</h1>
      <button
        className="bg-pink-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowDiscount((s) => !s)}
      >
        {showDiscount ? 'Ẩn quản lý mã giảm giá' : 'Quản lý mã giảm giá'}
      </button>
      {showDiscount && <DiscountManager />}
      {/* Các module admin khác có thể bổ sung tại đây */}
    </div>
  );
};

export default AdminDashboard;