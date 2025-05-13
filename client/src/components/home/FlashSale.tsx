import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { formatCurrency } from '@/lib/utils';
import Countdown from '@/components/ui/countdown';
import { useEffect, useState } from 'react';
import { Product, FlashSale } from '@shared/schema';

const FlashSaleSection = () => {
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Fetch active flash sale
  const { data: flashSale, isLoading: isLoadingFlashSale } = useQuery<FlashSale>({
    queryKey: ['/api/flash-sales/active'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Set end time for countdown
  useEffect(() => {
    if (flashSale) {
      setEndTime(new Date(flashSale.endDate));
    }
  }, [flashSale]);

  // Fetch flash sale products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', { flashSale: true }],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoadingFlashSale || isLoadingProducts) {
    return (
      <div className="mb-8 bg-gradient-to-r from-red-600 to-primary text-white py-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <i className="fas fa-bolt text-yellow-300 mr-2 text-xl"></i>
            <h2 className="font-heading font-bold text-xl">FLASH SALE</h2>
          </div>
          <div>
            <p className="text-sm">Đang tải...</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0 || !flashSale) {
    return null; // Don't show flash sale section if there are no products or no active flash sale
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-red-600 to-primary text-white py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i className="fas fa-bolt text-yellow-300 mr-2 text-xl"></i>
          <h2 className="font-heading font-bold text-xl">FLASH SALE</h2>
        </div>
        {endTime && (
          <div className="flex space-x-2 items-center">
            <p className="text-sm hidden sm:block">Kết thúc sau:</p>
            <Countdown endTime={endTime} />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex space-x-3 min-w-max pb-2">
          {/* Sử dụng useSequentialReveal */}
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden text-neutral-800 w-32 md:w-48 flex-shrink-0"
              style={{
                animation: `fadeSlideIn 0.3s ease-out ${index * 0.1}s both`,
                opacity: 0, // Bắt đầu với opacity 0
                transform: 'translateY(10px)' // Bắt đầu với vị trí dịch chuyển
              }}
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative">
                  <img 
                    src={product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={product.name} 
                    className="w-full h-36 md:h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback khi lỗi ảnh
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-0 left-0 bg-error text-white text-xs font-medium px-2 py-1 rounded-br-lg">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* Ribbon flash sale */}
                  <div className="absolute top-2 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-l-full">
                    HOT
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-xs md:text-sm font-medium truncate">{product.name}</h3>
                  <div className="flex items-baseline mt-1">
                    <span className="text-primary font-bold text-sm md:text-base">
                      {formatCurrency(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-gray-400 line-through text-xs ml-1">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS trực tiếp trong component */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
      
      <div className="text-center mt-3">
        <Link href="/products/flash-sale" className="inline-block bg-white text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-100 transition-colors">
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default FlashSaleSection;
