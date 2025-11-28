import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PLANETS_DATA } from '@/lib/planets-data';

/**
 * GET /api/planets
 *
 * Returns all published planets from PostgreSQL via Prisma
 * Fallback: Uses hardcoded data if database is unavailable
 */
export async function GET() {
  try {
    // Fetch from PostgreSQL database
    const planets = await prisma.planet.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' }
    });

    // If database has no data, use hardcoded fallback
    if (planets.length === 0) {
      console.warn('No planets in database, using hardcoded fallback');
      const fallbackPlanets = PLANETS_DATA.map((planet) => ({
        id: planet.englishName || planet.name,
        slug: planet.englishName || planet.name.toLowerCase(),
        koreanName: planet.name,
        englishName: planet.englishName || planet.name,
        emoji: getEmojiForPlanet(planet.englishName || planet.name),
        element: planet.element,
        yinYang: getYinYangForElement(planet.element),
        color: planet.color,
        gradient: getGradientForPlanet(planet.englishName || planet.name),
        orbitRadius: planet.orbitRadius,
        radius: planet.radius,
        rotationSpeed: planet.rotationSpeed,
        hasAtmosphere: planet.hasAtmosphere || false,
        hasRings: planet.englishName === 'saturn',
        textureUrl: null,
        normalMapUrl: null,
        cloudMapUrl: null,
        description: planet.description,
        mythology: `${planet.name}의 신화와 유래`,
        sajuMeaning: planet.description,
        fortuneKeywords: [planet.element, planet.zodiacPalace || 'unknown'],
        publishedAt: new Date().toISOString(),
        isPublished: true,
        order: PLANETS_DATA.indexOf(planet),
      }));

      return NextResponse.json(fallbackPlanets, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    return NextResponse.json(planets, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching planets from database:', error);

    // Fallback to hardcoded data on database error
    const fallbackPlanets = PLANETS_DATA.map((planet) => ({
      id: planet.englishName || planet.name,
      slug: planet.englishName || planet.name.toLowerCase(),
      koreanName: planet.name,
      englishName: planet.englishName || planet.name,
      emoji: getEmojiForPlanet(planet.englishName || planet.name),
      element: planet.element,
      yinYang: getYinYangForElement(planet.element),
      color: planet.color,
      gradient: getGradientForPlanet(planet.englishName || planet.name),
      orbitRadius: planet.orbitRadius,
      radius: planet.radius,
      rotationSpeed: planet.rotationSpeed,
      hasAtmosphere: planet.hasAtmosphere || false,
      hasRings: planet.englishName === 'saturn',
      textureUrl: null,
      normalMapUrl: null,
      cloudMapUrl: null,
      description: planet.description,
      mythology: `${planet.name}의 신화와 유래`,
      sajuMeaning: planet.description,
      fortuneKeywords: [planet.element, planet.zodiacPalace || 'unknown'],
      publishedAt: new Date().toISOString(),
      isPublished: true,
      order: PLANETS_DATA.indexOf(planet),
    }));

    return NextResponse.json(fallbackPlanets, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  }
}

/**
 * Helper functions
 */
function getEmojiForPlanet(name: string): string {
  const emojiMap: Record<string, string> = {
    sun: '☀️',
    mercury: '☿',
    venus: '♀',
    earth: '⊕',
    mars: '♂',
    jupiter: '♃',
    saturn: '♄',
    uranus: '♅',
    neptune: '♆',
    pluto: '♇',
  };
  return emojiMap[name.toLowerCase()] || '🪐';
}

function getYinYangForElement(element: string): string {
  const yinYangMap: Record<string, string> = {
    '水': '음',
    '金': '양',
    '木': '양',
    '火': '양',
    '土': '음',
  };
  return yinYangMap[element] || '양';
}

function getGradientForPlanet(name: string): string {
  const gradientMap: Record<string, string> = {
    sun: 'from-yellow-300 via-orange-400 to-red-500',
    mercury: 'from-gray-300 via-gray-400 to-gray-500',
    venus: 'from-yellow-200 via-orange-300 to-pink-400',
    earth: 'from-blue-400 via-green-500 to-blue-600',
    mars: 'from-red-400 via-orange-500 to-red-600',
    jupiter: 'from-orange-300 via-amber-400 to-orange-500',
    saturn: 'from-yellow-200 via-amber-300 to-yellow-400',
    uranus: 'from-cyan-300 via-blue-400 to-cyan-500',
    neptune: 'from-blue-500 via-indigo-600 to-blue-700',
    pluto: 'from-gray-400 via-gray-500 to-gray-600',
  };
  return gradientMap[name.toLowerCase()] || 'from-purple-400 via-pink-500 to-purple-600';
}
