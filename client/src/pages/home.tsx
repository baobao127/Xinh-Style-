import Banner from "@/components/home/Banner";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutUs from "@/components/home/AboutUs";

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