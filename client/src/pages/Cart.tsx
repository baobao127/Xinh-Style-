import React, { useContext } from "react";
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { CartContext } from "@/context/CartContext";

export default function Cart() {
  const { cart, calculateTotal, removeCartItem } = useContext(CartContext)!;

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
                <button
                  className="text-red-500 hover:underline ml-2"
                  onClick={() => {
                    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
                      removeCartItem(index);
                    }
                  }}
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
          <h2>Tổng: {calculateTotal().toLocaleString()}đ</h2>
        </div>
      )}
    </div>
  );
          }
