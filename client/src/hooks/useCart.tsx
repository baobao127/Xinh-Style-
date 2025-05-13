import { useContext, useCallback } from 'react';
import { CartContext } from '@/context/CartContext';
import { CartItem } from '@/lib/localStorage';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  const { cart, addToCart, updateCartItem, removeCartItem, clearCart } = context;
  
  // Calculate total price
  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);
  
  // Calculate number of items in cart
  const cartItemsCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);
  
  // Check if product is in cart
  const isInCart = useCallback((productId: number, size?: string, color?: string) => {
    return cart.some(
      (item) => 
        item.productId === productId && 
        (!size || item.size === size) && 
        (!color || item.color === color)
    );
  }, [cart]);
  
  // Find product in cart and return index
  const findCartItemIndex = useCallback((productId: number, size?: string, color?: string) => {
    return cart.findIndex(
      (item) => 
        item.productId === productId && 
        (!size || item.size === size) && 
        (!color || item.color === color)
    );
  }, [cart]);
  
  return {
    cart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    calculateTotal,
    cartItemsCount: cartItemsCount(),
    isInCart,
    findCartItemIndex
  };
};
