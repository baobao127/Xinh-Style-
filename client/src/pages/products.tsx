import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Product, Category } from '@shared/schema';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

const Products = () => {
  const { categorySlug } = useParams();
  const [search] = useLocation();
  const searchParams = new URLSearchParams(search.split('?')[1] || '');
  const searchQuery = searchParams.get('search');
  
  // Filter and sort states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch category info if categorySlug is provided
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${categorySlug}`],
    enabled: !!categorySlug,
  });
  
  // Determine the API endpoint based on filters
  const getQueryParams = () => {
    const params: Record<string, string> = {};
    
    if (categorySlug) params.category = categorySlug;
    if (searchQuery) params.search = searchQuery;
    if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');
    if (selectedColors.length > 0) params.colors = selectedColors.join(',');
    params.minPrice = priceRange[0].toString();
    params.maxPrice = priceRange[1].toString();
    params.sort = sortBy;
    
    return params;
  };
  
  // Fetch products based on category, search, and filters
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', getQueryParams()],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [categorySlug]);
  
  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Size filter handlers
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };
  
  // Color filter handlers
  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };
  
  // Get page title
  const getPageTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm: ${searchQuery}`;
    if (categorySlug === 'flash-sale') return 'Flash Sale';
    if (category) return category.name;
    return 'Tất cả sản phẩm';
  };
  
  // Available sizes and colors (would normally come from API)
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const availableColors = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Hồng', 'Vàng', 'Xám'];
  
  return (
    <>
      <Helmet>
        <title>{getPageTitle()} - Xinh Style QC</title>
        <meta name="description" content={`${getPageTitle()} - Thời trang nữ cao cấp với phong cách hiện đại, trẻ trung và năng động.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h1 className="text-2xl font-heading font-bold">{getPageTitle()}</h1>
            <Button onClick={toggleFilters} variant="outline" size="sm">
              <i className="fas fa-filter mr-2"></i> Bộ lọc
            </Button>
          </div>
          
          {/* Filters sidebar */}
          <div className={`w-full md:w-1/4 lg:w-1/5 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-20">
              <div className="flex justify-between items-center md:hidden mb-2">
                <h3 className="font-medium">Bộ lọc</h3>
                <Button onClick={toggleFilters} variant="ghost" size="sm">
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Giá</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 2000000]}
                    max={2000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Kích thước</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`size-${size}`} 
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <label htmlFor={`size-${size}`} className="text-sm">{size}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Màu sắc</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableColors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`color-${color}`} 
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                      />
                      <label htmlFor={`color-${color}`} className="text-sm">{color}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full" onClick={() => {
                  setPriceRange([0, 2000000]);
                  setSelectedSizes([]);
                  setSelectedColors([]);
                }}>
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-heading font-bold hidden md:block">{getPageTitle()}</h1>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sắp xếp:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="name-asc">Tên: A-Z</SelectItem>
                    <SelectItem value="name-desc">Tên: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm h-64 animate-pulse">
                    <div className="h-3/4 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium mb-2">Không tìm thấy sản phẩm nào</h3>
                <p className="text-gray-500 mb-6">Vui lòng thử lại với các bộ lọc khác hoặc xem các danh mục khác.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.slice(1, 6).map((category) => (
                    <Button 
                      key={category.slug}
                      variant="outline" 
                      asChild
                    >
                      <a href={`/products/${category.slug}`}>{category.name}</a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
