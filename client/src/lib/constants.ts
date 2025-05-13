// Categories
export const CATEGORIES = [
  { name: "Trang chủ", slug: "/" },
  { name: "Áo", slug: "ao" },
  { name: "Váy", slug: "vay" },
  { name: "Quần", slug: "quan" },
  { name: "Đồ thể thao", slug: "do-the-thao" },
  { name: "Phụ kiện", slug: "phu-kien" },
  { name: "Sale", slug: "sale" },
  { name: "Flash Sale", slug: "flash-sale", highlight: true },
  { name: "Bộ sưu tập mới", slug: "bo-suu-tap-moi" },
];

// Size options
export const SIZE_OPTIONS = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  shoes: ["35", "36", "37", "38", "39", "40"],
  accessories: ["Free Size"],
};

// Color options with hex values
export const COLOR_OPTIONS = [
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xám", hex: "#9E9E9E" },
  { name: "Xanh Navy", hex: "#0A1C40" },
  { name: "Hồng", hex: "#F48FB1" },
  { name: "Đỏ", hex: "#E53935" },
  { name: "Xanh", hex: "#42A5F5" },
  { name: "Nâu", hex: "#795548" },
  { name: "Xanh lá", hex: "#66BB6A" },
  { name: "Vàng", hex: "#FFEB3B" },
  { name: "Cam", hex: "#FF9800" },
  { name: "Tím", hex: "#9C27B0" },
];

// Payment methods
export const PAYMENT_METHODS = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", icon: "money-bill-wave" },
  { id: "bank", name: "Chuyển khoản ngân hàng", icon: "university" },
  { id: "momo", name: "Ví MoMo", icon: "wallet" },
  { id: "zalopay", name: "ZaloPay", icon: "credit-card" },
  { id: "vnpay", name: "VNPay", icon: "qrcode" },
];

// Order status options
export const ORDER_STATUS = [
  { value: "pending", label: "Chờ xác nhận", color: "bg-yellow-500" },
  { value: "confirmed", label: "Đã xác nhận", color: "bg-blue-500" },
  { value: "shipping", label: "Đang giao", color: "bg-purple-500" },
  { value: "delivered", label: "Đã giao", color: "bg-green-500" },
  { value: "cancelled", label: "Đã hủy", color: "bg-red-500" },
];

// Social media links
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/xinhstyleqc",
  instagram: "https://instagram.com/xinhstyleqc",
  tiktok: "https://tiktok.com/@xinhstyleqc",
  zalo: "https://zalo.me/xinhstyleqc",
};

// Contact information
export const CONTACT_INFO = {
  address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  phone: "1900 xxxx",
  email: "info@xinhstyle.vn",
  workingHours: "9:00 - 21:00, Thứ 2 - Chủ nhật",
};

// LocalStorage keys
export const STORAGE_KEYS = {
  cart: "xinhstyle-cart",
  wishlist: "xinhstyle-wishlist",
  auth: "xinhstyle-auth",
  browsingHistory: "xinhstyle-history",
  recentlyViewed: "xinhstyle-recent",
};
