// Theme types
export type {
  ThemeMode,
  PlantopiaColors,
  PlantopiaSpacing,
  PlantopiaTypography,
  PlantopiaRadius,
  PlantopiaTheme,
  ThemeContextType,
} from './types';

// Theme configuration
export {
  createPlantopiaTheme,
  lightTheme,
  darkTheme,
  defaultTheme,
} from './config';

// Theme context and provider
export {
  PlantopiaThemeProvider,
  ThemeContext,
} from './context';

// Theme hooks
export {
  usePlantopiaTheme,
  useTheme,
  useThemeColors,
  usePlantColors,
  useSystemColors,
  useThemeSpacing,
  useThemeTypography,
  useThemeRadius,
  useThemeShadows,
  useThemeTransitions,
  useIsDarkTheme,
  useIsLightTheme,
  useThemeToggle,
  useThemeSetter,
  usePlantColorVariables,
} from './hooks';
