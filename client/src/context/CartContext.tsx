import { createContext, useState, useEffect, ReactNode } from "react";
import { CartItem, getCart, setCart, saveTemporaryProduct, getTemporaryProduct } from "@/lib/localStorage";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (index: number, quantity: number) => void;
  removeCartItem: (index: number) => void;
  clearCart: () => void;
  saveTempProduct: (product: CartItem) => void;
  loadTempProduct: () => CartItem | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCartState] = useState<CartItem[]>([]);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = getCart();
    setCartState(storedCart);
  }, []);

  // Save temporary product
  const saveTempProduct = (product: CartItem) => {
    saveTemporaryProduct(product);
  };

  // Load temporary product
  const loadTempProduct = (): CartItem | null => {
    return getTemporaryProduct();
  };

  // Other cart functions (addToCart, updateCartItem, etc.) remain unchanged

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        saveTempProduct,
        loadTempProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};