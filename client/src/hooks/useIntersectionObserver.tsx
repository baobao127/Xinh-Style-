import { useState, useEffect, useRef, RefObject } from 'react';

// Options của Intersection Observer
interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  // Thêm options tùy chỉnh nếu cần
  triggerOnce?: boolean;
  skip?: boolean;
}

/**
 * Hook để theo dõi khi một phần tử xuất hiện trong viewport
 * - Hỗ trợ lazy loading cho các component
 * - Tối ưu hiệu suất bằng cách chỉ render khi cần thiết
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [boolean, RefObject<T>] {
  const { 
    root = null, 
    rootMargin = '0px', 
    threshold = 0, 
    triggerOnce = false,
    skip = false 
  } = options;
  
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Nếu skip = true, không quan sát
    if (skip) return;
    
    // Nếu đã trigger và triggerOnce=true, không tiếp tục quan sát
    if (isIntersecting && triggerOnce) return;
    
    // Hủy observer cũ nếu có
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Tạo observer mới
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );
    
    // Lưu observer để có thể hủy sau này
    observerRef.current = observer;
    
    // Lấy element hiện tại
    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }
    
    // Cleanup
    return () => {
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [root, rootMargin, threshold, triggerOnce, skip, elementRef.current, isIntersecting]);
  
  return [isIntersecting, elementRef];
}

/**
 * Hook để tiết kiệm tài nguyên bằng cách chỉ render khi cần thiết
 */
export function useLazyRender<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
  preRenderDistance: string = '200px' // Render trước khi hiển thị
): [boolean, RefObject<T>, boolean] {
  // Thay đổi rootMargin để render sớm hơn so với khi vào viewport
  const updatedOptions = {
    ...options,
    rootMargin: preRenderDistance,
  };
  
  const [isVisible, ref] = useIntersectionObserver<T>(updatedOptions);
  const [hasRendered, setHasRendered] = useState(false);
  
  // Một khi đã hiển thị, luôn giữ trạng thái đã render
  useEffect(() => {
    if (isVisible && !hasRendered) {
      setHasRendered(true);
    }
  }, [isVisible, hasRendered]);
  
  // Trả về: isVisible (đang nhìn thấy), ref (reference đến element), shouldRender (đã render chưa)
  return [isVisible, ref, hasRendered || isVisible];
}