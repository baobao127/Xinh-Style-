import React, { useState, useEffect } from 'react';

const ProductsEditor: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '', category: '' });

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { ...form, id: Date.now().toString(), price: parseInt(form.price) };
    const updated = [...products, newItem];
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
    setForm({ name: '', price: '', image: '', description: '', category: '' });
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
        {Object.keys(form).map(key => (
          <input key={key} name={key} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
            placeholder={key} className="border p-2 rounded" />
        ))}
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Lưu</button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Sản phẩm đã có</h3>
      <ul className="space-y-1">
        {products.map(p => (
          <li key={p.id} className="border p-2 rounded flex justify-between items-center">
            <span>{p.name} - {p.price.toLocaleString()}đ</span>
            <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsEditor;
