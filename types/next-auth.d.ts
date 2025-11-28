/**
 * NextAuth.js Type Extensions
 * 사용자 정의 필드 타입 정의
 */

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession`
   */
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  /**
   * Returned by `useSession`, `auth`, `getSession` and included in `jwt` callback
   */
  interface User extends DefaultUser {
    role?: string;
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    isActive: boolean;
  }
}
