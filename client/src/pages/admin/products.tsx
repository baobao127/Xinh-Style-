import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch products (mock data for now)
    const mockProducts: Product[] = [
      { id: 1, name: "Product A", price: 100, stock: 10 },
      { id: 2, name: "Product B", price: 200, stock: 5 },
    ];
    setProducts(mockProducts);
  }, []);

  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const saveProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
  };

  return (
    <div className="admin-products">
      <h1>Quản lý sản phẩm</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => setEditingProduct(product)}>Sửa</button>
                <button onClick={() => deleteProduct(product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div>
          <h2>Chỉnh sửa sản phẩm</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProduct(editingProduct);
            }}
          >
            <label>
              Tên sản phẩm:
              <input
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
              />
            </label>
            <label>
              Giá:
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: parseInt(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Tồn kho:
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: parseInt(e.target.value),
                  })
                }
              />
            </label>
            <button type="submit">Lưu</button>
          </form>
        </div>
      )}
    </div>
  );
}