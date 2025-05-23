import React from 'react';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

const ProductCard: React.FC<{
  product: Product;
  onQuickView?: () => void;
}> = ({ product, onQuickView }) => (
  <div className="border rounded p-2 shadow-sm">
    <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded" />
    <div className="mt-2 font-bold">{product.name}</div>
    <div className="text-pink-500">{product.price.toLocaleString()}đ</div>
    {onQuickView && (
      <button className="mt-2 text-xs underline" onClick={onQuickView}>
        Xem nhanh
      </button>
    )}
  </div>
);

export default ProductCard;