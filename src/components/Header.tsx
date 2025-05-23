import React from 'react';
import { Link } from 'react-router-dom';
import CartBadge from './badges/CartBadge';
import WishlistBadge from './badges/WishlistBadge';

const Header = () => (
  <header className="bg-white shadow sticky top-0 z-40">
    <div className="max-w-4xl mx-auto flex justify-between items-center h-14 px-3">
      <Link to="/" className="text-2xl font-bold text-pink-600">XinhStyle</Link>
      <nav className="flex gap-4 items-center">
        <Link to="/products">Sản phẩm</Link>
        <Link to="/wishlist" className="relative">
          Yêu thích
          <WishlistBadge />
        </Link>
        <Link to="/cart" className="relative">
          Giỏ hàng
          <CartBadge />
        </Link>
      </nav>
    </div>
  </header>
);
export default Header;