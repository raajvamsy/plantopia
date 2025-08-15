import { PlantopiaTheme, PlantopiaColors, ThemeMode } from './types';

// Plantopia Light Theme Colors
const lightColors: PlantopiaColors = {
  // Plant-themed primary colors
  sage: '#87A96B',      // Sage green - main brand color
  mint: '#B8E6B8',      // Light mint green
  moss: '#5D7C47',      // Dark moss green
  fern: '#7BA05B',      // Fresh fern green
  leaf: '#9CB86F',      // Natural leaf green
  
  // Supporting colors
  earth: '#8B7355',     // Earth brown
  bark: '#6B5B47',      // Tree bark brown
  stone: '#A8A8A8',     // Stone grey
  sky: '#B8D4E3',       // Sky blue
  water: '#7DB8E8',     // Water blue
  
  // System colors (matching your current theme)
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.145 0 0)',
  primary: '#87A96B',   // Using sage as primary
  primaryForeground: 'oklch(0.985 0 0)',
  secondary: 'oklch(0.97 0 0)',
  secondaryForeground: 'oklch(0.205 0 0)',
  muted: 'oklch(0.97 0 0)',
  mutedForeground: 'oklch(0.556 0 0)',
  accent: '#B8E6B8',    // Using mint as accent
  accentForeground: 'oklch(0.205 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: '#87A96B',      // Using sage for focus ring
};

// Plantopia Dark Theme Colors
const darkColors: PlantopiaColors = {
  // Plant-themed primary colors (adjusted for dark mode)
  sage: '#9CB86F',      // Brighter sage for dark background
  mint: '#7BA05B',      // Darker mint for contrast
  moss: '#B8E6B8',      // Light moss for visibility
  fern: '#87A96B',      // Medium fern green
  leaf: '#A8C976',      // Bright leaf green
  
  // Supporting colors (adjusted for dark mode)
  earth: '#A67C52',     // Lighter earth tone
  bark: '#8B7355',      // Lighter bark
  stone: '#6B6B6B',     // Darker stone
  sky: '#4A6B7D',       // Dark sky blue
  water: '#5A9BC4',     // Darker water blue
  
  // System colors (dark theme)
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  cardForeground: 'oklch(0.985 0 0)',
  popover: 'oklch(0.205 0 0)',
  popoverForeground: 'oklch(0.985 0 0)',
  primary: '#9CB86F',   // Brighter sage for dark mode
  primaryForeground: 'oklch(0.145 0 0)',
  secondary: 'oklch(0.269 0 0)',
  secondaryForeground: 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  mutedForeground: 'oklch(0.708 0 0)',
  accent: '#7BA05B',    // Darker mint for dark mode accent
  accentForeground: 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  destructiveForeground: 'oklch(0.985 0 0)',
  border: 'oklch(1 0 0 / 10%)',
  input: 'oklch(1 0 0 / 15%)',
  ring: '#9CB86F',      // Bright sage for focus ring
};

// Common theme properties
const commonTheme = {
  spacing: {
    xs: '0.25rem',      // 4px
    sm: '0.5rem',       // 8px
    md: '1rem',         // 16px
    lg: '1.5rem',       // 24px
    xl: '2rem',         // 32px
    '2xl': '2.5rem',    // 40px
    '3xl': '3rem',      // 48px
    '4xl': '4rem',      // 64px
  },
  typography: {
    fontSans: 'var(--font-geist-sans)',
    fontMono: 'var(--font-geist-mono)',
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  radius: {
    none: '0',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const createPlantopiaTheme = (mode: ThemeMode): PlantopiaTheme => ({
  mode,
  colors: mode === 'dark' ? darkColors : lightColors,
  ...commonTheme,
});

export const lightTheme = createPlantopiaTheme('light');
export const darkTheme = createPlantopiaTheme('dark');

export const defaultTheme = lightTheme;
