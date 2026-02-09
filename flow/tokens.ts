export const flowTokens = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    canvas: '#FFFFFF',
    border: '#E5E5E5',
    muted: '#707070',
    brand: '#000000',
    blue: {
      10: '#F0F7FF',
      100: '#1023D7', // Artsy Signature Blue
    },
    red: {
      100: '#C82828',
    },
    gray: {
      5: '#F8F8F8',
      10: '#F3F3F3',
      30: '#C2C2C2',
      60: '#707070',
    }
  },
  space: {
    0: '0px',
    0.5: '4px',
    1: '8px',
    2: '16px',
    3: '24px',
    4: '32px',
    6: '48px',
    8: '64px',
    12: '96px',
  },
  radii: {
    none: '0px',
    sm: '0px', // Sharp edges for Artsy feel
    md: '0px',
    lg: '0px',
    full: '9999px',
  },
  fonts: {
    sans: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
    mono: "Menlo, Monaco, monospace",
  },
  type: {
    display: {
      fontSize: '72px',
      lineHeight: '1.0',
      letterSpacing: '-0.03em',
      fontFamily: "'Playfair Display', serif",
    },
    h1: {
      fontSize: '48px',
      lineHeight: '1.1',
      fontWeight: '400',
      fontFamily: "'Playfair Display', serif",
    },
    h2: {
      fontSize: '32px',
      lineHeight: '1.2',
      fontFamily: "'Playfair Display', serif",
    },
    body: {
      fontSize: '15px',
      lineHeight: '1.6',
      fontFamily: "'Inter', sans-serif",
    },
    label: {
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontFamily: "'Inter', sans-serif",
    },
    caption: {
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#707070',
      fontFamily: "'Inter', sans-serif",
    }
  },
  shadows: {
    none: 'none',
    soft: 'none', 
    hard: 'none',
  }
};