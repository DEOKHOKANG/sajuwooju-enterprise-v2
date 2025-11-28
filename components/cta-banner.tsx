'use client';

export function CtaBanner() {
  return (
    <div className="py-6 sm:py-8 md:py-10">
      <div
        className="relative overflow-hidden bg-gradient-to-br from-secondary/90 to-secondary p-6 sm:p-8 md:p-10"
        style={{ borderRadius: '20px' }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center text-white">
          {/* Character/Mascot */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 flex items-center justify-center text-4xl sm:text-5xl" style={{ borderRadius: '50%' }}>
              😊
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            30일 인터뷰 모집
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 opacity-90 max-w-lg mx-auto px-4">
            사주우주와 함께하는 특별한 인터뷰 이벤트
            <br className="hidden sm:block" />
            지금 바로 신청하고 혜택을 받아보세요!
          </p>

          {/* CTA Button */}
          <button
            className="inline-block px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-white text-secondary font-bold text-sm sm:text-base md:text-lg hover:bg-white/90 transition-colors"
            style={{ borderRadius: '9999px' }}
          >
            지금 신청하기 →
          </button>

          {/* Small info text */}
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm opacity-75">
            5만 명에게 기쁨을 전달하는 특별 이벤트
          </div>
        </div>
      </div>
    </div>
  );
}
