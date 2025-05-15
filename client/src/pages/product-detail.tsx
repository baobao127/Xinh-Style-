import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('products') || '[]');
    const found = all.find((p: any) => p.id === id);
    if (found) setProduct(found);
  }, [id]);

  if (!product) return <p className="p-4">Không tìm thấy sản phẩm</p>;

  return (
    <div className="p-4">
      <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded mb-4" />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p>{product.description}</p>
      <p className="text-blue-600 font-semibold">{product.price.toLocaleString()}đ</p>
    </div>
  );
};

export default ProductDetail;
