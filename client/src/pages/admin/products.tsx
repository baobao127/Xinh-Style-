import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { Product, Category } from '@shared/schema';

const AdminProducts = () => {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    salePrice: 0,
    discount: 0,
    categoryId: 0,
    images: [''],
    colors: [''],
    sizes: [''],
    featured: false,
    newArrival: false,
    flashSale: false,
    inStock: true
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      setLocation('/login?redirect=/admin/products');
    }
  }, [user, isAdmin, setLocation]);
  
  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!isAdmin,
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!isAdmin,
  });
  
  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được thêm thành công",
        variant: "success",
      });
      setIsAddProductDialogOpen(false);
      resetNewProductForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thêm sản phẩm",
        variant: "destructive",
      });
    },
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest('DELETE', `/api/products/${productId}`);
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa thành công",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa sản phẩm",
        variant: "destructive",
      });
    },
  });
  
  // Filter products based on search term and category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.categoryId === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };
  
  // Reset new product form
  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      slug: '',
      description: '',
      price: 0,
      salePrice: 0,
      discount: 0,
      categoryId: 0,
      images: [''],
      colors: [''],
      sizes: [''],
      featured: false,
      newArrival: false,
      flashSale: false,
      inStock: true
    });
  };
  
  // Handle new product form change
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewProduct(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'salePrice' || name === 'discount' || name === 'categoryId') {
      setNewProduct(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle image URLs change
  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
    setNewProduct(prev => ({ ...prev, images: urls }));
  };
  
  // Handle colors change
  const handleColorsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const colors = e.target.value.split(',').map(color => color.trim()).filter(color => color !== '');
    setNewProduct(prev => ({ ...prev, colors }));
  };
  
  // Handle sizes change
  const handleSizesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sizes = e.target.value.split(',').map(size => size.trim()).filter(size => size !== '');
    setNewProduct(prev => ({ ...prev, sizes }));
  };
  
  // Handle add product form submission
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name || !newProduct.slug || !newProduct.price || !newProduct.categoryId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form
    addProductMutation.mutate(newProduct);
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      deleteProductMutation.mutate(productId);
    }
  };
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Quản lý sản phẩm - Xinh Style QC</title>
        <meta name="description" content="Quản lý sản phẩm Xinh Style QC" />
      </Helmet>
      
      <AdminLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Quản lý sản phẩm</h1>
          
          <main className="overflow-y-auto">
            {/* Actions bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-full md:w-64">
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <i className="fas fa-plus mr-2"></i>
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddProduct} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newProduct.name}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          name="slug"
                          value={newProduct.slug}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleNewProductChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Giá gốc</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={newProduct.price}
                          onChange={handleNewProductChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="salePrice">Giá khuyến mãi</Label>
                        <Input
                          id="salePrice"
                          name="salePrice"
                          type="number"
                          value={newProduct.salePrice || ''}
                          onChange={handleNewProductChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discount">Giảm giá (%)</Label>
                        <Input
                          id="discount"
                          name="discount"
                          type="number"
                          value={newProduct.discount || ''}
                          onChange={handleNewProductChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Danh mục</Label>
                      <Select 
                        value={newProduct.categoryId.toString()} 
                        onValueChange={(value) => handleNewProductChange({ 
                          target: { name: 'categoryId', value, type: 'select' } 
                        } as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="images">Hình ảnh (mỗi URL một dòng)</Label>
                      <textarea
                        id="images"
                        name="images"
                        value={newProduct.images.join('\n')}
                        onChange={handleImagesChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                        rows={3}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colors">Màu sắc (phân cách bằng dấu phẩy)</Label>
                        <textarea
                          id="colors"
                          name="colors"
                          value={newProduct.colors.join(', ')}
                          onChange={handleColorsChange}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                          placeholder="Đen, Trắng, Đỏ"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sizes">Kích thước (phân cách bằng dấu phẩy)</Label>
                        <textarea
                          id="sizes"
                          name="sizes"
                          value={newProduct.sizes.join(', ')}
                          onChange={handleSizesChange}
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                          placeholder="S, M, L, XL"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={newProduct.featured}
                          onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                        />
                        <Label htmlFor="featured">Nổi bật</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="newArrival"
                          checked={newProduct.newArrival}
                          onCheckedChange={(checked) => handleSwitchChange('newArrival', checked)}
                        />
                        <Label htmlFor="newArrival">Hàng mới</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="flashSale"
                          checked={newProduct.flashSale}
                          onCheckedChange={(checked) => handleSwitchChange('flashSale', checked)}
                        />
                        <Label htmlFor="flashSale">Flash sale</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          checked={newProduct.inStock}
                          onCheckedChange={(checked) => handleSwitchChange('inStock', checked)}
                        />
                        <Label htmlFor="inStock">Còn hàng</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddProductDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addProductMutation.isPending}
                      >
                        {addProductMutation.isPending ? (
                          <span className="flex items-center">
                            <i className="fas fa-spinner animate-spin mr-2"></i>
                            Đang lưu
                          </span>
                        ) : (
                          'Lưu sản phẩm'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Products table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingProducts || isLoadingCategories ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : currentItems && currentItems.length > 0 ? (
                      currentItems.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {product.images && product.images[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <i className="fas fa-image"></i>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                  {product.description && product.description.substring(0, 50)}
                                  {product.description && product.description.length > 50 ? '...' : ''}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                          <TableCell>
                            {product.salePrice ? (
                              <div>
                                <div className="font-medium">{formatCurrency(product.salePrice)}</div>
                                <div className="text-xs text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </div>
                              </div>
                            ) : (
                              formatCurrency(product.price)
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.inStock ? (
                                <Badge variant="success">Còn hàng</Badge>
                              ) : (
                                <Badge variant="destructive">Hết hàng</Badge>
                              )}
                              {product.featured && <Badge>Nổi bật</Badge>}
                              {product.newArrival && <Badge variant="secondary">Mới</Badge>}
                              {product.flashSale && <Badge variant="destructive">Flash Sale</Badge>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/admin/products/${product.id}/edit`}>
                                  <i className="fas fa-edit"></i>
                                </a>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deleteProductMutation.isPending}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Không có sản phẩm nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredProducts && filteredProducts.length > 0 && (
                <div className="flex justify-between items-center px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminProducts;
