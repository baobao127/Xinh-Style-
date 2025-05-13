import { useContext, useCallback } from 'react';
import { WishlistContext } from '@/context/WishlistContext';
import { WishlistItem } from '@/lib/localStorage';

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  const { wishlist, addToWishlist, removeFromWishlist } = context;
  
  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some(item => item.productId === productId);
  }, [wishlist]);
  
  // Move item from wishlist to cart
  const moveToCart = useCallback((productId: number) => {
    // This functionality will be implemented in the component that uses this hook
    return { productId };
  }, []);
  
  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
    wishlistCount: wishlist.length
  };
};
