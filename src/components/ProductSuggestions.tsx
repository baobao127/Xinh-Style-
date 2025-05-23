import React from "react";
import { Product } from "./ProductCard";

interface ProductSuggestionsProps {
  products: Product[];
  excludeId?: string | number;
  onQuickView?: (product: Product) => void;
}
const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({ products, excludeId, onQuickView }) => {
  let suggestions = products.filter((p) => p.id !== excludeId);
  // Nếu có category, ưu tiên cùng loại
  if (excludeId) {
    const current = products.find((p) => p.id === excludeId);
    if (current?.category) {
      suggestions = suggestions.filter((p) => p.category === current.category);
    }
  }
  suggestions = suggestions.slice(0, 3);

  return (
    <div>
      <h4 className="font-semibold mb-2">Sản phẩm đề xuất</h4>
      <div className="grid grid-cols-3 gap-2">
        {suggestions.map((p) => (
          <div key={p.id} className="border p-2 rounded">
            <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded mb-1" />
            <div className="text-xs font-bold">{p.name}</div>
            <div className="text-xs text-pink-500">{p.price.toLocaleString()}đ</div>
            {onQuickView && (
              <button className="text-xs underline" onClick={() => onQuickView(p)}>
                Xem nhanh
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductSuggestions;