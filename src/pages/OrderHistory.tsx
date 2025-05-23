import React, { useEffect, useState } from "react";

const statusColor = (status: string) =>
  status === "processing" ? "text-yellow-500" :
  status === "completed" ? "text-green-500" :
  status === "cancelled" ? "text-red-500" : "text-gray-500";

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
  }, []);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) return <div className="p-4">Bạn chưa có đơn hàng nào.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h2>
      <div className="mb-3">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-1 rounded">
          <option value="all">Tất cả</option>
          <option value="processing">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
      <ul>
        {filteredOrders.map((o: any) => (
          <li key={o.id} className="mb-2 border-b pb-2">
            <div>
              <span className="font-bold">Mã đơn: {o.id}</span> - {o.name} - {o.address}
            </div>
            <div>Ngày đặt: {new Date(o.createdAt).toLocaleString()}</div>
            <div className={`text-xs ${statusColor(o.status)}`}>Trạng thái: {o.status}</div>
            <ul className="pl-4 mt-1 text-sm">
              {o.items.map((item: any) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - {item.price.toLocaleString()}đ
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OrderHistory;