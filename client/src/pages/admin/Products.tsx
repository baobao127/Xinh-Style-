import React, { useEffect, useState } from 'react';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm (Admin)</h2>
      <ul className="space-y-2">
        {products.map((p: any) => (
          <li key={p.id} className="border p-2 rounded flex justify-between">
            <span>{p.name}</span>
            <span>{p.price.toLocaleString()}đ</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
