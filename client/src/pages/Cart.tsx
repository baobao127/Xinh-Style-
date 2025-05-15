import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function Cart() {
  const { cart, calculateTotal, removeCartItem } = useContext(CartContext)!;
  <button
  onClick={() => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này không?')) {
      handleRemove(product.id);
    }
  }}
  className="text-red-500 hover:underline"
>
  Xoá
</button>

  return (
    <div className="cart-page">
      <h1>Giỏ hàng</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x {item.price.toLocaleString()}đ
                <button onClick={() => removeCartItem(index)}>Xóa</button>
              </li>
            ))}
          </ul>
          <h2>Tổng: {calculateTotal().toLocaleString()}đ</h2>
        </div>
      )}
    </div>
  );
}
