import React, { useState } from 'react';
import { useTheme } from '../context/ThemeProvider';

const ThemeCustomizer = () => {
  const { colors, getRoleColor } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState('default');

  const themePresets = {
    default: {
      name: 'Default Blue',
      primary: '#3b82f6',
      secondary: '#64748b',
      description: 'Professional blue theme'
    },
    green: {
      name: 'Nature Green',
      primary: '#10b981',
      secondary: '#6b7280',
      description: 'Fresh green theme'
    },
    purple: {
      name: 'Royal Purple',
      primary: '#8b5cf6',
      secondary: '#64748b',
      description: 'Elegant purple theme'
    },
    orange: {
      name: 'Warm Orange',
      primary: '#f97316',
      secondary: '#6b7280',
      description: 'Energetic orange theme'
    },
    red: {
      name: 'Professional Red',
      primary: '#dc2626',
      secondary: '#64748b',
      description: 'Bold red theme'
    },
    pink: {
      name: 'Modern Pink',
      primary: '#ec4899',
      secondary: '#64748b',
      description: 'Modern pink theme'
    },
    teal: {
      name: 'Ocean Teal',
      primary: '#14b8a6',
      secondary: '#64748b',
      description: 'Calming teal theme'
    },
    indigo: {
      name: 'Deep Indigo',
      primary: '#6366f1',
      secondary: '#64748b',
      description: 'Deep indigo theme'
    }
  };

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    // In a real implementation, you would update the theme here
    console.log(`Theme changed to: ${themePresets[presetKey].name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold">Theme Customizer</h2>
          <p className="text-secondary">Customize your school management system theme</p>
        </div>
        
        <div className="card-body space-y-6">
          
          {/* Theme Presets */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Theme Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themePresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200
                    ${selectedPreset === key 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div 
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-full h-4 rounded mb-2"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <p className="text-sm font-medium">{preset.name}</p>
                  <p className="text-xs text-muted">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Color Palette */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(colors.primary).map(([shade, color]) => (
                <div key={shade} className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-mono">{shade}</p>
                  <p className="text-xs text-muted">{color}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Role Color Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Role-Based Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['admin', 'teacher', 'student', 'parent', 'receptionist'].map((role) => (
                <div 
                  key={role}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: getRoleColor(role, 'background'),
                    borderColor: getRoleColor(role, 'primary'),
                  }}
                >
                  <h4 
                    className="font-semibold mb-2 capitalize"
                    style={{ color: getRoleColor(role, 'text') }}
                  >
                    {role}
                  </h4>
                  <div className="space-y-2">
                    <div 
                      className="h-3 rounded"
                      style={{ backgroundColor: getRoleColor(role, 'primary') }}
                    />
                    <div 
                      className="h-3 rounded"
                      style={{ backgroundColor: getRoleColor(role, 'secondary') }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Component Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Component Examples</h3>
            <div className="space-y-4">
              {/* Buttons */}
              <div>
                <h4 className="font-medium mb-2">Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary">Primary Button</button>
                  <button className="btn btn-secondary">Secondary Button</button>
                  <button className="btn btn-outline">Outline Button</button>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h4 className="font-medium mb-2">Cards</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card">
                    <div className="card-header">
                      <h5>Sample Card</h5>
                    </div>
                    <div className="card-body">
                      <p>This is a sample card with the current theme.</p>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header">
                      <h5>Another Card</h5>
                    </div>
                    <div className="card-body">
                      <p>Another example card to show consistency.</p>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header">
                      <h5>Third Card</h5>
                    </div>
                    <div className="card-body">
                      <p>Third card to demonstrate the theme system.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h4 className="font-medium mb-2">Alerts</h4>
                <div className="space-y-2">
                  <div className="alert alert-success">Success alert message</div>
                  <div className="alert alert-warning">Warning alert message</div>
                  <div className="alert alert-error">Error alert message</div>
                  <div className="alert alert-info">Info alert message</div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="font-medium mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">Primary</span>
                  <span className="badge badge-success">Success</span>
                  <span className="badge badge-warning">Warning</span>
                  <span className="badge badge-error">Error</span>
                  <span className="badge badge-info">Info</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Instructions */}
          <div className="card bg-secondary-bg">
            <div className="card-body">
              <h3 className="text-lg font-semibold mb-2">How to Apply Changes</h3>
              <p className="text-secondary mb-4">
                To permanently change your theme, edit the <code>src/utils/themeConfig.js</code> file:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm">
{`// Change primary color
export const colors = {
  primary: {
    500: '#your-new-color', // ← Change this
  },
  // ... other colors
};`}
                </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer; 