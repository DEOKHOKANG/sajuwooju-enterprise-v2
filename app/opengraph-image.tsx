import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '사주우주 - AI가 해석하는 당신의 운명';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            opacity: 0.1,
          }}
        >
          {/* Stars pattern */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random(),
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              fontSize: '64px',
            }}
          >
            🔮
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            사주우주
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '30px',
              fontWeight: '500',
            }}
          >
            AI가 해석하는 당신의 운명
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '28px' }}>⭐</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
                정확한 사주 분석
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '28px' }}>💫</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
                AI 맞춤 해석
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '12px 24px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '28px' }}>🌟</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
                무료 시작
              </span>
            </div>
          </div>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '16px 32px',
            borderRadius: '30px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <span style={{ fontSize: '28px' }}>🎯</span>
          <span
            style={{
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            50,000+ 사용자의 선택
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
