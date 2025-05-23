import React from "react";
import { useCompare } from "../context/CompareContext";

const Compare: React.FC = () => {
  const { compare, removeFromCompare, clearCompare } = useCompare();

  if (compare.length === 0) return <div className="p-4">Chưa có sản phẩm nào để so sánh.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">So sánh sản phẩm</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th></th>
              {compare.map((p) => (
                <th key={p.id} className="border px-2 py-1 text-center">
                  {p.name}
                  <button className="ml-2 text-xs text-red-500" onClick={() => removeFromCompare(p.id)}>
                    X
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ảnh</td>
              {compare.map((p) => (
                <td key={p.id} className="border text-center">
                  <img src={p.image} alt={p.name} className="h-20 mx-auto" />
                </td>
              ))}
            </tr>
            <tr>
              <td>Giá</td>
              {compare.map((p) => (
                <td key={p.id} className="border text-center text-pink-500 font-bold">
                  {p.price.toLocaleString()}đ
                </td>
              ))}
            </tr>
            <tr>
              <td>Mô tả</td>
              {compare.map((p) => (
                <td key={p.id} className="border text-xs">{p.description || "..."}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <button className="mt-4 bg-gray-300 px-3 py-1 rounded" onClick={clearCompare}>
        Xóa tất cả
      </button>
    </div>
  );
};
export default Compare;