import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  }, []);

  const handleRemove = (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này không?')) return;
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="p-4">
        <p>Giỏ hàng trống. <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/products')}>Mua ngay</span></p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center border p-3 rounded">
          <div>
            <p className="font-bold">{item.name}</p>
            <p>{item.price.toLocaleString()}đ</p>
          </div>
          <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:underline">Xoá</button>
        </div>
      ))}
      <p className="text-right font-bold">Tổng cộng: {getTotal().toLocaleString()}đ</p>
      <button onClick={handleCheckout} className="bg-green-600 text-white px-4 py-2 rounded">Thanh toán</button>
    </div>
  );
};

export default Cart;
