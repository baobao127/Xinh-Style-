import { useState, useEffect, useRef } from 'react';

/**
 * Hook để hiển thị các phần tử trong một mảng một cách tuần tự,
 * giúp tối ưu hóa hiệu suất và tạo hiệu ứng tải dần dần
 */
export function useSequentialReveal<T>(
  items: T[],
  options: {
    /**
     * Thời gian chờ trước khi bắt đầu hiển thị (ms)
     */
    initialDelay?: number;
    /**
     * Thời gian giữa mỗi lần hiển thị (ms)
     */
    intervalDelay?: number;
    /**
     * Số lượng phần tử hiển thị ban đầu
     */
    initialCount?: number;
    /**
     * Số lượng phần tử hiển thị mỗi lần
     */
    batchSize?: number;
    /**
     * Chỉ hiển thị khi phần tử đầu tiên xuất hiện trong viewport
     */
    triggerOnVisible?: boolean;
  } = {}
) {
  const {
    initialDelay = 0,
    intervalDelay = 150,
    initialCount = 2,
    batchSize = 2,
    triggerOnVisible = true,
  } = options;

  // Trạng thái các phần tử hiện đang hiển thị
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isStarted, setIsStarted] = useState(!triggerOnVisible);
  
  // Tham chiếu tới element container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tham chiếu tới interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Tham chiếu tới observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Tinh chỉnh số lượng hiển thị, không bao giờ vượt quá số lượng trong mảng
  const actualVisibleCount = Math.min(visibleCount, items.length);
  
  // Mảng phần tử hiện đang hiển thị
  const visibleItems = items.slice(0, actualVisibleCount);
  
  // Có đang tải thêm không
  const isLoading = actualVisibleCount < items.length;
  
  // Đã tải hết chưa
  const isComplete = actualVisibleCount >= items.length;

  // Bắt đầu tuần tự hiển thị
  const startSequentialReveal = () => {
    // Nếu đã bắt đầu hoặc không còn gì để hiển thị, không làm gì
    if (isStarted || !isLoading) return;
    
    setIsStarted(true);

    // Đợi một khoảng thời gian trước khi bắt đầu
    setTimeout(() => {
      // Lập lịch hiển thị mỗi intervalDelay ms
      intervalRef.current = setInterval(() => {
        setVisibleCount(prev => {
          const newCount = prev + batchSize;
          
          // Nếu đã hiển thị hết, xóa interval
          if (newCount >= items.length) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
          
          return newCount;
        });
      }, intervalDelay);
    }, initialDelay);
  };

  // Xử lý hiển thị thêm phần tử khi cuộn
  useEffect(() => {
    if (!triggerOnVisible || !containerRef.current) {
      startSequentialReveal();
      return;
    }

    // Tạo observer để xác định khi nào container hiển thị trong viewport
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          startSequentialReveal();
          // Ngừng theo dõi sau khi đã bắt đầu
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Hiển thị khi ít nhất 10% container hiển thị
    );

    observerRef.current = observer;
    observer.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [triggerOnVisible, items.length]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Tải thêm thủ công (khi người dùng nhấp vào nút "Tải thêm")
  const loadMore = (count = batchSize * 2) => {
    setVisibleCount(prev => Math.min(prev + count, items.length));
  };

  return {
    visibleItems,
    isLoading,
    isComplete,
    loadMore,
    containerRef,
    startSequentialReveal,
  };
}