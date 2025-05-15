import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const ProductEditor: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    image: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) return alert("Vui lòng nhập đầy đủ");

    const newProduct = { ...form, id: Date.now().toString() };
    const updated = [...products, newProduct];
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
    setForm({ id: '', name: '', price: 0, image: '', description: '', category: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Xoá sản phẩm này?')) return;
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 mb-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" className="border p-2 rounded" />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Giá" className="border p-2 rounded" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Ảnh (URL)" className="border p-2 rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="border p-2 rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Danh mục" className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Thêm sản phẩm</button>
      </form>

      <h3 className="font-semibold text-lg mb-2">Danh sách sản phẩm</h3>
      <ul className="grid gap-2">
        {products.map(p => (
          <li key={p.id} className="border p-2 rounded flex justify-between items-center">
            <span>{p.name} - {p.price.toLocaleString()}đ</span>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductEditor;
