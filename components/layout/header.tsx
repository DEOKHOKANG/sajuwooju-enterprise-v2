"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl font-bold text-primary">
              사주우주
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/compatibility"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              사주궁합
            </Link>
            <Link
              href="/manselyeok"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              만세력
            </Link>
            <Link
              href="/consult"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              상담
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              소개
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            로그인
          </Button>
          <Button size="sm">
            시작하기
          </Button>
        </div>
      </div>
    </header>
  );
}
