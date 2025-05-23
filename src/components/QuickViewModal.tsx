import React from 'react';
import { Product } from './ProductCard';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-[90vw] relative">
        <button className="absolute right-2 top-2 text-gray-600" onClick={onClose}>✕</button>
        <img src={product.image} alt={product.name} className="w-48 h-48 object-cover mx-auto rounded mb-4" />
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <div className="text-pink-500 font-semibold mb-2">{product.price.toLocaleString()}đ</div>
        <p className="text-gray-600 mb-2">{product.description || 'Đang cập nhật mô tả...'}</p>
        <button className="bg-black text-white px-4 py-2 rounded" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default QuickViewModal;