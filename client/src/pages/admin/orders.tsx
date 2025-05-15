import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { ORDER_STATUS } from '@/lib/constants';
import React from 'react';

const Orders: React.FC = () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
      <ul className="space-y-2">
        {orders.map((o: any, i: number) => (
          <li key={i} className="border p-2 rounded">
            <p>Khách: {o.name}</p>
            <p>Địa chỉ: {o.address}</p>
            <p>Sản phẩm: {o.items.length} món</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
import { Order, OrderItem } from '@shared/schema';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const AdminOrders = () => {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      setLocation('/login?redirect=/admin/orders');
    }
  }, [user, isAdmin, setLocation]);
  
  // Fetch orders
  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/orders'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!isAdmin,
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest('PUT', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Thành công",
        description: "Trạng thái đơn hàng đã được cập nhật",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật trạng thái",
        variant: "destructive",
      });
    },
  });
  
  // Filter orders based on search term and status
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) || 
                        order.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.contactPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUS.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-500'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };
  
  // Handle view order details
  const handleViewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };
  
  // Handle update order status
  const handleUpdateStatus = (orderId: number, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Quản lý đơn hàng - Xinh Style QC</title>
        <meta name="description" content="Quản lý đơn hàng Xinh Style QC" />
      </Helmet>
      
      <AdminLayout>
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>
          
          <main className="overflow-y-auto">
            {/* Actions bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-full md:w-64">
                  <Input
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fas fa-search"></i>
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {ORDER_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/orders'] })}>
                <i className="fas fa-sync-alt mr-2"></i>
                Làm mới
              </Button>
            </div>
            
            {/* Orders table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : currentItems && currentItems.length > 0 ? (
                      currentItems.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.contactName}</div>
                              <div className="text-xs text-gray-500">{order.contactPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{formatCurrency(order.total)}</div>
                            <div className="text-xs text-gray-500">
                              {order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' :
                               order.paymentMethod === 'bank' ? 'Chuyển khoản' :
                               order.paymentMethod === 'momo' ? 'Ví MoMo' :
                               order.paymentMethod === 'zalopay' ? 'ZaloPay' :
                               order.paymentMethod === 'vnpay' ? 'VNPay' :
                               order.paymentMethod}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewOrder(order)}
                              >
                                <i className="fas fa-eye"></i>
                              </Button>
                              
                              <Select 
                                defaultValue={order.status} 
                                onValueChange={(value) => handleUpdateStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-[130px] h-8">
                                  <SelectValue placeholder="Cập nhật" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Không có đơn hàng nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredOrders && filteredOrders.length > 0 && (
                <div className="flex justify-between items-center px-4 py-3 border-t">
                  <div className="text-sm text-gray-500">
                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} của {filteredOrders.length} đơn hàng
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
      
      {/* Order details dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    <div><span className="font-medium">Tên:</span> {selectedOrder.contactName}</div>
                    <div><span className="font-medium">Số điện thoại:</span> {selectedOrder.contactPhone}</div>
                    <div><span className="font-medium">Địa chỉ:</span> {selectedOrder.shippingAddress}</div>
                    <div>
                      <span className="font-medium">Phương thức thanh toán:</span> {' '}
                      {selectedOrder.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' :
                       selectedOrder.paymentMethod === 'bank' ? 'Chuyển khoản' :
                       selectedOrder.paymentMethod === 'momo' ? 'Ví MoMo' :
                       selectedOrder.paymentMethod === 'zalopay' ? 'ZaloPay' :
                       selectedOrder.paymentMethod === 'vnpay' ? 'VNPay' :
                       selectedOrder.paymentMethod}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Trạng thái:</span> {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div>
                      <span className="font-medium">Ngày đặt:</span> {' '}
                      {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div><span className="font-medium">Mã giảm giá:</span> {selectedOrder.couponCode || 'Không có'}</div>
                    <div><span className="font-medium">Giảm giá:</span> {formatCurrency(selectedOrder.couponDiscount)}</div>
                    <div><span className="font-medium">Tổng tiền:</span> {formatCurrency(selectedOrder.total)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Sản phẩm đặt mua</h3>
                <div className="border rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items && selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">Sản phẩm #{item.productId}</div>
                              <div className="text-xs text-gray-500">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ' | '}
                                {item.color && `Màu: ${item.color}`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <h3 className="font-medium">Cập nhật trạng thái</h3>
                  <Select 
                    defaultValue={selectedOrder.status} 
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="mt-2 w-[200px]">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Đóng
                  </Button>
                  <Button asChild>
                    <a href={`/admin/orders/${selectedOrder.id}/print`} target="_blank">
                      <i className="fas fa-print mr-2"></i>
                      In đơn hàng
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOrders;
