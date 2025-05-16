import React, { useEffect, useState } from 'react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border p-3 rounded">
          <img src={p.image} alt={p.name} className="h-32 w-full object-cover mb-2" />
          <h3 className="font-bold">{p.name}</h3>
          <p>{p.price.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
