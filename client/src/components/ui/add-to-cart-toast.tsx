import { useState, useEffect } from 'react';

interface AddToCartToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const AddToCartToast: React.FC<AddToCartToastProps> = ({ 
  message, 
  isVisible, 
  onClose,
  autoHideDuration = 3000
}) => {
  const [isShowing, setIsShowing] = useState(isVisible);
  
  useEffect(() => {
    setIsShowing(isVisible);
    
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // After fade out animation
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, onClose, autoHideDuration]);
  
  return (
    <div 
      className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center transition-opacity duration-300 z-50 ${
        isShowing ? 'opacity-100' : 'opacity-0'
      } ${isVisible ? 'block' : 'hidden'}`}
    >
      <i className="fas fa-check-circle text-success mr-2"></i>
      <span>{message}</span>
    </div>
  );
};

export default AddToCartToast;
