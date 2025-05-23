import React, { useState } from "react";
import { validateDiscountCode } from "../utils/discountLogic";

interface DiscountCodeModalProps {
  visible: boolean;
  onApply: (code: string) => void;
  onClose: () => void;
}
const DiscountCodeModal: React.FC<DiscountCodeModalProps> = ({ visible, onApply, onClose }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!visible) return null;

  const handleApply = () => {
    if (!validateDiscountCode(input)) {
      setError("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
      setSuccess(false);
      return;
    }
    onApply(input);
    setInput("");
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 shadow relative w-80">
        <button className="absolute right-2 top-2 text-gray-600" onClick={onClose}>✕</button>
        <h3 className="font-bold mb-2">Nhập mã giảm giá</h3>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Mã giảm giá"
          className="border p-2 rounded w-full mb-2"
        />
        {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
        {success && <div className="text-xs text-green-600 mb-2">Áp dụng mã thành công!</div>}
        <button className="bg-pink-500 text-white px-4 py-1 rounded" onClick={handleApply}>Áp dụng</button>
      </div>
    </div>
  );
};
export default DiscountCodeModal;