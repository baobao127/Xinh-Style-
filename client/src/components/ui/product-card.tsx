import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { formatCurrency, generateStarRating } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  showRating?: boolean;
  badgeType?: 'sale' | 'new' | 'bestseller' | 'none';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showRating = true, badgeType = 'sale' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [isWishlisted, setIsWishlisted] = useState(() => product && product.id ? isInWishlist(product.id) : false);

  // Add to cart function
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Kiểm tra product tồn tại và hợp lệ
    if (!product || !product.id) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm không hợp lệ vào giỏ hàng",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity: 1,
      price: product.salePrice || product.price,
      name: product.name,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
      color: product.colors && product.colors.length > 0 ? product.colors[0] : undefined,
    });
    
    toast({
      title: "Thành công",
      description: "Sản phẩm đã được thêm vào giỏ hàng!",
    });
  };

  // Toggle wishlist function
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Kiểm tra product tồn tại và hợp lệ
    if (!product || !product.id) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm không hợp lệ vào danh sách yêu thích",
        variant: "destructive",
      });
      return;
    }
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
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
      setIsWishlisted(true);
      toast({
        title: "Đã thêm",
        description: "Sản phẩm đã được thêm vào danh sách yêu thích!",
      });
    }
  };

  // Calculate average rating from reviews (mock for now)
  const averageRating = 4.5; // This would come from product reviews
  const ratingCount = 120; // This would also come from product reviews
  const { full, half, empty } = generateStarRating(averageRating);

  return (
    <Link href={`/product/${product.slug}`} className="bg-white rounded-lg shadow-sm overflow-hidden relative group">
      <div className="relative">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : ''} 
          alt={product.name} 
          className="w-full aspect-[3/4] object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className={`bg-white ${isWishlisted ? 'text-primary' : 'text-neutral-800'} w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:text-primary transition-colors`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={isWishlisted ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        </div>
        
        {/* Show badge if needed */}
        {badgeType !== 'none' && (
          <div className="absolute top-3 left-3">
            {badgeType === 'sale' && product.discount && product.discount > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">-{product.discount}%</span>
            )}
            {badgeType === 'new' && (
              <span className="bg-secondary text-white text-xs px-2 py-1 rounded">Mới</span>
            )}
            {badgeType === 'bestseller' && (
              <span className="bg-accent text-white text-xs px-2 py-1 rounded">Bán chạy</span>
            )}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
        
        {/* Show rating if enabled */}
        {showRating && (
          <div className="flex text-yellow-500 text-xs mb-1">
            {[...Array(full)].map((_, i) => (
              <i key={`full-${i}`} className="fas fa-star"></i>
            ))}
            {half > 0 && <i className="fas fa-star-half-alt"></i>}
            {[...Array(empty)].map((_, i) => (
              <i key={`empty-${i}`} className="far fa-star"></i>
            ))}
            <span className="text-gray-500 ml-1">({ratingCount})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-neutral-800">
              {formatCurrency(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-gray-400 line-through text-xs ml-1">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <button 
            className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
