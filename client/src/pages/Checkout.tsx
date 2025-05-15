import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const order = {
      id: Date.now(),
      name,
      address,
      items: JSON.parse(localStorage.getItem('cart') || '[]'),
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));
    localStorage.removeItem('cart');

    navigate('/success');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Họ tên người nhận"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
};

export default Checkout;
