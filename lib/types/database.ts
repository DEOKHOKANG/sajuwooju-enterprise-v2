/**
 * Database Types for Vercel Postgres + Prisma
 * Phase 8: Database and API Implementation
 */

// User Types
export interface User {
  id: string;
  kakaoId?: string; // Optional for Phase 11
  name: string;
  email?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  kakaoId?: string;
  name: string;
  email?: string;
  profileImage?: string;
}

// Consultation Types
export interface Consultation {
  id: string;
  userId?: string; // Optional - anonymous consultations allowed
  sessionId: string; // UUID for sharing/accessing results
  productId?: string; // Which product/service was used

  // Input data
  name: string;
  birthDate: Date;
  birthTime: number; // 0-23
  gender: 'male' | 'female';
  isLunar: boolean;

  // Calculated saju data (stored as JSON)
  sajuData: string; // JSON stringified SajuResult

  // Metadata
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConsultationInput {
  userId?: string;
  sessionId: string;
  productId?: string;
  name: string;
  birthDate: Date;
  birthTime: number;
  gender: 'male' | 'female';
  isLunar: boolean;
}

export interface UpdateConsultationInput {
  sajuData?: string;
  status?: 'pending' | 'completed' | 'failed';
}

// Product Types (for Phase 8.3)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Favorite Types (for Phase 11)
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Query Parameters
export interface ConsultationQueryParams {
  userId?: string;
  sessionId?: string;
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'completed' | 'failed';
}
