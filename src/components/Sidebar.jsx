import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Settings, 
  User,
  FileText,
  TrendingUp,
  Bell,
  Plus,
  Search,
  Clock,
  Award,
  MessageSquare,
  BarChart3,
  Shield,
  HelpCircle,
  LogOut,
  Palette,
  Download,
  FolderOpen
} from 'lucide-react';

const Sidebar = ({ isOpen = true, onToggle, onTabChange, activeTab }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [quickActions] = useState([
    {
      id: 'add-student',
      label: 'Add Student',
      icon: <Plus className="w-4 h-4" />,
      action: () => console.log('Add Student clicked'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'quick-search',
      label: 'Quick Search',
      icon: <Search className="w-4 h-4" />,
      action: () => console.log('Quick Search clicked'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'attendance',
      label: 'Mark Attendance',
      icon: <Clock className="w-4 h-4" />,
      action: () => console.log('Mark Attendance clicked'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      action: () => console.log('Notifications clicked'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]);

  const getNavigationItems = () => {
    // Check if we're on a dashboard page or a standalone page
    const isOnDashboard = location.pathname.includes('/admin') || 
                         location.pathname.includes('/receptionist') || 
                         location.pathname.includes('/student') || 
                         location.pathname.includes('/parent') || 
                         location.pathname.includes('/teacher');
    const isOnManageDashboard = location.pathname.startsWith('/manage');

    let baseItems = [];

    if (isOnManageDashboard) {
      baseItems = [
        { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, type: 'tab' },
        { id: 'classes', label: 'Class Management', icon: <BookOpen className="w-5 h-5" />, type: 'tab' },
        { id: 'schedule', label: 'Schedule Management', icon: <Calendar className="w-5 h-5" />, type: 'tab' },
        { id: 'results', label: 'Result Management', icon: <Award className="w-5 h-5" />, type: 'tab' },
        { id: 'students', label: 'Student Management', icon: <Users className="w-5 h-5" />, type: 'tab' },
        { id: 'sections', label: 'Section Management', icon: <FolderOpen className="w-5 h-5" />, type: 'tab' },
      ];
    } else if (user?.role === 'receptionist' || user?.role === 'reception') {
      baseItems = [
        { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" />, type: 'tab' },
        { id: 'students', label: 'Students', icon: <GraduationCap className="w-5 h-5" />, type: 'tab' },
        { id: 'teachers', label: 'Teachers', icon: <Users className="w-5 h-5" />, type: 'tab' },
        { id: 'classes', label: 'Classes', icon: <BookOpen className="w-5 h-5" />, type: 'tab' },
        { id: 'schedule', label: 'Class Schedule', icon: <Calendar className="w-5 h-5" />, type: 'tab' },
        { id: 'attendance', label: 'Attendance', icon: <Clock className="w-5 h-5" />, type: 'tab' },
        { id: 'search', label: 'Student Search', icon: <Search className="w-5 h-5" />, type: 'tab' },
        { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" />, type: 'tab' },
      ];
    } else {
      // For other roles, use dynamic navigation
      baseItems = [
        { 
          id: 'overview', 
          label: 'Overview', 
          icon: <Home className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'students', 
          label: 'Students', 
          icon: <GraduationCap className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'teachers', 
          label: 'Teachers', 
          icon: <Users className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'classes', 
          label: 'Classes', 
          icon: <BookOpen className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'results', 
          label: 'All Results', 
          icon: <Award className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'attendance', 
          label: 'Attendance', 
          icon: <Calendar className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'receipts', 
          label: 'Fee Receipts', 
          icon: <FileText className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
        { 
          id: 'calendar', 
          label: 'Calendar', 
          icon: <Calendar className="w-5 h-5" />, 
          type: isOnDashboard ? 'tab' : 'route',
          path: isOnDashboard ? null : `/${user?.role || 'admin'}`
        },
      ];
      // Add role-specific items
      if (user?.role === 'admin') {
        baseItems.push(
          { path: '/admin/announcements', label: 'Announcements', icon: <Bell className="w-5 h-5" />, type: 'route' },
          // { path: '/manage', label: 'Manage Dashboard', icon: <Settings className="w-5 h-5" />, type: 'route' },
          { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, type: 'route' },
          { path: '/security', label: 'Security', icon: <Shield className="w-5 h-5" />, type: 'route' },
          { path: '/admin/theme', label: 'Customize Theme', icon: <Palette className="w-5 h-5" />, type: 'route' }
        );
      }
      if (user?.role === 'teacher') {
        baseItems.push(
          // { path: '/manage', label: 'Manage Dashboard', icon: <Settings className="w-5 h-5" />, type: 'route' },
          { path: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, type: 'route' },
          { path: '/security', label: 'Security', icon: <Shield className="w-5 h-5" />, type: 'route' }
        );
      }
      if (user?.role === 'teacher') {
        baseItems.push(
          { path: '/assignments', label: 'Assignments', icon: <FileText className="w-5 h-5" />, type: 'route' },
          { path: '/grades', label: 'Grades', icon: <TrendingUp className="w-5 h-5" />, type: 'route' }
        );
      }
      if (user?.role === 'student') {
        baseItems.push(
          { path: '/assignments', label: 'Assignments', icon: <FileText className="w-5 h-5" />, type: 'route' },
          { path: '/grades', label: 'My Grades', icon: <TrendingUp className="w-5 h-5" />, type: 'route' }
        );
      }
      if (user?.role === 'parent') {
        baseItems.push(
          { path: '/children', label: 'My Children', icon: <Users className="w-5 h-5" />, type: 'route' },
          { path: '/payments', label: 'Payments', icon: <FileText className="w-5 h-5" />, type: 'route' }
        );
      }
    }
    return baseItems;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 flex flex-col ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <Logo size={32} showText={true} />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-4 h-4 flex flex-col justify-center items-center">
              <div className="w-4 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
            </div>
          </button>
        </div>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {(() => {
                const userId = user?.id || user?.studentId;
                const profileImage = userId ? getProfileImage(userId) : null;
                
                if (profileImage && isValidImageData(profileImage)) {
                  return (
                    <img
                      src={profileImage}
                      alt={`${user?.name || 'User'} Profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  );
                }
                return <User className="w-5 h-5 text-white" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name || user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <nav className="p-4">
          <ul className="space-y-1">
            {getNavigationItems().map((item) => (
              <li key={item.id || item.path}>
                {item.type === 'tab' ? (
                  <button
                    onClick={() => {
                      console.log('Sidebar tab clicked:', item.id);
                      onTabChange && onTabChange(item.id);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </button>
                ) : (
                  <Link
                    to={item.path || item.id}
                    onClick={() => {
                      // Hide sidebar on mobile when navigating
                      if (window.innerWidth < 768 && onToggle) {
                        onToggle();
                      }
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === (item.path || item.id)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Quick Actions */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg transition-colors duration-500 border shadow-md max-h-40 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-500">Quick Actions</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-500">Common administrative tasks</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Add Student clicked');
                    if (window.addStudentModal) {
                      window.addStudentModal();
                    }
                  }}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Add Student</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Add Teacher clicked');
                    if (window.addTeacherModal) {
                      window.addTeacherModal();
                    }
                  }}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-xs">Add Teacher</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Create Class clicked');
                    if (window.addClassModal) {
                      window.addClassModal();
                    }
                  }}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">Create Class</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Schedule Event clicked');
                    if (window.scheduleEventModal) {
                      window.scheduleEventModal();
                    }
                  }}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Schedule Event</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Export Data clicked');
                    if (window.exportData) {
                      window.exportData();
                    }
                  }}
                >
                  <Download className="h-5 w-5" />
                  <span className="text-xs">Export Data</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Create Files clicked');
                    if (window.createFiles) {
                      window.createFiles();
                    }
                  }}
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Create Files</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Add Receptionist clicked');
                    if (window.addReceptionistModal) {
                      window.addReceptionistModal();
                    }
                  }}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Add Receptionist</span>
                </button>
                <button 
                  className="w-full px-3 py-3 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    console.log('Add Manager clicked');
                    if (window.addManagerModal) {
                      window.addManagerModal();
                    }
                  }}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Add Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="space-y-2">
          {isOpen && (
            <Link
              to="/help"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 