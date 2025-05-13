import { Link } from "wouter";
import { CATEGORIES, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand information */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">
              Xinh Style <span className="text-secondary">QC</span>
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Thời trang nữ cao cấp với phong cách hiện đại, trẻ trung và năng động.
            </p>
            <div className="flex space-x-3">
              <a 
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
              <a 
                href="#"
                className="bg-white bg-opacity-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4">Danh Mục</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={category.slug === '/' ? '/' : `/products/${category.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Support */}
          <div>
            <h4 className="font-medium mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  Tài khoản của tôi
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Trả hàng & Hoàn tiền
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="font-medium mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-primary"></i>
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2 text-primary"></i>
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-primary"></i>
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-2 text-primary"></i>
                <span>{CONTACT_INFO.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-xs">
          <p>© {new Date().getFullYear()} Xinh Style QC. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
