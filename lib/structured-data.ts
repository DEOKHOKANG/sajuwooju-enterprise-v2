/**
 * Structured Data (JSON-LD) 생성 유틸리티
 * Google Rich Results를 위한 Schema.org 마크업
 */

import type { Product } from '@/components/product-card';

interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image?: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: 'KRW';
    availability: 'https://schema.org/InStock';
    url: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

interface BreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface WebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

/**
 * Organization Schema 생성
 */
export function generateOrganizationSchema(baseUrl: string): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '사주우주',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'AI 기반 사주 궁합 및 운세 서비스',
    sameAs: [
      // 소셜 미디어 링크 (필요시 추가)
    ],
  };
}

/**
 * WebSite Schema 생성
 */
export function generateWebSiteSchema(baseUrl: string): WebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '사주우주',
    url: baseUrl,
    description: 'AI 기반 사주 궁합 및 운세 서비스 - 연애운, 재물운, 건강운 등 12가지 운세 분석',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Product Schema 생성
 */
export function generateProductSchema(
  product: Product,
  baseUrl: string,
  price: string = '5400'
): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/products/${product.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.views,
    },
  };
}

/**
 * Breadcrumb Schema 생성
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
  baseUrl: string
): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * JSON-LD 스크립트 태그 생성
 */
export function generateJsonLd(schema: Record<string, any>): string {
  return JSON.stringify(schema);
}
