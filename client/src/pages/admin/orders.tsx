import React, { useEffect, useState } from 'react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored) setOrders(JSON.parse(stored));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <p><strong>Khách:</strong> {order.name}</p>
              <p><strong>Địa chỉ:</strong> {order.address}</p>
              <p><strong>PT thanh toán:</strong> {order.paymentMethod}</p>
              <p><strong>Sản phẩm:</strong></p>
              <ul className="pl-4 list-disc">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.name} - {item.price.toLocaleString()}đ
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">Đặt lúc: {new Date(order.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
