export type ThemeMode = 'light' | 'dark' | 'system';

export interface PlantopiaColors {
  // Plant-themed primary colors
  sage: string;
  mint: string;
  moss: string;
  fern: string;
  leaf: string;
  
  // Supporting colors
  earth: string;
  bark: string;
  stone: string;
  sky: string;
  water: string;
  
  // System colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface PlantopiaSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface PlantopiaTypography {
  fontSans: string;
  fontMono: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}

export interface PlantopiaRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface PlantopiaTheme {
  mode: ThemeMode;
  colors: PlantopiaColors;
  spacing: PlantopiaSpacing;
  typography: PlantopiaTypography;
  radius: PlantopiaRadius;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
}

export interface ThemeContextType {
  theme: PlantopiaTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}
