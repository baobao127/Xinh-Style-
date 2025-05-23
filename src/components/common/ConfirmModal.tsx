import React from 'react';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, message, onConfirm, onCancel }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <p className="mb-4">{message}</p>
        <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={onConfirm}>Xác nhận</button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  );
};

export default ConfirmModal;