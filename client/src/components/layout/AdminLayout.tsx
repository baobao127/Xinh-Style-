import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Sản Phẩm",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Đơn Hàng",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Người Dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Cài Đặt",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex flex-1 flex-col min-h-0 border-r bg-white">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
            <h1 className="text-xl font-bold text-white">Xinh Style QC'</h1>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`
                      flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                      ${
                        location === item.href
                          ? "bg-gray-100 text-primary"
                          : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                    {location === item.href && (
                      <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </a>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="flex-shrink-0 flex border-t p-4">
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b flex items-center h-16 px-4">
        <div className="flex-1 flex items-center justify-between">
          <Link href="/">
            <a className="text-xl font-bold text-primary">Xinh Style QC'</a>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-primary">
                  Xinh Style QC'
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <nav className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`
                        flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                        ${
                          location === item.href
                            ? "bg-gray-100 text-primary"
                            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                        }
                      `}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                      {location === item.href && (
                        <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto py-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng Xuất
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="pt-16 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}