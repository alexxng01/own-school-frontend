import React, { useState } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import {
  Users,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  MessageSquare,
  TrendingUp,
  Award,
  Mail,
  Plus,
  X
} from 'lucide-react';

import { useAccounts, useAuth } from '../context/AuthContext';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import '../styles/animatedProfile.css';

export function TeacherDashboard() {
  console.log("TeacherDashboard rendered");
  const { teacherAccounts, setTeacherAccounts } = useAccounts();
  const { login, students } = useAuth();
  const [teacherId, setTeacherId] = useState('');
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [showTeacherLoginPrompt, setShowTeacherLoginPrompt] = useState(true);
  const [teacherLoginError, setTeacherLoginError] = useState('');
  const [isEditTeacherAccountModalOpen, setIsEditTeacherAccountModalOpen] = useState(false);
  const [editTeacherAccountData, setEditTeacherAccountData] = useState(null);
  // Remove local darkMode state and toggle button

  // Dummy data for dashboard sections
  const todaySchedule = [
    { time: "08:00 - 09:00", subject: "Mathematics", class: "Grade 10A", room: "Room 201", students: 30 },
    { time: "09:15 - 10:15", subject: "Algebra", class: "Grade 11B", room: "Room 201", students: 25 },
    { time: "11:00 - 12:00", subject: "Calculus", class: "Grade 12A", room: "Room 201", students: 20 },
    { time: "13:30 - 14:30", subject: "Mathematics", class: "Grade 9C", room: "Room 201", students: 28 }
  ];
  const recentAssignments = [
    { id: 1, title: "Quadratic Equations Worksheet", class: "Grade 10A", submitted: 28, total: 30, dueDate: "Today", status: "pending" },
    { id: 2, title: "Algebra Problem Set", class: "Grade 11B", submitted: 22, total: 25, dueDate: "Yesterday", status: "completed" },
    { id: 3, title: "Calculus Project", class: "Grade 12A", submitted: 15, total: 20, dueDate: "Tomorrow", status: "in-progress" },
    { id: 4, title: "Geometry Quiz", class: "Grade 9C", submitted: 25, total: 28, dueDate: "Next Week", status: "pending" }
  ];
  const pendingTasks = [
    { task: "Grade Quiz Papers", urgency: "high", count: 45, due: "Today" },
    { task: "Update Lesson Plans", urgency: "medium", count: 3, due: "This Week" },
    { task: "Parent Meeting Prep", urgency: "low", count: 2, due: "Next Week" },
    { task: "Exam Preparation", urgency: "high", count: 1, due: "Tomorrow" }
  ];
  const recentMessages = [
    { from: "Parent - John Smith", subject: "Student Progress Query", time: "2 hours ago", unread: true },
    { from: "Admin Office", subject: "Staff Meeting Reminder", time: "4 hours ago", unread: false },
    { from: "Parent - Mary Johnson", subject: "Assignment Extension Request", time: "1 day ago", unread: true }
  ];
  const upcomingEvents = [
    { date: "Tomorrow", event: "Parent-Teacher Meeting", type: "meeting" },
    { date: "Friday", event: "Math Olympiad", type: "event" },
    { date: "Next Week", event: "Staff Development Day", type: "training" },
    { date: "Next Week", event: "Exam Week", type: "exam" }
  ];
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceMarking, setAttendanceMarking] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Remove hardcoded teacherAssignments and generate options from students data
  // Ensure students in class 'A20' have subject 'All Subjects'
  const normalizedStudents = students.map(s =>
    s.class === 'A20' ? { ...s, subject: s.subject || 'All Subjects' } : s
  );
  const uniqueClasses = [...new Set(normalizedStudents.map(s => s.class).filter(Boolean))];
  const uniqueSubjects = [...new Set(normalizedStudents.map(s => s.subject).filter(Boolean))];
  const uniqueBatches = [...new Set(normalizedStudents.map(s => s.batch).filter(Boolean))];

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  // Filter students for the selected class/subject/batch
  const studentsForClass = normalizedStudents.filter(s =>
    (!selectedClass || s.class === selectedClass) &&
    (!selectedSubject || s.subject === selectedSubject) &&
    (!selectedBatch || s.batch === selectedBatch)
  );

  // Info for dashboard
  const info = teacherInfo || { name: 'Teacher', id: '', email: '', department: '', subject: '' };
  console.log('Dashboard info:', info);

  // Login handler
  const handleTeacherLogin = (e) => {
    console.log("Login form values:", {
      teacherId,
      teacherUsername,
      teacherPassword
    });
    e.preventDefault();
    setTeacherLoginError('');
    const enteredId = teacherId.trim().toLowerCase();
    const enteredUser = teacherUsername.trim().toLowerCase();
    const enteredPass = teacherPassword.trim().toLowerCase();
    console.log('teacherAccounts:', teacherAccounts);
    console.log('Login attempt:', { enteredId, enteredUser, enteredPass });
    let found = null;
    for (const t of teacherAccounts) {
      const idMatch = t.id && t.id.trim().toLowerCase() === enteredId;
      const usernameMatch = t.username && t.username.trim().toLowerCase() === enteredUser;
      const emailMatch = t.email && t.email.trim().toLowerCase() === enteredUser;
      const nameMatch = t.name && t.name.trim().toLowerCase() === enteredUser;
      const passMatch = t.password && t.password.trim().toLowerCase() === enteredPass;
      console.log('Checking:', {
        id: t.id, username: t.username, email: t.email, name: t.name, password: t.password,
        idMatch, usernameMatch, emailMatch, nameMatch, passMatch
      });
      if ((idMatch || usernameMatch || emailMatch || nameMatch) && passMatch) {
        found = t;
        break;
      }
    }
    if (found) {
      setTeacherInfo(found);
      setShowTeacherLoginPrompt(false);
      setTeacherLoginError('');
      console.log('Logged in teacher:', found);
      login(
        found.username,
        found.password,
        {
          id: found.id,
          name: found.name,
          username: found.username,
          email: found.email,
          password: found.password,
          role: 'teacher',
          department: found.department,
          subject: found.subject
        }
      );
      localStorage.setItem('teacherId', found.id.trim());
    } else {
      setTeacherLoginError('No matching teacher account found. Please check your Teacher ID, Username/Email/Name, and Password.');
    }
  };

  // Remove hardcoded classStats and generate dynamically from students
  const classPerformance = uniqueClasses.map(cls => {
    const classStudents = normalizedStudents.filter(s => s.class === cls);
    const sections = [...new Set(classStudents.map(s => s.section || '1'))];
    const studentsCount = classStudents.length;
    // Calculate attendance percentage (mock: count present records for now)
    // You can enhance this with real attendanceRecords if available
    const attendance = studentsCount > 0 ? `${Math.round((studentsCount * 0.9))}%` : '-';
    // Mock avgGrade and performance
    const avgGrade = 'B+';
    const performance = 'Good';
    return {
      class: cls,
      sections: sections.length,
      students: studentsCount,
      attendance,
      avgGrade,
      performance
    };
  });

  // Schedule management state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState(() => {
    const stored = localStorage.getItem(`teacherSchedule_${info.id}`);
    return stored ? JSON.parse(stored) : todaySchedule;
  });
  const [newSchedule, setNewSchedule] = useState({
    class: '',
    subject: '',
    department: '',
    time: '',
    room: ''
  });

  // Save schedule to localStorage when it changes
  React.useEffect(() => {
    if (info.id) {
      localStorage.setItem(`teacherSchedule_${info.id}`, JSON.stringify(scheduleEntries));
    }
  }, [scheduleEntries, info.id]);

  return (
    <DashboardLayout>
      {showTeacherLoginPrompt ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Teacher Login</h3>
            <form onSubmit={handleTeacherLogin}>
              <label className="block text-sm font-medium mb-1">Teacher ID</label>
              <input
                type="text"
                value={teacherId}
                onChange={e => setTeacherId(e.target.value)}
                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                placeholder="e.g., TEA-2025-001"
                required
              />
              <label className="block text-sm font-medium mb-1">Username or Email</label>
              <input
                type="text"
                value={teacherUsername}
                onChange={e => setTeacherUsername(e.target.value)}
                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                placeholder="Username or Email"
                required
              />
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={teacherPassword}
                onChange={e => setTeacherPassword(e.target.value)}
                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                required
                autoComplete="current-password"
              />
              {teacherLoginError && <div className="text-red-500 mb-2">{teacherLoginError}</div>}
              <div className="flex gap-3 mt-4">
                <Button type="submit" className="flex-1">Login</Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Good morning, {info.name}!</h1>
              <p className="text-lg text-white/90 font-medium">You have {todaySchedule.length} classes scheduled today and {pendingTasks.reduce((sum, task) => sum + task.count, 0)} tasks to complete.</p>
            </div>
          {/* Teacher Info Card */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="box small">
                  <div className="form flex items-center justify-center overflow-hidden">
                    {(() => {
                      const profileImage = getProfileImage(info?.id);
                      return profileImage && isValidImageData(profileImage) ? (
                        <img 
                          src={profileImage} 
                          alt={`${info?.name || 'Teacher'} Profile`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '100%' }}
                          onError={(e) => {
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
                          const profileImage = getProfileImage(info?.id);
                          return profileImage && isValidImageData(profileImage) ? 'none' : 'flex';
                        })()
                      }}
                    >
                      <User className="h-8 w-8" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{info.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                    <div>Subject: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{info.subject}</span></div>
                    <div>Department: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{info.department}</span></div>
                    <div>Teacher ID: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{info.id}</span></div>
                    <div>Experience: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">8 years</span></div>
                  </div>
                </div>
                <Link to="/profile">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:scale-105 transition-all duration-200 shadow-lg rounded-2xl p-6">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">103</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </CardContent>
            </Card>
            <Card className="hover:scale-105 transition-all duration-200 shadow-lg rounded-2xl p-6">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-gray-600">Active Classes</p>
              </CardContent>
            </Card>
            <Card className="hover:scale-105 transition-all duration-200 shadow-lg rounded-2xl p-6">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Assignments</p>
              </CardContent>
            </Card>
            <Card className="hover:scale-105 transition-all duration-200 shadow-lg rounded-2xl p-6">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">91%</p>
                <p className="text-sm text-gray-600">Avg Attendance</p>
              </CardContent>
            </Card>
          </div>
          {/* Today's Schedule */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsScheduleModalOpen(true)}>
                Manage Schedule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleEntries.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{schedule.subject}</p>
                      <p className="text-sm text-gray-600">
                        {schedule.class} • {schedule.department} • {schedule.room} 
                      </p>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {schedule.time}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setScheduleEntries(entries => entries.filter((_, i) => i !== index))}>Remove</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Schedule Modal */}
          {isScheduleModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Manage Schedule</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={e => {
                  e.preventDefault();
                  setScheduleEntries(entries => [...entries, newSchedule]);
                  setNewSchedule({ class: '', subject: '', department: '', time: '', room: '' });
                }}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <input type="text" value={newSchedule.class} onChange={e => setNewSchedule(s => ({ ...s, class: e.target.value }))} className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input type="text" value={newSchedule.subject} onChange={e => setNewSchedule(s => ({ ...s, subject: e.target.value }))} className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input type="text" value={newSchedule.department} onChange={e => setNewSchedule(s => ({ ...s, department: e.target.value }))} className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input type="text" value={newSchedule.time} onChange={e => setNewSchedule(s => ({ ...s, time: e.target.value }))} className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Room</label>
                    <input type="text" value={newSchedule.room} onChange={e => setNewSchedule(s => ({ ...s, room: e.target.value }))} className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2" required />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button type="submit" className="flex-1">Add Schedule</Button>
                    <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Class Performance */}
          <Card className="lg:col-span-2 shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Class Performance
              </CardTitle>
              <CardDescription>Overview of your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 font-semibold text-gray-700 mb-2">
                  <div>Class</div>
                  <div>Sections</div>
                  <div>Students</div>
                  <div>Attendance</div>
                  <div>Avg Grade</div>
                  <div>Performance</div>
                </div>
                {classPerformance.map((classData, index) => (
                  <div className="grid grid-cols-6 gap-4 items-center" key={classData.class}>
                    <div>
                      <p className="font-medium">{classData.class}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{classData.sections}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{classData.students} students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{classData.attendance}</p>
                      <p className="text-xs text-gray-600">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{classData.avgGrade}</p>
                      <p className="text-xs text-gray-600">Avg Grade</p>
                    </div>
                    <div className="text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        classData.performance === 'Outstanding' ? 'bg-green-100 text-green-700' :
                        classData.performance === 'Excellent' ? 'bg-blue-100 text-blue-700' :
                        classData.performance === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {classData.performance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Recent Messages */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${message.unread ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{message.from}</p>
                        <p className="text-sm text-gray-600">{message.subject}</p>
                      </div>
                      <div className="text-xs text-gray-500">{message.time}</div>
                    </div>
                    {message.unread && (
                      <div className="mt-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Assignment Status */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Assignment Status
              </CardTitle>
              <CardDescription>Recent assignment submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {assignment.dueDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.class}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {assignment.submitted}/{assignment.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Pending Tasks */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{task.task}</p>
                      <p className="text-sm text-gray-600">{task.count} items • Due: {task.due}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                        task.urgency === 'high' ? 'bg-red-500' :
                        task.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Upcoming Events */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-full ${
                      event.type === 'exam' ? 'bg-red-100 text-red-600' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'training' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {event.type === 'exam' ? <FileText className="h-4 w-4" /> :
                       event.type === 'meeting' ? <MessageSquare className="h-4 w-4" /> :
                       event.type === 'training' ? <BookOpen className="h-4 w-4" /> :
                       <Calendar className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Attendance Management */}
          <Card className="shadow-lg rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Attendance Management
              </CardTitle>
              <CardDescription>Take attendance for your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Button onClick={() => setIsAttendanceModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Take Attendance
                </Button>
              </div>
              {/* Attendance List Table: show attendanceRecords */}
              <div className="overflow-x-auto mt-6 rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border-b">Date</th>
                      <th className="text-left p-3 border-b">Section</th>
                      <th className="text-left p-3 border-b">Subject</th>
                      <th className="text-left p-3 border-b">Batch</th>
                      <th className="text-left p-3 border-b">Student ID</th>
                      <th className="text-left p-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((rec, idx) => (
                      <tr key={idx}>
                        <td className="p-3 border-b">{rec.date}</td>
                        <td className="p-3 border-b">{rec.section}</td>
                        <td className="p-3 border-b">{rec.subject}</td>
                        <td className="p-3 border-b">{rec.batch}</td>
                        <td className="p-3 border-b">{rec.studentId}</td>
                        <td className="p-3 border-b capitalize">{rec.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Attendance Modal */}
              {isAttendanceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">Take Attendance</h3>
                      <Button variant="outline" size="sm" onClick={() => setIsAttendanceModalOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <form onSubmit={e => {
                      e.preventDefault();
                      // Only allow if valid assignment
                      // const valid = teacherAssignments.some(a => a.class === selectedClass && a.subject === selectedSubject && a.batch === selectedBatch);
                      // if (!valid) return;
                      // Save attendance for all students in the class
                      const marked = Object.entries(attendanceMarking).map(([studentId, status]) => ({
                        studentId,
                        status,
                        class: selectedClass,
                        subject: selectedSubject,
                        batch: selectedBatch,
                        date: new Date().toISOString().slice(0, 10)
                      }));
                      setAttendanceRecords(prev => [...prev, ...marked]);
                      setIsAttendanceModalOpen(false);
                      setSelectedClass('');
                      setSelectedSubject('');
                      setSelectedBatch('');
                      setAttendanceMarking({});
                    }}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Class</label>
                          <select
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                            required
                          >
                            <option value="">Select Class</option>
                            {uniqueClasses.map(cls => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Subject</label>
                          <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                            required
                            disabled={!selectedClass}
                          >
                            <option value="">Select Subject</option>
                            {uniqueSubjects.map(subj => (
                              <option key={subj} value={subj}>{subj}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Batch</label>
                          <select
                            value={selectedBatch}
                            onChange={e => setSelectedBatch(e.target.value)}
                            className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                            required
                            disabled={!selectedClass || !selectedSubject}
                          >
                            <option value="">Select Batch</option>
                            {uniqueBatches.map(batch => (
                              <option key={batch} value={batch}>{batch}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Only show students if valid assignment selected */}
                      {selectedClass && selectedSubject && selectedBatch && uniqueSubjects.includes(selectedSubject) && uniqueClasses.includes(selectedClass) && uniqueBatches.includes(selectedBatch) && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Mark Attendance</h4>
                                  <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="text-left p-3 border-b">Student Name</th>
                                  <th className="text-left p-3 border-b">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {studentsForClass.map(student => {
                                  const status = attendanceMarking[student.studentId || student.id] || 'present';
                                  let rowClass = '';
                                  if (status === 'present') rowClass = 'bg-green-50';
                                  else if (status === 'absent') rowClass = 'bg-red-50';
                                  else if (status === 'late') rowClass = 'bg-yellow-50';
                                  return (
                                    <tr key={student.studentId || student.id} className={rowClass}>
                                      <td className="p-3 border-b flex items-center gap-2">
                                        {student.name} <span className="text-xs text-gray-400">({student.studentId || student.id})</span>
                                        <span className={`ml-2 w-3 h-3 rounded-full inline-block ${
                                          status === 'present' ? 'bg-green-500' : status === 'absent' ? 'bg-red-500' : 'bg-yellow-400'
                                        }`}></span>
                                      </td>
                                      <td className="p-3 border-b">
                                        <select
                                          value={status}
                                          onChange={e => setAttendanceMarking(mark => ({ ...mark, [student.studentId || student.id]: e.target.value }))}
                                          className="px-2 py-1 border rounded"
                                        >
                                          <option value="present">Present</option>
                                          <option value="absent">Absent</option>
                                          <option value="late">Late</option>
                                        </select>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3 mt-6">
                        <Button type="submit" className="flex-1" disabled={!(selectedClass && selectedSubject && selectedBatch && uniqueSubjects.includes(selectedSubject) && uniqueClasses.includes(selectedClass) && uniqueBatches.includes(selectedBatch))}>Save Attendance</Button>
                        <Button type="button" variant="outline" onClick={() => setIsAttendanceModalOpen(false)} className="flex-1">Cancel</Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Edit Teacher Account Modal */}
          {isEditTeacherAccountModalOpen && editTeacherAccountData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Edit Teacher Account</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  setTeacherAccounts(prev => prev.map(t =>
                    t.id === editTeacherAccountData.id ? { ...editTeacherAccountData } : t
                  ));
                  setIsEditTeacherAccountModalOpen(false);
                  setEditTeacherAccountData(null);
                }}>
                  <label className="block text-sm font-medium mb-1">Teacher ID</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.id}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, id: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.username || ''}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, username: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  />
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.name}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, name: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editTeacherAccountData.email}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, email: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.password}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, password: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.department}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, department: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  />
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    value={editTeacherAccountData.subject}
                    onChange={e => setEditTeacherAccountData(d => ({ ...d, subject: e.target.value }))}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button type="submit" className="flex-1">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditTeacherAccountModalOpen(false)} className="flex-1">Cancel</Button>
                  </div>
                </form>
              </div>
            </div>
          )}


        </div>
      )}
    </DashboardLayout>
  );
}

export default TeacherDashboard;