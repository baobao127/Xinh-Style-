import { Helmet } from 'react-helmet';
import { Suspense, lazy, useState, useEffect } from 'react';
import Banner from '@/components/home/Banner';
import CategoryShortcuts from '@/components/home/CategoryShortcuts';
import FlashSale from '@/components/home/FlashSale';
import TrendingProducts from '@/components/home/TrendingProducts';
import Collections from '@/components/home/Collections';
import NewArrivals from '@/components/home/NewArrivals';
import CategoryTabs from '@/components/product/CategoryTabs';
import FloatingContact from '@/components/ui/floating-contact';
import { usePageStability } from '@/hooks/usePageStability';

// Sử dụng lazy loading để tối ưu hiệu suất
const LazyFeatures = lazy(() => import('@/components/home/Features'));
const LazyInstagramFeed = lazy(() => import('@/components/home/InstagramFeed'));

const Home = () => {
  // Sử dụng hook ổn định trang để giảm layout shifts và giật lag
  const { isStable } = usePageStability();
  
  // Sử dụng hiệu ứng skeleton trước khi trang ổn định
  const [isLoading, setIsLoading] = useState(true);
  
  // Đặt một thời gian tối thiểu cho loading state để tránh nhấp nháy nhanh
  useEffect(() => {
    if (isStable) {
      // Thêm 100ms để tránh nhấp nháy giao diện (too quick loading)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isStable]);
  
  return (
    <>
      <Helmet>
        <title>Xinh Style QC - Thời Trang Nữ Cao Cấp</title>
        <meta name="description" content="Thời trang nữ cao cấp với phong cách hiện đại, trẻ trung và năng động. Giao hàng toàn quốc, đổi trả 7 ngày." />
      </Helmet>

      {/* Overlay khi đang tải để tránh nhấp nháy khi mạng chậm */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="text-center p-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Xinh Style đang tải...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-0 md:px-4">
        {/* Phần hiển thị ngay lập tức */}
        <Banner />
        <CategoryShortcuts />
        <FlashSale />
        <TrendingProducts />
        <Collections />
        
        {/* Phần hiển thị khi cuộn xuống */}
        <NewArrivals />
        
        {/* Phần tải theo nhu cầu */}
        <CategoryTabs 
          title="Khám Phá Theo Danh Mục" 
          columns={2}
          itemsPerCategory={6}
          showLoadMore={true}
        />
        
        {/* Phần tải lazy */}
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Đang tải...</div>}>
          <LazyFeatures />
          <LazyInstagramFeed />
        </Suspense>
      </div>
      
      {/* Nút liên hệ nổi */}
      <FloatingContact 
        phone="0123456789"
        zaloId="0123456789"
        facebookPage="https://facebook.com/xinhstyleqc"
      />
      
      {/* Add style for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeSlideUp 0.5s ease-out forwards;
          }
        `
      }} />
    </>
  );
};

export default Home;
