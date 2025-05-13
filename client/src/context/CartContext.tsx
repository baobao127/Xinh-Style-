import { createContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, getCart, setCart } from '@/lib/localStorage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartItem: (index: number, quantity: number) => void;
  removeCartItem: (index: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCartState] = useState<CartItem[]>([]);
  
  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = getCart();
    setCartState(storedCart);
  }, []);
  
  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setCartState(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        cartItem => 
          cartItem.productId === item.productId && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );
      
      let newCart;
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        newCart = [...prevCart, item];
      }
      
      // Save to localStorage
      setCart(newCart);
      
      return newCart;
    });
  };
  
  // Update item quantity
  const updateCartItem = (index: number, quantity: number) => {
    setCartState(prevCart => {
      if (index < 0 || index >= prevCart.length) return prevCart;
      
      const newCart = [...prevCart];
      newCart[index].quantity = quantity;
      
      // Save to localStorage
      setCart(newCart);
      
      return newCart;
    });
  };
  
  // Remove item from cart
  const removeCartItem = (index: number) => {
    setCartState(prevCart => {
      if (index < 0 || index >= prevCart.length) return prevCart;
      
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      
      // Save to localStorage
      setCart(newCart);
      
      return newCart;
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCartState([]);
    setCart([]);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
