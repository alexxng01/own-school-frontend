# 🎨 Theme Customization Guide

This guide shows you all the different ways to customize your School Management System theme.

## 🚀 Quick Customization Methods

### Method 1: Change Primary Colors (Easiest)

Edit `src/utils/themeConfig.js` and change the primary color:

```javascript
// Change the main blue color to green
export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // ← Change this to your preferred color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // ... other colors
};
```

### Method 2: Change All Colors at Once

Replace the entire color palette:

```javascript
export const colors = {
  // Red Theme
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main red color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Purple Theme
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main purple color
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // ... customize other colors
};
```

## 🎯 Specific Customization Areas

### 1. **Change Background Colors**

```javascript
export const backgrounds = {
  light: {
    primary: '#ffffff',      // Main background
    secondary: '#f8fafc',    // Secondary background
    card: '#ffffff',         // Card backgrounds
    navbar: '#ffffff',       // Navigation bar
    sidebar: '#f8fafc',      // Sidebar background
  },
  dark: {
    primary: '#0f172a',      // Dark main background
    secondary: '#1e293b',    // Dark secondary background
    card: '#1e293b',         // Dark card backgrounds
    navbar: '#1e293b',       // Dark navigation bar
    sidebar: '#0f172a',      // Dark sidebar background
  },
};
```

### 2. **Change Text Colors**

```javascript
export const textColors = {
  light: {
    primary: '#0f172a',      // Main text color
    secondary: '#475569',    // Secondary text
    muted: '#94a3b8',        // Muted text
  },
  dark: {
    primary: '#f8fafc',      // Dark mode main text
    secondary: '#cbd5e1',    // Dark mode secondary text
    muted: '#64748b',        // Dark mode muted text
  },
};
```

### 3. **Change Role-Specific Colors**

```javascript
export const roleColors = {
  admin: {
    primary: '#ef4444',      // Admin primary color (red)
    secondary: '#fef2f2',    // Admin secondary color
    text: '#b91c1c',         // Admin text color
    background: '#fef2f2',   // Admin background
  },
  teacher: {
    primary: '#0ea5e9',      // Teacher primary color (blue)
    secondary: '#f0f9ff',    // Teacher secondary color
    text: '#0369a1',         // Teacher text color
    background: '#f0f9ff',   // Teacher background
  },
  student: {
    primary: '#22c55e',      // Student primary color (green)
    secondary: '#f0fdf4',    // Student secondary color
    text: '#15803d',         // Student text color
    background: '#f0fdf4',   // Student background
  },
  // ... customize other roles
};
```

### 4. **Change Images and Avatars**

```javascript
export const images = {
  avatars: {
    default: '/img/your-default-avatar.png',
    admin: '/img/admin-avatar.png',
    teacher: '/img/teacher-avatar.png',
    student: '/img/student-avatar.png',
    parent: '/img/parent-avatar.png',
    receptionist: '/img/receptionist-avatar.png',
  },
  
  backgrounds: {
    hero: '/img/your-hero-background.jpg',
    dashboard: '/img/your-dashboard-bg.jpg',
    login: '/img/your-login-background.jpg',
  },
  
  logos: {
    primary: '/img/your-logo.png',
    secondary: '/img/your-logo-white.png',
    favicon: '/img/your-favicon.ico',
  },
};
```

### 5. **Change Font Sizes and Weights**

```javascript
export const fontSizes = {
  xs: '0.75rem',      // Extra small
  sm: '0.875rem',     // Small
  base: '1rem',       // Base size
  lg: '1.125rem',     // Large
  xl: '1.25rem',      // Extra large
  '2xl': '1.5rem',    // 2X large
  '3xl': '1.875rem',  // 3X large
  '4xl': '2.25rem',   // 4X large
  '5xl': '3rem',      // 5X large
  '6xl': '3.75rem',   // 6X large
};

export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};
```

### 6. **Change Spacing and Border Radius**

```javascript
export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  56: '14rem',     // 224px
  64: '16rem',     // 256px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
};
```

## 🎨 Popular Theme Presets

### 1. **Modern Blue Theme**
```javascript
export const colors = {
  primary: {
    500: '#3b82f6', // Modern blue
  },
  secondary: {
    500: '#64748b', // Slate gray
  },
};
```

### 2. **Nature Green Theme**
```javascript
export const colors = {
  primary: {
    500: '#10b981', // Emerald green
  },
  secondary: {
    500: '#6b7280', // Gray
  },
};
```

### 3. **Royal Purple Theme**
```javascript
export const colors = {
  primary: {
    500: '#8b5cf6', // Purple
  },
  secondary: {
    500: '#64748b', // Slate
  },
};
```

