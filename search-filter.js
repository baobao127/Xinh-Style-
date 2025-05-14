const products = [
  { id: 1, name: "Áo sơ mi", category: "ao", price: 200000 },
  { id: 2, name: "Váy công sở", category: "vay", price: 500000 },
];

function filterProducts() {
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const categoryFilter = document.getElementById("category-filter").value;
  const priceFilter = document.getElementById("price-filter").value;

  const filtered = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchInput) &&
      (categoryFilter === "" || product.category === categoryFilter) &&
      product.price <= priceFilter
    );
  });

  renderProducts(filtered);
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products.map(product => `
    <div>${product.name} - ${product.price}đ</div>
  `).join("");
}

document.getElementById("search-input").addEventListener("input", filterProducts);
document.getElementById("category-filter").addEventListener("change", filterProducts);
document.getElementById("price-filter").addEventListener("input", filterProducts);

filterProducts();