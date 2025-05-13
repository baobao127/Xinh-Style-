import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw, Gauge, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const { online, reconnecting, reconnect, connectionQuality, latency } = useNetworkStatus();
  
  // State để theo dõi xem người dùng đã tắt thông báo chưa
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Id lưu trạng thái đóng thông báo (mỗi lần có thay đổi lớn về kết nối sẽ tạo ID mới)
  const [alertId, setAlertId] = useState("");
  
  // Reset trạng thái đóng khi trạng thái kết nối thay đổi đáng kể
  useEffect(() => {
    const newAlertId = `${online ? 1 : 0}-${connectionQuality}-${Date.now()}`;
    // Chỉ reset khi có sự thay đổi lớn về trạng thái
    if ((!online && alertId.startsWith("1")) || 
        (online && alertId.startsWith("0")) ||
        (online && connectionQuality === 'poor' && !alertId.includes('poor'))) {
      setIsDismissed(false);
      setAlertId(newAlertId);
    }
  }, [online, connectionQuality]);
  
  // Tham chiếu để theo dõi thời gian hiển thị thông báo
  const autoHideTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Tự động ẩn thông báo nếu đó là thông báo về kết nối kém
  useEffect(() => {
    if (online && connectionQuality === 'poor' && !isDismissed) {
      // Tự động ẩn thông báo kết nối kém sau 10 giây
      autoHideTimeoutRef.current = setTimeout(() => {
        setIsDismissed(true);
      }, 10000);
    }
    
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [online, connectionQuality, isDismissed]);
  
  // Hiển thị thông báo trong các trường hợp:
  // 1. Nếu mất kết nối (offline)
  // 2. Hoặc nếu kết nối cực kỳ kém (latency > 5000ms theo thiết lập mới)
  // 3. Và người dùng chưa đóng thông báo này
  if (isDismissed || (online && (connectionQuality !== 'poor' || !latency || latency < 5000))) {
    return null;
  }
  
  // Hiển thị thông báo phù hợp với tình trạng kết nối
  const getConnectionMessage = () => {
    if (!online) {
      return reconnecting 
        ? 'Đang thử kết nối lại với máy chủ...' 
        : 'Vui lòng kiểm tra kết nối mạng của bạn và thử lại.';
    }
    
    // Nếu online nhưng kết nối kém
    if (connectionQuality === 'poor' && latency) {
      return `Kết nối internet chậm (${latency}ms). Một số chức năng có thể không hoạt động ổn định.`;
    }
    
    return 'Đang kiểm tra kết nối...';
  };
  
  const getAlertVariant = () => {
    if (!online) return "destructive";
    if (connectionQuality === 'poor') return "default"; // Thay đổi về mặc định cho ít gây chú ý hơn
    return "default";
  };
  
  const getIcon = () => {
    if (reconnecting) {
      return <RefreshCw className="h-5 w-5 animate-spin" />;
    }
    
    if (!online) {
      return <WifiOff className="h-5 w-5" />;
    }
    
    if (connectionQuality === 'poor') {
      return <Gauge className="h-5 w-5 text-yellow-500" />;
    }
    
    return <Wifi className="h-5 w-5" />;
  };
  
  const getTitle = () => {
    if (reconnecting) return 'Đang kết nối lại...';
    if (!online) return 'Mất kết nối';
    if (connectionQuality === 'poor') return 'Kết nối chậm';
    return 'Đang kiểm tra kết nối...';
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Lưu trạng thái đã đóng vào localStorage để không hiển thị lại
    if (online && connectionQuality === 'poor') {
      // Lưu thời gian đã đóng thông báo
      localStorage.setItem('connection_notice_dismissed', Date.now().toString());
    }
  };

  return (
    <Alert
      variant={getAlertVariant()}
      className={cn(
        'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 shadow-lg',
        connectionQuality === 'poor' ? 'bg-gray-50 border-gray-200' : '',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <AlertTitle>
            {getTitle()}
          </AlertTitle>
        </div>
        
        {/* Nút đóng thông báo */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <AlertDescription className="mt-2">
        {getConnectionMessage()}
        {!online && !reconnecting && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={reconnect}
            disabled={reconnecting}
          >
            <Wifi className="mr-2 h-4 w-4" />
            Kết nối lại
          </Button>
        )}
        {online && connectionQuality === 'poor' && (
          <div className="text-xs mt-2 text-gray-500">
            Tip: Thử tải lại trang hoặc chuyển sang mạng khác để có trải nghiệm tốt hơn.
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default ConnectionStatus;