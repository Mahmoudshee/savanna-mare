'use client'

interface LogoProps {
  /** Height in px — width scales proportionally */
  height?: number
  /** Override for the text colours (for use on light backgrounds) */
  variant?: 'light' | 'dark'
  className?: string
  style?: React.CSSProperties
}

/**
 * Savanna & Mare Adventures — inline SVG logo.
 * Transparent background → works on any header colour.
 * Scales via height prop; width is auto (3.6:1 aspect ratio).
 */
export default function Logo({ height = 44, variant = 'light', className, style }: LogoProps) {
  const wordmark  = variant === 'dark' ? '#0f2219' : '#f5f0e8'
  const tagline   = variant === 'dark' ? '#3d7a55' : '#6a9e7f'
  const treeGold  = '#c8923a'
  const treeDark  = '#a07028'
  const sunOrange = '#dc7855'
  const sunDark   = '#b85c38'
  const groundLine = variant === 'dark' ? '#a07028' : '#c8923a'

  // Keep 3.6:1 ratio
  const width = Math.round(height * 3.6)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 80"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="Savanna & Mare Adventures"
      role="img"
    >
      {/* ── Acacia tree icon ── */}
      <g transform="translate(4, 6)">
        {/* Sun / horizon arc */}
        <path
          d="M8 56 A28 28 0 0 1 64 56"
          fill={sunOrange}
          opacity="0.9"
        />
        <path
          d="M12 56 A24 24 0 0 1 60 56"
          fill={sunDark}
          opacity="0.5"
        />

        {/* Trunk */}
        <rect x="33" y="38" width="5" height="20" rx="2" fill={treeDark} />

        {/* Canopy — layered umbrella shape */}
        <ellipse cx="36" cy="26" rx="22" ry="13" fill={treeGold} />
        <ellipse cx="20" cy="34" rx="11" ry="8"  fill={treeGold} />
        <ellipse cx="52" cy="34" rx="11" ry="8"  fill={treeGold} />
        {/* inner depth */}
        <ellipse cx="36" cy="29" rx="15" ry="9"  fill={treeDark} opacity="0.3" />

        {/* Ground line */}
        <line x1="6" y1="58" x2="66" y2="58" stroke={groundLine} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── SAVANNA wordmark ── */}
      <text
        x="82" y="38"
        fontFamily="Georgia, 'Playfair Display', 'Times New Roman', serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="3"
        fill={wordmark}
        textAnchor="start"
      >
        SAVANNA
      </text>

      {/* thin rule */}
      <line x1="82" y1="45" x2="286" y2="45" stroke={tagline} strokeWidth="0.8" opacity="0.6" />

      {/* ── & MARE ADVENTURES tagline ── */}
      <text
        x="82" y="62"
        fontFamily="'DM Sans', Arial, sans-serif"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="4.5"
        fill={tagline}
        textAnchor="start"
      >
        &amp; MARE ADVENTURES
      </text>
    </svg>
  )
}

