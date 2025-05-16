import React, { useEffect, useState } from 'react';

const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((item) => (
          <div key={item.id} className="border p-3 rounded">
            <img src={item.image} alt={item.name} className="h-32 w-full object-cover mb-2" />
            <p className="font-bold">{item.name}</p>
            <p>{item.price.toLocaleString()}đ</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsView;
