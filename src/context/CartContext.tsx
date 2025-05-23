import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((p) => p.id !== id));
  const updateQuantity = (id: string, qty: number) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p))
    );

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);