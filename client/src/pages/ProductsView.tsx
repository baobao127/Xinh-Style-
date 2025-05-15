import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded p-3 shadow hover:shadow-lg transition">
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-blue-600 font-semibold mt-2">{product.price.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
};

export default ProductsView;
