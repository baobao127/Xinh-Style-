import { useState, useEffect, useRef } from 'react';

/**
 * Hook giúp cải thiện trải nghiệm người dùng bằng cách giảm thiểu hiện tượng giật lag (layout shifts)
 * - Giảm thiểu Cumulative Layout Shift (CLS)
 * - Đợi tải đủ tài nguyên thiết yếu trước khi hiển thị
 * - Phát hiện và xử lý các tình huống rendering không ổn định
 */
export function usePageStability({
  minStableTime = 200, // Thời gian tối thiểu trang phải ổn định trước khi hiển thị
  layoutShiftThreshold = 10, // Số lượng layout shifts tối đa có thể chấp nhận
  imageStabilityTimeout = 1000, // Thời gian tối đa đợi ảnh tải xong
  resources = ['style', 'script', 'font'], // Các loại tài nguyên cần đợi
} = {}) {
  const [isStable, setIsStable] = useState(false);
  const layoutShiftsRef = useRef(0);
  const stableTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderTimestampRef = useRef(Date.now());

  // Theo dõi layout shifts
  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            layoutShiftsRef.current += 1;
            
            // Nếu có quá nhiều layout shifts, reset timer
            if (layoutShiftsRef.current > layoutShiftThreshold && stableTimerRef.current) {
              clearTimeout(stableTimerRef.current);
              stableTimerRef.current = setTimeout(() => {
                setIsStable(true);
              }, minStableTime);
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        return () => observer.disconnect();
      } catch (e) {
        console.warn('PerformanceObserver for layout-shift not supported', e);
      }
    }
  }, [layoutShiftThreshold, minStableTime]);

  // Theo dõi tải tài nguyên
  useEffect(() => {
    const unloadedResources = new Set<string>();
    
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if ('initiatorType' in entry) {
              const resourceEntry = entry as PerformanceResourceTiming;
              const resource = resourceEntry.initiatorType;
              
              if (resources.includes(resource)) {
                unloadedResources.delete(resourceEntry.name);
              }
            }
            
            // Nếu không còn tài nguyên cần tải, đánh dấu trang là ổn định
            if (unloadedResources.size === 0 && !isStable) {
              stableTimerRef.current = setTimeout(() => {
                setIsStable(true);
              }, minStableTime);
            }
          });
        });
        
        observer.observe({ type: 'resource', buffered: true });
        
        // Đếm các tài nguyên đang tải
        performance.getEntriesByType('resource').forEach((entry) => {
          if ('initiatorType' in entry) {
            const resourceEntry = entry as PerformanceResourceTiming;
            const resource = resourceEntry.initiatorType;
            if (resources.includes(resource)) {
              unloadedResources.add(resourceEntry.name);
            }
          }
        });
        
        return () => observer.disconnect();
      } catch (e) {
        console.warn('PerformanceObserver for resources not supported', e);
      }
    }
    
    // Fallback: Nếu không theo dõi được tài nguyên, đợi thời gian cố định
    const fallbackTimer = setTimeout(() => {
      setIsStable(true);
    }, 800);
    
    return () => clearTimeout(fallbackTimer);
  }, [resources, minStableTime, isStable]);

  // Backup: Hiển thị trang sau một thời gian tối đa dù có ổn định hay không
  useEffect(() => {
    const maxWaitTime = 2000;
    const timeElapsed = Date.now() - initialRenderTimestampRef.current;
    
    const remainingTime = Math.max(0, maxWaitTime - timeElapsed);
    const maxWaitTimer = setTimeout(() => {
      setIsStable(true);
    }, remainingTime);
    
    return () => clearTimeout(maxWaitTimer);
  }, []);

  return { isStable };
}