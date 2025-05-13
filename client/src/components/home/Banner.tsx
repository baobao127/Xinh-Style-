import { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface BannerItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const banners: BannerItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600",
    title: "Bộ Sưu Tập Mùa Hè 2023",
    description: "Khám phá những thiết kế mới nhất với phong cách tươi trẻ và năng động",
    buttonText: "Mua ngay",
    buttonLink: "/products/bo-suu-tap-moi"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600",
    title: "Thời Trang Công Sở",
    description: "Tự tin tỏa sáng với thiết kế sang trọng và thanh lịch",
    buttonText: "Khám phá",
    buttonLink: "/products/ao"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600",
    title: "Phụ Kiện Thời Trang",
    description: "Điểm nhấn hoàn hảo cho mọi trang phục",
    buttonText: "Xem ngay",
    buttonLink: "/products/phu-kien"
  }
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative overflow-hidden mb-4">
      <div className="relative h-[200px] md:h-[400px] bg-cover bg-center" style={{
        backgroundImage: `url('${banners[currentSlide].image}')`
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/70 to-transparent"></div>
        <div className="absolute left-6 md:left-12 top-1/2 transform -translate-y-1/2 w-2/3 md:w-1/2">
          <h1 className="text-white text-2xl md:text-4xl font-heading font-bold mb-2 md:mb-4">
            {banners[currentSlide].title}
          </h1>
          <p className="text-white text-sm md:text-base mb-3 md:mb-6">
            {banners[currentSlide].description}
          </p>
          <Link 
            href={banners[currentSlide].buttonLink} 
            className="inline-block bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
          >
            {banners[currentSlide].buttonText}
          </Link>
        </div>
      </div>
      
      {/* Banner Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button 
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? 'bg-white bg-opacity-100' : 'bg-white bg-opacity-50'
            }`}
            aria-current={index === currentSlide}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;
