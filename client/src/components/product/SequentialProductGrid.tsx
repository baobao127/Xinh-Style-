import { memo } from 'react';
import { Product } from '@shared/schema';
import { useSequentialReveal } from '@/hooks/useSequentialReveal';
import LazyProductCard from './LazyProductCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

interface SequentialProductGridProps {
  products: Product[];
  className?: string;
  columns?: number;
  gap?: number;
  initialCount?: number;
  itemsPerBatch?: number;
  title?: string;
  showLoadMore?: boolean;
  cardWidth?: string;
  cardHeight?: string;
}

/**
 * Grid hiển thị sản phẩm theo cách tuần tự với hiệu ứng
 * để tối ưu hóa hiệu suất và trải nghiệm người dùng
 */
function SequentialProductGrid({
  products,
  className,
  columns = 2,
  gap = 4,
  initialCount = 4,
  itemsPerBatch = 2,
  title,
  showLoadMore = true,
  cardWidth = '100%',
  cardHeight = 'auto',
}: SequentialProductGridProps) {
  // Sử dụng hook hiển thị tuần tự
  const {
    visibleItems,
    isLoading,
    isComplete,
    loadMore,
    containerRef,
  } = useSequentialReveal(products, {
    initialCount,
    batchSize: itemsPerBatch,
    intervalDelay: 150,
    initialDelay: 100,
    triggerOnVisible: true,
  });

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
  };

  return (
    <div className={cn('my-6', className)}>
      {title && (
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      )}
      
      <div ref={containerRef}>
        <motion.div
          className={`grid grid-cols-${columns} gap-${gap}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {visibleItems.map((product, index) => (
              <motion.div
                key={product.id}
                className="product-grid-item"
                variants={itemVariants}
                layout
              >
                <LazyProductCard
                  product={product}
                  width={cardWidth}
                  height={cardHeight}
                  className={cn(
                    'transition-all duration-300 ease-in-out',
                    index >= visibleItems.length - itemsPerBatch ? 'animate-fade-in-up' : ''
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {isLoading && showLoadMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => loadMore(itemsPerBatch * 2)}
              variant="outline" 
              className="px-8"
              size="lg"
            >
              <ChevronDownIcon className="mr-2 h-4 w-4" />
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SequentialProductGrid);