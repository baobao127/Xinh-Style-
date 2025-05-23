import React, { useEffect, useState } from 'react';
const fakeNames = ["Lan", "Hùng", "Thảo", "Minh", "Hà", "Tú", "Phúc"];
const fakeProducts = ["áo sơ mi", "quần jeans", "váy hoa", "áo phông"];
export default function FakePurchase() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      setMsg(`${fakeNames[Math.floor(Math.random()*fakeNames.length)]} vừa mua ${fakeProducts[Math.floor(Math.random()*fakeProducts.length)]}`);
      setShow(true);
      setTimeout(() => setShow(false), 3500);
    }, 18000);
    return () => clearInterval(timer);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed left-2 bottom-16 bg-white shadow px-3 py-2 rounded z-50 border">
      <span className="text-green-600 font-semibold">{msg}</span>
    </div>
  );
}