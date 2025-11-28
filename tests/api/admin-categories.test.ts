/**
 * @jest-environment node
 */

import { GET, POST } from '@/app/api/admin/categories/route';
import { NextRequest } from 'next/server';
import { SignJWT } from 'jose';

// Helper function to generate JWT token
async function generateToken() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ id: 'admin-id', username: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
  return token;
}

describe('Admin Categories API', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await generateToken();
  });

  describe('GET /api/admin/categories', () => {
    it('인증 토큰 없이 요청 시 401 에러', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'GET',
        }
      );

      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('유효한 토큰으로 카테고리 목록 조회', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('페이지네이션 파라미터 적용', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories?page=1&limit=10',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(10);
    });

    it('검색 쿼리 파라미터 적용', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories?search=연애',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it('정렬 파라미터 적용', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories?sortBy=name&sortOrder=asc',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });
  });

  describe('POST /api/admin/categories', () => {
    it('인증 토큰 없이 요청 시 401 에러', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify({
            name: '테스트 카테고리',
            slug: 'test-category',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('유효한 데이터로 카테고리 생성', async () => {
      const categoryData = {
        name: `테스트카테고리_${Date.now()}`,
        slug: `test-category-${Date.now()}`,
        description: '테스트 설명',
        icon: '🧪',
        color: '#FF5733',
        gradient: 'from-red-500 to-orange-500',
        order: 100,
        isActive: true,
      };

      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify(categoryData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.name).toBe(categoryData.name);
      expect(data.data.slug).toBe(categoryData.slug);
    });

    it('필수 필드 없이 생성 시 400 에러', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify({
            name: '테스트',
            // slug 누락
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('중복된 slug로 생성 시 에러', async () => {
      const slug = `duplicate-slug-${Date.now()}`;

      // 첫 번째 카테고리 생성
      const request1 = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify({
            name: '첫 번째',
            slug: slug,
            description: '첫 번째 카테고리',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      await POST(request1);

      // 중복 slug로 두 번째 카테고리 생성 시도
      const request2 = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify({
            name: '두 번째',
            slug: slug,
            description: '두 번째 카테고리',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response2 = await POST(request2);
      const data2 = await response2.json();

      expect(response2.status).toBe(400);
      expect(data2.success).toBe(false);
      expect(data2.error).toMatch(/중복|duplicate|already exists/i);
    });

    it('잘못된 JSON 형식으로 요청 시 400 에러', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: 'invalid json',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('선택적 필드 없이도 생성 가능', async () => {
      const categoryData = {
        name: `최소카테고리_${Date.now()}`,
        slug: `minimal-category-${Date.now()}`,
        description: '최소 필드만 포함',
      };

      const request = new NextRequest(
        'http://localhost:3000/api/admin/categories',
        {
          method: 'POST',
          body: JSON.stringify(categoryData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(categoryData.name);
    });
  });
});
