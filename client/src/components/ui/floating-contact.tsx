import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, 
  MessageCircle, 
  Facebook, 
  ChevronUp, 
  ChevronDown,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingContactProps {
  className?: string;
  phone?: string;
  zaloId?: string;
  facebookPage?: string;
}

export function FloatingContact({
  className,
  phone = '0123456789',
  zaloId = '0123456789',
  facebookPage = 'https://facebook.com/xinhstyleqc',
}: FloatingContactProps) {
  // State để kiểm soát trạng thái mở/đóng
  const [isExpanded, setIsExpanded] = useState(false);

  // Các liên kết
  const contactLinks = [
    {
      label: 'Gọi điện',
      icon: <PhoneCall className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      href: `tel:${phone}`,
    },
    {
      label: 'Zalo',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: `https://zalo.me/${zaloId}`,
    },
    {
      label: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      href: facebookPage,
    },
  ];

  // Animation variants
  const containerVariants = {
    collapsed: { width: '50px', height: '50px', borderRadius: '50%' },
    expanded: { width: 'auto', height: 'auto', borderRadius: '16px' }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      }
    }
  };

  return (
    <div className={cn('fixed right-4 bottom-20 z-40', className)}>
      <motion.div
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={cn(
          'bg-white shadow-lg overflow-hidden',
          isExpanded ? 'p-3' : 'p-0'
        )}
      >
        {/* Nút mở/đóng */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            'w-full h-full flex items-center justify-center bg-primary text-white transition-all',
            isExpanded ? 'rounded-full w-10 h-10 mb-2' : 'rounded-full w-[50px] h-[50px]'
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Thu gọn tùy chọn liên hệ' : 'Mở rộng tùy chọn liên hệ'}
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <Headphones className="h-5 w-5" />
          )}
        </Button>

        {/* Các tùy chọn liên hệ */}
        <AnimatePresence>
          {isExpanded && (
            <div className="space-y-2">
              {contactLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  custom={index}
                  className="flex"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-white transition-colors',
                      link.color
                    )}
                  >
                    <span className="font-medium">{link.label}</span>
                    {link.icon}
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default FloatingContact;