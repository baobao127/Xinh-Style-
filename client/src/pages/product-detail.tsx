import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, generateStarRating } from '@/lib/utils';
import { Product, Review, InsertReview } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import ProductCard from '@/components/ui/product-card';

const ProductDetail = () => {
  const { productSlug } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Local state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fetch product data
  const { data: product, isLoading: isLoadingProduct, error } = useQuery<Product>({
    queryKey: [`/api/products/${productSlug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!productSlug,
  });
  
  // Fetch product reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/products/${product?.id}/reviews`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!product?.id,
  });
  
  // Fetch similar products
  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: product?.categoryId }],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!product?.categoryId,
  });
  
  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: InsertReview) => {
      const response = await apiRequest('POST', '/api/reviews', reviewData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${product?.id}/reviews`] });
      toast({
        title: "Đánh giá thành công",
        description: "Cảm ơn bạn đã đánh giá sản phẩm!",
        variant: "success",
      });
      setReviewComment('');
    },
  });
  
  // Add product to browsing history
  const addToBrowsingHistoryMutation = useMutation({
    mutationFn: async ({ userId, productId }: { userId: number; productId: number }) => {
      const response = await apiRequest('POST', '/api/browsing-history', { userId, productId });
      return response.json();
    },
  });
  
  // Initialize product selections when data is loaded
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      
      // Add to browsing history if user is logged in
      if (user && user.id) {
        addToBrowsingHistoryMutation.mutate({
          userId: user.id,
          productId: product.id,
        });
      }
    }
  }, [product, user, addToBrowsingHistoryMutation]);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    if ((product.sizes && product.sizes.length > 0 && !selectedSize) || 
        (product.colors && product.colors.length > 0 && !selectedColor)) {
      toast({
        title: "Vui lòng chọn",
        description: "Hãy chọn kích thước và màu sắc trước khi thêm vào giỏ hàng",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity: quantity,
      price: product.salePrice || product.price,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      size: selectedSize,
      color: selectedColor,
    });
    
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng!",
      variant: "success",
    });
  };
  
  // Handle wishlist actions
  const handleWishlistToggle = () => {
    if (!product) return;
    
    const productIsInWishlist = isInWishlist(product.id);
    
    if (productIsInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Đã xóa",
        description: "Sản phẩm đã được xóa khỏi danh sách yêu thích!",
        variant: "default",
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
      });
      toast({
        title: "Đã thêm",
        description: "Sản phẩm đã được thêm vào danh sách yêu thích!",
        variant: "success",
      });
    }
  };
  
  // Handle submitting a review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !product) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đánh giá sản phẩm",
        variant: "destructive",
      });
      return;
    }
    
    submitReviewMutation.mutate({
      userId: user.id,
      productId: product.id,
      rating: userRating,
      comment: reviewComment,
    });
  };
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };
  
  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Button asChild>
            <Link href="/products">Xem sản phẩm khác</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Star rating display
  const averageRating = calculateAverageRating();
  const { full: fullStars, half: halfStars, empty: emptyStars } = generateStarRating(averageRating);
  
  // Check if product is in wishlist
  const productIsInWishlist = isInWishlist(product.id);
  
  return (
    <>
      <Helmet>
        <title>{product.name} - Xinh Style QC</title>
        <meta name="description" content={product.description || `Mua ${product.name} chính hãng tại Xinh Style QC. Giao hàng toàn quốc, đổi trả 7 ngày.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Product layout */}
          <div className="flex flex-col md:flex-row">
            {/* Product images */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <img 
                  src={product.images && product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full object-cover aspect-square"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-error text-white text-sm font-medium px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex mt-2 space-x-2 px-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`w-16 h-16 flex-shrink-0 border-2 rounded ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div className="w-full md:w-1/2 p-6">
              <h1 className="text-2xl font-heading font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500 mr-2">
                  {[...Array(fullStars)].map((_, i) => (
                    <i key={`full-${i}`} className="fas fa-star"></i>
                  ))}
                  {halfStars > 0 && <i className="fas fa-star-half-alt"></i>}
                  {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`} className="far fa-star"></i>
                  ))}
                </div>
                <span className="text-gray-500 text-sm">
                  {reviews ? `(${reviews.length} đánh giá)` : '(0 đánh giá)'}
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {product.salePrice ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-gray-400 line-through ml-2">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                )}
              </div>
              
              {/* Short description */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {isExpanded 
                    ? product.description 
                    : product.description && product.description.length > 150 
                      ? `${product.description.substring(0, 150)}...` 
                      : product.description}
                </p>
                {product.description && product.description.length > 150 && (
                  <button 
                    className="text-primary text-sm font-medium mt-1"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </div>
              
              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Kích thước:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-3 py-1 border rounded-md min-w-[40px] ${
                          selectedSize === size 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Màu sắc:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`px-3 py-1 border rounded-md ${
                          selectedColor === color 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Số lượng:</h3>
                <div className="flex items-center">
                  <button 
                    className="w-10 h-10 rounded-l-md bg-gray-100 flex items-center justify-center border border-gray-300"
                    onClick={decreaseQuantity}
                  >
                    <i className="fas fa-minus text-gray-600"></i>
                  </button>
                  <input
                    type="text"
                    className="w-14 h-10 border-t border-b border-gray-300 text-center"
                    value={quantity}
                    readOnly
                  />
                  <button 
                    className="w-10 h-10 rounded-r-md bg-gray-100 flex items-center justify-center border border-gray-300"
                    onClick={increaseQuantity}
                  >
                    <i className="fas fa-plus text-gray-600"></i>
                  </button>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <i className="fas fa-shopping-bag mr-2"></i>
                  Thêm vào giỏ hàng
                </Button>
                <Button 
                  variant={productIsInWishlist ? "outline" : "secondary"}
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <i className={`${productIsInWishlist ? 'fas' : 'far'} fa-heart mr-2`}></i>
                  {productIsInWishlist ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                </Button>
              </div>
              
              {/* Additional info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <i className="fas fa-truck text-primary mr-2"></i>
                  <span>Giao hàng toàn quốc (2-5 ngày)</span>
                </div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-exchange-alt text-primary mr-2"></i>
                  <span>Đổi trả trong vòng 7 ngày</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-primary mr-2"></i>
                  <span>Bảo hành 30 ngày</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product tabs */}
          <div className="p-6 border-t border-gray-200">
            <Tabs defaultValue="description">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="description">Mô tả</TabsTrigger>
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá ({reviews ? reviews.length : 0})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <div className="prose max-w-none">
                  <p>{product.description || "Không có mô tả chi tiết cho sản phẩm này."}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Thông tin sản phẩm</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Mã sản phẩm:</span>
                        <span>{product.id}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Chất liệu:</span>
                        <span>Cao cấp</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Xuất xứ:</span>
                        <span>Việt Nam</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Tình trạng:</span>
                        <span>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Hướng dẫn bảo quản</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Giặt máy ở nhiệt độ thường</li>
                      <li>Không sử dụng chất tẩy</li>
                      <li>Ủi ở nhiệt độ trung bình</li>
                      <li>Không giặt khô</li>
                      <li>Phơi trong bóng râm</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                {/* User reviews */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Đánh giá từ khách hàng</h3>
                  
                  {isLoadingReviews ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium">Khách hàng</span>
                              <div className="flex text-yellow-500 mt-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <i key={i} className="fas fa-star text-sm"></i>
                                ))}
                                {[...Array(5 - review.rating)].map((_, i) => (
                                  <i key={i} className="far fa-star text-sm"></i>
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}
                </div>
                
                {/* Submit review form */}
                {user ? (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-4">Viết đánh giá</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block mb-2">Đánh giá của bạn:</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="text-2xl focus:outline-none"
                              onClick={() => setUserRating(star)}
                            >
                              <i className={`${userRating >= star ? 'fas' : 'far'} fa-star text-yellow-500`}></i>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="comment" className="block mb-2">Nhận xét:</label>
                        <textarea
                          id="comment"
                          rows={4}
                          className="w-full border rounded-md p-2"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={submitReviewMutation.isPending}
                      >
                        {submitReviewMutation.isPending ? (
                          <>
                            <i className="fas fa-spinner animate-spin mr-2"></i>
                            Đang gửi...
                          </>
                        ) : (
                          <>Gửi đánh giá</>
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="mb-4">Vui lòng đăng nhập để gửi đánh giá</p>
                    <Button asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Similar products */}
        {!isLoadingSimilar && similarProducts && similarProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-heading font-bold mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
