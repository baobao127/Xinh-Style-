import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ConfirmModal from '../components/common/ConfirmModal';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [removeId, setRemoveId] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <ul>
          {cart.map((item: any) => (
            <li key={item.id} className="mb-3">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-sm text-gray-500">{item.price.toLocaleString()}đ</div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="border px-2 w-16 mt-1"
                  />
                </div>
                <button
                  onClick={() => setRemoveId(item.id)}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmModal
        visible={!!removeId}
        message="Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ?"
        onConfirm={() => {
          if (removeId) removeFromCart(removeId);
          setRemoveId(null);
        }}
        onCancel={() => setRemoveId(null)}
      />
    </div>
  );
};

export default Cart;