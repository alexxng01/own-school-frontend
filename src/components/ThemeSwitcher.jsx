import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = ({ className = '', size = 'md' }) => {
  const { toggleTheme, isDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative
        rounded-full
        bg-gradient-to-r from-blue-500 to-purple-600
        hover:from-blue-600 hover:to-purple-700
        active:from-blue-700 active:to-purple-800
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        flex items-center justify-center
        text-white
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
    >
      <div className="relative">
        {/* Sun Icon */}
        <Sun
          className={`
            ${iconSizes[size]}
            absolute inset-0
            transition-all duration-300 ease-in-out
            ${isDarkMode 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`
            ${iconSizes[size]}
            absolute inset-0
            transition-all duration-300 ease-in-out
            ${isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
        />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-200" />
    </button>
  );
};

export default ThemeSwitcher; 