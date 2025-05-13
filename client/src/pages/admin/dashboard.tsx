import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';

// Mock data for charts (in a real app, this would come from API)
const salesData = [
  { date: '01/06', revenue: 1500000 },
  { date: '02/06', revenue: 1200000 },
  { date: '03/06', revenue: 1800000 },
  { date: '04/06', revenue: 2100000 },
  { date: '05/06', revenue: 1950000 },
  { date: '06/06', revenue: 2300000 },
  { date: '07/06', revenue: 2500000 },
];

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [timeRange, setTimeRange] = useState('week');
  
  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      setLocation('/login?redirect=/admin');
    }
  }, [user, isAdmin, setLocation]);
  
  // Fetch statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats', { timeRange }],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!isAdmin,
  });
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Quản trị - Xinh Style QC</title>
        <meta name="description" content="Trang quản trị Xinh Style QC" />
      </Helmet>
      
      <AdminLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Tổng quan</h1>
          
          <main className="overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Statistics cards */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Doanh thu hôm nay</p>
                      <h3 className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          formatCurrency(stats?.todayRevenue || 0)
                        )}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <i className="fas fa-hand-holding-usd"></i>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 12% so với hôm qua
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Đơn hàng mới</p>
                      <h3 className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          stats?.newOrders || 0
                        )}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 8% so với hôm qua
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Khách hàng mới</p>
                      <h3 className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          stats?.newCustomers || 0
                        )}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-red-500">
                    <i className="fas fa-arrow-down mr-1"></i> 3% so với hôm qua
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Sản phẩm đã bán</p>
                      <h3 className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          stats?.productsSold || 0
                        )}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <i className="fas fa-box"></i>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-500">
                    <i className="fas fa-arrow-up mr-1"></i> 15% so với hôm qua
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue chart */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Doanh thu</CardTitle>
                    <CardDescription>Tổng doanh thu theo thời gian</CardDescription>
                  </div>
                  <Tabs defaultValue="week" value={timeRange} onValueChange={setTimeRange}>
                    <TabsList>
                      <TabsTrigger value="week">Tuần</TabsTrigger>
                      <TabsTrigger value="month">Tháng</TabsTrigger>
                      <TabsTrigger value="year">Năm</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  {/* In a real app, we would use a chart library like recharts here */}
                  <div className="w-full h-full flex items-end justify-between px-4">
                    {salesData.map((day, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-primary rounded-t" 
                          style={{ 
                            height: `${(day.revenue / 2500000) * 100}%`, 
                            minHeight: '20px'
                          }}
                        ></div>
                        <div className="mt-2 text-xs">{day.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent orders */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Đơn hàng gần đây</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/admin/orders">Xem tất cả</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Không có dữ liệu đơn hàng gần đây</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Top products */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sản phẩm bán chạy</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/admin/products">Xem tất cả</a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-gray-50 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Không có dữ liệu sản phẩm bán chạy</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
