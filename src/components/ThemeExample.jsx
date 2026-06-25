import React from 'react';
import { useTheme } from '../context/ThemeProvider';

const ThemeExample = () => {
  const { 
    theme, 
    isDarkMode, 
    toggleTheme, 
    getColor, 
    getRoleColor, 
    getComponentStyle,
    colors,
    backgrounds,
    textColors,
    roleColors 
  } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">
        Theme System Example
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card using CSS classes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">CSS Classes</h3>
          </div>
          <div className="card-body">
            <p className="text-secondary mb-4">
              This card uses CSS classes from the theme system.
            </p>
            <button className="btn btn-primary">Primary Button</button>
          </div>
        </div>

        {/* Card using inline styles with theme functions */}
        <div 
          className="card"
          style={{
            backgroundColor: backgrounds.card,
            borderColor: getColor('border', 'primary'),
            color: textColors.primary
          }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold">Theme Functions</h3>
          </div>
          <div className="card-body">
            <p className="mb-4">
              This card uses theme functions for dynamic styling.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: colors.primary[500],
                color: 'white'
              }}
            >
              Dynamic Button
            </button>
          </div>
        </div>

        {/* Role-based styling */}
        <div 
          className="card"
          style={{
            backgroundColor: getRoleColor('admin', 'background'),
            borderColor: getRoleColor('admin', 'primary')
          }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: getRoleColor('admin', 'text') }}>
              Admin Role
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-4" style={{ color: getRoleColor('admin', 'text') }}>
              This card uses admin role colors.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: getRoleColor('admin', 'primary'),
                color: 'white'
              }}
            >
              Admin Button
            </button>
          </div>
        </div>

        {/* Teacher role */}
        <div 
          className="card"
          style={{
            backgroundColor: getRoleColor('teacher', 'background'),
            borderColor: getRoleColor('teacher', 'primary')
          }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: getRoleColor('teacher', 'text') }}>
              Teacher Role
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-4" style={{ color: getRoleColor('teacher', 'text') }}>
              This card uses teacher role colors.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: getRoleColor('teacher', 'primary'),
                color: 'white'
              }}
            >
              Teacher Button
            </button>
          </div>
        </div>

        {/* Student role */}
        <div 
          className="card"
          style={{
            backgroundColor: getRoleColor('student', 'background'),
            borderColor: getRoleColor('student', 'primary')
          }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: getRoleColor('student', 'text') }}>
              Student Role
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-4" style={{ color: getRoleColor('student', 'text') }}>
              This card uses student role colors.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: getRoleColor('student', 'primary'),
                color: 'white'
              }}
            >
              Student Button
            </button>
          </div>
        </div>

        {/* Receptionist role */}
        <div 
          className="card"
          style={{
            backgroundColor: getRoleColor('receptionist', 'background'),
            borderColor: getRoleColor('receptionist', 'primary')
          }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold" style={{ color: getRoleColor('receptionist', 'text') }}>
              Receptionist Role
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-4" style={{ color: getRoleColor('receptionist', 'text') }}>
              This card uses receptionist role colors.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: getRoleColor('receptionist', 'primary'),
                color: 'white'
              }}
            >
              Receptionist Button
            </button>
          </div>
        </div>

      </div>

      {/* Color Palette Display */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Color Palette</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(colors.primary).map(([shade, color]) => (
              <div key={shade} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-lg mb-2"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-mono">{shade}</p>
                <p className="text-xs text-muted">{color}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Current Theme</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Theme:</strong> {theme}</p>
              <p><strong>Dark Mode:</strong> {isDarkMode ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <button 
                className="btn btn-primary"
                onClick={toggleTheme}
              >
                Toggle Theme
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ThemeExample; 