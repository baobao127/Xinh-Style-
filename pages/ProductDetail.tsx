import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../lib/fakeApi";
import { useCompare } from "../context/CompareContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductSuggestions from "../components/ProductSuggestions";

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const { addToCompare, compare } = useCompare();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      const found = data.find((p) => String(p.id) === id);
      setProduct(found);
      if (!found) setTimeout(() => navigate("/products"), 1500);
    });
  }, [id, navigate]);

  if (!product) return <div className="p-4 text-center">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image} alt={product.name} className="w-80 h-80 object-cover rounded shadow mx-auto border" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-lg text-pink-600 font-semibold mb-2">{product.price.toLocaleString()}đ</div>
          <p className="mb-2 text-gray-600">{product.description || "Chưa có mô tả."}</p>
          <div className="flex gap-2 mt-2">
            <button className="bg-black text-white px-4 py-2 rounded" onClick={() => addToCart(product)}>
              Thêm vào giỏ
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => addToCompare(product)}>
              {compare.some((p: any) => p.id === product.id) ? "Đã so sánh" : "So sánh"}
            </button>
            <button
              className={`px-4 py-2 rounded ${isInWishlist(product.id) ? "bg-pink-400 text-white" : "bg-gray-200"}`}
              onClick={() => toggleWishlist(product)}
            >
              {isInWishlist(product.id) ? "Đã yêu thích" : "Yêu thích"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ProductSuggestions products={products} excludeId={product.id} />
      </div>
    </div>
  );
};
export default ProductDetail;