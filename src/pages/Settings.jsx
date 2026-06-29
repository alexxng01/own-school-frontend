import React, { useState, useEffect } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Globe,
  Palette,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { isDarkMode, toggleTheme: toggleDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('general');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    language: 'en',
    theme: isDarkMode ? 'dark' : 'light',
    autoSave: true,
    compactMode: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Update profile data when user changes
  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  }, [user]);

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && Object.keys(currentUser).length > 0) {
      setProfileData({
        name: currentUser.name || user?.name || '',
        email: currentUser.email || user?.email || '',
        phone: currentUser.phone || user?.phone || '',
        address: currentUser.address || user?.address || ''
      });
    }
  }, []);

  // Refresh user data from source when component mounts
  useEffect(() => {
    const refreshUserData = () => {
      if (!user) return;

      // Use current user data directly
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    };

    refreshUserData();
  }, [user?.id, user?.role]);

  // Update settings when theme changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: isDarkMode ? 'dark' : 'light'
    }));
  }, [isDarkMode]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Handle theme change immediately
    if (key === 'theme') {
      if (value === 'dark' && !isDarkMode) {
        toggleDarkMode();
      } else if (value === 'light' && isDarkMode) {
        toggleDarkMode();
      }
    }
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    setProfileMessage({ type: '', text: '' });

    // Validate required fields
    if (!profileData.name.trim()) {
      setProfileMessage({ type: 'error', text: 'Name is required!' });
      return;
    }

    if (!profileData.email.trim()) {
      setProfileMessage({ type: 'error', text: 'Email is required!' });
      return;
    }

    // Simple approach: Update current user directly
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone || '',
      address: profileData.address || ''
    };

    // Update current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update the user in their respective role array
    try {
      let userData;
      let userKey;

      switch (user.role) {
        case 'admin':
          userData = JSON.parse(localStorage.getItem('admins') || '[]');
          userKey = 'admins';
          break;
        case 'teacher':
          userData = JSON.parse(localStorage.getItem('teacherAccounts') || '[]');
          userKey = 'teacherAccounts';
          break;
        case 'student':
          userData = JSON.parse(localStorage.getItem('students') || '[]');
          userKey = 'students';
          break;
        case 'receptionist':
          userData = JSON.parse(localStorage.getItem('receptionists') || '[]');
          userKey = 'receptionists';
          break;
        case 'parent':
          userData = JSON.parse(localStorage.getItem('parentAccounts') || '[]');
          userKey = 'parentAccounts';
          break;
        default:
          // If role is not recognized, just update current user
          setIsEditingProfile(false);
          setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
          setTimeout(() => setProfileMessage({ type: '', text: '' }), 3000);
          return;
      }

      // Try to find and update user in the array
      const userId = user.id || user.studentId;
      const username = user.username;
      const email = user.email;

      let found = false;

      // Try multiple ways to find the user
      for (let i = 0; i < userData.length; i++) {
        const u = userData[i];
        if ((u.id === userId || u.studentId === userId || u.username === username || u.email === email)) {
          userData[i] = {
            ...u,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone || '',
            address: profileData.address || ''
          };
          found = true;
          break;
        }
      }

      // If found, save the updated array
      if (found) {
        localStorage.setItem(userKey, JSON.stringify(userData));
      }

    } catch (error) {
      console.log('Could not update role-specific data, but current user was updated:', error);
    }

    setIsEditingProfile(false);
    setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setProfileMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleCancelProfile = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditingProfile(false);
    setProfileMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long!' });
      return;
    }

    // Get user data based on role
    let userData;
    let userKey;

    switch (user.role) {
      case 'admin':
        userData = JSON.parse(localStorage.getItem('admins') || '[]');
        userKey = 'admins';
        break;
      case 'teacher':
        userData = JSON.parse(localStorage.getItem('teacherAccounts') || '[]');
        userKey = 'teacherAccounts';
        break;
      case 'student':
        userData = JSON.parse(localStorage.getItem('students') || '[]');
        userKey = 'students';
        break;
      case 'receptionist':
        userData = JSON.parse(localStorage.getItem('receptionists') || '[]');
        userKey = 'receptionists';
        break;
      case 'parent':
        userData = JSON.parse(localStorage.getItem('parentAccounts') || '[]');
        userKey = 'parentAccounts';
        break;
      default:
        setPasswordMessage({ type: 'error', text: 'Invalid user role!' });
        return;
    }

    // Find user and verify current password
    const userId = user.id || user.studentId;
    const userIndex = userData.findIndex(u => (u.id === userId || u.studentId === userId));

    if (userIndex === -1) {
      setPasswordMessage({ type: 'error', text: 'User not found!' });
      return;
    }

    if (userData[userIndex].password !== passwordData.currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Current password is incorrect!' });
      return;
    }

    // Update password
    userData[userIndex].password = passwordData.newPassword;
    localStorage.setItem(userKey, JSON.stringify(userData));

    // Update current user
    const updatedUser = { ...user, password: passwordData.newPassword };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Clear form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setPasswordMessage({ type: '', text: '' });
    }, 3000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Settings</h1>
          <p className="text-lg text-white/90 font-medium">Manage your account preferences and security settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      {section.icon}
                      <span>{section.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your basic account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Account Information</h3>
                      {!isEditingProfile ? (
                        <Button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-sm"
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            className="text-sm bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancelProfile}
                            className="text-sm bg-gray-600 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    {profileMessage.text && (
                      <div className={`mb-4 p-3 rounded-md text-sm font-medium ${profileMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {profileMessage.text}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditingProfile
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditingProfile
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          disabled={!isEditingProfile}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditingProfile
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <input
                          type="text"
                          value={user?.role || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        disabled={!isEditingProfile}
                        rows="3"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditingProfile
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Auto Save</label>
                          <p className="text-sm text-gray-500">Automatically save your work</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Compact Mode</label>
                          <p className="text-sm text-gray-500">Use compact layout</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.compactMode}
                          onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Push Notifications</label>
                        <p className="text-sm text-gray-500">Receive notifications in the browser</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Sound Effects</label>
                        <p className="text-sm text-gray-500">Play sound for notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Change Password
                      </Button>
                    </form>
                    {passwordMessage.text && (
                      <div className={`mt-4 p-3 rounded-md text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {passwordMessage.text}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Choose your preferred theme</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Choose your preferred language</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="mt-6">
              <Button onClick={handleSaveSettings} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}