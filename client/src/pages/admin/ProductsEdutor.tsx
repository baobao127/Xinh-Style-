import React, { useEffect, useState } from 'react';

const ProductsEditor: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    const data = localStorage.getItem('products');
    if (data) setProducts(JSON.parse(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      ...form,
      id: Date.now().toString(),
      price: parseInt(form.price),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setForm({ name: '', price: '', image: '', description: '', category: '' });
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Thêm/Sửa/Xoá sản phẩm</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="border p-2 rounded"
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Thêm sản phẩm</button>
      </form>
      <h3 className="font-semibold mb-2">Danh sách sản phẩm</h3>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border p-3 rounded flex justify-between">
            <span>{p.name} - {p.price.toLocaleString()}đ</span>
            <button onClick={() => handleDelete(p.id)} className="text-red-600">Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsEditor;
