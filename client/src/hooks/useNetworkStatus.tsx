import { useState, useEffect, useCallback, useRef } from 'react';
import { isOnline } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface NetworkStatus {
  online: boolean;
  previousOnline: boolean | null;
  since: Date | null;
  reconnecting: boolean;
  latency: number | null; // Thêm độ trễ mạng
  connectionQuality: 'good' | 'fair' | 'poor' | 'offline';
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    online: isOnline(),
    previousOnline: null,
    since: null,
    reconnecting: false,
    latency: null,
    connectionQuality: 'good', // Mặc định giả định kết nối tốt
  });
  
  // Thêm ref để lưu số lần thử kết nối
  const retryCount = useRef(0);
  const pingTimestampRef = useRef<number | null>(null);
  
  // Tham chiếu để theo dõi số lần kết nối kém liên tiếp
  const poorConnectionCountRef = useRef(0);
  const lastToastTimeRef = useRef(0);
  
  // Kiểm tra độ trễ và chất lượng kết nối
  const checkLatency = useCallback(async () => {
    if (!status.online) return;
    
    try {
      // Ghi lại thời gian bắt đầu ping
      pingTimestampRef.current = Date.now();
      
      // Thực hiện yêu cầu để kiểm tra độ trễ
      const response = await fetch('/api/products?limit=1', { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (response.ok) {
        // Tính toán độ trễ
        const latency = Date.now() - (pingTimestampRef.current || 0);
        
        // Xác định chất lượng kết nối dựa trên độ trễ
        // Nâng ngưỡng lên rất cao (rất ít nhạy cảm)
        let connectionQuality: 'good' | 'fair' | 'poor' | 'offline' = 'good';
        if (latency > 5000) connectionQuality = 'poor'; // Chỉ coi là kém khi > 5 giây
        else if (latency > 2500) connectionQuality = 'fair';
        
        // Cập nhật trạng thái kết nối
        setStatus(prev => ({
          ...prev,
          latency,
          connectionQuality
        }));
        
        // Đếm số lần kết nối kém liên tiếp
        if (connectionQuality === 'poor') {
          poorConnectionCountRef.current += 1;
        } else {
          // Đặt lại bộ đếm nếu kết nối tốt hoặc bình thường
          poorConnectionCountRef.current = 0;
        }
        
        // Chỉ hiển thị thông báo khi:
        // 1. Kết nối kém liên tiếp ít nhất 2 lần
        // 2. Và đã qua ít nhất 30 giây kể từ thông báo cuối cùng
        const now = Date.now();
        const timeSinceLastToast = now - lastToastTimeRef.current;
        
        if (connectionQuality === 'poor' && 
            poorConnectionCountRef.current >= 2 && 
            timeSinceLastToast > 30000) {
          
          toast({
            title: "Kết nối mạng chậm",
            description: "Kết nối internet của bạn đang chậm. Một số tính năng có thể bị ảnh hưởng.",
            duration: 5000, // Chỉ hiển thị 5 giây
          });
          
          lastToastTimeRef.current = now;
        }
      }
    } catch (error) {
      // Nếu không thể thực hiện ping, đánh dấu chất lượng kết nối là kém
      setStatus(prev => ({
        ...prev,
        connectionQuality: 'poor'
      }));
      
      poorConnectionCountRef.current += 1;
    }
  }, [status.online]);

  const checkConnection = useCallback(() => {
    const online = isOnline();
    
    if (status.online !== online) {
      setStatus(prev => ({
        online,
        previousOnline: prev.online,
        since: new Date(),
        reconnecting: !online,
        latency: prev.latency,
        connectionQuality: online ? 'fair' : 'offline'
      }));
      
      // Nếu kết nối được khôi phục, kiểm tra độ trễ
      if (online && !status.online) {
        checkLatency();
        retryCount.current = 0; // Đặt lại số lần thử
      }
    }
  }, [status.online, checkLatency]);

  const handleOnline = useCallback(() => {
    setStatus(prev => ({
      online: true,
      previousOnline: prev.online,
      since: new Date(),
      reconnecting: false,
      latency: prev.latency,
      connectionQuality: 'fair' // Mặc định khi vừa kết nối lại
    }));
    
    // Kiểm tra độ trễ sau khi kết nối lại
    setTimeout(checkLatency, 1000);
    
    // Thông báo kết nối đã được khôi phục
    toast({
      title: "Đã kết nối lại",
      description: "Kết nối mạng đã được khôi phục.",
    });
    
    // Làm mới dữ liệu sau khi kết nối lại
    // Nếu bạn sử dụng React Query, có thể làm mới queries
    window.dispatchEvent(new CustomEvent('connection-restored'));
  }, [checkLatency]);

  const handleOffline = useCallback(() => {
    setStatus(prev => ({
      online: false,
      previousOnline: prev.online,
      since: new Date(),
      reconnecting: true,
      latency: null,
      connectionQuality: 'offline'
    }));
  }, []);

  // Khi người dùng nhấn vào nút tái kết nối
  const reconnect = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      reconnecting: true,
    }));
    
    retryCount.current += 1;

    // Thêm thời gian chờ tăng dần theo số lần thử
    const delay = Math.min(1500 * retryCount.current, 10000);
    
    toast({
      title: "Đang kết nối lại",
      description: `Đang thử kết nối lại... (lần thử ${retryCount.current})`,
    });

    // Kiểm tra kết nối sau thời gian chờ
    setTimeout(() => {
      const online = isOnline();
      setStatus(prev => ({
        online,
        previousOnline: prev.online,
        since: new Date(),
        reconnecting: !online,
        latency: null,
        connectionQuality: online ? 'fair' : 'offline'
      }));
      
      // Kiểm tra độ trễ nếu kết nối thành công
      if (online) {
        checkLatency();
        retryCount.current = 0; // Đặt lại số lần thử
      }
    }, delay);
  }, [checkLatency]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Kiểm tra kết nối mỗi 30 giây
    const connectionCheckId = setInterval(checkConnection, 30000);
    
    // Kiểm tra độ trễ mỗi 2 phút
    const latencyCheckId = setInterval(checkLatency, 120000);
    
    // Kiểm tra độ trễ ban đầu
    checkLatency();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionCheckId);
      clearInterval(latencyCheckId);
    };
  }, [handleOnline, handleOffline, checkConnection, checkLatency]);

  return {
    ...status,
    reconnect,
  };
}