import { useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      quantity: 1,
      price: item.price,
      name: item.name,
      image: item.image,
    });

    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng!",
      variant: "success",
    });
  };

  const handleRemove = (productId: number) => {
    removeFromWishlist(productId);
    
    toast({
      title: "Đã xóa",
      description: "Sản phẩm đã được xóa khỏi danh sách yêu thích!",
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>Danh sách yêu thích - Xinh Style QC</title>
        <meta name="description" content="Danh sách sản phẩm yêu thích của bạn tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Danh sách yêu thích</h1>
        
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <i className="far fa-heart text-5xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-medium mb-4">Danh sách yêu thích trống</h2>
            <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
            <Button asChild>
              <Link href="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wishlist.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img 
                              className="h-16 w-16 object-cover" 
                              src={item.image} 
                              alt={item.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <Link href={`/product/${item.productId}`} className="text-sm font-medium text-gray-900 hover:text-primary">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex space-x-2 justify-center">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                          >
                            <i className="fas fa-shopping-bag mr-1"></i> Thêm vào giỏ
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemove(item.productId)}
                          >
                            <i className="fas fa-trash-alt text-red-500"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                <Link href="/products" className="text-primary hover:underline">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Tiếp tục mua sắm
                </Link>
                <Button asChild>
                  <Link href="/cart">
                    Xem giỏ hàng
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
