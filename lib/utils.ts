import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the base URL for API calls in both development and production
 * Works in server components and client components
 */
export function getBaseUrl(): string {
  // In browser, use relative URLs
  if (typeof window !== 'undefined') {
    return '';
  }

  // In server-side rendering, use environment variable or Vercel URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to localhost for development
  return 'http://localhost:3000';
}
