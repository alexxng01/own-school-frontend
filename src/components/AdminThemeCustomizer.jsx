import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';
import { Shield, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminThemeCustomizer = () => {
  const { user } = useAuth();
  const { colors, getRoleColor, toggleTheme, isDarkMode } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="w-full p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Only administrators can customize themes.
          </p>
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>Current Role:</strong> {user?.role || 'Guest'}
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              <strong>Required Role:</strong> Admin
            </p>
          </div>
          <Link 
            to="/admin" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
    const preset = themePresets[presetKey];
    setCustomColors(prev => ({
      ...prev,
      primary: preset.primary,
      secondary: preset.secondary,
    }));
  };

  const handleColorChange = (colorType, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value,
    }));
  };

  const handleSaveTheme = () => {
    // In a real implementation, this would save to backend/database
    console.log('Saving theme:', customColors);
    alert('Theme saved successfully! (This would save to database in production)');
  };

  const generateThemeCode = () => {
    return `// Generated theme code for src/utils/themeConfig.js
export const colors = {
  primary: {
    50: '${customColors.primary}20',
    100: '${customColors.primary}30',
    200: '${customColors.primary}50',
    300: '${customColors.primary}70',
    400: '${customColors.primary}90',
    500: '${customColors.primary}',
    600: '${customColors.primary}',
    700: '${customColors.primary}',
    800: '${customColors.primary}',
    900: '${customColors.primary}',
  },
  secondary: {
    500: '${customColors.secondary}',
  },
  success: {
    500: '${customColors.success}',
  },
  warning: {
    500: '${customColors.warning}',
  },
  error: {
    500: '${customColors.error}',
  },
};`;
  };

  return (
    <div className="p-6 space-y-6 w-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Theme Customizer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Customize your school's theme colors and appearance</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Theme Presets */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Theme Presets</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose from pre-designed themes or create your own</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(themePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 text-left
                      ${selectedPreset === key 
                        ? 'border-purple-500 shadow-lg scale-105 bg-purple-50 dark:bg-purple-900/30' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{preset.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 mt-6">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Custom Colors</h2>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(customColors).map(([colorType, colorValue]) => (
                  <div key={colorType} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {colorType} Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        style={{ backgroundColor: colorValue }}
                        title={colorValue}
                      />
                      <input
                        type="color"
                        value={colorValue}
                        onChange={(e) => handleColorChange(colorType, e.target.value)}
                        className="flex-1 h-10 border border-gray-300 dark:border-gray-600 rounded px-3 text-sm dark:bg-gray-700 dark:text-white cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{colorValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code */}
          {showAdvanced && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 mt-6">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Theme Code</h2>
                <p className="text-gray-600 dark:text-gray-400">Copy this code to src/utils/themeConfig.js</p>
              </div>
              
              <div className="p-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm dark:bg-black">
                  <code>{generateThemeCode()}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Theme Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Preview</h2>
              <p className="text-gray-600 dark:text-gray-400">See how your theme looks</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Color Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Colors</h3>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                    <div key={shade} className="text-center">
                      <div 
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 mx-auto mb-1"
                        style={{ 
                          backgroundColor: customColors.primary,
                          opacity: 1 - (shade - 50) / 900
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{shade}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Component Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Components</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full px-4 py-2 rounded text-white text-sm font-medium hover:shadow-md transition-all"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="w-full px-4 py-2 rounded text-white text-sm font-medium hover:shadow-md transition-all"
                    style={{ backgroundColor: customColors.secondary }}
                  >
                    Secondary Button
                  </button>
                  <div 
                    className="p-3 rounded border"
                    style={{ 
                      backgroundColor: customColors.primary + '15',
                      borderColor: customColors.primary + '50'
                    }}
                  >
                    <p className="text-sm font-medium" style={{ color: customColors.primary }}>
                      Sample card with primary color
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Controls</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage theme settings</p>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: isDarkMode ? customColors.primary : '#d1d5db' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Save Theme */}
              <button
                onClick={handleSaveTheme}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                style={{ backgroundColor: customColors.primary }}
              >
                <Save className="w-4 h-4" />
                <span>Save Theme</span>
              </button>

              {/* Reset Theme */}
              <button
                onClick={() => handlePresetChange('default')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Role Colors Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Role Colors</h2>
              <p className="text-gray-600 dark:text-gray-400">Current role-based colors</p>
            </div>
            
            <div className="p-6 space-y-3">
              {['admin', 'teacher', 'student', 'parent', 'receptionist'].map((role) => (
                <div 
                  key={role}
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: getRoleColor(role, 'background'),
                    borderColor: getRoleColor(role, 'primary'),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-medium capitalize"
                      style={{ color: getRoleColor(role, 'text') }}
                    >
                      {role}
                    </span>
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: getRoleColor(role, 'primary') }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminThemeCustomizer; 