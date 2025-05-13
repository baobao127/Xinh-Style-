import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Một hook tùy chỉnh để bắt và xử lý lỗi để ngăn người dùng bị văng ra khỏi ứng dụng
 */
export function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setHasError(true);
    setError(error);
    setErrorInfo(errorInfo);
    
    // Hiển thị thông báo cho người dùng
    toast({
      title: "Có lỗi xảy ra",
      description: "Đã xảy ra lỗi khi tải trang. Vui lòng thử lại sau.",
      variant: "destructive",
    });
    
    // Ghi log lỗi để phát hiện vấn đề
    console.error("Caught error:", error, errorInfo);
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
    setErrorInfo(null);
  }, []);

  // Bắt các lỗi không xử lý trong toàn bộ ứng dụng
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      handleError(event.error, { componentStack: event.message });
      return true;
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error = new Error(`Promise rejected: ${event.reason}`);
      handleError(error, { componentStack: event.reason?.stack || 'No stack trace available' });
      return true;
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, [handleError]);

  return {
    hasError,
    error,
    errorInfo,
    resetError,
  };
}

/**
 * Component ErrorBoundary để bắt lỗi trong các component React
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Cập nhật state để hiển thị UI lỗi
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ghi log lỗi
    console.error("Component error caught:", error, errorInfo);
    
    // Lưu vào localStorage để theo dõi
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      // Chỉ lưu tối đa 10 lỗi gần nhất
      localStorage.setItem('app_errors', JSON.stringify(errors.slice(-10)));
    } catch (e) {
      // Xử lý lỗi localStorage không khả dụng
      console.warn('Could not save error to localStorage', e);
    }
    
    // Hiển thị thông báo nếu lỗi không nghiêm trọng
    if (!this.state.hasError) {
      toast({
        title: "Cảnh báo",
        description: "Đã phát hiện lỗi. Đang thử khắc phục...",
        variant: "destructive",
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    
    // Làm mới trang nếu cần thiết
    if (this.state.error && this.state.error.message.includes('ChunkLoadError')) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Import động thành phần ErrorScreen để đảm bảo hiển thị ngay cả khi có lỗi
      const ErrorScreen = React.lazy(() => import('@/components/ui/error-screen').then(module => ({
        default: module.ErrorScreen
      })));
      
      // Fallback đơn giản nếu ErrorScreen không thể tải
      const simpleFallback = (
        <div className="min-h-[50vh] w-full flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Rất tiếc, đã xảy ra lỗi</h2>
            <p className="text-gray-600 mb-4">Đã có lỗi xảy ra khi tải trang. Vui lòng thử lại.</p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      );

      // Sử dụng fallback tùy chỉnh hoặc ErrorScreen hoặc fallback đơn giản
      return this.props.fallback || (
        <React.Suspense fallback={simpleFallback}>
          <ErrorScreen 
            title="Đã xảy ra lỗi" 
            message={this.state.error?.message || "Có lỗi xảy ra khi tải trang. Vui lòng thử lại."} 
            onRetry={this.handleRetry}
            showHomeButton={true} 
          />
        </React.Suspense>
      );
    }

    return this.props.children; 
  }
}