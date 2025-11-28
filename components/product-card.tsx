'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  views: string;
  discount: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="bg-muted-100 overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-xl"
        style={{
          borderRadius: '16px',
          willChange: 'transform, box-shadow',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Product Image */}
        <div
          className="w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-pink-100 to-pink-200 flex-shrink-0 relative overflow-hidden"
          style={{ borderRadius: '12px' }}
        >
          <Image
            src={product.image}
            alt={product.title}
            width={80}
            height={96}
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 64px, 80px"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-primary mb-1 text-sm sm:text-base truncate">
            {product.title}
          </div>
          <div className="text-xs sm:text-sm text-primary mb-2 truncate">
            {product.subtitle}
          </div>

          {/* Stats */}
          <div className="flex gap-2 text-xs sm:text-sm mb-2">
            <span className="text-yellow-500 flex items-center gap-0.5">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500" />
              {product.rating}
            </span>
            <span className="text-slate-400 flex items-center gap-0.5">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              {product.views}
            </span>
          </div>

          {/* Discount Badge */}
          <div
            className="inline-block px-2 sm:px-3 py-1 bg-secondary/10 text-secondary text-[10px] sm:text-xs font-medium"
            style={{ borderRadius: '9999px' }}
          >
            {product.discount}% 할인중
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
