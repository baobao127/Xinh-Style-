import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600">404 - Không tìm thấy trang</h2>
      <p className="mb-4">Oops! Đường dẫn không tồn tại.</p>
      <Link to="/" className="text-blue-600 hover:underline">Quay về trang chủ</Link>
    </div>
  );
};

export default NotFound;
