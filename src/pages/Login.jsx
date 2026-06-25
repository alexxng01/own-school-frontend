import React, { createContext, useContext, useState, useEffect } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useAccounts } from '../context/AuthContext';
import { Eye, EyeOff, GraduationCap, AlertCircle, Users, BookOpen, Calendar, Award, Shield, Clock, Star, Edit } from 'lucide-react';
import { teacherAccounts } from '../data/teacherAccounts';
import { studentAccounts } from '../data/studentAccounts';
import { parentAccounts } from '../data/parentAccounts';

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [receptionists, setReceptionists] = useState(() => {
    const stored = localStorage.getItem('receptionists');
    return stored ? JSON.parse(stored) : [];
  });
  const [teacherAccounts, setTeacherAccounts] = useState(() => {
    const stored = localStorage.getItem('teacherAccounts');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('receptionists', JSON.stringify(receptionists));
  }, [receptionists]);
  useEffect(() => {
    localStorage.setItem('teacherAccounts', JSON.stringify(teacherAccounts));
  }, [teacherAccounts]);

  return (
    <AccountsContext.Provider value={{ receptionists, setReceptionists, teacherAccounts, setTeacherAccounts }}>
      {children}
    </AccountsContext.Provider>
  );
};

const Login = ({ onClose }) => {
  // Remove role and loginId state
  // const [role, setRole] = useState('');
  // const [loginId, setLoginId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isUserExists, users, getAllStudents } = useAuth();
  const { receptionists, teacherAccounts } = useAccounts();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const admins = JSON.parse(localStorage.getItem('admins'));
    setShowSignup(!admins || admins.length === 0);
  }, []);

  // Helper functions to get accounts
  // const getTeacherAccounts = () => {
  //   const stored = localStorage.getItem('teacherAccounts');
  //   return stored ? JSON.parse(stored) : [];
  // };
  // const getReceptionists = () => {
  //   const stored = localStorage.getItem('receptionists');
  //   return stored ? JSON.parse(stored) : [];
  // };

  // Use teacherAccounts to render the Teacher Accounts table
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!username.trim() || !password.trim()) {
        setError('Username/email and password are required.');
        setIsLoading(false);
        return;
      }
      const user = await login(username.trim(), password.trim());
      console.log('Login successful, user:', user);
      if (user) {
        console.log('User role:', user.role);
        if (user.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else if (user.role === 'teacher') {
          console.log('Redirecting to teacher dashboard');
          navigate('/teacher');
        } else if (user.role === 'receptionist') {
          console.log('Redirecting to receptionist dashboard');
          navigate('/receptionist');
        } else if (user.role === 'student') {
          console.log('Redirecting to student dashboard');
          navigate('/student');
        } else if (user.role === 'parent') {
          console.log('Redirecting to parent dashboard');
          navigate('/parent');
        } else if (user.role === 'manager') {
          console.log('Redirecting to manager dashboard');
          navigate('/manage');
        } else {
          console.log('Unknown role, redirecting to home');
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const features = [
    { icon: Users, title: 'Student Management', description: 'Complete student lifecycle management' },
    { icon: BookOpen, title: 'Academic Portal', description: 'Assignments, grades, and progress tracking' },
    { icon: Calendar, title: 'Smart Scheduling', description: 'Automated class and event scheduling' },
    { icon: Award, title: 'Performance Analytics', description: 'Advanced reporting and insights' },
    { icon: Shield, title: 'Secure Access', description: 'Role-based security and permissions' },
    { icon: Clock, title: 'Real-time Updates', description: 'Live attendance and notifications' }
  ];

  const testimonials = [
    { name: 'Dr. Sarah Johnson', role: 'Principal', content: 'Brinay School has transformed our administrative efficiency by 300%.' },
    { name: 'Mr. David Chen', role: 'Teacher', content: 'The intuitive interface makes managing my classes effortless.' },
    { name: 'Mrs. Emily Rodriguez', role: 'Parent', content: 'I can track my child\'s progress in real-time. Amazing!' }
  ];

  // Define a common input className for all fields
  const inputClassName = "w-full 2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm";

  // Add cross button handler
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Section - Welcome & Features */}
          <div className="text-white space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    R.P.M.School
                  </h1>
                  <p className="text-xl text-blue-200">Management System</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">
                  Welcome to the Future of 
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                    Education Management
                  </span>
                </h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Experience the next generation of school management with our comprehensive 
                  platform designed for modern educational institutions.
                </p>
              </div>
            </div>

            {/* Features Grid */}
           

            
           
          </div>

          {/* Right Section - Login Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl relative">
                {/* Cross Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none z-20"
                  aria-label="Close Login"
                >
                  &times;
                </button>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-blue-200">Sign in to your account to continue</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-white">Username or Email</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className={inputClassName + " text-white"}
                      required
                      style={{ padding: '0 10px', borderRadius: '6px' }}
                    />
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={inputClassName + " text-white"}
                      required
                      style={{ padding: '0 10px', borderRadius: '6px' }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-9 transform -translate-y-1/2 text-blue-300 hover:text-blue-500 focus:outline-none"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200">
                      <AlertCircle className="h-5 w-5" />
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    {isLoading ? 'Signing In...' : 'Login'}
                  </button>
        </form>
        {showSignup && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        )}

                {/* Signup link: only show if role is admin */}
                {/* The role dropdown and ID field are removed, so this section is no longer relevant */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 