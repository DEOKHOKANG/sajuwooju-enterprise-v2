'use client';

export function Footer() {
  return (
    <footer className="bg-muted-100 border-t border-border mt-12 sm:mt-16 md:mt-20">
      <div className="mx-auto w-full max-w-[600px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {/* Company Name */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-display text-lg sm:text-xl font-bold text-primary mb-2">
            사주우주 (SajuWooju)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            우주의 법칙으로 읽는 나의 운명
          </p>
        </div>

        {/* Company Info */}
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium text-primary">상호명:</span>
            <span>사주우주 (SajuWooju)</span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium text-primary">대표:</span>
            <span>강덕호</span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium text-primary">주소:</span>
            <span>서울특별시 광진구 능동로 120</span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium text-primary">이메일:</span>
            <span>contact@sajuwooju.com</span>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <span className="font-medium text-primary">고객지원:</span>
            <span>카카오톡 채널 (사주우주)</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            이용약관
          </a>
          <span className="text-slate-300">|</span>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">
            개인정보처리방침
          </a>
          <span className="text-slate-300">|</span>
          <a href="#" className="text-slate-400 hover:text-primary transition-colors">
            환불정책
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
          <a
            href="#"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-muted flex items-center justify-center hover:bg-slate-200 transition-colors"
            style={{ borderRadius: '50%' }}
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="#"
            className="w-8 h-8 sm:w-10 sm:h-10 bg-muted flex items-center justify-center hover:bg-slate-200 transition-colors"
            style={{ borderRadius: '50%' }}
            aria-label="KakaoTalk"
          >
            <span className="text-sm sm:text-base">💬</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs sm:text-sm text-slate-400 pt-6 sm:pt-8 border-t border-border">
          <p>© 2025 사주우주. All rights reserved.</p>
          <p className="mt-1 sm:mt-2">사업자등록번호: 123-45-67890</p>
        </div>
      </div>
    </footer>
  );
}
