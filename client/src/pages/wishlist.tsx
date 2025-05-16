import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const wishlist: React.FC = () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) setList(JSON.parse(stored));
  }, []);

  const handleRemove = (id: string) => {
    if (!window.confirm('Xoá khỏi danh sách yêu thích?')) return;
    const updated = list.filter(p => p.id !== id);
    setList(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  if (list.length === 0) {
    return <p className="p-4">Danh sách yêu thích trống.</p>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Danh sách yêu thích</h2>
      <ul className="space-y-4">
        {list.map(p => (
          <li key={p.id} className="flex justify-between border p-3 rounded">
            <span>{p.name}</span>
            <button onClick={() => handleRemove(p.id)} className="text-red-500 hover:underline">Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default wishlist;
