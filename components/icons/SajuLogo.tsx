/**
 * SAJU Logo Icon Component
 * SajuWooju brand logo for navigation and headers
 */

interface SajuLogoProps {
  className?: string;
  size?: number;
  variant?: 'filled' | 'outline';
}

// Filled version for header
export function SajuLogo({ className = "w-6 h-6", size = 24, variant = 'filled' }: SajuLogoProps) {
  if (variant === 'outline') {
    // Outline version for bottom navigation (matches other nav icons)
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="12" cy="12" r="10" />

        {/* Inner cosmic symbol - 8 trigram style */}
        <circle cx="12" cy="12" r="3" fill="currentColor" />

        {/* Four cardinal points */}
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />

        {/* Four diagonal points (shorter) */}
        <line x1="5.5" y1="5.5" x2="7.5" y2="7.5" />
        <line x1="18.5" y1="5.5" x2="16.5" y2="7.5" />
        <line x1="5.5" y1="18.5" x2="7.5" y2="16.5" />
        <line x1="18.5" y1="18.5" x2="16.5" y2="16.5" />
      </svg>
    );
  }

  // Filled version for header
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cosmic circle background */}
      <circle cx="12" cy="12" r="10" fill="url(#sajuGradient)" opacity="0.2" />

      {/* SAJU text stylized */}
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="sans-serif"
        letterSpacing="0.5"
      >
        SAJU
      </text>

      {/* Star accents */}
      <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="18" cy="6" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="4" r="0.8" fill="currentColor" opacity="0.8" />

      <defs>
        <linearGradient id="sajuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
