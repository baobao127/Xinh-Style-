import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

const Checkout: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { visible, message, showToast } = useToast();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      showToast('Vui lòng nhập đầy đủ họ tên và địa chỉ.');
      return;
    }

    setSubmitting(true);

    const newOrder = {
      id: Date.now(),
      name,
      address,
      paymentMethod: payment,
      items: JSON.parse(localStorage.getItem('cart') || '[]'),
      createdAt: new Date().toISOString(),
      status: payment === 'bank' ? 'pending' : 'processing',
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...orders, newOrder]));
    localStorage.removeItem('cart');

    showToast('Đặt hàng thành công!', 'success');

    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>
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
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
          <option value="bank">Chuyển khoản ngân hàng</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
        </button>
      </form>
      <Toast visible={visible} message={message} type="success" />
    </div>
  );
};

export default Checkout;