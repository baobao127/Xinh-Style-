import React, { useEffect, useState } from 'react';
import ProductList from './components/ProductList';
import EmptyState from './components/EmptyState';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
      {products.length > 0 ? <ProductList products={products} /> : <EmptyState />}
    </div>
  );
};

export default Home;
