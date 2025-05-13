import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { Suspense } from 'react';
import SequentialProductGrid from '@/components/product/SequentialProductGrid';

const TrendingProducts = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold">Sản Phẩm Nổi Bật</h2>
        <Link href="/products" className="text-primary text-sm font-medium">
          Xem tất cả
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse">
              <div className="h-3/4 bg-gray-200 rounded-t-lg"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Suspense fallback={<div>Đang tải...</div>}>
          <SequentialProductGrid
            products={products || []}
            columns={2}
            initialCount={2}
            itemsPerBatch={2}
            showLoadMore={false}
            className="md:grid-cols-4"
          />
        </Suspense>
      )}
    </div>
  );
};

export default TrendingProducts;
