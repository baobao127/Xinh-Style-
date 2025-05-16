import React, { useEffect, useState } from 'react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('orders');
    if (data) setOrders(JSON.parse(data));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="border p-4 rounded">
              <p><strong>Khách:</strong> {o.name}</p>
              <p><strong>Địa chỉ:</strong> {o.address}</p>
              <p><strong>Thanh toán:</strong> {o.paymentMethod}</p>
              <p className="text-gray-500 text-sm">Thời gian: {new Date(o.createdAt).toLocaleString()}</p>
              <hr className="my-2" />
              <ul className="text-sm list-disc pl-5">
                {o.items.map((item: any) => (
                  <li key={item.id}>{item.name} - {item.price.toLocaleString()}đ</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
