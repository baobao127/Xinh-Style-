const features = [
  {
    icon: "fa-truck",
    title: "Giao Hàng Toàn Quốc",
    description: "Miễn phí từ 499k",
    bgColor: "bg-primary/10",
    textColor: "text-primary"
  },
  {
    icon: "fa-exchange-alt",
    title: "Đổi Trả 7 Ngày",
    description: "Đổi trả dễ dàng",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary"
  },
  {
    icon: "fa-credit-card",
    title: "Thanh Toán",
    description: "COD, QR, chuyển khoản",
    bgColor: "bg-accent/10",
    textColor: "text-accent"
  },
  {
    icon: "fa-headset",
    title: "Hỗ Trợ 24/7",
    description: "Hotline: 1900 xxxx",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500"
  }
];

const Features = () => {
  return (
    <div className="px-4 py-8 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center ${feature.textColor} mb-3`}>
              <i className={`fas ${feature.icon} text-lg`}></i>
            </div>
            <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
            <p className="text-gray-500 text-xs">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
