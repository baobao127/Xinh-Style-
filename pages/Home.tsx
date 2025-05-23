import React, { useEffect, useState } from "react";
import { fetchProducts } from "../lib/fakeApi";
import ProductCard from "../components/ProductCard";
import SkeletonProduct from "../components/SkeletonProduct";
import SpinToWin from "../components/SpinToWin";
import QuickViewModal from "../components/QuickViewModal";
import FlashSaleBanner from "../components/FlashSaleBanner";
import ProductSuggestions from "../components/ProductSuggestions";
import { useCompare } from "../context/CompareContext";

const FLASH_SALE_END = new Date(Date.now() + 3600 * 1000 * 2); // 2h từ lúc load

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSpin, setShowSpin] = useState(false);
  const [quickProduct, setQuickProduct] = useState<any | null>(null);
  const { addToCompare } = useCompare();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const flashSaleProducts = products.slice(0, 2).map((p: any) => ({ ...p, price: Math.round(p.price * 0.7) }));

  return (
    <div className="p-4">
      <FlashSaleBanner endTime={FLASH_SALE_END} />
      <button
        className="mb-3 bg-pink-500 text-white px-4 py-2 rounded"
        onClick={() => setShowSpin(true)}
      >
        Thử vận may vòng quay
      </button>
      <h1 className="text-xl font-bold mb-4">Flash Sale</h1>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonProduct key={i} />)
          : flashSaleProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={() => setQuickProduct(p)}
              />
            ))}
      </div>
      <h1 className="text-xl font-bold mb-4">Sản phẩm nổi bật</h1>
      <div className="grid grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonProduct key={i} />)
          : products.slice(2).map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={() => setQuickProduct(p)}
              />
            ))}
      </div>
      <div className="my-8">
        <ProductSuggestions products={products} onQuickView={setQuickProduct} />
      </div>
      {showSpin && <SpinToWin onClose={() => setShowSpin(false)} />}
      <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} />
    </div>
  );
};
export default Home;