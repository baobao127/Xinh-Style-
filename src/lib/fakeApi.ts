export async function fetchProducts() {
  // Bạn có thể thay bằng API thật nếu muốn
  return [
    { id: 1, name: 'Áo sơ mi', price: 320000, image: '/img/shirt.jpg' },
    { id: 2, name: 'Quần jeans', price: 420000, image: '/img/jeans.jpg' },
    { id: 3, name: 'Đầm hoa', price: 550000, image: '/img/dress.jpg' }
  ];
}