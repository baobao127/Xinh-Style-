import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

// Hook for fetching all products
export function useProducts(options?: { category?: string; featured?: boolean; newArrival?: boolean; flashSale?: boolean }) {
  const queryParams = new URLSearchParams();

  if (options?.category) queryParams.append('category', options.category);
  if (options?.featured) queryParams.append('featured', 'true');
  if (options?.newArrival) queryParams.append('newArrival', 'true');
  if (options?.flashSale) queryParams.append('flashSale', 'true');

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  return useQuery<Product[]>({
    queryKey: ['/api/products' + queryString],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for fetching a single product
export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug,
  });
}

// Hook for adding browsing history
export function useAddToBrowsingHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, productId }: { userId: number; productId: number }) => {
      const response = await apiRequest('POST', '/api/browsing-history', { userId, productId });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate recommendations query when browsing history changes
      queryClient.invalidateQueries({ queryKey: ['/api/users', 'recommendations'] });
    },
  });
}

// Hook for fetching product recommendations
export function useProductRecommendations(userId: number) {
  return useQuery<Product[]>({
    queryKey: [`/api/users/${userId}/recommendations`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
}

// Hook for fetching products by collection
export function useCollectionProducts(collectionId: number) {
  return useQuery<Product[]>({
    queryKey: [`/api/collections/${collectionId}/products`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!collectionId,
  });
}

// Hook for creating a product (admin only)
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id'>) => {
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate products queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}

// Hook for updating a product (admin only)
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: Partial<Product> }) => {
      const response = await apiRequest('PUT', `/api/products/${id}`, productData);
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate specific product and product list queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${variables.id}`] });
    },
  });
}

// Hook for deleting a product (admin only)
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/products/${id}`);
      return response.status === 204;
    },
    onSuccess: () => {
      // Invalidate products queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}
