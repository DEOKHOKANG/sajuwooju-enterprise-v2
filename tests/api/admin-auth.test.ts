/**
 * @jest-environment node
 */

import { POST } from '@/app/api/admin/auth/route';
import { NextRequest } from 'next/server';

describe('Admin Authentication API', () => {
  describe('POST /api/admin/auth', () => {
    it('올바른 인증 정보로 로그인 성공', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123!',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.token).toBeDefined();
      expect(typeof data.token).toBe('string');
      expect(data.admin).toBeDefined();
      expect(data.admin.username).toBe('admin');
    });

    it('잘못된 사용자명으로 로그인 실패', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'wronguser',
          password: 'admin123!',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
      expect(data.error).toMatch(/인증.*실패|Invalid/i);
    });

    it('잘못된 비밀번호로 로그인 실패', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'wrongpassword',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('빈 사용자명으로 로그인 실패', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: '',
          password: 'admin123!',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('빈 비밀번호로 로그인 실패', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: '',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('잘못된 JSON 형식으로 요청 시 에러 반환', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('JWT 토큰이 유효한 형식인지 확인', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123!',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.token).toBeDefined();

      // JWT 형식 검증 (3개 파트로 구성)
      const tokenParts = data.token.split('.');
      expect(tokenParts.length).toBe(3);
    });

    it('응답에 민감한 정보가 포함되지 않음', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123!',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.admin.password).toBeUndefined();
      expect(data.admin.id).toBeDefined();
    });
  });
});
