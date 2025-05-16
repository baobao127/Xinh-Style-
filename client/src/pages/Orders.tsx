import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/constants';
import { Order, OrderItem } from '@shared/schema';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('orders');
    if (data) setOrders(JSON.parse(data));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <p><strong>Tên:</strong> {order.name}</p>
              <p><strong>Địa chỉ:</strong> {order.address}</p>
              <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
              <p><strong>Trạng thái:</strong> Chờ xử lý</p>
              <p className="text-gray-500 text-sm">Đặt lúc: {new Date(order.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
