import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 */}
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold text-primary">
              사주우주
            </h3>
            <p className="text-sm text-muted-foreground">
              AI 기반의 정확한 사주 궁합 분석 서비스
            </p>
          </div>

          {/* 서비스 */}
          <div className="space-y-3">
            <h4 className="font-semibold">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/compatibility"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  사주궁합
                </Link>
              </li>
              <li>
                <Link
                  href="/manselyeok"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  만세력
                </Link>
              </li>
              <li>
                <Link
                  href="/consult"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  상담
                </Link>
              </li>
            </ul>
          </div>

          {/* 정보 */}
          <div className="space-y-3">
            <h4 className="font-semibold">정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  회사 소개
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div className="space-y-3">
            <h4 className="font-semibold">법적 고지</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 사주우주. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
