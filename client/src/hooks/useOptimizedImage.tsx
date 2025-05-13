import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

interface ImageOptimizationOptions {
  /**
   * Kích thước ảnh mong muốn (chiều rộng)
   */
  width?: number;
  /**
   * Chất lượng ảnh (1-100), mặc định 75
   */
  quality?: number;
  /**
   * Có tải trước khi màn hình hiển thị không
   */
  preload?: boolean;
  /**
   * Kích thước thumbnail thấp để hiển thị khi đang tải
   */
  lowQualityWidth?: number;
  /**
   * Có blur thumbnail không
   */
  blurThumbnail?: boolean;
  /**
   * Thực hiện WebP hoặc AVIF chuyển đổi nếu trình duyệt hỗ trợ
   */
  modernFormat?: boolean;
}

interface OptimizedImageResult {
  /**
   * URL ảnh đã tối ưu
   */
  src: string;
  /**
   * URL thumbnail chất lượng thấp để hiển thị trước
   */
  lowSrc: string;
  /**
   * Trạng thái tải
   */
  isLoading: boolean;
  /**
   * Đã tải xong chưa
   */
  isLoaded: boolean;
  /**
   * Lỗi tải (nếu có)
   */
  error: Error | null;
  /**
   * Tỷ lệ khung hình (chiều cao / chiều rộng)
   */
  aspectRatio: number | null;
  /**
   * Kích thước ảnh
   */
  dimensions: { width: number; height: number } | null;
  /**
   * Tham chiếu sử dụng cho onLoad, onError
   */
  ref: (img: HTMLImageElement | null) => void;
}

const deviceIsMobile = () => {
  if (typeof window === 'undefined') return false; 
  return window.innerWidth < 768;
};

const deviceIsTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/**
 * Hook tối ưu hóa hình ảnh thông minh dựa trên:
 * - Thiết bị (mobile, tablet, desktop)
 * - Chất lượng kết nối mạng
 * - Hỗ trợ định dạng hiện đại (WebP, AVIF)
 */
export function useOptimizedImage(
  url: string,
  options: ImageOptimizationOptions = {}
): OptimizedImageResult {
  const { 
    width: requestedWidth,
    quality = 75,
    preload = false,
    lowQualityWidth = 20,
    blurThumbnail = true,
    modernFormat = true,
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  
  const { connectionQuality } = useNetworkStatus();
  
  // Điều chỉnh kích thước ảnh dựa trên thiết bị và chất lượng kết nối
  const getOptimalWidth = useCallback(() => {
    // Nếu kích thước cụ thể được yêu cầu, sử dụng nó
    if (requestedWidth) return requestedWidth;
    
    // Xác định kích thước dựa trên thiết bị
    let optimalWidth = 800; // Desktop
    if (deviceIsMobile()) {
      optimalWidth = 400;
    } else if (deviceIsTablet()) {
      optimalWidth = 600;
    }
    
    // Giảm chất lượng nếu mạng kém
    if (connectionQuality === 'poor') {
      optimalWidth = Math.max(optimalWidth * 0.75, 300);
    }
    
    return Math.round(optimalWidth);
  }, [requestedWidth, connectionQuality]);
  
  // Tạo URL tối ưu
  const optimizeImageUrl = useCallback((originalUrl: string, targetWidth: number, imageQuality = quality) => {
    if (!originalUrl) return '';
    
    // Không tối ưu hóa nếu đã là URL base64 hoặc blob
    if (originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
      return originalUrl;
    }
    
    // Không tối ưu hóa SVG
    if (originalUrl.endsWith('.svg')) {
      return originalUrl;
    }
    
    try {
      // Thêm các tham số tối ưu hóa
      const urlObj = new URL(originalUrl);
      
      // Thêm tham số kích thước
      urlObj.searchParams.set('w', targetWidth.toString());
      
      // Thêm tham số chất lượng
      urlObj.searchParams.set('q', imageQuality.toString());
      
      // Thêm tham số định dạng hiện đại nếu trình duyệt hỗ trợ
      if (modernFormat) {
        const supportsWebP = typeof window !== 'undefined' && 
          'createImageBitmap' in window &&
          'ImageDecoder' in window;
          
        if (supportsWebP) {
          urlObj.searchParams.set('fm', 'webp');
        }
      }
      
      return urlObj.toString();
    } catch (e) {
      // Nếu URL không hợp lệ, trả về nguyên gốc
      console.warn('Failed to optimize image URL:', e);
      return originalUrl;
    }
  }, [quality, modernFormat]);

  // Tính URL ảnh đã tối ưu
  const src = useMemo(() => {
    if (!url) return '';
    return optimizeImageUrl(url, getOptimalWidth());
  }, [url, optimizeImageUrl, getOptimalWidth]);
  
  // Tính URL thumbnail chất lượng thấp
  const lowSrc = useMemo(() => {
    if (!url) return '';
    return optimizeImageUrl(url, lowQualityWidth, 30);
  }, [url, optimizeImageUrl, lowQualityWidth]);

  // Xử lý sự kiện tải
  const imageRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;

    const onLoad = () => {
      setIsLoading(false);
      setIsLoaded(true);
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setAspectRatio(img.naturalHeight / img.naturalWidth);
    };

    const onError = (e: ErrorEvent) => {
      setIsLoading(false);
      setError(new Error('Failed to load image'));
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, []);

  // Tải trước nếu cần
  useEffect(() => {
    if (!preload || !src) return;

    const img = new Image();
    img.src = src;

    return () => {
      // Hủy tải nếu component unmount
      img.src = '';
    };
  }, [src, preload]);

  return {
    src,
    lowSrc,
    isLoading,
    isLoaded,
    error,
    aspectRatio,
    dimensions,
    ref: imageRef,
  };
}