import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/constants';
import { Order, OrderItem } from '@shared/schema';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const Orders = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Check for success parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');
    
    if (success === 'true') {
      setShowSuccessMessage(true);
      // Clear URL parameters after showing success message
      window.history.replaceState({}, document.title, '/orders');
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Redirect if not logged in
  if (!user) {
    setLocation('/login?redirect=/orders');
    return null;
  }
  
  // Fetch user orders
  const { data: orders, isLoading, error } = useQuery<OrderWithItems[]>({
    queryKey: [`/api/users/${user.id}/orders`],
    staleTime: 1000 * 60, // 1 minute
  });
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUS.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-500'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Đơn hàng của tôi - Xinh Style QC</title>
        <meta name="description" content="Xem lịch sử và trạng thái đơn hàng của bạn tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Đơn hàng của tôi</h1>
        
        {/* Success message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6 flex items-start">
            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
            <div>
              <h3 className="font-medium">Đặt hàng thành công!</h3>
              <p className="text-sm">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-red-500 mb-4">
                <i className="fas fa-exclamation-circle text-3xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">Không thể tải đơn hàng</h3>
              <p className="text-gray-500">Đã xảy ra lỗi khi tải dữ liệu đơn hàng. Vui lòng thử lại sau.</p>
            </CardContent>
          </Card>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 px-6 py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base">Đơn hàng #{order.id}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/orders/${order.id}`}>Chi tiết</a>
                      </Button>
                      {order.status === 'pending' && (
                        <Button variant="destructive" size="sm" asChild>
                          <a href={`/orders/${order.id}/cancel`}>Hủy đơn</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 py-4">
                  {/* Order items */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
                          {/* We don't have product image in the orderItem, in a real app we would fetch this */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <i className="fas fa-tshirt text-xl"></i>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">Sản phẩm #{item.productId}</div>
                          <div className="text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `Màu: ${item.color}`}
                          </div>
                          <div className="text-sm">
                            {item.quantity} x {formatCurrency(item.price)}
                          </div>
                        </div>
                        
                        <div className="font-medium text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order summary */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phương thức thanh toán:</span>
                      <span className="font-medium">
                        {order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' : 
                         order.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' :
                         order.paymentMethod === 'momo' ? 'Ví MoMo' :
                         order.paymentMethod === 'zalopay' ? 'ZaloPay' : 
                         order.paymentMethod === 'vnpay' ? 'VNPay' : 
                         order.paymentMethod}
                      </span>
                    </div>
                    
                    {order.couponDiscount > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Giảm giá:</span>
                        <span className="text-green-500">-{formatCurrency(order.couponDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium mt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-shopping-bag text-5xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-4">Bạn chưa có đơn hàng nào</h3>
              <Button asChild>
                <a href="/products">Mua sắm ngay</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Orders;
