# Plantopia Theme System

A comprehensive theme system built for the Plantopia PWA, providing plant-inspired colors, typography, spacing, and theming capabilities with full light/dark mode support.

## Features

- 🌱 **Plant-themed colors**: Sage, mint, moss, fern, leaf, and more nature-inspired colors
- 🌙 **Light/Dark mode**: Full support for light, dark, and system themes
- 🎨 **CSS Variables**: Automatic CSS variable generation for all theme properties
- 🪝 **React Hooks**: Easy-to-use hooks for accessing theme properties
- 💾 **Persistent**: Theme preferences are saved to localStorage
- 🔄 **Dynamic**: Update themes from any component throughout your app

## Quick Start

The theme system is already set up in your root layout. Just start using the hooks in your components!

```tsx
import { usePlantColors, useThemeToggle, useIsDarkTheme } from '@/lib/theme';

function MyComponent() {
  const colors = usePlantColors();
  const toggleTheme = useThemeToggle();
  const isDark = useIsDarkTheme();

  return (
    <div style={{ backgroundColor: colors.sage }}>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}
```

## Available Hooks

### Core Theme Hooks

- `useTheme()` - Access the complete theme context
- `useThemeColors()` - Get all theme colors
- `useThemeToggle()` - Get theme toggle function
- `useThemeSetter()` - Get theme setter function
- `useIsDarkTheme()` - Check if current theme is dark
- `useIsLightTheme()` - Check if current theme is light

### Color Hooks

- `usePlantColors()` - Access plant-themed colors (sage, mint, moss, etc.)
- `useSystemColors()` - Access system colors (background, foreground, primary, etc.)
- `usePlantColorVariables()` - Get CSS variable strings for plant colors

### Design Token Hooks

- `useThemeSpacing()` - Access spacing values
- `useThemeTypography()` - Access typography settings
- `useThemeRadius()` - Access border radius values
- `useThemeShadows()` - Access shadow definitions
- `useThemeTransitions()` - Access transition definitions

## Plant Colors

The theme includes 10 carefully selected plant-inspired colors:

| Color | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|--------|
| `sage` | #87A96B | #9CB86F | Primary brand color |
| `mint` | #B8E6B8 | #7BA05B | Accent color |
| `moss` | #5D7C47 | #B8E6B8 | Dark green accents |
| `fern` | #7BA05B | #87A96B | Medium green |
| `leaf` | #9CB86F | #A8C976 | Fresh green |
| `earth` | #8B7355 | #A67C52 | Earth tones |
| `bark` | #6B5B47 | #8B7355 | Tree bark brown |
| `stone` | #A8A8A8 | #6B6B6B | Neutral grey |
| `sky` | #B8D4E3 | #4A6B7D | Sky blue |
| `water` | #7DB8E8 | #5A9BC4 | Water blue |

## Usage Examples

### Using Plant Colors

```tsx
function PlantCard() {
  const colors = usePlantColors();
  
  return (
    <div style={{
      backgroundColor: colors.mint,
      borderColor: colors.sage,
      color: colors.moss
    }}>
      <h3>My Plant</h3>
      <p>Last watered: Today</p>
    </div>
  );
}
```

### Using CSS Classes with Tailwind

The plant colors are available as CSS variables that work with Tailwind:

```tsx
function PlantButton() {
  return (
    <button className="bg-plantopia-sage text-white hover:bg-plantopia-moss">
      Water Plant
    </button>
  );
}
```

### Theme-aware Components

```tsx
function ThemedCard({ children }) {
  const { background, foreground, border } = useSystemColors();
  const isDark = useIsDarkTheme();
  
  return (
    <div 
      style={{
        backgroundColor: background,
        color: foreground,
        border: `1px solid ${border}`,
        padding: '1rem',
        borderRadius: '8px',
      }}
      className={isDark ? 'shadow-lg' : 'shadow-md'}
    >
      {children}
    </div>
  );
}
```

### Manual Theme Control

```tsx
function ThemeControls() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme.mode}</p>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

### Responsive Design with Theme

```tsx
function ResponsiveComponent() {
  const { spacing, typography } = useTheme();
  const colors = usePlantColors();
  
  return (
    <div style={{
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.lg,
      backgroundColor: colors.sage,
      borderRadius: '8px',
    }}>
      <h2 style={{ fontSize: typography.fontSize['2xl'] }}>
        Plant Care Tips
      </h2>
    </div>
  );
}
```

## CSS Variables

All theme properties are automatically available as CSS variables:

```css
/* Plant colors */
--plantopia-sage
--plantopia-mint
--plantopia-moss
/* ... and all other plant colors */

/* System colors (automatically switch with theme) */
--primary (uses sage)
--accent (uses mint)
--ring (uses sage for focus rings)
```

## Theme Provider Setup

The theme provider is already configured in your root layout:

```tsx
// src/app/layout.tsx
import { PlantopiaThemeProvider } from '@/lib/theme';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PlantopiaThemeProvider defaultMode="system">
          {children}
        </PlantopiaThemeProvider>
      </body>
    </html>
  );
}
```

## Customization

To modify colors or add new ones, edit the theme configuration:

```typescript
// src/lib/theme/config.ts
const lightColors: PlantopiaColors = {
  sage: '#87A96B',
  // ... modify existing colors
  newColor: '#123456', // Add new colors
};
```

Don't forget to update the TypeScript types in `types.ts` if you add new color properties.

## Best Practices

1. **Use semantic colors**: Prefer `colors.primary` over specific color names when possible
2. **Theme-aware styling**: Always use `useIsDarkTheme()` for conditional styling
3. **Consistent spacing**: Use `theme.spacing` values instead of hardcoded measurements
4. **Accessible colors**: The provided colors have been chosen for good contrast in both themes
5. **CSS Variables**: Use CSS variables for styles that need to change with theme transitions

## Demo

Visit the theme demo page to see all colors and features in action. You can toggle between themes and see real-time updates.
