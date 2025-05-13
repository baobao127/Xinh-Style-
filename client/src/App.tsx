import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ConnectionStatus from "@/components/ui/connection-status";
import { isOnline } from "@/lib/utils";
import { useScrollRestoration, useSmoothScroll } from "@/hooks/useScrollRestoration";
import { ErrorBoundary, useErrorBoundary } from "@/hooks/useErrorBoundary";

// Eager loaded components
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import FloatingButtons from "@/components/layout/FloatingButtons";
import Home from "@/pages/home";

// Lazy loaded components for better mobile performance
const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const Cart = lazy(() => import("@/pages/cart"));
const Wishlist = lazy(() => import("@/pages/wishlist"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Account = lazy(() => import("@/pages/account"));
const Orders = lazy(() => import("@/pages/orders"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/products"));
const AdminOrders = lazy(() => import("@/pages/admin/orders"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));

// Loading component for lazy-loaded routes
function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}

function Router() {
  const { user, isAdmin } = useAuth();

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:categorySlug" component={Products} />
        <Route path="/product/:productSlug" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Protected routes */}
        {user ? (
          <>
            <Route path="/account" component={Account} />
            <Route path="/orders" component={Orders} />
            
            {/* Admin routes */}
            {isAdmin && (
              <>
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/products" component={AdminProducts} />
                <Route path="/admin/orders" component={AdminOrders} />
                <Route path="/admin/users" component={AdminUsers} />
              </>
            )}
          </>
        ) : null}
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Initialize browsing tracking
  const { user } = useAuth();
  
  // Sử dụng hook để khôi phục vị trí cuộn và làm mượt việc cuộn
  useScrollRestoration();
  useSmoothScroll();
  
  useEffect(() => {
    // Xử lý thay đổi trạng thái khi trang web được hiển thị/ẩn
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Khi người dùng quay lại trang, kiểm tra kết nối và khôi phục trạng thái
        if (isOnline()) {
          // Đồng bộ dữ liệu nếu cần thiết
          queryClient.invalidateQueries();
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Xử lý các sự kiện trên thiết bị di động
    window.addEventListener("pagehide", () => {
      // Lưu trạng thái khi người dùng rời khỏi trang
      sessionStorage.setItem("lastActiveTime", new Date().toISOString());
    });
    
    window.addEventListener("pageshow", (event) => {
      // Kiểm tra xem có phải là back/forward navigation không
      if (event.persisted) {
        // Trang được tải từ bộ nhớ cache của trình duyệt
        const lastActiveTime = sessionStorage.getItem("lastActiveTime");
        
        if (lastActiveTime) {
          const timeDiff = new Date().getTime() - new Date(lastActiveTime).getTime();
          
          // Nếu thời gian không hoạt động quá 5 phút, làm mới dữ liệu
          if (timeDiff > 5 * 60 * 1000) {
            queryClient.invalidateQueries();
          }
        }
      }
    });
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", () => {});
      window.removeEventListener("pageshow", () => {});
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <MobileMenu />
            <main className="flex-grow pb-20">
              <ErrorBoundary>
                <Router />
              </ErrorBoundary>
            </main>
            <Footer />
            <FloatingButtons />
            <ConnectionStatus />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
