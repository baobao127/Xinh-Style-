import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { CATEGORIES, SOCIAL_LINKS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { throttle } from '@/lib/utils';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Close menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Theo dõi và xử lý menu khi nó được mở từ Header
  useEffect(() => {
    const checkHeaderToggle = () => {
      const menuElement = document.getElementById('mobileMenu');
      if (menuElement && menuElement.getAttribute('data-open') === 'true') {
        setIsOpen(true);
        menuElement.removeAttribute('data-open');
      }
    };

    // Kiểm tra mỗi 100ms để xem menu có được mở từ header không
    const intervalId = setInterval(checkHeaderToggle, 100);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Tối ưu hóa hiệu suất của trang khi menu mở
  useEffect(() => {
    if (isOpen) {
      // Ngăn cuộn trang
      document.body.style.overflow = 'hidden';
      
      // Dừng hoạt ảnh không cần thiết khi menu mở
      const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin');
      animatedElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.animationPlayState = 'paused';
        }
      });
    } else {
      // Khôi phục cuộn trang
      document.body.style.overflow = '';
      
      // Khôi phục hoạt ảnh
      const animatedElements = document.querySelectorAll('.animate-pulse, .animate-spin');
      animatedElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.animationPlayState = '';
        }
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Sử dụng throttle để ngăn việc gọi nhiều lần khi người dùng nhấn nhanh
  const closeMenu = useCallback(throttle(() => {
    setIsOpen(false);
  }, 300), []);
  
  const openMenu = useCallback(throttle(() => {
    setIsOpen(true);
  }, 300), []);

  return (
    <div 
      id="mobileMenu" 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}
      onClick={closeMenu}
    >
      <div 
        id="menuContent" 
        className={`bg-white h-full w-4/5 max-w-xs shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="font-heading font-bold text-xl text-primary">
              Xinh Style <span className="text-secondary">QC</span>
            </div>
            <button 
              id="closeMenu" 
              className="text-neutral-800"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b">
          {user ? (
            <>
              <div className="flex items-center py-2">
                <i className="fas fa-user text-primary mr-3"></i>
                <span className="font-medium">{user.fullName || user.username}</span>
              </div>
              <Link href="/account" className="flex items-center py-2">
                <i className="fas fa-user-cog text-primary mr-3"></i>
                <span>Quản lý tài khoản</span>
              </Link>
              <Link href="/orders" className="flex items-center py-2">
                <i className="fas fa-box text-primary mr-3"></i>
                <span>Đơn hàng của tôi</span>
              </Link>
              <Link href="/wishlist" className="flex items-center py-2">
                <i className="fas fa-heart text-primary mr-3"></i>
                <span>Danh sách yêu thích</span>
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center py-2">
                  <i className="fas fa-user-shield text-primary mr-3"></i>
                  <span>Quản trị viên</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="flex items-center py-2 w-full text-left"
              >
                <i className="fas fa-sign-out-alt text-primary mr-3"></i>
                <span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center py-2">
                <i className="fas fa-user text-primary mr-3"></i>
                <span>Đăng nhập / Đăng ký</span>
              </Link>
              <Link href="/wishlist" className="flex items-center py-2">
                <i className="fas fa-heart text-primary mr-3"></i>
                <span>Danh sách yêu thích</span>
              </Link>
            </>
          )}
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-240px)]">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">DANH MỤC</h3>
          <ul>
            {CATEGORIES.map((category, index) => (
              <li key={category.slug}>
                <Link 
                  href={category.slug === '/' ? '/' : `/products/${category.slug}`}
                  className={`block py-2 border-b border-gray-100 ${
                    category.highlight ? 'text-accent' : ''
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 mt-auto border-t">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">LIÊN HỆ</h3>
          <div className="flex space-x-4 my-2">
            <a 
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a 
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a 
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok text-xl"></i>
            </a>
            <a 
              href="#"
              className="text-primary"
              aria-label="Email"
            >
              <i className="fas fa-envelope text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
