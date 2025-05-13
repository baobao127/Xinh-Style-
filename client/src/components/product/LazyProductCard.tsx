import { memo, useMemo } from 'react';
import { Link } from 'wouter';
import ProductCard from '@/components/ui/product-card';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { useLazyRender } from '@/hooks/useIntersectionObserver';
import { Product } from '@shared/schema';

interface LazyProductCardProps {
  product: Product;
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Phiên bản tối ưu hóa của ProductCard với:
 * - Lazy rendering (chỉ render khi cần hiển thị)
 * - Optimized images (tối ưu hình ảnh)
 * - Memorized components (tránh re-render không cần thiết)
 */
function LazyProductCard({ product, width = '100%', height = 'auto', className = '' }: LazyProductCardProps) {
  // Sử dụng lazy render để chỉ render khi cần thiết (sắp hiển thị trong viewport)
  const [isVisible, ref, shouldRender] = useLazyRender({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '200px', // Render trước khi hiển thị 200px
  });
  
  // Kiểm tra sản phẩm tồn tại và có ảnh
  const imageUrl = product && product.images && product.images[0] ? product.images[0] : '';
  
  // Tối ưu hình ảnh
  const { src: optimizedImage } = useOptimizedImage(imageUrl);
  
  // Tạo placeholder có kích thước tương tự (giảm Cumulative Layout Shift)
  const placeholderStyle = useMemo(() => ({
    width,
    height: height === 'auto' ? '0' : height,
    paddingBottom: height === 'auto' ? '133%' : '0', // Tỉ lệ ảnh 3:4
  }), [width, height]);
  
  // Nếu chưa cần render, trả về placeholder để giữ không gian
  if (!shouldRender) {
    return (
      <div 
        ref={ref} 
        className={`bg-gray-100 animate-pulse rounded-lg ${className}`}
        style={placeholderStyle}
      />
    );
  }
  
  // Nếu không có sản phẩm hợp lệ, hiển thị placeholder
  if (!product) {
    return (
      <div 
        ref={ref} 
        className={`bg-gray-100 rounded-lg ${className}`}
        style={placeholderStyle}
      />
    );
  }
  
  // Render thật với hình ảnh được tối ưu
  return (
    <div ref={ref}>
      <ProductCard
        product={product}
        showRating={true}
        badgeType={product.discount && product.discount > 0 ? 'sale' : 'none'}
      />
    </div>
  );
}

// Sử dụng memo để tránh re-render không cần thiết
export default memo(LazyProductCard);