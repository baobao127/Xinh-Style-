import React, { useState } from 'react';
import { discountCodes } from '../../utils/discountLogic';

const DiscountManager: React.FC = () => {
  const [codes, setCodes] = useState(discountCodes);
  const [newCode, setNewCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState(0);

  const addCode = () => {
    if (!newCode || value <= 0) return;
    setCodes([...codes, { code: newCode, type, value }]);
    setNewCode('');
    setValue(0);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý mã giảm giá</h2>
      <ul className="mb-4">
        {codes.map((c, idx) => (
          <li key={idx} className="mb-2">
            <span className="font-mono">{c.code}</span> - {c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString()}đ`}
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-2">
        <input
          value={newCode}
          onChange={e => setNewCode(e.target.value)}
          placeholder="Mã mới"
          className="border p-1 rounded"
        />
        <select value={type} onChange={e => setType(e.target.value)} className="border p-1 rounded">
          <option value="percent">%</option>
          <option value="fixed">VND</option>
        </select>
        <input
          type="number"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="border p-1 rounded w-20"
          placeholder="Giá trị"
        />
        <button className="bg-pink-500 text-white px-2 py-1 rounded" onClick={addCode}>
          Thêm
        </button>
      </div>
    </div>
  );
};

export default DiscountManager;