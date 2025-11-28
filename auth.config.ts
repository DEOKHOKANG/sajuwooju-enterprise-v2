/**
 * NextAuth.js v5 Configuration (Edge-compatible)
 * Middleware에서 사용할 수 있는 설정
 */

import type { NextAuthConfig } from "next-auth";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/saved", "/chat"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/auth/signin", "/auth/signup"];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/dashboard",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Check if route is protected
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Check if route is auth page
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Redirect to sign in if accessing protected route without auth
      if (isProtectedRoute && !isLoggedIn) {
        return false; // NextAuth will redirect to signIn page
      }

      // Redirect to dashboard if accessing auth page while logged in
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },

  providers: [], // Providers will be added in auth.ts
};
