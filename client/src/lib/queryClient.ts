import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Tạo một cache đơn giản cho API requests
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 2; // 2 phút

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Kiểm tra xem cache có hết hạn chưa
function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_DURATION;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // Thêm timeout để tránh request treo quá lâu
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const cacheKey = `GET-${url}`;
    
    // Kiểm tra cache trước khi gọi API
    if (apiCache[cacheKey] && !isCacheExpired(apiCache[cacheKey].timestamp)) {
      return apiCache[cacheKey].data;
    }
    
    try {
      const res = await fetch(url, {
        credentials: "include",
        // Thêm timeout để tránh request treo quá lâu
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Lưu vào cache
      apiCache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
      
      return data;
    } catch (error) {
      console.error('Query function error:', error);
      
      // Nếu có cache cũ, trả về cache cũ dù đã hết hạn trong trường hợp mạng có vấn đề
      if (apiCache[cacheKey]) {
        console.log('Using stale cache data due to network error for:', url);
        return apiCache[cacheKey].data;
      }
      
      throw error;
    }
  };

// Sử dụng queryClient với cấu hình tối ưu cho kết nối chậm
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Giảm số lần retry xuống để tránh quá nhiều requests
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Tăng thời gian retry
      // cacheTime mặc định là 5 phút
    },
    mutations: {
      retry: 1,
    },
  },
});
