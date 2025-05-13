import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import CollectionCard from '@/components/ui/collection-card';
import { Collection } from '@shared/schema';

const Collections = () => {
  const { data: collections, isLoading } = useQuery<Collection[]>({
    queryKey: ['/api/collections'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold">Bộ Sưu Tập</h2>
          <span className="text-primary text-sm font-medium">Xem tất cả</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden animate-pulse bg-gray-200 h-64"></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden animate-pulse bg-gray-200 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  const mainCollections = collections.slice(0, 2);
  const smallCollections = collections.slice(2, 5);

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold">Bộ Sưu Tập</h2>
        <Link href="/collections" className="text-primary text-sm font-medium">
          Xem tất cả
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {mainCollections.map((collection) => (
          <Link key={collection.id} href={`/products/${collection.slug}`} className="relative rounded-lg overflow-hidden">
            <img 
              src={collection.image} 
              alt={collection.name} 
              className="w-full aspect-square md:aspect-[3/4] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 md:p-4">
              <h3 className="text-white font-heading font-medium text-sm md:text-base">{collection.name}</h3>
              <p className="text-white/80 text-xs md:text-sm">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6 mt-3">
        {smallCollections.map((collection) => (
          <Link key={collection.id} href={`/products/${collection.slug}`} className="relative rounded-lg overflow-hidden">
            <img 
              src={collection.image} 
              alt={collection.name} 
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2 md:p-3">
              <h3 className="text-white font-heading font-medium text-xs md:text-sm">{collection.name}</h3>
              <p className="text-white/80 text-xs hidden md:block">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
