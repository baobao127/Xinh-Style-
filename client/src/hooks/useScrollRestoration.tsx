import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook giúp khôi phục vị trí cuộn khi điều hướng trở lại trang trước đó
 * và ngăn việc trang bị cuộn lên trên cùng khi người dùng trở lại
 */
export function useScrollRestoration() {
  const [location] = useLocation();

  useEffect(() => {
    // Lưu giữ vị trí cuộn hiện tại cho URL hiện tại
    const saveScrollPosition = () => {
      // Lưu vị trí cuộn hiện tại vào sessionStorage
      const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      scrollPositions[location] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
    };

    // Khôi phục vị trí cuộn khi quay trở lại trang
    const restoreScrollPosition = () => {
      const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');
      const savedPosition = scrollPositions[location];
      
      if (savedPosition !== undefined) {
        // Sử dụng setTimeout để đảm bảo DOM đã được render
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 50);
      }
    };

    // Đăng ký sự kiện
    window.addEventListener('pagehide', saveScrollPosition);
    
    // Khôi phục vị trí cuộn khi trang được tải lại
    // Dùng setTimeout để đảm bảo DOM đã được render đầy đủ
    const timeoutId = setTimeout(restoreScrollPosition, 100);
    
    // Sự kiện popstate xảy ra khi người dùng nhấn nút back/forward
    window.addEventListener('popstate', () => {
      setTimeout(restoreScrollPosition, 50);
    });

    return () => {
      window.removeEventListener('pagehide', saveScrollPosition);
      window.removeEventListener('popstate', restoreScrollPosition);
      clearTimeout(timeoutId);
    };
  }, [location]);
}

/**
 * Hook ngăn việc trang bị giật lên xuống khi cuộn 
 * - Tối ưu độ trễ hiển thị
 * - Tối ưu việc tải hình ảnh
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Thêm CSS để có cuộn mượt hơn
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
      
      /* Tối ưu tải hình ảnh để tránh CLS (Cumulative Layout Shift) */
      img {
        height: auto;
        aspect-ratio: attr(width) / attr(height);
        content-visibility: auto;
      }
      
      /* Giảm thiểu việc chớp nháy khi tải dữ liệu */
      .fade-in {
        animation: fadeIn 0.3s ease-in;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Thêm thuộc tính loading="lazy" cho tất cả hình ảnh
    const addLazyLoadingToImages = () => {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    };

    // Thực hiện ngay lập tức
    addLazyLoadingToImages();

    // MutationObserver để theo dõi sự thay đổi DOM và áp dụng tải lười biếng cho hình ảnh mới
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          addLazyLoadingToImages();
        }
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      observer.disconnect();
    };
  }, []);
}