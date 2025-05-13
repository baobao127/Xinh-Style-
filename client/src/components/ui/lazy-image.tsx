import React, { useState, useRef, useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  preload?: boolean;
  blur?: boolean;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  threshold?: number;
  rootMargin?: string;
  fallbackSrc?: string;
}

/**
 * Component hình ảnh tối ưu hiệu suất với:
 * - Lazy loading thông minh
 * - Hiệu ứng blur/fade khi tải
 * - Tự động tối ưu kích thước và định dạng
 * - Tự động xử lý lỗi
 */
const LazyImage = ({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  preload = false,
  blur = true,
  fit = 'cover',
  threshold = 0.1,
  rootMargin = '100px',
  fallbackSrc = '/placeholder-image.jpg',
  ...props
}: LazyImageProps) => {
  // State để kiểm soát việc hiển thị hình ảnh
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Tham chiếu đến phần tử hình ảnh
  const [inViewport, ref] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
  });
  
  // Tham chiếu đến phần tử hình ảnh thật
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Sử dụng hook tối ưu hình ảnh
  const { src: optimizedSrc, lowSrc } = useOptimizedImage(src, {
    width: width || (window.innerWidth < 768 ? 400 : 800),
    preload,
    lowQualityWidth: 20,
    blurThumbnail: blur,
  });
  
  // Hiệu ứng theo dõi khi trong viewport
  useEffect(() => {
    if (inViewport && !isVisible) {
      setIsVisible(true);
    }
  }, [inViewport, isVisible]);
  
  // Xử lý khi ảnh tải xong
  const handleImageLoaded = () => {
    setIsLoaded(true);
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 300); // Delay nhỏ tạo hiệu ứng mượt mà hơn
  };
  
  // Xử lý khi ảnh lỗi
  const handleImageError = () => {
    setHasError(true);
  };
  
  return (
    <div 
      ref={ref} 
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      {/* Placeholder khi ảnh đang tải */}
      {showPlaceholder && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-100 animate-pulse',
            blur && lowSrc && 'bg-cover bg-center blur-sm',
            placeholderClassName
          )}
          style={lowSrc ? { backgroundImage: `url(${lowSrc})` } : {}}
        />
      )}
      
      {/* Ảnh thật, chỉ tải khi trong viewport */}
      {isVisible && (
        <img
          ref={imgRef}
          src={hasError ? fallbackSrc : optimizedSrc}
          alt={alt}
          onLoad={handleImageLoaded}
          onError={handleImageError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            `object-${fit}`
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;