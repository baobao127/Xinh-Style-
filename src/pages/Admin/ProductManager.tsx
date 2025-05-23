import React, { useState, useEffect } from "react";
import Toast from "../../components/common/Toast";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [toast, setToast] = useState<{visible: boolean, msg: string, type?: "success"|"error"}>({visible: false, msg: ""});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(data);
  }, []);

  const saveProducts = (prods: Product[]) => {
    setProducts(prods);
    localStorage.setItem("products", JSON.stringify(prods));
  };

  const handleEdit = (prod: Product) => {
    setEditing(prod);
    setForm(prod);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.image) {
      setToast({visible: true, msg: "Vui lòng nhập đủ thông tin!", type: "error"});
      return;
    }
    if (products.some((p) => p.name === form.name && (!editing || editing.id !== p.id))) {
      setToast({visible: true, msg: "Tên sản phẩm đã có!", type: "error"});
      return;
    }
    let prods = [...products];
    if (editing) {
      prods = prods.map((p) => p.id === editing.id ? { ...editing, ...form } as Product : p);
      setToast({visible: true, msg: "Cập nhật thành công", type: "success"});
    } else {
      prods.push({ ...form, id: Date.now() } as Product);
      setToast({visible: true, msg: "Thêm thành công", type: "success"});
    }
    saveProducts(prods);
    setEditing(null);
    setForm({});
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Xóa sản phẩm này?")) {
      saveProducts(products.filter((p) => p.id !== id));
      setToast({visible: true, msg: "Đã xóa!", type: "success"});
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-4">Quản lý sản phẩm</h2>
      <div className="mb-4">
        <input
          value={form.name || ""}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Tên sản phẩm"
          className="border p-1 mr-2 rounded"
        />
        <input
          value={form.price || ""}
          onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
          type="number"
          placeholder="Giá"
          className="border p-1 mr-2 rounded w-20"
        />
        <input
          value={form.image || ""}
          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
          placeholder="Ảnh (URL)"
          className="border p-1 mr-2 rounded"
        />
        <input
          value={form.description || ""}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Mô tả"
          className="border p-1 mr-2 rounded"
        />
        <button className="bg-black text-white px-3 py-1 rounded" onClick={handleSave}>
          {editing ? "Lưu" : "Thêm"}
        </button>
        {editing && (
          <button className="ml-2 text-gray-400" onClick={() => { setEditing(null); setForm({}); }}>
            Hủy
          </button>
        )}
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th>Ảnh</th>
            <th>Mô tả</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()}đ</td>
              <td><img src={p.image} alt={p.name} className="h-12" /></td>
              <td>{p.description}</td>
              <td>
                <button className="text-blue-500 underline mr-2" onClick={() => handleEdit(p)}>Sửa</button>
                <button className="text-red-500 underline" onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toast visible={toast.visible} message={toast.msg} type={toast.type} onClose={() => setToast(t => ({...t, visible: false}))} />
    </div>
  );
};
export default ProductManager;