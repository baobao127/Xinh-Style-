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

export interface Order {
  id: string;
  name: string;
  status: 'processing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrderItemProps {
  order: Order;
  onCancel: (id: string, reason: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onCancel }) => {
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelClick = () => {
    if (!showCancelInput) {
      setShowCancelInput(true);
    } else if (cancelReason.trim()) {
      onCancel(order.id, cancelReason.trim());
      setShowCancelInput(false);
      setCancelReason('');
    }
  };

  const isCancelable = order.status === 'processing';

  return (
    <div className="border rounded-xl p-4 shadow mb-4 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{order.name}</p>
          <p className="text-sm text-gray-500">Ngày tạo: {order.createdAt}</p>
          <p className={`text-sm mt-1 ${
            order.status === 'cancelled' ? 'text-red-500' :
            order.status === 'shipping' ? 'text-blue-500' :
            order.status === 'delivered' ? 'text-green-600' :
            'text-yellow-600'
          }`}>
            Trạng thái: {statusText(order.status)}
          </p>
        </div>

        {isCancelable && (
          <div className="text-right">
            <button
              onClick={handleCancelClick}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              {showCancelInput ? 'Xác nhận hủy' : 'Hủy đơn'}
            </button>
            {showCancelInput && (
              <textarea
                placeholder="Nhập lý do hủy..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-2 w-full p-2 border rounded"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const statusText = (status: Order['status']) => {
  switch (status) {
    case 'processing': return 'Đang xử lý';
    case 'shipping': return 'Đang giao hàng';
    case 'delivered': return 'Đã nhận hàng';
    case 'cancelled': return 'Đã huỷ';
    default: return 'Không rõ';
  }
};

export default Order;
