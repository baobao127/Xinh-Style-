import React, { useState } from 'react';

const UnlockAdmin: React.FC = () => {
  const [input, setInput] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const storedCodes = ['xanh30', 'giam5', 'freevanchuyen'];

  const handleSubmit = () => {
    if (!input.trim()) return;

    if (storedCodes.includes(input.trim())) {
      const updated = [...codes, input.trim()];
      setCodes(updated);
      setMessage('Mã hợp lệ!');
      setInput('');

      if (updated.length === 3 && new Set(updated).size === 3) {
        localStorage.setItem('adminUnlocked', 'true');
        setMessage('Đã mở khóa admin!');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1200);
      }
    } else {
      setMessage('Sai mã hoặc nhập trùng!');
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập mã admin"
        className="border p-2 rounded w-full mb-2"
      />
      <button onClick={handleSubmit} className="bg-black text-white px-3 py-1 rounded">
        Kiểm tra
      </button>
      {message && <div className="mt-2 text-xs">{message}</div>}
    </div>
  );
};

export default UnlockAdmin;