import { useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
  const { cart, updateCartItem, removeCartItem, calculateTotal } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItem(index, newQuantity);
    
    toast({
      title: "Cập nhật giỏ hàng",
      description: "Số lượng sản phẩm đã được cập nhật!",
      variant: "default",
    });
  };
  
  const handleRemoveItem = (index: number) => {
    removeCartItem(index);
    
    toast({
      title: "Đã xóa",
      description: "Sản phẩm đã được xóa khỏi giỏ hàng!",
      variant: "default",
    });
  };
  
  const total = calculateTotal();
  const shipping = total > 499000 ? 0 : 30000;
  const grandTotal = total + shipping;
  
  return (
    <>
      <Helmet>
        <title>Giỏ hàng - Xinh Style QC</title>
        <meta name="description" content="Giỏ hàng của bạn tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Giỏ hàng</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-medium mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
            <Button asChild>
              <Link href="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-medium">Sản phẩm ({cart.length})</h2>
                </div>
                
                <div className="divide-y">
                  {cart.map((item, index) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="p-4 flex flex-col sm:flex-row">
                      <div className="sm:w-24 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <Link href={`/product/${item.productId}`} className="font-medium hover:text-primary">
                            {item.name}
                          </Link>
                          <div className="text-primary font-bold mt-1 sm:mt-0">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500">
                          {item.size && <div>Kích thước: {item.size}</div>}
                          {item.color && <div>Màu sắc: {item.color}</div>}
                          <div>Đơn giá: {formatCurrency(item.price)}</div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <button 
                              className="w-8 h-8 rounded-l bg-gray-100 flex items-center justify-center border border-gray-300"
                              onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                            >
                              <i className="fas fa-minus text-xs text-gray-600"></i>
                            </button>
                            
                            <input
                              type="text"
                              className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
                              value={item.quantity}
                              readOnly
                            />
                            
                            <button 
                              className="w-8 h-8 rounded-r bg-gray-100 flex items-center justify-center border border-gray-300"
                              onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                            >
                              <i className="fas fa-plus text-xs text-gray-600"></i>
                            </button>
                          </div>
                          
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>
                        {shipping === 0 
                          ? <span className="text-green-500">Miễn phí</span> 
                          : formatCurrency(shipping)}
                      </span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="text-xs text-gray-500">
                        Miễn phí vận chuyển cho đơn hàng từ {formatCurrency(499000)}
                      </div>
                    )}
                    
                    <div className="pt-3 border-t">
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">{formatCurrency(grandTotal)}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        (Đã bao gồm VAT)
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button asChild className="w-full">
                      <Link href="/checkout">
                        Tiến hành thanh toán
                        <i className="fas fa-arrow-right ml-2"></i>
                      </Link>
                    </Button>
                    
                    <Link href="/products" className="text-primary hover:underline text-center block mt-4">
                      <i className="fas fa-arrow-left mr-2"></i>
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Promotion code */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                <div className="p-4">
                  <h2 className="font-medium mb-3">Mã giảm giá</h2>
                  
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button variant="default" className="rounded-l-none">
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
