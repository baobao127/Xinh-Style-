import React from 'react';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-black',
};

const Toast: React.FC<ToastProps> = ({ visible, message, type = 'info', onClose }) => {
  if (!visible) return null;
  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white rounded-lg shadow-lg z-50 ${colorMap[type]}`}>
      {message}
      {onClose && (
        <button className="ml-2 text-xs underline" onClick={onClose}>
          Đóng
        </button>
      )}
    </div>
  );
};

export default Toast;