import { Link } from 'wouter';
import { Collection } from '@shared/schema';

interface CollectionCardProps {
  collection: Collection;
  size?: 'small' | 'large';
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, size = 'large' }) => {
  return (
    <Link 
      href={`/products/${collection.slug}`} 
      className="relative rounded-lg overflow-hidden block"
    >
      <img 
        src={collection.image} 
        alt={collection.name} 
        className={`w-full ${size === 'large' ? 'aspect-square md:aspect-[3/4]' : 'aspect-square'} object-cover`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 md:p-4">
        <h3 className={`text-white font-heading font-medium ${size === 'large' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
          {collection.name}
        </h3>
        <p className={`text-white/80 ${size === 'large' ? 'text-xs md:text-sm' : 'text-xs hidden md:block'}`}>
          {collection.description}
        </p>
      </div>
    </Link>
  );
};

export default CollectionCard;
