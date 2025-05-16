import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h2>
      <p className="mb-4">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng sớm nhất.</p>
      <div className="space-x-2">
        <button onClick={() => navigate('/orders')} className="bg-blue-600 text-white px-4 py-2 rounded">Xem đơn hàng</button>
        <button onClick={() => navigate('/products')} className="bg-gray-300 px-4 py-2 rounded">Tiếp tục mua</button>
      </div>
    </div>
  );
};

export default Success;
