import { useState, useEffect } from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll-to-top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-40">
      {/* Messenger button */}
      <a 
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0068ff] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#0052cc] transition-colors pulse"
        aria-label="Messenger"
      >
        <i className="fab fa-facebook-messenger text-xl"></i>
      </a>
      
      {/* Zalo button */}
      <a 
        href={SOCIAL_LINKS.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0180c7] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#0167a3] transition-colors pulse"
        aria-label="Zalo"
      >
        <i className="fas fa-comment text-xl"></i>
      </a>
      
      {/* Scroll to top button - only visible when scrolled down */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up text-lg"></i>
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
