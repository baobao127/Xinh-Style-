import Banner from "@/components/home/Banner";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutUs from "@/components/home/AboutUs";
import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded p-2 shadow">
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-blue-600 font-semibold">{product.price.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Section: Banner */}
      <section id="banner">
        <Banner />
      </section>
      
      {/* Section: Categories */}
      <section id="categories" className="px-4">
        <CategoryShortcuts />
      </section>

      {/* Section: Featured Products */}
      <section id="featured-products" className="px-4">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
        <FeaturedProducts />
      </section>

      {/* Section: About Us */}
      <section id="about-us" className="bg-gray-100 px-4 py-8">
        <AboutUs />
      </section>
    </div>
  );
}