### 4. **Warm Orange Theme**
```javascript
export const colors = {
  primary: {
    500: '#f97316', // Orange
  },
  secondary: {
    500: '#6b7280', // Gray
  },
};
```

### 5. **Professional Red Theme**
```javascript
export const colors = {
  primary: {
    500: '#dc2626', // Red
  },
  secondary: {
    500: '#64748b', // Slate
  },
};
```

## 🔧 Advanced Customization

### 1. **Custom Component Styles**

```javascript
export const components = {
  button: {
    primary: {
      background: colors.primary[500],
      color: '#ffffff',
      hover: colors.primary[600],
      active: colors.primary[700],
      disabled: colors.gray[300],
      // Add custom properties
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
    },
    // Add new button variants
    gradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      hover: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    },
  },
  
  card: {
    // Customize card styles
    background: backgrounds.light.card,
    border: `2px solid ${borderColors.light.primary}`,
    borderRadius: '16px',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '24px',
  },
};
```

### 2. **Custom CSS Variables**

```javascript
export const generateCSSVariables = (theme) => {
  return {
    // Existing variables
    '--color-primary': colors.primary[500],
    '--color-secondary': colors.secondary[500],
    
    // Add custom variables
    '--custom-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--custom-shadow': '0 20px 40px rgba(0, 0, 0, 0.15)',
    '--custom-border-radius': '20px',
    '--custom-spacing': '32px',
  };
};
```

### 3. **Custom Role Colors**

```javascript
export const roleColors = {
  // Add new roles
  principal: {
    primary: '#7c3aed',      // Purple
    secondary: '#f3e8ff',
    text: '#581c87',
    background: '#faf5ff',
  },
  
  librarian: {
    primary: '#059669',      // Emerald
    secondary: '#ecfdf5',
    text: '#047857',
    background: '#f0fdf4',
  },
  
  // Customize existing roles
  admin: {
    primary: '#dc2626',      // Red
    secondary: '#fef2f2',
    text: '#991b1b',
    background: '#fef2f2',
  },
};
```

## 🎯 Real-World Examples

### Example 1: School Brand Colors
```javascript
// If your school colors are blue and gold
export const colors = {
  primary: {
    500: '#1e40af', // School blue
  },
  secondary: {
    500: '#f59e0b', // School gold
  },
  accent: {
    500: '#10b981', // Green for success
  },
};
```

### Example 2: Seasonal Themes
```javascript
// Spring theme
export const colors = {
  primary: {
    500: '#10b981', // Green
  },
  secondary: {
    500: '#fbbf24', // Yellow
  },
  accent: {
    500: '#f472b6', // Pink
  },
};

// Fall theme
export const colors = {
  primary: {
    500: '#f97316', // Orange
  },
  secondary: {
    500: '#dc2626', // Red
  },
  accent: {
    500: '#fbbf24', // Yellow
  },
};
```

### Example 3: Accessibility Focused
```javascript
// High contrast theme
export const colors = {
  primary: {
    500: '#000000', // Black
  },
  secondary: {
    500: '#ffffff', // White
  },
  background: {
    primary: '#ffffff',
    secondary: '#f0f0f0',
  },
  text: {
    primary: '#000000',
    secondary: '#333333',
  },
};
```

## 🚀 Quick Theme Switcher

You can also create multiple theme presets and switch between them:

```javascript
// In your component
const { setSpecificTheme } = useTheme();

const themes = {
  blue: { primary: '#3b82f6' },
  green: { primary: '#10b981' },
  purple: { primary: '#8b5cf6' },
  orange: { primary: '#f97316' },
  red: { primary: '#dc2626' },
};

// Switch themes
<button onClick={() => setSpecificTheme('blue')}>Blue Theme</button>
<button onClick={() => setSpecificTheme('green')}>Green Theme</button>
```

## 📝 Tips for Customization

1. **Start Small**: Change one color at a time to see the effect
2. **Use Color Tools**: Use tools like Coolors.co or Adobe Color to generate palettes
3. **Test Both Themes**: Always test your changes in both light and dark modes
4. **Keep Contrast**: Ensure text remains readable on backgrounds
5. **Be Consistent**: Use the same color palette throughout your application
6. **Document Changes**: Keep notes of what you changed for future reference

## 🎨 Color Palette Generators

- **Coolors.co**: Generate beautiful color palettes
- **Adobe Color**: Professional color tools
- **Color Hunt**: Curated color palettes
- **Paletton**: Advanced color scheme generator

---

Now you have complete control over your theme! Start with small changes and gradually build your perfect theme. 🎉 