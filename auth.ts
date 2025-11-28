/**
 * NextAuth.js v5 Configuration
 * 사주우주 인증 시스템
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Authentication successful
      return true;
    },

    async session({ session, user }) {
      // Add user id and role to session
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "user";
        session.user.isActive = (user as any).isActive ?? true;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      // Add user data to JWT token
      if (user && user.id) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.isActive = (user as any).isActive ?? true;
      }
      return token;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email}, isNewUser: ${isNewUser}`);

      // Track sign in event (optional: integrate with analytics)
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
      }
    },

    async signOut() {
      console.log('User signed out');
    },
  },

  debug: process.env.NODE_ENV === "development",
});
