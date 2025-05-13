import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { PAYMENT_METHODS } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';

const Checkout = () => {
  const { cart, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Calculate totals
  const subTotal = calculateTotal();
  const shipping = subTotal > 499000 ? 0 : 30000;
  const total = subTotal + shipping - couponDiscount;
  
  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0) {
      setLocation('/cart');
    }
  }, [cart, setLocation]);
  
  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã giảm giá",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setValidatingCoupon(true);
      const response = await apiRequest('POST', '/api/coupons/validate', { 
        code: couponCode, 
        total: subTotal 
      });
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Mã không hợp lệ",
          description: error.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn",
          variant: "destructive",
        });
        return;
      }
      
      const coupon = await response.json();
      
      // Calculate discount amount
      let discountAmount = 0;
      if (coupon.isPercentage) {
        discountAmount = (subTotal * coupon.discount) / 100;
      } else {
        discountAmount = coupon.discount;
      }
      
      setCouponDiscount(discountAmount);
      
      toast({
        title: "Thành công",
        description: "Mã giảm giá đã được áp dụng!",
        variant: "success",
      });
    } catch (error) {
      console.error('Apply coupon error:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi áp dụng mã giảm giá",
        variant: "destructive",
      });
    } finally {
      setValidatingCoupon(false);
    }
  };
  
  // Show QR code if payment method is QR
  useEffect(() => {
    setShowQRCode(paymentMethod === 'momo' || paymentMethod === 'zalopay' || paymentMethod === 'vnpay');
  }, [paymentMethod]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!fullName || !phone || !address) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin giao hàng",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare order data
      const orderData = {
        order: {
          userId: user?.id || 0, // Guest order if not logged in
          total,
          paymentMethod,
          shippingAddress: address,
          contactPhone: phone,
          contactName: fullName,
          couponCode: couponCode || undefined,
          couponDiscount: couponDiscount || 0,
        },
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        }))
      };
      
      const response = await apiRequest('POST', '/api/orders', orderData);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Có lỗi xảy ra khi đặt hàng");
      }
      
      const newOrder = await response.json();
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: "Đặt hàng thành công",
        description: "Đơn hàng của bạn đã được tiếp nhận!",
        variant: "success",
      });
      
      // Redirect to confirmation page
      setLocation(`/orders?success=true&id=${newOrder.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Đặt hàng thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Thanh toán - Xinh Style QC</title>
        <meta name="description" content="Thanh toán đơn hàng tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Thanh toán</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipping information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Thông tin giao hàng</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (tùy chọn)</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Địa chỉ giao hàng</Label>
                    <Textarea 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                    <Textarea 
                      id="note" 
                      value={note} 
                      onChange={(e) => setNote(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment methods */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Phương thức thanh toán</h2>
                </div>
                
                <div className="p-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {PAYMENT_METHODS.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                          <i className={`fas fa-${method.icon} text-primary mr-2`}></i>
                          {method.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {showQRCode && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="text-center mb-3">
                        <p className="font-medium">Quét mã QR để thanh toán</p>
                        <p className="text-sm text-gray-500 mt-1">Số tiền: {formatCurrency(total)}</p>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                          <i className="fas fa-qrcode text-6xl text-gray-400"></i>
                        </div>
                      </div>
                      
                      <p className="text-sm text-center mt-3 text-gray-500">
                        Vui lòng giữ màn hình này mở cho đến khi thanh toán hoàn tất
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Tóm tắt đơn hàng</h2>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ', '}
                            {item.color && `Màu: ${item.color}`}
                          </div>
                          <div className="text-sm">{item.quantity} x {formatCurrency(item.price)}</div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>{formatCurrency(subTotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>
                        {shipping === 0 
                          ? <span className="text-green-500">Miễn phí</span> 
                          : formatCurrency(shipping)}
                      </span>
                    </div>
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="text-green-500">-{formatCurrency(couponDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatCurrency(total)}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        (Đã bao gồm VAT)
                      </div>
                    </div>
                  </div>
                  
                  {/* Coupon input */}
                  <div className="mt-6 pt-4 border-t">
                    <Label htmlFor="coupon">Mã giảm giá</Label>
                    <div className="flex mt-1">
                      <Input 
                        id="coupon" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)} 
                        className="rounded-r-none" 
                      />
                      <Button 
                        type="button" 
                        className="rounded-l-none" 
                        onClick={applyCoupon}
                        disabled={validatingCoupon}
                      >
                        {validatingCoupon ? (
                          <span className="flex items-center">
                            <i className="fas fa-spinner animate-spin mr-2"></i>
                            Đang áp dụng
                          </span>
                        ) : (
                          'Áp dụng'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Place order button */}
                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <i className="fas fa-spinner animate-spin mr-2"></i>
                          Đang xử lý
                        </span>
                      ) : (
                        'Đặt hàng'
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Bằng cách đặt hàng, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
