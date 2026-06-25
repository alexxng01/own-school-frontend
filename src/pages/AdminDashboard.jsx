import React, { useState, useEffect } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { formatNepaliRupees } from '../utils/currencyFormatter';
import { useAuth, useAccounts } from '../context/AuthContext';
import { exportAllData, downloadData, createDataFiles, showFileStorageInfo } from '../utils/dataExport';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import '../styles/animatedProfile.css';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Eye,
  Edit,
  Download,
  Search,
  Plus,
  Trash2,
  User,
  Award,
  Receipt,
  X,
  EyeOff,
  Palette,
  MessageSquare,
  Settings
} from 'lucide-react';


export function AdminDashboard() {
  // Move generateStudentId to the very top of the component, before all useEffect hooks and any usage
  const { students, teachers, addStudent, updateStudent, deleteStudent, addTeacher, deleteTeacher } = useAuth();
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    let maxNum = 0;
    students.forEach(s => {
      if (s.studentId && s.studentId.startsWith(`STU-${year}-`)) {
        const num = parseInt(s.studentId.split('-')[2], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    const newNum = (maxNum + 1).toString().padStart(3, '0');
    return `STU-${year}-${newNum}`;
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    phoneCountry: '+977',
    class: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    parentPhoneCountry: '+977',
    address: '',
    studentId: ''
  });
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isViewStudentDetails, setIsViewStudentDetails] = useState(false);
  const [isViewTeacherDetails, setIsViewTeacherDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newClass, setNewClass] = useState({
    name: '',
    teacher: '',
    room: '',
    capacity: '',
    schedule: ''
  });
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    qualification: '',
    experience: '',
    address: ''
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSearchResults, setStudentSearchResults] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceSection, setAttendanceSection] = useState('');
  const [attendanceSubject, setAttendanceSubject] = useState('');
  const [attendanceBatch, setAttendanceBatch] = useState('');
  const [attendanceMarking, setAttendanceMarking] = useState({});
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [isContactDetailModalOpen, setIsContactDetailModalOpen] = useState(false);
  const [selectedContactSubmission, setSelectedContactSubmission] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const stored = localStorage.getItem('attendanceRecords');
    return stored ? JSON.parse(stored) : [];
  });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [calendarEvents, setCalendarEvents] = useState([
    { title: 'Parent-Teacher Meeting', date: new Date().toISOString().slice(0, 10), time: '14:00' },
    { title: 'Annual Sports Day', date: '', time: '09:00' },
    { title: 'Exam Week', date: '', time: '' }
  ]);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);
  const [isAddReceptionistModalOpen, setIsAddReceptionistModalOpen] = useState(false);
  const [newReceptionistName, setNewReceptionistName] = useState('');
  const [newReceptionistPassword, setNewReceptionistPassword] = useState('');
  const { receptionists, setReceptionists } = useAccounts();
  const [receptionistError, setReceptionistError] = useState('');
  const [receptionistSuccess, setReceptionistSuccess] = useState('');
  // Add state for editing receptionist
  const [isEditReceptionistModalOpen, setIsEditReceptionistModalOpen] = useState(false);
  const [editReceptionistData, setEditReceptionistData] = useState(null);
  // Add username and email fields to receptionist creation/editing
  const [newReceptionistUsername, setNewReceptionistUsername] = useState('');
  const [newReceptionistEmail, setNewReceptionistEmail] = useState('');
  // Manager account creation state
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerUsername, setNewManagerUsername] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [newManagerPassword, setNewManagerPassword] = useState('');
  const { managers, setManagers } = useAccounts();
  const [managerError, setManagerError] = useState('');
  const [managerSuccess, setManagerSuccess] = useState('');
  const [isEditManagerModalOpen, setIsEditManagerModalOpen] = useState(false);
  const [editManagerData, setEditManagerData] = useState(null);
  const [visibleManagerPasswords, setVisibleManagerPasswords] = useState({});
  // At the top of the AdminDashboard component:
  const [recentActivities, setRecentActivities] = useState([]);
  const [classes, setClasses] = useState([]);
  // At the top of the AdminDashboard component, add:
  // const [pendingTasks, setPendingTasks] = useState([]);
  const [editAttendanceIdx, setEditAttendanceIdx] = useState(null);
  const [editAttendanceStatus, setEditAttendanceStatus] = useState('present');
  const [visibleStudentPasswords, setVisibleStudentPasswords] = useState({});
  const [visibleTeacherPasswords, setVisibleTeacherPasswords] = useState({});
  const [visibleReceptionistPasswords, setVisibleReceptionistPasswords] = useState({});
  const [attendanceClass, setAttendanceClass] = useState('');
  const [attendanceTeacher, setAttendanceTeacher] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceRemarks, setAttendanceRemarks] = useState({});

  const { user } = useAuth();
  const { admins } = useAccounts();
  // Get the latest admin info from admins array if available
  const adminProfile = Array.isArray(admins) ? admins.find(a => a.id === user?.id) : null;
  const adminInfo = adminProfile || user;

  const stats = [
    {
      title: "Total Students",
      value: students.length.toString(),
      change: "+0%",
      trend: "stable",
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Total Teachers",
      value: teachers.length.toString(),
      change: "+0%",
      trend: "stable",
      icon: Users,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Active Classes",
      value: "0",
      change: "0%",
      trend: "stable",
      icon: BookOpen,
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      title: "Monthly Revenue",
      value: formatNepaliRupees(0),
      change: "+0%",
      trend: "stable",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  // Empty data arrays - will be populated with real data
  const allResults = [];
  const feeReceipts = [];

  // Save attendanceRecords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  // Save receptionists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('receptionists', JSON.stringify(receptionists));
  }, [receptionists]);

  // Save managers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('managers', JSON.stringify(managers));
    console.log('Saving managers to localStorage:', managers);
  }, [managers]);

  // 1. Add a new useEffect to auto-generate username and password from name and ID
  useEffect(() => {
    if (isAddStudentModalOpen && newStudent.name && newStudent.studentId) {
      const namePart = newStudent.name.toLowerCase().replace(/\s/g, '');
      const idPart = newStudent.studentId.split('-')[2];
      const newUsername = `${namePart}${idPart}`;
      const newPassword = newUsername; // Same as username
      setNewStudent(s => ({ ...s, username: newUsername, password: newPassword }));
    }
  }, [newStudent.name, newStudent.studentId, isAddStudentModalOpen]);

  // 2. Add useEffect to generate ID and username when modal opens
  useEffect(() => {
    if (isAddStudentModalOpen) {
      const newId = generateStudentId();
      setNewStudent(s => ({ ...s, studentId: newId, username: newId.toLowerCase() }));
    }
  }, [isAddStudentModalOpen, generateStudentId]);

  // Load contact submissions
  useEffect(() => {
    loadContactSubmissions();
  }, []);

  // Listen for contact submission changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'contactSubmissions') {
        loadContactSubmissions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Expose modal functions to window for sidebar access
  useEffect(() => {
    window.addStudentModal = () => setIsAddStudentModalOpen(true);
    window.addTeacherModal = () => setIsAddTeacherModalOpen(true);
    window.addClassModal = () => setIsAddClassModalOpen(true);
    window.addReceptionistModal = () => setIsAddReceptionistModalOpen(true);
    window.addManagerModal = () => setIsAddManagerModalOpen(true);
    window.scheduleEventModal = () => setIsScheduleModalOpen(true);
    window.exportData = () => {
      downloadData();
      showFileStorageInfo();
      exportAllData();
    };
    window.createFiles = createDataFiles;

    return () => {
      delete window.addStudentModal;
      delete window.addTeacherModal;
      delete window.addClassModal;
      delete window.addReceptionistModal;
      delete window.addManagerModal;
      delete window.scheduleEventModal;
      delete window.exportData;
      delete window.createFiles;
    };
  }, []);

  const renderOverview = () => (
    <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="flex flex-col items-start">
              <div className="flex items-center justify-between w-full mb-2 p-4">
                  <div>
                    <p className="text-sm font-medium ">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`}>{stat.change} from last month</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest actions and updates across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-100 text-green-600' :
                      activity.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                        activity.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                        <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm ">{activity.user} • {activity.time}</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => deleteActivity(activity.id)}>
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 ">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent activities</p>
                  <p className="text-sm">Activities will appear here when you add students, teachers, or classes</p>
                </div>
              )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Pending Tasks
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Contact Submissions */}
                {contactSubmissions.filter(sub => sub.status === 'new').map((submission) => (
                  <div 
                    key={submission.id} 
                    className="p-3 rounded-lg border hover:bg-yellow-50 cursor-pointer"
                    onClick={() => handleViewContactSubmission(submission)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <p className="font-medium text-sm">Contact: {submission.name}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        New
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Subject: {submission.subject}</p>
                    <p className="text-xs text-gray-500">{new Date(submission.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}

                {/* Fee Receipts */}
                {feeReceipts.length > 0 ? (
                  feeReceipts.map((receipt) => (
                    <div key={receipt.id} className="p-3 rounded-lg border hover:bg-yellow-50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm">{receipt.receiptNo}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          receipt.status === 'Paid' ? 'bg-green-100 text-green-700' :
                          receipt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {receipt.status}
                        </span>
                      </div>
                      <p className="text-xs ">Due: {receipt.due}</p>
                    </div>
                  ))
                ) : null}

                {/* Show message if no pending tasks */}
                {contactSubmissions.filter(sub => sub.status === 'new').length === 0 && feeReceipts.length === 0 && (
                  <div className="text-center py-8 ">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No pending tasks</p>
                    <p className="text-sm">Tasks will appear here when needed</p>
                  </div>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderResults = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-green-600" />
          All Student Results
        </CardTitle>
        <CardDescription>View and manage all student academic results - showing available class data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
        
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Classes Available</h3>
            <p className="text-gray-500 mb-4">Create classes first to view student results</p>
            <Button onClick={() => setIsAddClassModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {cls.name}
                  </CardTitle>
                  <CardDescription>Class Performance Overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Class Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Teacher:</span>
                        <p className="font-medium">{cls.teacher || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <p className="font-medium">{cls.students || 0}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Room:</span>
                        <p className="font-medium">Room {cls.id || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <p className="font-medium">{cls.capacity || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-green-600 font-medium">Average Grade</div>
                          <div className="text-2xl font-bold text-green-700">A-</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-blue-600 font-medium">Pass Rate</div>
                          <div className="text-2xl font-bold text-blue-700">95%</div>
                        </div>
                      </div>
                    </div>

                    {/* Subject Performance */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Subject Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mathematics</span>
                          <span className="text-sm font-medium text-green-600">A+ (92%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Science</span>
                          <span className="text-sm font-medium text-blue-600">A (88%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">English</span>
                          <span className="text-sm font-medium text-yellow-600">B+ (85%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Results
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {classes.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Overall School Performance</CardTitle>
                <CardDescription>Summary of all classes and student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{classes.length}</div>
                    <div className="text-sm text-gray-600">Total Classes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">A-</div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Pass Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">8.5</div>
                    <div className="text-sm text-gray-600">Avg GPA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAttendance = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Attendance Management
        </CardTitle>
        <CardDescription>View and manage student attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
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
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? attendanceRecords.map((rec, idx) => (
                <tr key={idx}>
                  <td className="p-3 border-b">{rec.date}</td>
                  <td className="p-3 border-b">{rec.section}</td>
                  <td className="p-3 border-b">{rec.subject}</td>
                  <td className="p-3 border-b">{rec.batch}</td>
                  <td className="p-3 border-b">{rec.studentId}</td>
                  <td className="p-3 border-b capitalize">{rec.status}</td>
                  <td className="p-3 border-b">
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditAttendanceIdx(idx);
                      setEditAttendanceStatus(rec.status);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderFeeReceipts = () => (
        <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-purple-600" />
          Fee Receipts & Payments
        </CardTitle>
        <CardDescription>View all fee payments and receipts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search receipts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border-b">Receipt No</th>
                <th className="text-left p-3 border-b">Student Name</th>
                <th className="text-left p-3 border-b">Class</th>
                <th className="text-left p-3 border-b">Amount</th>
                <th className="text-left p-3 border-b">Status</th>
                <th className="text-left p-3 border-b">Date</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b font-medium">{receipt.receiptNo}</td>
                  <td className="p-3 border-b">{receipt.studentName}</td>
                  <td className="p-3 border-b">{receipt.class}</td>
                  <td className="p-3 border-b font-medium">{formatNepaliRupees(receipt.amount)}</td>
                  <td className="p-3 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      receipt.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      receipt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {receipt.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">{receipt.date}</td>
                  <td className="p-3 border-b">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderStudents = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Student Management
        </CardTitle>
        <CardDescription>Manage all registered students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => {
            if (!studentSearch.trim()) {
              setStudentSearchResults(null);
              return;
            }
            const search = studentSearch.trim().toLowerCase();
            setStudentSearchResults(
              students.filter(s =>
                (s.name && s.name.toLowerCase().includes(search)) ||
                (s.studentId && s.studentId.toLowerCase().includes(search))
              )
            );
          }}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {(studentSearchResults !== null ? studentSearchResults : students).length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 border-b text-left">Name</th>
                  <th className="p-3 border-b text-left">Username</th>
                  <th className="p-3 border-b text-left">Password</th>
                  <th className="p-3 border-b text-left">Student ID</th>
                  <th className="text-left p-3 border-b">Class</th>
                  <th className="text-left p-3 border-b">Roll Number</th>
                  <th className="text-left p-3 border-b">Email</th>
                  <th className="text-left p-3 border-b">Phone</th>
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(studentSearchResults !== null ? studentSearchResults : students).map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">{student.name}</td>
                    <td className="p-3 border-b">{student.username}</td>
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <span>
                          {visibleStudentPasswords[student.studentId] ? student.password : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setVisibleStudentPasswords(prev => ({
                            ...prev,
                            [student.studentId]: !prev[student.studentId]
                          }))}
                          className="text-blue-400 hover:text-blue-600 focus:outline-none"
                          aria-label={visibleStudentPasswords[student.studentId] ? 'Hide password' : 'Show password'}
                        >
                          {visibleStudentPasswords[student.studentId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border-b">{student.studentId}</td>
                    <td className="p-3 border-b">{student.class}</td>
                    <td className="p-3 border-b">{student.rollNumber}</td>
                    <td className="p-3 border-b">{student.email}</td>
                    <td className="p-3 border-b">{student.phone}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewStudentDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditStudentData(student);
                          setIsEditStudentModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteStudent(student.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold  mb-2">No Students Registered</h3>
              <p className=" mb-4">Add your first student to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTeachers = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-600" />
          Teacher Management
        </CardTitle>
        <CardDescription>Manage all registered teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => setIsAddTeacherModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {teachers.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border-b">Name</th>
                  <th className="text-left p-3 border-b">Subject</th>
                  <th className="text-left p-3 border-b">Department</th>
                  <th className="text-left p-3 border-b">Email</th>
                  <th className="text-left p-3 border-b">Phone</th>
                  <th className="text-left p-3 border-b">Experience</th>
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b font-medium">{teacher.name}</td>
                    <td className="p-3 border-b">{teacher.subject}</td>
                    <td className="p-3 border-b">{teacher.department}</td>
                    <td className="p-3 border-b">{teacher.email}</td>
                    <td className="p-3 border-b">{teacher.phone}</td>
                    <td className="p-3 border-b">{teacher.experience}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setIsViewTeacherDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteTeacher(teacher.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold  mb-2">No Teachers Registered</h3>
              <p className=" mb-4">Add your first teacher to get started</p>
              <Button onClick={() => setIsAddTeacherModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Teacher
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderClasses = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Class Management
        </CardTitle>
        <CardDescription>Manage all classes and their details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => setIsAddClassModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {cls.students} students
                    </span>
                  </div>
                  <div className="space-y-2 text-sm ">
                    <div>Teacher: <span className="font-medium">{cls.teacher}</span></div>
                    <div>Room: <span className="font-medium">Room {cls.id}</span></div>
                    <div>Schedule: <span className="font-medium">Mon-Fri 8:00 AM</span></div>
                    <div>Sections: {cls.sections && cls.sections.length > 0 ? (
                      <select className="ml-2 px-2 py-1 border rounded">
                        {cls.sections.map((section, i) => (
                          <option key={i} value={section}>{section}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="ml-2 text-gray-400">No sections</span>
                    )}</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold  mb-2">No Classes Created</h3>
              <p className=" mb-4">Create your first class to get started</p>
              <Button onClick={() => setIsAddClassModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Class
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderCalendar = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-600" />
          Calendar & Events
        </CardTitle>
        <CardDescription>View today's date and monthly events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Monthly Calendar</h3>
          <Button size="sm" variant="outline" onClick={() => setIsScheduleModalOpen(true)}>
            Schedule Event
          </Button>
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium ">
              {day}
            </div>
          ))}
          {/* Calendar Days */}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate();
            // Find events for this day
            const eventForDay = calendarEvents.find(ev => {
              if (!ev.date) return false;
              const evDate = new Date(ev.date);
              return evDate.getDate() === day && evDate.getMonth() === new Date().getMonth();
            });
            return (
              <div
                key={i}
                className={`p-2 text-center text-sm border rounded relative ${
                  isToday ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'
                }`}
              >
                {day <= 31 ? day : ''}
                {eventForDay && day <= 31 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
        {/* Schedule Event Modal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Schedule Event</h3>
                <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                setCalendarEvents(prev => [
                  ...prev,
                  { title: eventTitle, date: eventDate, time: eventTime }
                ]);
                setIsScheduleModalOpen(false);
                setEventTitle('');
                setEventDate('');
                setEventTime('');
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Save Event</Button>
                  <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Upcoming Events List */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Upcoming Events</h4>
          <div className="space-y-3">
            {calendarEvents.map((ev, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-sm ">{ev.date} {ev.time && `, ${ev.time}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const countryCodes = [
    { code: '+1', name: 'USA/Canada' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+81', name: 'Japan' },
    { code: '+977', name: 'Nepal' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+86', name: 'China' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+92', name: 'Pakistan' },
    { code: '+7', name: 'Russia' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+82', name: 'South Korea' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+971', name: 'UAE' },
    { code: '+20', name: 'Egypt' },
    { code: '+27', name: 'South Africa' },
    { code: '+55', name: 'Brazil' },
    // ... add more as needed
  ];

  // Function to generate a unique receptionist ID
  const generateReceptionistId = () => {
    const year = new Date().getFullYear();
    const num = (receptionists.length + 1).toString().padStart(3, '0');
    return `REC-${year}-${num}`;
  };

  // Function to generate a unique manager ID
  const generateManagerId = () => {
    const year = new Date().getFullYear();
    const num = (managers.length + 1).toString().padStart(3, '0');
    return `MGR-${year}-${num}`;
  };

  function addActivity(action, type = 'info') {
    setRecentActivities(prev => [
      {
        id: Date.now(),
        action,
        user: 'Admin',
        type,
        time: new Date().toLocaleString()
      },
      ...prev
    ]);
  }

  function deleteActivity(id) {
    setRecentActivities(prev => prev.filter(a => a.id !== id));
  }

  // Contact submissions management
  const loadContactSubmissions = () => {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    setContactSubmissions(submissions);
  };

  const handleContactStatusChange = (submissionId, newStatus) => {
    const updatedSubmissions = contactSubmissions.map(sub =>
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    );
    setContactSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
  };

  const handleDeleteContactSubmission = (submissionId) => {
    const updatedSubmissions = contactSubmissions.filter(sub => sub.id !== submissionId);
    setContactSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    
    const deletedSubmission = contactSubmissions.find(s => s.id === submissionId);
    if (deletedSubmission) {
      addActivity(`Deleted contact submission from ${deletedSubmission.name}`, 'warning');
    }
  };

  const handleViewContactSubmission = (submission) => {
    setSelectedContactSubmission(submission);
    setIsContactDetailModalOpen(true);
  };

  return (
    <DashboardLayout onTabChange={(tab) => {
      console.log('AdminDashboard tab change:', tab);
      setActiveTab(tab);
    }} activeTab={activeTab}>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Welcome back! {adminInfo.name}</h1>
          <p className="text-lg text-white/90 font-medium">Manage all aspects of R.P.M.School from this central dashboard.</p>
        </div>

        {/* Admin Info Card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="box small">
                <div className="form flex items-center justify-center overflow-hidden">
                {(() => {
                  const profileImage = getProfileImage(adminInfo?.id);
                  return profileImage && isValidImageData(profileImage) ? (
                    <img 
                      src={profileImage} 
                      alt={`${adminInfo?.name || 'Admin'} Profile`} 
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
                       const profileImage = getProfileImage(adminInfo?.id);
                       return profileImage && isValidImageData(profileImage) ? 'none' : 'flex';
                     })()
                   }}
                 >
                   <User className="h-8 w-8" />
                 </div>
               </div>
             </div>
              <div className="flex-1">
              <h3 className="text-xl font-bold">{adminInfo.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm ">
                  <div>Role: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{adminInfo.role}</span></div>
                  <div>Admin ID: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{adminInfo.id}</span></div>
                  <div>Department: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{adminInfo.department}</span></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to="/profile">
                  <Button variant="defult">View Profile</Button>
                </Link>
               
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Tab Content */}
        <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Current Tab: {activeTab}</p>
        </div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'results' && renderResults()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'receipts' && renderFeeReceipts()}
        {activeTab === 'calendar' && renderCalendar()}



        {/* Add Student Modal */}
        {isAddStudentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Student</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddStudentModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                addStudent(newStudent);
                setNewStudent({
                  name: '',
                  email: '',
                  phone: '',
                  phoneCountry: '+977',
                  class: '',
                  rollNumber: '',
                  parentName: '',
                  parentPhone: '',
                  parentPhoneCountry: '+977',
                  address: '',
                  studentId: ''
                });
                setIsAddStudentModalOpen(false);
                addActivity('Created a student account', 'success');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Name</label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <div className="flex gap-2">
                      <select
                        value={newStudent.phoneCountry}
                        onChange={e => setNewStudent({ ...newStudent, phoneCountry: e.target.value })}
                        className="px-2 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                        required
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={newStudent.phone}
                        onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <input
                      type="text"
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={newStudent.rollNumber}
                      onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <input
                      type="text"
                      value={newStudent.studentId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs  mt-1">
                      This ID will be used by students to sign up for their account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Name</label>
                    <input
                      type="text"
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Phone</label>
                    <div className="flex gap-2">
                      <select
                        value={newStudent.parentPhoneCountry}
                        onChange={e => setNewStudent({ ...newStudent, parentPhoneCountry: e.target.value })}
                        className="px-2 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                        required
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={newStudent.parentPhone}
                        onChange={e => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        placeholder="Parent phone number"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={newStudent.address}
                      onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="text"
                      value={newStudent.password}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Add Student
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}
        {isAddTeacherModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Teacher</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddTeacherModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                addTeacher(newTeacher);
                setNewTeacher({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  department: '',
                  qualification: '',
                  experience: '',
                  address: ''
                });
                setIsAddTeacherModalOpen(false);
                addActivity('Created a teacher account', 'success');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Teacher Name</label>
                    <input
                      type="text"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newTeacher.phone}
                      onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input
                      type="text"
                      value={newTeacher.department}
                      onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Qualification</label>
                    <input
                      type="text"
                      value={newTeacher.qualification}
                      onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience</label>
                    <input
                      type="text"
                      value={newTeacher.experience}
                      onChange={(e) => setNewTeacher({...newTeacher, experience: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={newTeacher.address}
                      onChange={(e) => setNewTeacher({...newTeacher, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Add Teacher
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTeacherModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Student Details Modal */}
        {isViewStudentDetails && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Student Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewStudentDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-blue-600">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">Full Name</label>
                      <p className="text-lg font-medium">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Email</label>
                      <p className="text-lg">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Phone</label>
                      <p className="text-lg">{selectedStudent.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Address</label>
                      <p className="text-lg">{selectedStudent.address}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-green-600">Academic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">Class</label>
                      <p className="text-lg font-medium">{selectedStudent.class}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Roll Number</label>
                      <p className="text-lg">{selectedStudent.rollNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedStudent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedStudent.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Created</label>
                      <p className="text-lg">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-4 text-purple-600">Parent Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium ">Parent Name</label>
                      <p className="text-lg">{selectedStudent.parentName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Parent Phone</label>
                      <p className="text-lg">{selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Student
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsViewStudentDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Teacher Details Modal */}
        {isViewTeacherDetails && selectedTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Teacher Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewTeacherDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-blue-600">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">Full Name</label>
                      <p className="text-lg font-medium">{selectedTeacher.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Email</label>
                      <p className="text-lg">{selectedTeacher.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Phone</label>
                      <p className="text-lg">{selectedTeacher.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Address</label>
                      <p className="text-lg">{selectedTeacher.address}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-green-600">Professional Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">Subject</label>
                      <p className="text-lg font-medium">{selectedTeacher.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Department</label>
                      <p className="text-lg">{selectedTeacher.department}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Qualification</label>
                      <p className="text-lg">{selectedTeacher.qualification}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Experience</label>
                      <p className="text-lg">{selectedTeacher.experience}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">Status</label>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTeacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedTeacher.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Teacher
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsViewTeacherDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Class Modal */}
        {isAddClassModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Create New Class</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddClassModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                // Add class logic here
                setClasses(prev => [...prev, newClass]); // <-- This line actually adds the class
                setNewClass({
                  name: '',
                  teacher: '',
                  room: '',
                  capacity: '',
                  schedule: ''
                });
                setIsAddClassModalOpen(false);
                addActivity('Created a class', 'success');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Class Name</label>
                    <input
                      type="text"
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Grade 10A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assigned Teacher</label>
                    <input
                      type="text"
                      value={newClass.teacher}
                      onChange={(e) => setNewClass({...newClass, teacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Teacher name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Room Number</label>
                    <input
                      type="text"
                      value={newClass.room}
                      onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Room 201"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacity</label>
                    <input
                      type="number"
                      value={newClass.capacity}
                      onChange={(e) => setNewClass({...newClass, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Maximum students"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Schedule</label>
                    <textarea
                      value={newClass.schedule}
                      onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="e.g., Monday to Friday, 8:00 AM - 3:00 PM"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Class
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddClassModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Modal */}
        {isAttendanceModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Take Attendance</h3>
                <Button variant="outline" size="sm" onClick={() => setIsAttendanceModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Teacher and Class Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Teacher</label>
                    <select
                      value={attendanceTeacher || ''}
                      onChange={e => setAttendanceTeacher(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Class</label>
                    <select
                      value={attendanceClass || ''}
                      onChange={e => setAttendanceClass(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name} - {cls.teacher}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Section</label>
                    <select
                      value={attendanceSection || ''}
                      onChange={e => setAttendanceSection(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Subject</label>
                    <input
                      type="text"
                      value={attendanceSubject}
                      onChange={e => setAttendanceSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800"
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={attendanceDate || new Date().toISOString().slice(0, 10)}
                      onChange={e => setAttendanceDate(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Student Attendance Marking */}
              {attendanceClass && attendanceSection && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Mark Student Attendance</h4>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allStudents = students.filter(s => {
                            // More flexible filtering - check if student belongs to the selected class/section
                            return s.class === attendanceClass || 
                                   s.class?.includes(attendanceSection) || 
                                   s.section === attendanceSection ||
                                   s.class?.toLowerCase().includes(attendanceSection.toLowerCase());
                          });
                          const allPresent = {};
                          allStudents.forEach(student => {
                            allPresent[student.id] = 'present';
                          });
                          setAttendanceMarking(allPresent);
                        }}
                      >
                        Mark All Present
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const allStudents = students.filter(s => {
                            // More flexible filtering - check if student belongs to the selected class/section
                            return s.class === attendanceClass || 
                                   s.class?.includes(attendanceSection) || 
                                   s.section === attendanceSection ||
                                   s.class?.toLowerCase().includes(attendanceSection.toLowerCase());
                          });
                          const allAbsent = {};
                          allStudents.forEach(student => {
                            allAbsent[student.id] = 'absent';
                          });
                          setAttendanceMarking(allAbsent);
                        }}
                      >
                        Mark All Absent
                      </Button>
                    </div>
                  </div>

                  {/* Debug Information */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Debug Info:</strong> Selected Class: {attendanceClass}, Section: {attendanceSection}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Total Students: {students.length} | Filtered Students: {
                        students.filter(s => {
                          return s.class === attendanceClass || 
                                 s.class?.includes(attendanceSection) || 
                                 s.section === attendanceSection ||
                                 s.class?.toLowerCase().includes(attendanceSection.toLowerCase());
                        }).length
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.filter(s => {
                      // More flexible filtering - check if student belongs to the selected class/section
                      return s.class === attendanceClass || 
                             s.class?.includes(attendanceSection) || 
                             s.section === attendanceSection ||
                             s.class?.toLowerCase().includes(attendanceSection.toLowerCase());
                    }).map(student => (
                      <div 
                        key={student.id} 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          attendanceMarking[student.id] === 'present' 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : attendanceMarking[student.id] === 'absent'
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                        }`}
                        onClick={() => {
                          const currentStatus = attendanceMarking[student.id] || 'present';
                          const newStatus = currentStatus === 'present' ? 'absent' : 'present';
                          setAttendanceMarking(prev => ({
                            ...prev,
                            [student.id]: newStatus
                          }));
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-sm">{student.name}</h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400">ID: {student.studentId}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Class: {student.class || 'Not assigned'}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attendanceMarking[student.id] === 'present' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : attendanceMarking[student.id] === 'absent'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {attendanceMarking[student.id] || 'Present'}
                          </div>
                        </div>
                        
                        {/* Remarks Section */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Remarks
                          </label>
                          <textarea
                            value={attendanceRemarks[student.id] || ''}
                            onChange={e => setAttendanceRemarks(prev => ({
                              ...prev,
                              [student.id]: e.target.value
                            }))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none"
                            placeholder="Add remarks..."
                            rows="2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {students.filter(s => {
                    return s.class === attendanceClass || 
                           s.class?.includes(attendanceSection) || 
                           s.section === attendanceSection ||
                           s.class?.toLowerCase().includes(attendanceSection.toLowerCase());
                  }).length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-2">No students found in this section</p>
                      <p className="text-sm text-gray-400 mb-4">Available students: {students.map(s => `${s.name} (${s.class || 'No class'})`).join(', ')}</p>
                      
                      {/* Helper button to create sample students */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const sampleStudents = [
                            { name: 'John Doe', class: 'A10', section: 'A', studentId: 'STU-2024-001' },
                            { name: 'Jane Smith', class: 'A10', section: 'A', studentId: 'STU-2024-002' },
                            { name: 'Mike Johnson', class: 'A10', section: 'B', studentId: 'STU-2024-003' },
                            { name: 'Sarah Wilson', class: 'A10', section: 'C', studentId: 'STU-2024-004' },
                            { name: 'Tom Brown', class: 'A10', section: 'C', studentId: 'STU-2024-005' },
                            { name: 'Emily Davis', class: 'A10', section: 'D', studentId: 'STU-2024-006' }
                          ];
                          
                          sampleStudents.forEach(student => {
                            addStudent({
                              ...student,
                              email: `${student.name.toLowerCase().replace(' ', '.')}@school.com`,
                              phone: '+977123456789',
                              phoneCountry: '+977',
                              rollNumber: student.studentId.split('-')[2],
                              parentName: `${student.name}'s Parent`,
                              parentPhone: '+977987654321',
                              parentPhoneCountry: '+977',
                              address: 'School Address'
                            });
                          });
                          
                          alert('Sample students created! Try selecting the attendance again.');
                        }}
                      >
                        Create Sample Students
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={e => {
                e.preventDefault();
                if (!attendanceClass || !attendanceSection || !attendanceSubject) {
                  alert('Please fill in all required fields');
                  return;
                }

                // Save attendance with remarks
                const marked = Object.entries(attendanceMarking).map(([studentId, status]) => ({
                  studentId,
                  status,
                  section: attendanceSection,
                  subject: attendanceSubject,
                  class: attendanceClass,
                  teacher: attendanceTeacher,
                  date: attendanceDate || new Date().toISOString().slice(0, 10),
                  remarks: attendanceRemarks[studentId] || ''
                }));
                
                setAttendanceRecords(prev => [...prev, ...marked]);
                setIsAttendanceModalOpen(false);
                setAttendanceSection('');
                setAttendanceSubject('');
                setAttendanceClass('');
                setAttendanceTeacher('');
                setAttendanceDate('');
                setAttendanceMarking({});
                setAttendanceRemarks({});
                addActivity(`Marked attendance for ${attendanceSection} - ${attendanceSubject}`, 'success');
              }}>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Save Attendance</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAttendanceModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditStudentModalOpen && editStudentData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Student</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditStudentModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                updateStudent(editStudentData.id, editStudentData);
                setIsEditStudentModalOpen(false);
                addActivity('Edited a student account', 'info');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Name</label>
                    <input
                      type="text"
                      value={editStudentData.name}
                      onChange={e => setEditStudentData({ ...editStudentData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={editStudentData.email}
                      onChange={e => setEditStudentData({ ...editStudentData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <div className="flex gap-2">
                      <select
                        value={editStudentData.phoneCountry}
                        onChange={e => setEditStudentData({ ...editStudentData, phoneCountry: e.target.value })}
                        className="px-2 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                        required
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={editStudentData.phone}
                        onChange={e => setEditStudentData({ ...editStudentData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <input
                      type="text"
                      value={editStudentData.class}
                      onChange={e => setEditStudentData({ ...editStudentData, class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={editStudentData.rollNumber}
                      onChange={e => setEditStudentData({ ...editStudentData, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <input
                      type="text"
                      value={editStudentData.studentId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                    <p className="text-xs  mt-1">
                      This ID will be used by students to sign up for their account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Name</label>
                    <input
                      type="text"
                      value={editStudentData.parentName}
                      onChange={e => setEditStudentData({ ...editStudentData, parentName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Phone</label>
                    <div className="flex gap-2">
                      <select
                        value={editStudentData.parentPhoneCountry}
                        onChange={e => setEditStudentData({ ...editStudentData, parentPhoneCountry: e.target.value })}
                        className="px-2 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                        required
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={editStudentData.parentPhone}
                        onChange={e => setEditStudentData({ ...editStudentData, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        placeholder="Parent phone number"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={editStudentData.address}
                      onChange={e => setEditStudentData({ ...editStudentData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                      type="text"
                      value={editStudentData.username}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="text"
                      value={editStudentData.password}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Save</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditStudentModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Receptionist Modal */}
        {isAddReceptionistModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create Receptionist Account</h3>
              <form onSubmit={e => {
                e.preventDefault();
                setReceptionistError('');
                setReceptionistSuccess('');
                if (!newReceptionistName.trim() || !newReceptionistUsername.trim() || !newReceptionistEmail.trim() || !newReceptionistPassword.trim()) {
                  setReceptionistError('All fields are required.');
                  return;
                }
                // Check for duplicate username or email
                if (receptionists.some(r => r.username === newReceptionistUsername.trim() || r.email === newReceptionistEmail.trim())) {
                  setReceptionistError('Receptionist with this username or email already exists.');
                  return;
                }
                const id = generateReceptionistId();
                setReceptionists(prev => [...prev, {
                  id,
                  name: newReceptionistName.trim(),
                  username: newReceptionistUsername.trim(),
                  email: newReceptionistEmail.trim(),
                  password: newReceptionistPassword,
                  role: 'Receptionist',
                  department: 'Reception'
                }]);
                setReceptionistSuccess(`Receptionist created! ID: ${id}`);
                setNewReceptionistName('');
                setNewReceptionistUsername('');
                setNewReceptionistEmail('');
                setNewReceptionistPassword('');
                setTimeout(() => {
                  setIsAddReceptionistModalOpen(false);
                  setReceptionistSuccess('');
                }, 1200);
              }}>
                <label className="block text-sm font-medium mb-1">Receptionist Name</label>
                <input
                  type="text"
                  value={newReceptionistName}
                  onChange={e => setNewReceptionistName(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="e.g., Sarah Reception"
                  required
                />
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={newReceptionistUsername}
                  onChange={e => setNewReceptionistUsername(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Set a username"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newReceptionistEmail}
                  onChange={e => setNewReceptionistEmail(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Receptionist email"
                  required
                />
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newReceptionistPassword}
                  onChange={e => setNewReceptionistPassword(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Set a password"
                  required
                />
                {receptionistError && <div className="text-red-500 mb-2">{receptionistError}</div>}
                {receptionistSuccess && <div className="text-green-600 mb-2">{receptionistSuccess}</div>}
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">Create</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddReceptionistModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Display the list of created receptionists and their IDs */}
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Receptionist Accounts
            </CardTitle>
            <CardDescription>IDs and passwords to give to receptionists for login</CardDescription>
          </CardHeader>
          <CardContent>
            {receptionists.length === 0 ? (
              <div className="">No receptionists created yet.</div>
            ) : (
              <table className="w-full border-collapse ">
                <thead>
                  <tr className="bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                    <th className="text-left p-3 border-b">Name</th>
                    <th className="text-left p-3 border-b">Username</th>
                    <th className="text-left p-3 border-b">Email</th>
                    <th className="text-left p-3 border-b">Receptionist ID</th>
                    <th className="text-left p-3 border-b">Password</th>
                    <th className="text-left p-3 border-b">Role</th>
                    <th className="text-left p-3 border-b">Department</th>
                    <th className="text-left p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receptionists.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                      <td className="p-3 border-b font-medium">{r.name}</td>
                      <td className="p-3 border-b">{r.username}</td>
                      <td className="p-3 border-b">{r.email}</td>
                      <td className="p-3 border-b">{r.id}</td>
                      <td className="p-3 border-b">
                        <div className="flex items-center gap-2">
                          <span>
                            {visibleReceptionistPasswords[r.id] ? r.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisibleReceptionistPasswords(prev => ({
                              ...prev,
                              [r.id]: !prev[r.id]
                            }))}
                            className="text-blue-400 hover:text-blue-600 focus:outline-none"
                            aria-label={visibleReceptionistPasswords[r.id] ? 'Hide password' : 'Show password'}
                          >
                            {visibleReceptionistPasswords[r.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border-b">{r.role}</td>
                      <td className="p-3 border-b">{r.department}</td>
                      <td className="p-3 border-b">
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditReceptionistData(r);
                            setIsEditReceptionistModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            setReceptionists(prev => prev.filter(rec => rec.id !== r.id));
                            addActivity('Deleted a receptionist account', 'warning');
                          }}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Edit Receptionist Modal */}
        {isEditReceptionistModalOpen && editReceptionistData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Receptionist Account</h3>
              <form onSubmit={e => {
                e.preventDefault();
                setReceptionists(prev => prev.map(r =>
                  r.id === editReceptionistData.id ? { ...editReceptionistData } : r
                ));
                setIsEditReceptionistModalOpen(false);
                setEditReceptionistData(null);
              }}>
                <label className="block text-sm font-medium mb-1">Receptionist ID</label>
                <input
                  type="text"
                  value={editReceptionistData.id}
                  onChange={e => setEditReceptionistData(d => ({ ...d, id: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Receptionist Name</label>
                <input
                  type="text"
                  value={editReceptionistData.name}
                  onChange={e => setEditReceptionistData(d => ({ ...d, name: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={editReceptionistData.username}
                  onChange={e => setEditReceptionistData(d => ({ ...d, username: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editReceptionistData.email}
                  onChange={e => setEditReceptionistData(d => ({ ...d, email: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="text"
                  value={editReceptionistData.password}
                  onChange={e => setEditReceptionistData(d => ({ ...d, password: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={editReceptionistData.role}
                  onChange={e => setEditReceptionistData(d => ({ ...d, role: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={editReceptionistData.department}
                  onChange={e => setEditReceptionistData(d => ({ ...d, department: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditReceptionistModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Manager Modal */}
        {isAddManagerModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create Manager Account</h3>
              <form onSubmit={e => {
                e.preventDefault();
                setManagerError('');
                setManagerSuccess('');
                if (!newManagerName.trim() || !newManagerUsername.trim() || !newManagerEmail.trim() || !newManagerPassword.trim()) {
                  setManagerError('All fields are required.');
                  return;
                }
                // Check for duplicate username or email
                if (managers.some(m => m.username === newManagerUsername.trim() || m.email === newManagerEmail.trim())) {
                  setManagerError('Manager with this username or email already exists.');
                  return;
                }
                const id = generateManagerId();
                const newManager = {
                  id,
                  name: newManagerName.trim(),
                  username: newManagerUsername.trim(),
                  email: newManagerEmail.trim(),
                  password: newManagerPassword,
                  role: 'manager',
                  department: 'Management'
                };
                console.log('Creating new manager:', newManager);
                setManagers(prev => {
                  const updated = [...prev, newManager];
                  console.log('Updated managers array:', updated);
                  return updated;
                });
                setManagerSuccess(`Manager created! ID: ${id}`);
                setNewManagerName('');
                setNewManagerUsername('');
                setNewManagerEmail('');
                setNewManagerPassword('');
                setTimeout(() => {
                  setIsAddManagerModalOpen(false);
                  setManagerSuccess('');
                }, 1200);
              }}>
                <label className="block text-sm font-medium mb-1">Manager Name</label>
                <input
                  type="text"
                  value={newManagerName}
                  onChange={e => setNewManagerName(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="e.g., John Manager"
                  required
                />
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={newManagerUsername}
                  onChange={e => setNewManagerUsername(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Set a username"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newManagerEmail}
                  onChange={e => setNewManagerEmail(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Manager email"
                  required
                />
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newManagerPassword}
                  onChange={e => setNewManagerPassword(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="Set a password"
                  required
                />
                {managerError && <div className="text-red-500 mb-2">{managerError}</div>}
                {managerSuccess && <div className="text-green-600 mb-2">{managerSuccess}</div>}
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">Create</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddManagerModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Display the list of created managers and their IDs */}
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Manager Accounts
            </CardTitle>
            <CardDescription>IDs and passwords to give to managers for login</CardDescription>
          </CardHeader>
          <CardContent>
            {managers.length === 0 ? (
              <div className="">No managers created yet.</div>
            ) : (
              <table className="w-full border-collapse ">
                <thead>
                  <tr className="bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                    <th className="text-left p-3 border-b">Name</th>
                    <th className="text-left p-3 border-b">Username</th>
                    <th className="text-left p-3 border-b">Email</th>
                    <th className="text-left p-3 border-b">Manager ID</th>
                    <th className="text-left p-3 border-b">Password</th>
                    <th className="text-left p-3 border-b">Role</th>
                    <th className="text-left p-3 border-b">Department</th>
                    <th className="text-left p-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                      <td className="p-3 border-b font-medium">{m.name}</td>
                      <td className="p-3 border-b">{m.username}</td>
                      <td className="p-3 border-b">{m.email}</td>
                      <td className="p-3 border-b">{m.id}</td>
                      <td className="p-3 border-b">
                        <div className="flex items-center gap-2">
                          <span>
                            {visibleManagerPasswords[m.id] ? m.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisibleManagerPasswords(prev => ({
                              ...prev,
                              [m.id]: !prev[m.id]
                            }))}
                            className="text-blue-400 hover:text-blue-600 focus:outline-none"
                            aria-label={visibleManagerPasswords[m.id] ? 'Hide password' : 'Show password'}
                          >
                            {visibleManagerPasswords[m.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border-b">{m.role}</td>
                      <td className="p-3 border-b">{m.department}</td>
                      <td className="p-3 border-b">
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditManagerData(m);
                            setIsEditManagerModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {
                            setManagers(prev => prev.filter(man => man.id !== m.id));
                            addActivity('Deleted a manager account', 'warning');
                          }}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Edit Manager Modal */}
        {isEditManagerModalOpen && editManagerData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Manager Account</h3>
              <form onSubmit={e => {
                e.preventDefault();
                setManagers(prev => prev.map(m =>
                  m.id === editManagerData.id ? { ...editManagerData } : m
                ));
                setIsEditManagerModalOpen(false);
                setEditManagerData(null);
              }}>
                <label className="block text-sm font-medium mb-1">Manager ID</label>
                <input
                  type="text"
                  value={editManagerData.id}
                  onChange={e => setEditManagerData(d => ({ ...d, id: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Manager Name</label>
                <input
                  type="text"
                  value={editManagerData.name}
                  onChange={e => setEditManagerData(d => ({ ...d, name: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={editManagerData.username}
                  onChange={e => setEditManagerData(d => ({ ...d, username: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editManagerData.email}
                  onChange={e => setEditManagerData(d => ({ ...d, email: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="text"
                  value={editManagerData.password}
                  onChange={e => setEditManagerData(d => ({ ...d, password: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={editManagerData.role}
                  onChange={e => setEditManagerData(d => ({ ...d, role: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={editManagerData.department}
                  onChange={e => setEditManagerData(d => ({ ...d, department: e.target.value }))}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditManagerModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contact Submission Detail Modal */}
        {isContactDetailModalOpen && selectedContactSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Contact Submission Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsContactDetailModalOpen(false);
                    setSelectedContactSubmission(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                      <p className="text-gray-900 dark:text-white">{selectedContactSubmission.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedContactSubmission.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedContactSubmission.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedContactSubmission.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Message Details */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Message Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Subject</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedContactSubmission.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</label>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContactSubmission.message}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Management */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Status Management</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Status</label>
                      <select
                        value={selectedContactSubmission.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          handleContactStatusChange(selectedContactSubmission.id, newStatus);
                          setSelectedContactSubmission(prev => ({ ...prev, status: newStatus }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          handleDeleteContactSubmission(selectedContactSubmission.id);
                          setIsContactDetailModalOpen(false);
                          setSelectedContactSubmission(null);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default AdminDashboard;
