/**
 * Shared SVG filters and petal shapes for the ink-and-watercolor art.
 * Rendered once in the root layout; every flower, leaf and wrap refers to these ids.
 */
export function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {/* Watercolor wash: wobbly edge, soft blur, opaque body with darker pigment speckles. */}
        <filter id="sc-wc" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves={3} seed={8} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={13} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={1.3} result="b" />
          <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves={2} seed={3} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.3 1.2" result="ga" />
          <feComposite in="b" in2="ga" operator="in" result="w" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.32" result="dk" />
          <feComposite in="dk" in2="w" operator="in" result="dk2" />
          <feComposite in="dk2" in2="w" operator="over" />
        </filter>
        {/* Hand-drawn ink line wobble. */}
        <filter id="sc-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency=".6" numOctaves={1} seed={5} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Stronger wobble for frilly carnation edges. */}
        <filter id="sc-frill" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="turbulence" baseFrequency=".45" numOctaves={1} seed={9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Paper grain for wraps. */}
        <filter id="sc-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={3} seed={4} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 .22  0 0 0 0 .13  0 0 0 0 .06  0 0 0 .5 -.12" result="t" />
          <feComposite in="t" in2="SourceAlpha" operator="in" />
        </filter>

        <path id="sc-scal" d="M38 0Q44.7 14.5 30.7 22.3Q27.6 38 11.7 36.1Q0 47-11.7 36.1Q-27.6 38-30.7 22.3Q-44.7 14.5-38 0Q-44.7-14.5-30.7-22.3Q-27.6-38-11.7-36.1Q0-47 11.7-36.1Q27.6-38 30.7-22.3Q44.7-14.5 38 0Z" />
        <path id="sc-zp" d="M-7-8C-9-20-9-34 0-37C9-34 9-20 7-8" />
        <path id="sc-dp" d="M-6-8C-8-22-4-34 0-40C4-34 8-22 6-8" />
        <path id="sc-gp" d="M-3.5-12C-4.5-26-3-38 0-40C3-38 4.5-26 3.5-12" />
        <path id="sc-yp" d="M-4-10C-5-22-3-34 0-36C3-34 5-22 4-10" />
        <path id="sc-sp" d="M-6-20C-7-30-3-40 0-46C3-40 7-30 6-20" />
        <path id="sc-cp" d="M-12-7C-16-22-14-36-8-41L-4-36L0-42L4-36L8-41C14-36 16-22 12-7" />
        <path id="sc-ap" d="M-15-8C-26-22-18-42 0-42C18-42 26-22 15-8" />
        <path id="sc-rib" d="M0-12V-34" />
        <path id="sc-lp" d="M0-5C-12-15-12-32 0-46C12-32 12-15 0-5Z" />
        <path id="sc-lrib" d="M0-8V-38" />
        <path id="sc-lst" d="M0 0L0-20M-3-21a3 1.6 0 1 0 6 0a3 1.6 0 1 0-6 0" />
        <path id="sc-slp" d="M-2-5C-6-16-6-28 0-34C4-37 7-33 3-30C4-22 4-13 2-5" />
        <path id="sc-sst" d="M0-4C4-20 14-32 11-45M9.4-45a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0" />
        <path id="sc-hf" d="M0 0C-4-3-4-9 0-10C4-9 4-3 0 0C3-4 9-4 10 0C9 4 3 4 0 0C4 3 4 9 0 10C-4 9-4 3 0 0C-3 4-9 4-10 0C-9-4-3-4 0 0Z" />

        <pattern id="sc-liner" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#F1C9CF" />
          <circle cx="6" cy="6" r="1.5" fill="#C25B72" />
        </pattern>
        <pattern id="sc-linen" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0H6M0 3H6M0 0V6M3 0V6" stroke="#000" strokeOpacity=".07" strokeWidth=".8" />
        </pattern>
        <pattern id="sc-news" width="60" height="14" patternUnits="userSpaceOnUse">
          <path d="M2 4H26M30 4H58M2 9H20M24 9H44M48 9H58" stroke="#2A1A1E" strokeOpacity=".28" strokeWidth="1.4" strokeLinecap="round" />
        </pattern>
        <linearGradient id="sc-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".25" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
      </defs>
    </svg>
  );
}
