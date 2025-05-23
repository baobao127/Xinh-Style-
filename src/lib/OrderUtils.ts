export function saveOrder(order: any) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  localStorage.setItem('orders', JSON.stringify([...orders, order]));
}

export function getAllOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}

export function updateOrderStatus(orderId: number, newStatus: string) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const updated = orders.map((o: any) =>
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  localStorage.setItem('orders', JSON.stringify(updated));
}