# 🎨 Centralized Theme System Guide

This guide explains how to use the new centralized theme system for the School Management System. The theme system provides consistent colors, backgrounds, images, and text styling across all components.

## 📁 File Structure

```
src/
├── utils/
│   └── themeConfig.js          # Main theme configuration
├── context/
│   └── ThemeProvider.jsx       # Theme provider component
├── components/
│   ├── ThemeSwitcher.jsx       # Theme toggle component
│   └── ThemeExample.jsx        # Example usage component
└── styles/
    └── theme.css               # CSS with theme variables
```

## 🚀 Quick Start

### 1. Import the Theme Provider

The theme provider is already set up in `App.js`:

```jsx
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### 2. Use the Theme Hook

In any component, import and use the theme hook:

```jsx
import { useTheme } from '../context/ThemeProvider';

const MyComponent = () => {
  const { 
    theme, 
    isDarkMode, 
    toggleTheme, 
    getColor, 
    getRoleColor,
    colors,
    backgrounds,
    textColors 
  } = useTheme();

  return (
    <div>
      <h1>Current theme: {theme}</h1>
      <button onClick={toggleTheme}>
        Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
};
```

## 🎯 How to Change Colors

### Method 1: Edit themeConfig.js (Recommended)

To change colors globally, edit `src/utils/themeConfig.js`:

```javascript
export const colors = {
  primary: {
    500: '#your-new-color', // Change primary color
  },
  // ... other colors
};
```

### Method 2: Use Theme Functions

For dynamic styling in components:

```jsx
const { getColor, getRoleColor } = useTheme();

// Get theme-aware colors
const backgroundColor = getColor('background', 'primary');
const textColor = getColor('text', 'primary');

// Get role-specific colors
const adminColor = getRoleColor('admin', 'primary');
const teacherColor = getRoleColor('teacher', 'primary');
```

### Method 3: Use CSS Classes

The theme system provides CSS classes:

```jsx
<div className="card bg-primary text-white">
  <h2 className="text-primary">Title</h2>
  <p className="text-secondary">Content</p>
</div>
```

## 🎨 Available Color Schemes

### Primary Colors
- **Blue**: `#3b82f6` (Default)
- **Green**: `#22c55e`
- **Purple**: `#a855f7`
- **Orange**: `#f97316`
- **Red**: `#ef4444`

### Role-Specific Colors
- **Admin**: Red theme
- **Teacher**: Blue theme
- **Student**: Green theme
- **Parent**: Purple theme
- **Receptionist**: Orange theme

## 🖼️ Changing Images

### Avatar Images
Edit `src/utils/themeConfig.js`:

```javascript
export const images = {
  avatars: {
    default: '/img/your-default-avatar.png',
    admin: '/img/your-admin-avatar.png',
    teacher: '/img/your-teacher-avatar.png',
    // ... other roles
  },
};
```

### Background Images
```javascript
export const images = {
  backgrounds: {
    hero: '/img/your-hero-bg.jpg',
    dashboard: '/img/your-dashboard-bg.jpg',
    login: '/img/your-login-bg.jpg',
  },
};
```

## 📝 Changing Text Styles

### Font Sizes
```javascript
export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  // ... add more sizes
};
```

### Font Weights
```javascript
export const fontWeights = {
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  // ... add more weights
};
```

## 🎭 Component Styling Examples

### Button Styling
```jsx
// Using CSS classes
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-outline">Outline Button</button>

// Using inline styles
<button 
  style={{
    backgroundColor: colors.primary[500],
    color: 'white',
    padding: spacing[4],
    borderRadius: borderRadius.md
  }}
>
  Custom Button
</button>
```

### Card Styling
```jsx
// Using CSS classes
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content</p>
  </div>
</div>

// Using theme functions
<div 
  className="card"
  style={{
    backgroundColor: backgrounds.card,
    borderColor: getColor('border', 'primary'),
    boxShadow: shadows.md
  }}
>
  <h3 style={{ color: textColors.primary }}>Dynamic Card</h3>
</div>
```

### Role-Based Styling
```jsx
const { getRoleColor } = useTheme();

<div 
  style={{
    backgroundColor: getRoleColor('admin', 'background'),
    borderColor: getRoleColor('admin', 'primary'),
    color: getRoleColor('admin', 'text')
  }}
>
  <h3>Admin Section</h3>
  <button 
    style={{
      backgroundColor: getRoleColor('admin', 'primary'),
      color: 'white'
    }}
  >
    Admin Action
  </button>
</div>
```

## 🌙 Dark Mode Support

The theme system automatically handles dark mode:

```jsx
const { isDarkMode, toggleTheme } = useTheme();

// Colors automatically adapt to theme
const backgroundColor = getColor('background', 'primary'); // Light or dark based on theme
const textColor = getColor('text', 'primary'); // Light or dark based on theme
```

## 🎨 Adding New Colors

To add new colors to the theme:

1. **Add to themeConfig.js**:
```javascript
export const colors = {
  // ... existing colors
  custom: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
};
```

2. **Use in components**:
```jsx
const { colors } = useTheme();

<div style={{ backgroundColor: colors.custom[500] }}>
  Custom colored element
</div>
```

## 🔧 Advanced Customization

### Custom Component Styles
```javascript
export const components = {
  customButton: {
    background: colors.primary[500],
    color: 'white',
    padding: spacing[4],
    borderRadius: borderRadius.md,
    boxShadow: shadows.md,
  },
};
```

### Custom CSS Variables
```javascript
export const generateCSSVariables = (theme) => {
  return {
    // ... existing variables
    '--custom-color': colors.custom[500],
    '--custom-spacing': spacing[8],
  };
};
```

## 📱 Responsive Design

The theme system includes responsive utilities:

```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  .card {
    margin: 0.5rem;
  }
  
  .table {
    font-size: 0.875rem;
  }
}
```

## 🎯 Best Practices

1. **Use CSS classes when possible** - They're more performant
2. **Use theme functions for dynamic styling** - They adapt to theme changes
3. **Keep colors consistent** - Use the predefined color palette
4. **Test both themes** - Ensure your components work in light and dark modes
5. **Use semantic color names** - `primary`, `secondary`, `success`, etc.

## 🐛 Troubleshooting

### Theme not updating
- Ensure `ThemeProvider` wraps your component
- Check that `useTheme()` is called within the provider
- Verify localStorage permissions

### Colors not changing
- Clear browser cache
- Check CSS specificity
- Ensure theme variables are properly applied

### Dark mode not working
- Verify `data-theme="dark"` is set on document
- Check CSS custom properties are applied
- Ensure dark theme colors are defined

## 📚 Additional Resources

- **Theme Configuration**: `src/utils/themeConfig.js`
- **Theme Provider**: `src/context/ThemeProvider.jsx`
- **Example Usage**: `src/components/ThemeExample.jsx`
- **CSS Variables**: `src/styles/theme.css`

---

This theme system provides a centralized way to manage all colors, backgrounds, images, and text styling across your application. By using this system, you can easily maintain consistency and make global changes from a single location. 