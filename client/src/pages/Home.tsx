import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Chào mừng đến với XinhStyle</h2>
      <p className="mb-4">Nơi tụ hội những món đồ Quảng Châu chất lừ!</p>
      <Link to="/products" className="bg-blue-600 text-white px-4 py-2 rounded">Xem sản phẩm</Link>
    </div>
  );
};

export default Home;
