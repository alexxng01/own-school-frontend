import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import ThemeSwitcher from './ThemeSwitcher';
import { User, Menu, X, Settings, Moon, Sun, Bell, Globe, Palette, Shield, HelpCircle, LogOut, User as UserIcon } from 'lucide-react';
import Logo from './Logo';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    sound: true,
    autoSave: true,
    compactMode: false
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingsOptions = [
    {
      id: 'language',
      label: 'Language',
      type: 'select',
     
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'fr', label: 'Français' },
        { value: 'de', label: 'Deutsch' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      type: 'toggle'
    },
    {
      id: 'sound',
      label: 'Sound Effects',
      type: 'toggle'
    },
    {
      id: 'autoSave',
      label: 'Auto Save',
      type: 'toggle'
    },
    {
      id: 'compactMode',
      label: 'Compact Mode',
      type: 'toggle'
    }
  ];

  // Function to get avatar image based on profileImage, localStorage, or role
  const getAvatar = () => {
    if (!user) return '/img/default-avatar.png';
    
    // First check if user has a valid profile image
    if (user.profileImage && isValidImageData(user.profileImage)) return user.profileImage;
    
    // Then check localStorage for profile image
    const storedImage = getProfileImage(user.id || user.studentId);
    if (storedImage) return storedImage;
    
    // Fallback to role-based avatars
    if (user.role === 'admin') return '/img/admin-avatar.png';
    if (user.role === 'receptionist') return '/img/reception-avatar.png';
    if (user.role === 'teacher') return '/img/teacher-avatar.png';
    if (user.role === 'student') return '/img/student-avatar.png';
    if (user.role === 'parent') return '/img/parent-avatar.png';
    
    return '/img/default-avatar.png';
  };

  // Debug log
  // console.log('user:', user, 'avatar:', getAvatar());

  return (
    <>
      <nav className="w-full px-6 py-4 flex items-center justify-between shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-white  transition-colors duration-300">
        <Logo />
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin Dashboard</Link>}
              {user.role === 'receptionist' && <Link to="/reception" className="hover:underline">Reception Dashboard</Link>}
              {user.role === 'student' && <Link to="/student" className="hover:underline">Student Dashboard</Link>}
              {user.role === 'parent' && <Link to="/parent" className="hover:underline">Parent Dashboard</Link>}
              {user.role === 'teacher' && <Link to="/teacher" className="hover:underline">Teacher Dashboard</Link>}
              
       
              
            
             <div className="relative group">
  {/* Circular Button */}
  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center 
                 hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer">
     {(() => {
                        const avatarSrc = getAvatar();
                        const isValidImage = isValidImageData(avatarSrc) || avatarSrc.startsWith('/img/');
                        return isValidImage ? (
                          <img
                            className="h-5 w-5 text-white"
                            src={avatarSrc}
                            alt={user?.username || 'User'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '100%' }}
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null;
                      })()}
                      <div
                        className="flex items-center justify-center w-full h-full"
                        style={{ 
                          display: (() => {
                            const avatarSrc = getAvatar();
                            const isValidImage = isValidImageData(avatarSrc) || avatarSrc.startsWith('/img/');
                            return isValidImage ? 'none' : 'flex';
                          })()
                        }}
                      >
                        <User className="h-4 w-4 text-white" />
                      </div>
  </div>

  {/* Dropdown Menu (appears on hover) */}
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 
                 invisible group-hover:visible transition-all duration-200 origin-top-right">
                   
    <button
      onClick={toggleSettings}
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
    >
      Settings
    </button>
    <button 
      onClick={handleLogout}
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
    >
      Logout
    </button>
  </div>
</div>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <button
              onClick={toggleSettings}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-blue-700 border-t border-blue-600 md:hidden z-50">
            <div className="p-4 space-y-4">
              {!user ? (
                <>
                  <Link to="/login" className="block hover:bg-blue-600 p-2 rounded">Login</Link>
                  <Link to="/signup" className="block hover:bg-blue-600 p-2 rounded">Signup</Link>
                </>
              ) : (
                <>
                  {user.role === 'admin' && <Link to="/admin" className="block hover:bg-blue-600 p-2 rounded">Admin Dashboard</Link>}
                  {user.role === 'receptionist' && <Link to="/reception" className="block hover:bg-blue-600 p-2 rounded">Reception Dashboard</Link>}
                  {user.role === 'student' && <Link to="/student" className="block hover:bg-blue-600 p-2 rounded">Student Dashboard</Link>}
                  {user.role === 'parent' && <Link to="/parent" className="block hover:bg-blue-600 p-2 rounded">Parent Dashboard</Link>}
                  {user.role === 'teacher' && <Link to="/teacher" className="block hover:bg-blue-600 p-2 rounded">Teacher Dashboard</Link>}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-blue-600 p-2 rounded">
                    <UserIcon className="h-4 w-4" />
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left hover:bg-blue-600 p-2 rounded">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /70 dark:bg-gray-900/70">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            {/* Settings Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              </div>
              <div className="flex items-center gap-2">
                       {/* Theme Switcher */}
              <ThemeSwitcher size="sm" />
                
                <button
                  onClick={toggleSettings}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Settings Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              {user && (
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ">
                      
                      <img
                        className="h-5 w-5 text-white"
                        src={getAvatar()}
                        alt={user?.username || 'User'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '100%' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                    <div >
                      <p className="font-semibold ">{user.username}</p>
                      <p className="text-sm  capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Settings Options */}
              <div className="space-y-4">
                {settingsOptions.map((option) => (
                  <div key={option.id} className="flex bg-white dark:bg-gray-800 text-gray-900 dark:text-white items-center justify-between p-3  rounded-lg">
                    <div className="flex items-center gap-3 ">
                      {option.id === 'language' && <Globe className="h-4 w-4  " />}
                      {option.id === 'notifications' && <Bell className="h-4 w-4 " />}
                      {option.id === 'sound' && <Bell className="h-4 w-4 " />}
                      {option.id === 'autoSave' && <Shield className="h-4 w-4 " />}
                      {option.id === 'compactMode' && <Settings className="h-4 w-4 " />}
                      <span className="">{option.label}</span>
                    </div>
                    {option.type === 'toggle' ? (
                      <button
                        onClick={() => handleSettingChange(option.id, !settings[option.id])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[option.id] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white  transition-transform ${
                            settings[option.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : option.type === 'select' ? (
                      <select
                        value={settings[option.id]}
                        onChange={(e) => handleSettingChange(option.id, e.target.value)}
                        className="px-3 py-1 bg-white dark:bg-black-800 text-gray-900 dark:text-black  border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {option.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
              </div>
              {/* Additional Options */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <HelpCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Help & Support</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Privacy & Security</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">About Brinay School</span>
                </button>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 rounded-b-lg">
                <button
                  onClick={() => {
                    // Reset settings to default
                    setSettings({
                      language: 'en',
                      notifications: true,
                      sound: true,
                      autoSave: true,
                      compactMode: false
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={toggleSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 