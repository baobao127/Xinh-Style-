import { STORAGE_KEYS } from "./constants";

// Generic function to get data from localStorage
export function getStorageData<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue;
  }
}

// Generic function to set data in localStorage
export function setStorageData<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
}

// Generic function to remove data from localStorage
export function removeStorageData(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
  }
}

// Cart related functions
export interface CartItem {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  name: string;
  image: string;
}

export function getCart(): CartItem[] {
  return getStorageData<CartItem[]>(STORAGE_KEYS.cart, []);
}

export function setCart(cart: CartItem[]): void {
  setStorageData(STORAGE_KEYS.cart, cart);
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (cartItem) => 
      cartItem.productId === item.productId && 
      cartItem.size === item.size && 
      cartItem.color === item.color
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.push(item);
  }

  setCart(cart);
  return cart;
}

export function updateCartItem(index: number, quantity: number): CartItem[] {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart[index].quantity = quantity;
    setCart(cart);
  }
  return cart;
}

export function removeCartItem(index: number): CartItem[] {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    setCart(cart);
  }
  return cart;
}

export function clearCart(): void {
  setCart([]);
}

// Wishlist related functions
export interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  image: string;
}

export function getWishlist(): WishlistItem[] {
  return getStorageData<WishlistItem[]>(STORAGE_KEYS.wishlist, []);
}

export function setWishlist(wishlist: WishlistItem[]): void {
  setStorageData(STORAGE_KEYS.wishlist, wishlist);
}

export function addToWishlist(item: WishlistItem): WishlistItem[] {
  const wishlist = getWishlist();
  const existingItemIndex = wishlist.findIndex(
    (wishlistItem) => wishlistItem.productId === item.productId
  );

  if (existingItemIndex === -1) {
    // Only add if not already in wishlist
    wishlist.push(item);
    setWishlist(wishlist);
  }

  return wishlist;
}

export function removeFromWishlist(productId: number): WishlistItem[] {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(
    (item) => item.productId !== productId
  );
  setWishlist(updatedWishlist);
  return updatedWishlist;
}

export function isInWishlist(productId: number): boolean {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.productId === productId);
}

// Auth related functions
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: string;
}

export function getAuthUser(): AuthUser | null {
  return getStorageData<AuthUser | null>(STORAGE_KEYS.auth, null);
}

export function setAuthUser(user: AuthUser): void {
  setStorageData(STORAGE_KEYS.auth, user);
}

export function clearAuthUser(): void {
  removeStorageData(STORAGE_KEYS.auth);
}

// Recently viewed products
export interface RecentlyViewedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  slug: string;
  viewedAt: number;
}

export function getRecentlyViewed(): RecentlyViewedProduct[] {
  return getStorageData<RecentlyViewedProduct[]>(STORAGE_KEYS.recentlyViewed, []);
}

export function addToRecentlyViewed(product: Omit<RecentlyViewedProduct, 'viewedAt'>): RecentlyViewedProduct[] {
  const recentlyViewed = getRecentlyViewed();
  
  // Remove if already exists
  const filteredList = recentlyViewed.filter((item) => item.id !== product.id);
  
  // Add to beginning with timestamp
  const newItem: RecentlyViewedProduct = { ...product, viewedAt: Date.now() };
  const updatedList = [newItem, ...filteredList].slice(0, 10); // Keep only 10 items
  
  setStorageData(STORAGE_KEYS.recentlyViewed, updatedList);
  return updatedList;
}
