
export const flowTokens = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    canvas: '#FFFFFF',
    border: '#E5E5E5',
    muted: '#666666',
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
      60: '#666666',
    }
  },
  space: {
    0: '0px',
    0.5: '5px',
    1: '10px',
    2: '20px',
    3: '30px',
    4: '40px',
    6: '60px',
    8: '80px',
    12: '120px',
  },
  radii: {
    none: '0px',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },
  fonts: {
    sans: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
    mono: "Menlo, Monaco, monospace",
  },
  type: {
    display: {
      fontSize: '80px',
      lineHeight: '1',
      letterSpacing: '-0.03em',
      fontFamily: "'Playfair Display', serif",
    },
    h1: {
      fontSize: '48px',
      lineHeight: '1.1',
      fontWeight: '500',
    },
    h2: {
      fontSize: '32px',
      lineHeight: '1.2',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    // Added missing caption token to resolve property access error in Text.tsx
    caption: {
      fontSize: '12px',
      lineHeight: '1.4',
    }
  },
  shadows: {
    none: 'none',
    soft: '0 2px 10px rgba(0,0,0,0.05)',
    hard: '0 10px 40px rgba(0,0,0,0.1)',
  }
};
