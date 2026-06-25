import React, { createContext, useContext, useEffect, useState } from 'react';
import themeConfig, { generateCSSVariables } from '../utils/themeConfig';
import { backendStorage } from '../utils/backendStorage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get saved theme from backendStorage or default to 'light'
    const savedTheme = backendStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  // Apply theme to document
  useEffect(() => {
    // Apply CSS custom properties
    const cssVariables = generateCSSVariables(theme);
    Object.entries(cssVariables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });

    // Apply theme class to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    // Save theme to backendStorage
    backendStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      setIsDarkMode(newTheme === 'dark');
    }
  };

  // Get theme-aware colors
  const getColor = (colorType, variant = 'primary') => {
    return themeConfig.getThemeColor(theme, colorType, variant);
  };

  // Get role-specific colors
  const getRoleColor = (role, variant = 'primary') => {
    return themeConfig.getRoleColor(role, variant);
  };

  // Get component styles
  const getComponentStyle = (component, variant = 'default') => {
    return themeConfig.getComponentStyle(component, variant);
  };

  // Get image by type
  const getImage = (type, variant = 'default') => {
    return themeConfig.images[type]?.[variant] || themeConfig.images.placeholders.image;
  };

  // Get avatar image for user role
  const getAvatarImage = (role) => {
    return themeConfig.images.avatars[role] || themeConfig.images.avatars.default;
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setSpecificTheme,
    getColor,
    getRoleColor,
    getComponentStyle,
    getImage,
    getAvatarImage,
    // Expose theme configuration for direct access
    colors: themeConfig.colors,
    backgrounds: themeConfig.backgrounds[theme],
    textColors: themeConfig.textColors[theme],
    borderColors: themeConfig.borderColors[theme],
    shadows: themeConfig.shadows,
    borderRadius: themeConfig.borderRadius,
    spacing: themeConfig.spacing,
    fontSizes: themeConfig.fontSizes,
    fontWeights: themeConfig.fontWeights,
    transitions: themeConfig.transitions,
    roleColors: themeConfig.roleColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 