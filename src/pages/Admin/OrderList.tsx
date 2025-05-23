import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../lib/OrderUtils";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setOrders(getAllOrders());
  }, []);

  const handleStatus = (id: number, status: string) => {
    updateOrderStatus(id, status);
    setOrders([...getAllOrders()]);
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">Quản lý đơn hàng</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr className="border-b" key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>
                <ul className="text-xs">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="text-right">{order.total.toLocaleString()}đ</td>
              <td>
                <select
                  className="border rounded p-1"
                  value={order.status}
                  onChange={e => handleStatus(order.id, e.target.value)}
                >
                  <option value="processing">Chờ xử lý</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}