import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Category, Product } from '@shared/schema';
import SequentialProductGrid from './SequentialProductGrid';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  className?: string;
  title?: string;
  defaultCategory?: string; // slug của danh mục mặc định
  columns?: number;
  itemsPerCategory?: number;
  showLoadMore?: boolean;
}

export default function CategoryTabs({
  className,
  title = 'Danh mục sản phẩm',
  defaultCategory,
  columns = 2,
  itemsPerCategory = 8,
  showLoadMore = true,
}: CategoryTabsProps) {
  // Tải tất cả danh mục
  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Lấy slug danh mục mặc định (hoặc dùng danh mục đầu tiên)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Cập nhật danh mục hiện tại khi danh sách danh mục được tải
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      if (defaultCategory) {
        // Kiểm tra xem defaultCategory có tồn tại trong danh sách không
        const categoryExists = categories.some((cat: Category) => cat.slug === defaultCategory);
        setActiveCategory(categoryExists ? defaultCategory : categories[0].slug);
      } else {
        setActiveCategory(categories[0].slug);
      }
    }
  }, [categories, defaultCategory, activeCategory]);

  // Tải sản phẩm theo danh mục
  const { data: allProducts = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Lọc sản phẩm theo danh mục
  const getProductsByCategory = (categoryId: number): Product[] => {
    return allProducts.filter((product: Product) => product.categoryId === categoryId);
  };

  // Nếu đang tải, hiển thị skeleton
  if (loadingCategories) {
    return (
      <div className={cn('my-8', className)}>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Nếu không có danh mục nào
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={cn('my-8', className)}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      <Tabs
        defaultValue={activeCategory || categories[0].slug}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <ScrollArea className="w-full max-w-full pb-2">
          <TabsList className="flex h-auto p-1 bg-muted/50 w-full justify-start overflow-x-auto">
            {categories.map((category: Category) => (
              <TabsTrigger
                key={category.id}
                value={category.slug}
                className="px-4 py-2 whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {categories.map((category: Category) => {
          const productsInCategory = getProductsByCategory(category.id);
          
          return (
            <TabsContent key={category.id} value={category.slug} className="pt-4">
              {loadingProducts ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : productsInCategory.length > 0 ? (
                <SequentialProductGrid
                  products={productsInCategory}
                  columns={columns}
                  initialCount={4}
                  itemsPerBatch={2}
                  showLoadMore={showLoadMore && productsInCategory.length > itemsPerCategory}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Không có sản phẩm nào trong danh mục này
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}