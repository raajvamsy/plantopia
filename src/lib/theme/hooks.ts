import { useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { ThemeContextType, PlantopiaColors } from './types';

/**
 * Hook to access the complete theme context
 * @returns ThemeContextType with all theme properties and functions
 */
export const usePlantopiaTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('usePlantopiaTheme must be used within a PlantopiaThemeProvider');
  }
  return context;
};

/**
 * Hook to access theme colors specifically
 * @returns PlantopiaColors object with all color values
 */
export const useThemeColors = (): PlantopiaColors => {
  const { theme } = usePlantopiaTheme();
  return theme.colors;
};

/**
 * Hook to access plant-specific colors
 * @returns Object with plant-themed colors (sage, mint, moss, etc.)
 */
export const usePlantColors = () => {
  const colors = useThemeColors();
  return useMemo(() => ({
    sage: colors.sage,
    mint: colors.mint,
    moss: colors.moss,
    fern: colors.fern,
    leaf: colors.leaf,
    earth: colors.earth,
    bark: colors.bark,
    stone: colors.stone,
    sky: colors.sky,
    water: colors.water,
  }), [colors]);
};

/**
 * Hook to access system colors (background, foreground, primary, etc.)
 * @returns Object with system colors
 */
export const useSystemColors = () => {
  const colors = useThemeColors();
  return useMemo(() => ({
    background: colors.background,
    foreground: colors.foreground,
    card: colors.card,
    cardForeground: colors.cardForeground,
    popover: colors.popover,
    popoverForeground: colors.popoverForeground,
    primary: colors.primary,
    primaryForeground: colors.primaryForeground,
    secondary: colors.secondary,
    secondaryForeground: colors.secondaryForeground,
    muted: colors.muted,
    mutedForeground: colors.mutedForeground,
    accent: colors.accent,
    accentForeground: colors.accentForeground,
    destructive: colors.destructive,
    destructiveForeground: colors.destructiveForeground,
    border: colors.border,
    input: colors.input,
    ring: colors.ring,
  }), [colors]);
};

/**
 * Hook to access theme spacing values
 * @returns Spacing object with all spacing values
 */
export const useThemeSpacing = () => {
  const { theme } = usePlantopiaTheme();
  return theme.spacing;
};

/**
 * Hook to access theme typography values
 * @returns Typography object with fonts, sizes, weights, etc.
 */
export const useThemeTypography = () => {
  const { theme } = usePlantopiaTheme();
  return theme.typography;
};

/**
 * Hook to access theme radius values
 * @returns Radius object with all border radius values
 */
export const useThemeRadius = () => {
  const { theme } = usePlantopiaTheme();
  return theme.radius;
};

/**
 * Hook to access theme shadows
 * @returns Shadows object with all shadow values
 */
export const useThemeShadows = () => {
  const { theme } = usePlantopiaTheme();
  return theme.shadows;
};

/**
 * Hook to access theme transitions
 * @returns Transitions object with all transition values
 */
export const useThemeTransitions = () => {
  const { theme } = usePlantopiaTheme();
  return theme.transitions;
};

/**
 * Hook to check if current theme is dark
 * @returns boolean indicating if theme is dark
 */
export const useIsDarkTheme = (): boolean => {
  const { isDark } = usePlantopiaTheme();
  return isDark;
};

/**
 * Hook to check if current theme is light
 * @returns boolean indicating if theme is light
 */
export const useIsLightTheme = (): boolean => {
  const { isLight } = usePlantopiaTheme();
  return isLight;
};

/**
 * Hook to get theme toggle function
 * @returns Function to toggle between light and dark themes
 */
export const useThemeToggle = () => {
  const { toggleTheme } = usePlantopiaTheme();
  return toggleTheme;
};

/**
 * Hook to get theme setter function
 * @returns Function to set specific theme mode
 */
export const useThemeSetter = () => {
  const { setTheme } = usePlantopiaTheme();
  return setTheme;
};

/**
 * Hook to get CSS variables for plant colors (useful for inline styles)
 * @returns Object with CSS variable strings
 */
export const usePlantColorVariables = () => {
  return useMemo(() => ({
    sage: 'var(--plantopia-sage)',
    mint: 'var(--plantopia-mint)',
    moss: 'var(--plantopia-moss)',
    fern: 'var(--plantopia-fern)',
    leaf: 'var(--plantopia-leaf)',
    earth: 'var(--plantopia-earth)',
    bark: 'var(--plantopia-bark)',
    stone: 'var(--plantopia-stone)',
    sky: 'var(--plantopia-sky)',
    water: 'var(--plantopia-water)',
  }), []);
};

/**
 * Convenient export - main hook for theme access
 */
export const useTheme = usePlantopiaTheme;
