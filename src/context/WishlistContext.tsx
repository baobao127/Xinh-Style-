import React, { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext<any>(null);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: any) => {
    const exists = wishlist.find((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const isInWishlist = (id: string | number) =>
    wishlist.some((p) => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);