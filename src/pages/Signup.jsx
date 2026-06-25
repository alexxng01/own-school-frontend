import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, GraduationCap, AlertCircle, Users, BookOpen, Calendar, Award, Shield, Clock, Star, ArrowRight, Zap, Globe, Lock } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, getAllStudents } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.role) {
      throw new Error('Please select a role.');
    }
    if (formData.role === 'student' || formData.role === 'parent') {
      // Student ID is no longer required for authentication, but can be a profile field
      // if (formData.studentId.trim()) {
      //   throw new Error('Student ID is required.');
      // }
      if (!formData.email.trim()) {
        throw new Error('Email is required for student signup.');
      }
    } else {
      if (!formData.username.trim()) {
        throw new Error('Username is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
    }
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      validateForm();
      if (formData.role === 'student') {
        const students = getAllStudents();
        const existingStudent = students.find(student => student.studentId === formData.studentId);
        if (!existingStudent) {
          throw new Error('Student ID not found. Please check your Student ID or contact admin.');
        }
        if (existingStudent.email !== formData.email) {
          throw new Error('Email does not match the Student ID.');
        }
        // Set user profile info from student record
        const newUser = signup(
          formData.studentId,
          formData.email,
          formData.password,
          formData.role,
          formData.studentId,
          {
            name: existingStudent.name,
            class: existingStudent.class,
            rollNumber: existingStudent.rollNumber
          }
        );
        navigate(`/${newUser.role}`);
        return;
      }
      if (formData.role === 'student' || formData.role === 'parent') {
        const students = getAllStudents();
        const existingStudent = students.find(student => student.studentId === formData.studentId);
        if (!existingStudent) {
          throw new Error('Student ID not found. Please check your Student ID or contact admin.');
        }
        if (formData.role === 'student' && existingStudent.email !== formData.email) {
          throw new Error('Email does not match the Student ID.');
        }
      }
      // Create new user
      const newUser = signup(
        formData.role === 'student' || formData.role === 'parent' ? formData.studentId : formData.username,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'student' || formData.role === 'parent' ? formData.studentId : null,
        formData.role === 'admin' ? {
          name: formData.name || formData.username, // Use provided name or username as fallback
          phone: '+977123456789', // Default phone
          address: 'School Administration Office' // Default address
        } : {}
      );
      navigate(`/${newUser.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const benefits = [
    { icon: Zap, title: 'Instant Access', description: 'Get started immediately with your account' },
    { icon: Globe, title: 'Global Platform', description: 'Access from anywhere, anytime' },
    { icon: Lock, title: 'Secure & Private', description: 'Your data is protected with encryption' },
    { icon: Users, title: 'Community', description: 'Join thousands of educators and students' }
  ];

  const features = [
    { icon: BookOpen, title: 'Academic Excellence', description: 'Track progress and achievements' },
    { icon: Calendar, title: 'Smart Scheduling', description: 'Automated class and event management' },
    { icon: Award, title: 'Performance Analytics', description: 'Advanced reporting and insights' },
    { icon: Shield, title: 'Role-based Access', description: 'Secure permissions for different roles' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Admin', content: 'Managing the school system has never been easier!' },
    { name: 'Mike Wilson', role: 'Reception', content: 'Student registration and management is so streamlined.' },
    { name: 'Lisa Anderson', role: 'Admin', content: 'The platform provides excellent administrative control.' }
  ];

  // In the roles array, mark teacher and reception as disabled for signup
  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'reception', label: 'Reception', description: 'Front desk access', disabled: true },
    { value: 'student', label: 'Student', description: 'Student access' },
    { value: 'parent', label: 'Parent', description: 'Parent access' },
    { value: 'teacher', label: 'Teacher', description: 'Teacher access', disabled: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Welcome & Benefits */}
          <div className="text-white space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /20 backdrop-blur-sm rounded-2xl p-4">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    Brinay School
                  </h1>
                  <p className="text-xl text-green-200">Join Our Community</p>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight">
                  Start Your Journey with
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                    Brinay School
                  </span>
                </h2>
                <p className="text-lg text-green-100 leading-relaxed">
                  Join thousands of students, teachers, and administrators who trust 
                  our platform for their educational needs.
                </p>
              </div>
            </div>
            {/* Benefits Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Why Choose Brinay School?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white dark:bg-gray-800 text-gray-900 dark:text-white /20 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /20 rounded-lg p-2">
                          <Icon className="h-5 w-5 text-green-200" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{benefit.title}</h3>
                          <p className="text-xs text-green-200">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Platform Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /20 rounded-lg p-2">
                          <Icon className="h-5 w-5 text-blue-200" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{feature.title}</h3>
                          <p className="text-xs text-blue-200">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-200">1000+</div>
                <div className="text-xs text-green-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-200">99.9%</div>
                <div className="text-xs text-green-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-200">24/7</div>
                <div className="text-xs text-green-300">Support</div>
              </div>
            </div>
          </div>
          {/* Right Section - Signup Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-blue-200 mb-2">Select Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    required
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="teacher" disabled>Teacher (get account from Reception)</option>
                    <option value="reception" disabled>Receptionist (get account from Admin)</option>
                    <option value="student" disabled>Student (get account from Reception)</option>
                    <option value="parent" disabled>Parent (get account from Reception)</option>
                  </select>
                </div>
                {role !== 'admin' ? (
                  <div className="text-red-500 text-center text-lg font-semibold">
                    Signup is only available for admin accounts.
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                      <p className="text-green-200">Join our educational community today</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      {formData.role === 'admin' && (
                        <div>
                          <label className="block text-sm font-medium text-green-200 mb-2">
                            Full Name
                          </label>
                          <input 
                            type="text" 
                            name="name"
                            placeholder="Enter your full name" 
                            className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                            value={formData.name || ''} 
                            onChange={handleChange}
                            required
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Username
                        </label>
                        <input 
                          type="text" 
                          name="username"
                          placeholder="Enter username" 
                          className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                          value={formData.username} 
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Email
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          placeholder="Enter your email" 
                          className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                          value={formData.email} 
                          onChange={handleChange}
                          required={formData.role !== 'parent'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Role
                        </label>
                        <select 
                          name="role"
                          value={formData.role} 
                          onChange={handleChange}
                          className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                          required
                        >
                          {roles.map(role => (
                            <option key={role.value} value={role.value} disabled={role.disabled}>{role.label}{role.disabled ? ' (ask admin)' : ''}</option>
                          ))}
                        </select>
                      </div>
                      {/* Student ID field for student and parent roles */}
                      {(formData.role === 'student' || formData.role === 'parent') && (
                        <div className="mb-4">
                          <label htmlFor="studentId" className="block text-sm font-medium text-green-700 mb-2">
                            Student ID
                          </label>
                          <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            className="w-full p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-green-300 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                            placeholder="Enter your Student ID (provided by admin)"
                            // required // Removed required attribute
                          />
                          <p className="text-xs text-green-500 mt-1">
                            Enter the Student ID that was assigned to you by the admin/reception
                          </p>
                        </div>
                      )}
                      {/* Show a message if the user selects teacher or reception (if you want to keep the options visible but disabled) */}
                      {(formData.role === 'teacher' || formData.role === 'reception') && (
                        <div className="text-red-500 text-sm mb-4">
                          {formData.role === 'teacher' && 'Teachers must get their account from the Reception Desk and log in using their assigned ID and password on the Teacher Dashboard.'}
                          {formData.role === 'receptionist' && 'Receptionists must get their account from the Admin and log in using their assigned ID and password on the Reception Dashboard.'}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password (min 6 characters)" 
                            className="w-full p-4 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                            value={formData.password} 
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-200 hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-green-200 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password" 
                            className="w-full p-4 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /10 border border-white/20 rounded-xl text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-200 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200">
                          <AlertCircle className="h-5 w-5" />
                          {error}
                        </div>
                      )}
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                        {!isLoading && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-green-200">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-semibold hover:underline">
                          Login here
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 