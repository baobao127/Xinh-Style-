import { createContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem, getWishlist, setWishlist } from '@/lib/localStorage';

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlistState] = useState<WishlistItem[]>([]);
  
  // Initialize wishlist from localStorage
  useEffect(() => {
    const storedWishlist = getWishlist();
    setWishlistState(storedWishlist);
  }, []);
  
  // Add an item to the wishlist
  const addToWishlist = (item: WishlistItem) => {
    setWishlistState(prevWishlist => {
      // Check if item already exists in wishlist
      const exists = prevWishlist.some(wishlistItem => wishlistItem.productId === item.productId);
      
      if (exists) {
        return prevWishlist;
      }
      
      const newWishlist = [...prevWishlist, item];
      
      // Save to localStorage
      setWishlist(newWishlist);
      
      return newWishlist;
    });
  };
  
  // Remove item from wishlist
  const removeFromWishlist = (productId: number) => {
    setWishlistState(prevWishlist => {
      const newWishlist = prevWishlist.filter(item => item.productId !== productId);
      
      // Save to localStorage
      setWishlist(newWishlist);
      
      return newWishlist;
    });
  };
  
  // Check if an item is in the wishlist
  const isInWishlist = (productId: number): boolean => {
    return wishlist.some(item => item.productId === productId);
  };
  
  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
