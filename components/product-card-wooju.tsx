'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye } from 'lucide-react';
import { PLANETS_DATA } from '@/lib/planets-data';

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  rating: number;
  views: string;
  discount: number;
  image: string;
  element?: string; // 音양五行 (木火土金水)
}

interface ProductCardWoojuProps {
  product: Product;
}

// Map elements to planets
const getElementPlanet = (element?: string) => {
  if (!element) return PLANETS_DATA[0]; // Default to Mercury

  const elementMap: Record<string, string> = {
    '水': '수성', // Water
    '金': '금성', // Metal
    '土': '지구', // Earth
    '火': '화성', // Fire
    '木': '목성', // Wood
  };

  const planetName = elementMap[element];
  return PLANETS_DATA.find(p => p.name === planetName) || PLANETS_DATA[0];
};

export function ProductCardWooju({ product }: ProductCardWoojuProps) {
  const planet = getElementPlanet(product.element);

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] hover:-translate-y-1 rounded-2xl bg-white border border-gray-200 hover:border-violet-200 shadow-sm hover:shadow-xl"
      >
        {/* Subtle gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${planet.color}08, transparent 70%)`,
          }}
        />

        <div className="relative flex gap-3 sm:gap-4 p-4 sm:p-5">
          {/* Product Image */}
          <div
            className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${planet.color}15, ${planet.color}08)`,
            }}
          >
            <Image
              src={product.image}
              alt={product.title}
              width={96}
              height={112}
              className="object-cover w-full h-full"
              sizes="(max-width: 640px) 80px, 96px"
            />

            {/* Element Badge on Image */}
            {product.element && (
              <div
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                style={{ background: planet.color }}
              >
                {product.element}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base line-clamp-2 leading-snug">
                {product.title}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-1">
                {product.subtitle}
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3 text-xs sm:text-sm">
                <span className="text-amber-500 flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-500" />
                  <span className="font-medium text-gray-700">{product.rating}</span>
                </span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{product.views}</span>
                </span>
              </div>

              {/* Discount Badge */}
              <div
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm"
              >
                {product.discount}% OFF
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
