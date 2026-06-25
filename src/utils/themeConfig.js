/**
 * Centralized Theme Configuration
 * This file contains all colors, backgrounds, images, and text styling for the entire application
 * To change the theme, simply modify the values in this file
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary color
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main secondary color
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info Colors
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main info color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Purple Colors
  purple: {
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

  // Orange Colors
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Main orange color
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Gray Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// ============================================================================
// BACKGROUND COLORS
// ============================================================================

export const backgrounds = {
  // Light Theme Backgrounds
  light: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    card: '#ffffff',
    modal: '#ffffff',
    sidebar: '#f8fafc',
    navbar: '#ffffff',
    footer: '#f1f5f9',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      error: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  },

  // Dark Theme Backgrounds
  dark: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
    card: '#1e293b',
    modal: '#1e293b',
    sidebar: '#0f172a',
    navbar: '#1e293b',
    footer: '#0f172a',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      error: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  },
};

// ============================================================================
// TEXT COLORS
// ============================================================================

export const textColors = {
  // Light Theme Text Colors
  light: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    muted: '#94a3b8',
    inverse: '#ffffff',
    link: '#3b82f6',
    linkHover: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0284c7',
  },

  // Dark Theme Text Colors
  dark: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
    inverse: '#0f172a',
    link: '#60a5fa',
    linkHover: '#93c5fd',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
  },
};

// ============================================================================
// BORDER COLORS
// ============================================================================

export const borderColors = {
  light: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    focus: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#334155',
    secondary: '#475569',
    tertiary: '#64748b',
    focus: '#60a5fa',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
};

// ============================================================================
// FONT SIZES
// ============================================================================

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
};

// ============================================================================
// FONT WEIGHTS
// ============================================================================

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

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '300ms ease-in-out',
  slow: '500ms ease-in-out',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// ============================================================================
// IMAGES AND ICONS
// ============================================================================

export const images = {
  // Default Avatar Images
  avatars: {
    default: '/img/default-avatar.png',
    admin: '/img/admin-avatar.png',
    reception: '/img/reception-avatar.png',
    teacher: '/img/teacher-avatar.png',
    student: '/img/student-avatar.png',
    parent: '/img/parent-avatar.png',
  },

  // Logo Images
  logos: {
    primary: '/img/logo.png',
    secondary: '/img/logo-white.png',
    favicon: '/favicon.ico',
  },

  // Background Images
  backgrounds: {
    hero: '/img/hero-bg.jpg',
    dashboard: '/img/dashboard-bg.jpg',
    login: '/img/login-bg.jpg',
  },

  // Placeholder Images
  placeholders: {
    image: 'https://via.placeholder.com/400x300',
    avatar: 'https://via.placeholder.com/150x150',
    thumbnail: 'https://via.placeholder.com/100x100',
  },
};

// ============================================================================
// COMPONENT-SPECIFIC STYLES
// ============================================================================

export const components = {
  // Button Styles
  button: {
    primary: {
      background: colors.primary[500],
      color: '#ffffff',
      hover: colors.primary[600],
      active: colors.primary[700],
      disabled: colors.gray[300],
    },
    secondary: {
      background: colors.secondary[500],
      color: '#ffffff',
      hover: colors.secondary[600],
      active: colors.secondary[700],
      disabled: colors.gray[300],
    },
    outline: {
      background: 'transparent',
      color: colors.primary[500],
      border: `1px solid ${colors.primary[500]}`,
      hover: colors.primary[50],
    },
  },

  // Card Styles
  card: {
    background: backgrounds.light.card,
    border: `1px solid ${borderColors.light.primary}`,
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
    padding: spacing[6],
  },

  // Input Styles
  input: {
    background: '#ffffff',
    border: `1px solid ${borderColors.light.primary}`,
    borderRadius: borderRadius.md,
    focus: {
      border: `1px solid ${borderColors.light.focus}`,
      shadow: `0 0 0 3px ${colors.primary[100]}`,
    },
  },

  // Modal Styles
  modal: {
    background: backgrounds.light.modal,
    overlay: backgrounds.light.overlay,
    borderRadius: borderRadius.xl,
    shadow: shadows['2xl'],
  },
};

// ============================================================================
// ROLE-SPECIFIC COLORS
// ============================================================================

export const roleColors = {
  admin: {
    primary: colors.error[500],
    secondary: colors.error[100],
    text: colors.error[700],
    background: colors.error[50],
  },
  receptionist: {
    primary: colors.orange[500],
    secondary: colors.orange[100],
    text: colors.orange[700],
    background: colors.orange[50],
  },
  teacher: {
    primary: colors.info[500],
    secondary: colors.info[100],
    text: colors.info[700],
    background: colors.info[50],
  },
  student: {
    primary: colors.success[500],
    secondary: colors.success[100],
    text: colors.success[700],
    background: colors.success[50],
  },
  parent: {
    primary: colors.purple[500],
    secondary: colors.purple[100],
    text: colors.purple[700],
    background: colors.purple[50],
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme-aware color based on current theme
 * @param {string} theme - 'light' or 'dark'
 * @param {string} colorType - 'background', 'text', 'border'
 * @param {string} variant - color variant
 * @returns {string} CSS color value
 */
export const getThemeColor = (theme, colorType, variant = 'primary') => {
  const themeColors = {
    light: {
      background: backgrounds.light,
      text: textColors.light,
      border: borderColors.light,
    },
    dark: {
      background: backgrounds.dark,
      text: textColors.dark,
      border: borderColors.dark,
    },
  };

  return themeColors[theme]?.[colorType]?.[variant] || themeColors.light[colorType][variant];
};

/**
 * Get role-specific color
 * @param {string} role - user role
 * @param {string} variant - color variant
 * @returns {string} CSS color value
 */
export const getRoleColor = (role, variant = 'primary') => {
  return roleColors[role]?.[variant] || roleColors.student[variant];
};

/**
 * Get component style
 * @param {string} component - component name
 * @param {string} variant - style variant
 * @returns {object} style object
 */
export const getComponentStyle = (component, variant = 'default') => {
  return components[component]?.[variant] || components[component]?.default || {};
};

/**
 * Generate CSS custom properties for theme
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} CSS custom properties
 */
export const generateCSSVariables = (theme) => {
  return {
    '--color-primary': colors.primary[500],
    '--color-secondary': colors.secondary[500],
    '--color-success': colors.success[500],
    '--color-warning': colors.warning[500],
    '--color-error': colors.error[500],
    '--color-info': colors.info[500],
    '--background-primary': backgrounds[theme].primary,
    '--background-secondary': backgrounds[theme].secondary,
    '--background-card': backgrounds[theme].card,
    '--text-primary': textColors[theme].primary,
    '--text-secondary': textColors[theme].secondary,
    '--text-muted': textColors[theme].muted,
    '--border-primary': borderColors[theme].primary,
    '--border-secondary': borderColors[theme].secondary,
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--radius-sm': borderRadius.sm,
    '--radius-md': borderRadius.md,
    '--radius-lg': borderRadius.lg,
  };
};



const themeConfig = {
  colors,
  backgrounds,
  textColors,
  borderColors,
  shadows,
  borderRadius,
  spacing,
  fontSizes,
  fontWeights,
  transitions,
  images,
  components,
  roleColors,
  getThemeColor,
  getRoleColor,
  getComponentStyle,
  generateCSSVariables,
};

export default themeConfig; 