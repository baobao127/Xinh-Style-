import React from 'react';
import { Link } from 'react-router-dom';

const Success: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h1>
      <p className="text-gray-700 mb-6">Cảm ơn bạn đã mua sắm tại XinhStyle. Đơn hàng sẽ được xử lý trong thời gian sớm nhất.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
      >
        Về trang chủ
      </Link>
    </div>
  );
};

export default Success;
