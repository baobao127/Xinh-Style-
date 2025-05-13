import { Link } from 'wouter';

interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

const categories: CategoryItem[] = [
  {
    name: "Áo",
    slug: "ao",
    icon: "fa-tshirt",
    bgColor: "bg-primary/10",
    textColor: "text-primary"
  },
  {
    name: "Váy",
    slug: "vay",
    icon: "fa-female",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary"
  },
  {
    name: "Quần",
    slug: "quan",
    icon: "fa-socks",
    bgColor: "bg-accent/10",
    textColor: "text-accent"
  },
  {
    name: "Phụ kiện",
    slug: "phu-kien",
    icon: "fa-gem",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500"
  }
];

const CategoryShortcuts = () => {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {categories.map((category) => (
          <Link 
            key={category.slug}
            href={`/products/${category.slug}`} 
            className="flex flex-col items-center"
          >
            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full ${category.bgColor} flex items-center justify-center mb-2`}>
              <i className={`fas ${category.icon} ${category.textColor} text-xl md:text-2xl`}></i>
            </div>
            <span className="text-xs md:text-sm text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryShortcuts;
