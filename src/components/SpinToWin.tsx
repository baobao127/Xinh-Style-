import React, { useState } from 'react';

const prizes = [
  { label: 'Giảm 10%', value: 'xinh10' },
  { label: 'Freeship', value: 'freeship30' },
  { label: 'Giảm 5%', value: 'giam5' },
  { label: 'Chúc may mắn lần sau', value: null },
  { label: 'Áo phông miễn phí', value: 'free-shirt' },
];

const getRandomPrize = () => prizes[Math.floor(Math.random() * prizes.length)];

const SpinToWin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; value: string | null } | null>(null);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      const prize = getRandomPrize();
      setResult(prize);
      setSpinning(false);
      if (prize.value) {
        localStorage.setItem('wonPrize', prize.value);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] text-center">
        <h2 className="text-xl font-semibold mb-4">Vòng quay may mắn</h2>
        {result ? (
          <>
            <div className="text-lg mb-2">{result.label}</div>
            {result.value && (
              <div className="text-green-600 font-bold">Mã: {result.value}</div>
            )}
            <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded" onClick={onClose}>
              Đóng
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">Quay để nhận phần thưởng hấp dẫn!</div>
            <button
              className={`bg-black text-white px-4 py-2 rounded ${spinning ? 'opacity-50' : ''}`}
              onClick={handleSpin}
              disabled={spinning}
            >
              {spinning ? 'Đang quay...' : 'Quay ngay'}
            </button>
            <button className="mt-4 text-sm underline text-gray-500 block" onClick={onClose}>Thoát</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SpinToWin;