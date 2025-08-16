# 🌱 Plantopia Component Architecture

## 📋 Overview
Plantopia uses a modern, scalable component architecture built with **Radix UI primitives**, **Tailwind CSS**, and **TypeScript** to ensure consistency, accessibility, and mobile responsiveness across all pages.

## 🏗️ Component Structure

### 🎨 Design System Components (`/src/components/ui/`)

#### **Radix UI Based Components**
- **Button** - Customizable button with variants (default, sage, mint, outline, ghost, etc.)
- **Card** - Flexible card container with header, content, and footer sections
- **Input** - Form input with consistent styling and validation states
- **Textarea** - Multi-line text input component
- **Checkbox** - Accessible checkbox with proper states
- **Label** - Form labels with accessibility features
- **Dialog** - Modal dialogs with overlay and animations

#### **Layout Components**
- **PlantopiaHeader** - Unified header with dynamic icons per page
- **BottomNavigation** - Mobile-first bottom navigation
- **ResponsiveContainer** - Responsive wrapper with configurable max-widths
- **MobilePageWrapper** - Page wrapper optimized for mobile with proper spacing

#### **Specialized Components**
- **PlantCard** - Display plant information with images and stats
- **TaskItem** - Interactive task list items
- **ProgressBar** - Animated progress indicators
- **AchievementCard** - Gamification elements
- **LeafSpinner** - Custom loading animations

## 📱 Mobile-First Design

### **Responsive Breakpoints**
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
```

### **Touch Targets**
- Minimum 44px touch targets for mobile
- Proper spacing between interactive elements
- Accessible focus states

### **PWA Features**
- **Service Worker** - Offline caching and background sync
- **Web App Manifest** - Native app-like installation
- **Responsive Icons** - Multiple icon sizes for different devices
- **App Shortcuts** - Quick actions from home screen

## 🎯 Theme System

### **Theme Provider**
```typescript
<PlantopiaThemeProvider defaultMode="light">
  {/* App content */}
</PlantopiaThemeProvider>
```

### **Theme Colors**
- **Primary Colors**: Sage (`#7fb069`) and Mint (`#38e07b`)
- **Semantic Colors**: Background, foreground, muted, accent
- **State Colors**: Success, warning, error, info

### **Theme Hooks**
- `usePlantopiaTheme()` - Theme state and controls
- `usePlantColors()` - Plant-specific color palette
- `useThemeColors()` - General theme colors

## 🔧 Implementation Guidelines

### **Component Usage**
```typescript
// ✅ Preferred: Use common components
import { Button, Card, Input } from '@/components/ui';

// ❌ Avoid: Direct HTML elements for interactive components
<button className="...">Click me</button>
```

### **Responsive Patterns**
```typescript
// ✅ Use responsive containers
<ResponsiveContainer maxWidth="4xl" padding="lg">
  <MobilePageWrapper>
    {/* Page content */}
  </MobilePageWrapper>
</ResponsiveContainer>
```

### **Accessibility**
- All interactive elements have proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## 📄 Page Structure

### **Consistent Page Layout**
```typescript
export default function PageName() {
  return (
    <MobilePageWrapper>
      <PlantopiaHeader currentPage="pagename" />
      <ResponsiveContainer>
        {/* Page content */}
      </ResponsiveContainer>
      <BottomNavigation />
    </MobilePageWrapper>
  );
}
```

### **Form Components**
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Form</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Form Title</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input">Label</Label>
        <Input id="input" placeholder="Placeholder" />
      </div>
      <Button variant="sage" className="w-full">
        Submit
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

## ✅ Quality Assurance

### **Component Standards**
- ✅ Radix UI primitives for accessibility
- ✅ Consistent styling with Tailwind classes
- ✅ TypeScript for type safety
- ✅ Mobile-responsive design
- ✅ Theme integration
- ✅ Proper error handling

### **Performance**
- ✅ Code splitting with Next.js
- ✅ Optimized bundle sizes
- ✅ Lazy loading for non-critical components
- ✅ Image optimization
- ✅ Service worker caching

## 🚀 Future Enhancements

### **Planned Components**
- Tooltip component for help text
- Select dropdown with search
- Date picker for scheduling
- Progress indicators for uploads
- Toast notifications

### **Advanced Features**
- Dark mode animations
- Component documentation with Storybook
- Automated testing suite
- Performance monitoring
- A11y testing automation

---

*This architecture ensures Plantopia delivers a consistent, accessible, and delightful user experience across all devices and platforms.* 🌱✨
