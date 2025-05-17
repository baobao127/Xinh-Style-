import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="border p-3 rounded shadow-sm hover:shadow-md transition">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
      )}
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-blue-600 font-semibold">{product.price.toLocaleString()}đ</p>
    </div>
  );
};

export default ProductCard;
