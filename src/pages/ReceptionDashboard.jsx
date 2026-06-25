import React, { useState, useEffect, useCallback } from "react";
import { backendStorage as localStorage } from "../utils/backendStorage";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Button } from "../components/Button";
import { formatNepaliRupees } from "../utils/currencyFormatter";
import { getProfileImage, isValidImageData } from "../utils/fileStorage";
import { useAuth, useAccounts } from "../context/AuthContext";
import "../styles/animatedProfile.css";
import {
  Users,
  Calendar,
  Search,
  Edit,
  Eye,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  Award,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Download,
  Save,
  X,
  Trash2,
  EyeOff,
  MessageSquare,
} from "lucide-react";

import { parentAccounts as initialParentAccounts } from "../data/parentAccounts";
import { QRCodeCanvas } from "qrcode.react";
import QuickActions from "../components/ReceptionDashboard/QuickActions";

const countryCodes = [
  { code: "+1", name: "USA/Canada" },
  { code: "+91", name: "India" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+81", name: "Japan" },
  { code: "+977", name: "Nepal" },
  { code: "+49", name: "Germany" },
  { code: "+33", name: "France" },
  { code: "+86", name: "China" },
  { code: "+880", name: "Bangladesh" },
  { code: "+92", name: "Pakistan" },
  { code: "+7", name: "Russia" },
  { code: "+39", name: "Italy" },
  { code: "+34", name: "Spain" },
  { code: "+82", name: "South Korea" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+971", name: "UAE" },
  { code: "+20", name: "Egypt" },
  { code: "+27", name: "South Africa" },
  { code: "+55", name: "Brazil" },
];

function getStudentAttendanceStats(studentId, attendanceRecords) {
  const records = attendanceRecords.filter((r) => r.studentId === studentId);
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const total = records.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { present, absent, late, percentage };
}

export default function ReceptionDashboard() {
  const [recentActivities, setRecentActivities] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Load contact submissions from localStorage
  useEffect(() => {
    const loadContactSubmissions = () => {
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      setContactSubmissions(submissions);
    };

    loadContactSubmissions();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'contactSubmissions') {
        loadContactSubmissions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Function to handle contact submission status changes
  const handleContactStatusChange = (submissionId, newStatus) => {
    const updatedSubmissions = contactSubmissions.map(sub => 
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    );
    setContactSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    
    // Add activity for status change
    addActivity(`Contact submission ${newStatus}: ${updatedSubmissions.find(s => s.id === submissionId)?.name}`, 'info');
  };

  // Function to delete contact submission
  const handleDeleteContactSubmission = (submissionId) => {
    const updatedSubmissions = contactSubmissions.filter(sub => sub.id !== submissionId);
    setContactSubmissions(updatedSubmissions);
    localStorage.setItem('contactSubmissions', JSON.stringify(updatedSubmissions));
    
    // Add activity for deletion
    const deletedSubmission = contactSubmissions.find(s => s.id === submissionId);
    addActivity(`Deleted contact submission from ${deletedSubmission?.name}`, 'warning');
  };
  const [selectedClass, setSelectedClass] = useState("all");
  const [studentId, setStudentId] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isViewStudentDetails, setIsViewStudentDetails] = useState(false);
  const [isViewTeacherDetails, setIsViewTeacherDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newClass, setNewClass] = useState({
    name: "",
    teacher: "",
    room: "",
    capacity: "",
    schedule: "",
  });
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    rollNumber: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    studentId: "",
  });
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    qualification: "",
    experience: "",
    address: "",
  });
  const {
    students,
    teachers,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    signup,
    setUser,
  } = useAuth();
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const stored = localStorage.getItem("attendanceRecords");
    return stored ? JSON.parse(stored) : [];
  });
  const [editAttendanceIdx, setEditAttendanceIdx] = useState(null);
  const [editAttendanceStatus, setEditAttendanceStatus] = useState("present");
  const [attendanceSection, setAttendanceSection] = useState('');
  const [attendanceSubject, setAttendanceSubject] = useState('');
  const [attendanceBatch, setAttendanceBatch] = useState('');
  const [attendanceMarking, setAttendanceMarking] = useState({});
  const [attendanceTeacher, setAttendanceTeacher] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [attendanceRemarks, setAttendanceRemarks] = useState({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([
    {
      title: "Parent-Teacher Meeting",
      date: new Date().toISOString().slice(0, 10),
      time: "14:00",
    },
    { title: "Annual Sports Day", date: "", time: "09:00" },
    { title: "Exam Week", date: "", time: "" },
  ]);
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
  const [parentForm, setParentForm] = useState({ studentId: "" });
  const [parentError, setParentError] = useState("");
  const [parentSuccess, setParentSuccess] = useState("");
  const [studentError, setStudentError] = useState("");
  const [studentSuccess, setStudentSuccess] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherSuccess, setTeacherSuccess] = useState("");
  const [classes, setClasses] = useState(() => {
    const stored = localStorage.getItem("classes");
    return stored ? JSON.parse(stored) : [];
  });
  const [editClassIdx, setEditClassIdx] = useState(null);
  const [editClassData, setEditClassData] = useState(null);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);

  // Add state for receptionistId and receptionistInfo
  const [receptionistId, setReceptionistId] = useState(
    localStorage.getItem("receptionistId") || ""
  );
  const [receptionistPassword, setReceptionistPassword] = useState("");
  const [receptionistInfo, setReceptionistInfo] = useState(null);
  const [showReceptionistLoginPrompt, setShowReceptionistLoginPrompt] =
    useState(!receptionistId);
  const [receptionistLoginError, setReceptionistLoginError] = useState("");
  const [showReceptionistPassword, setShowReceptionistPassword] =
    useState(false);

  // Add at the top, after other useState hooks
  const [isAddTeacherAccountModalOpen, setIsAddTeacherAccountModalOpen] =
    useState(false);
  const [newTeacherAccount, setNewTeacherAccount] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
    id: "",
    username: "",
    password: "",
  });
  const [teacherAccountError, setTeacherAccountError] = useState("");
  const [teacherAccountSuccess, setTeacherAccountSuccess] = useState("");
  const [isEditTeacherAccountModalOpen, setIsEditTeacherAccountModalOpen] =
    useState(false);
  const [editTeacherAccountData, setEditTeacherAccountData] = useState(null);

  const [isAddStudentAccountModalOpen, setIsAddStudentAccountModalOpen] =
    useState(false);
  const [isAddParentAccountModalOpen, setIsAddParentAccountModalOpen] =
    useState(false);
  const [newParentAccountName, setNewParentAccountName] = useState("");
  const [newParentAccountEmail, setNewParentAccountEmail] = useState("");
  const [newParentAccountPassword, setNewParentAccountPassword] = useState("");
  const [newParentAccountChildId, setNewParentAccountChildId] = useState("");
  const [newStudentAccountEmail, setNewStudentAccountEmail] = useState("");
  const [newStudentAccountPassword, setNewStudentAccountPassword] =
    useState("");
  const [newStudentAccountClass, setNewStudentAccountClass] = useState("");
  const [newStudentAccountRoll, setNewStudentAccountRoll] = useState("");

  const [newStudentAccount, setNewStudentAccount] = useState({
    name: "",
    email: "",
    class: "",
    id: "",
    username: "",
    password: "",
  });
  const [newParentAccount, setNewParentAccount] = useState({
    name: "",
    email: "",
    childId: "",
    id: "",
    username: "",
    password: "",
  });

  const { login } = useAuth();
  const { teacherAccounts, setTeacherAccounts } = useAccounts();

  // Add state for account type selector
  const [selectedAccountType, setSelectedAccountType] = useState("student");

  // 1. Initialize currentParentAccounts from localStorage if available
  const [currentParentAccounts, setCurrentParentAccounts] = useState(() => {
    const stored = localStorage.getItem("parentAccounts");
    return stored ? JSON.parse(stored) : initialParentAccounts;
  });

  const parentAccounts = currentParentAccounts;

  // Unique ID generators (move these up before any useEffect that uses them)
  const generateStudentId = useCallback(() => {
    const year = new Date().getFullYear();
    let maxNum = 0;
    students.forEach((s) => {
      if (s.studentId && s.studentId.startsWith(`STU-${year}-`)) {
        const num = parseInt(s.studentId.split("-")[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `STU-${year}-${(maxNum + 1).toString().padStart(3, "0")}`;
  }, [students]);

  const generateTeacherId = useCallback(() => {
    const year = new Date().getFullYear();
    let maxNum = 0;
    teacherAccounts.forEach((t) => {
      if (t.id && t.id.startsWith(`TEA-${year}-`)) {
        const num = parseInt(t.id.split("-")[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `TEA-${year}-${(maxNum + 1).toString().padStart(3, "0")}`;
  }, [teacherAccounts]);

  const generateParentId = useCallback(() => {
    const year = new Date().getFullYear();
    let maxNum = 0;
    currentParentAccounts.forEach((p) => {
      if (p.id && p.id.startsWith(`PAR-${year}-`)) {
        const num = parseInt(p.id.split("-")[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `PAR-${year}-${(maxNum + 1).toString().padStart(3, "0")}`;
  }, [currentParentAccounts]);

  useEffect(() => {
    if (isAddStudentAccountModalOpen) {
      const newId = generateStudentId();
      setNewStudentAccount((s) => ({ ...s, id: newId }));
    } else {
      setNewStudentAccount({
        name: "",
        email: "",
        class: "",
        id: "",
        username: "",
        password: "",
      });
    }
  }, [isAddStudentAccountModalOpen, generateStudentId]);

  useEffect(() => {
    if (newStudent.name && newStudent.studentId) {
      const namePart = newStudent.name.toLowerCase().replace(/\s/g, "");
      const idPart = newStudent.studentId.split("-")[2];
      const newUsername = `${namePart}${idPart}`;
      setNewStudent((s) => ({
        ...s,
        username: newUsername,
        password: newUsername,
      }));
    }
  }, [newStudent.name, newStudent.studentId]);

  useEffect(() => {
    if (isAddTeacherAccountModalOpen) {
      const newId = generateTeacherId();
      setNewTeacherAccount((t) => ({ ...t, id: newId }));
    } else {
      setNewTeacherAccount({
        name: "",
        email: "",
        department: "",
        subject: "",
        id: "",
        username: "",
        password: "",
      });
    }
  }, [isAddTeacherAccountModalOpen]);

  useEffect(() => {
    if (newTeacherAccount.name && newTeacherAccount.id) {
      const namePart = newTeacherAccount.name.toLowerCase().replace(/\s/g, "");
      const idPart = newTeacherAccount.id.split("-")[2];
      const newUsername = `${namePart}${idPart}`;
      setNewTeacherAccount((t) => ({
        ...t,
        username: newUsername,
        password: newUsername,
      }));
    }
  }, [newTeacherAccount.name, newTeacherAccount.id]);

  useEffect(() => {
    if (isAddParentAccountModalOpen) {
      const newId = generateParentId();
      setNewParentAccount((p) => ({ ...p, id: newId }));
    } else {
      setNewParentAccount({
        name: "",
        email: "",
        childId: "",
        id: "",
        username: "",
        password: "",
      });
    }
  }, [isAddParentAccountModalOpen]);

  useEffect(() => {
    if (newParentAccount.name && newParentAccount.id) {
      const namePart = newParentAccount.name.toLowerCase().replace(/\s/g, "");
      const idPart = newParentAccount.id.split("-")[2];
      const newUsername = `${namePart}${idPart}`;
      setNewParentAccount((p) => ({
        ...p,
        username: newUsername,
        password: newUsername,
      }));
    }
  }, [newParentAccount.name, newParentAccount.id]);

  // On mount or when receptionistId changes, fetch receptionist info
  useEffect(() => {
    if (receptionistId && receptionistPassword) {
      const accounts = getReceptionists();
      const foundReceptionist = accounts.find(
        (r) => r.id === receptionistId && r.password === receptionistPassword
      );
      if (foundReceptionist) {
        setReceptionistInfo(foundReceptionist);
        setShowReceptionistLoginPrompt(false);
        setReceptionistLoginError("");
        localStorage.setItem("receptionistId", receptionistId);
      } else {
        setReceptionistInfo(null);
        setShowReceptionistLoginPrompt(true);
        setReceptionistLoginError("Invalid Receptionist ID or Password.");
        localStorage.removeItem("receptionistId");
      }
    }
  }, [receptionistId, receptionistPassword]);

  const receptionInfo = {
    name: "Sarah Reception",
    role: "Receptionist",
    receptionId: "REC-2024-001",
    department: "Reception",
  };

  const handleStudentSearch = () => {
    // Search by studentId (string match, case-insensitive)
    const student = students.find(
      (s) =>
        s.studentId &&
        s.studentId.toLowerCase() === studentId.trim().toLowerCase()
    );
    setSearchResults(student || null);
  };

  const handleSaveAttendance = () => {
    // Here you would save the attendance changes
    setIsEditingAttendance(false);
    setEditingStudent(null);
  };

  // Save attendanceRecords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords)
    );
  }, [attendanceRecords]);

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  // Save teacher accounts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("teacherAccounts", JSON.stringify(teacherAccounts));
  }, [teacherAccounts]);

  // 2. Persist currentParentAccounts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "parentAccounts",
      JSON.stringify(currentParentAccounts)
    );
  }, [currentParentAccounts]);

  const renderOverview = () => (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:scale-105 transition-all duration-200 shadow-md">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{students.length}</p>
            <p className="text-sm ">Total Students</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-all duration-200 shadow-md">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{teachers.length}</p>
            <p className="text-sm ">Total Teachers</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-all duration-200 shadow-md">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{classes.length}</p>
            <p className="text-sm ">Active Classes</p>
          </CardContent>
        </Card>
        <Card className="hover:scale-105 transition-all duration-200 shadow-md">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">0%</p>
            <p className="text-sm ">Avg Attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest reception activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-100"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : activity.type === "warning" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent activities</p>
                  <p className="text-sm">
                    Activities will appear here when you add students, teachers,
                    or classes
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Submissions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Contact Submissions
            </CardTitle>
            <CardDescription>New contact form submissions from website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contactSubmissions.length > 0 ? (
                contactSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {submission.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {submission.email} {submission.phone && `• ${submission.phone}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(submission.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          submission.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          submission.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        Subject: {submission.subject}
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {submission.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={submission.status}
                        onChange={(e) => handleContactStatusChange(submission.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteContactSubmission(submission.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No contact submissions</p>
                  <p className="text-sm">
                    Contact form submissions from the website will appear here
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common reception tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <QuickActions
            setIsAddStudentModalOpen={setIsAddStudentModalOpen}
            setIsAddTeacherAccountModalOpen={setIsAddTeacherAccountModalOpen}
            setIsScheduleModalOpen={setIsScheduleModalOpen}
            setIsAttendanceModalOpen={setIsAttendanceModalOpen}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </CardContent>
      </Card>
    </>
  );

  const renderClassSchedule = () => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Class Schedule Management
        </CardTitle>
        <CardDescription>Manage and edit class schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
            />
          </div>
          <Button onClick={() => setIsAddClassModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border-b">Class</th>
                <th className="text-left p-3 border-b">Teacher</th>
                <th className="text-left p-3 border-b">Room</th>
                <th className="text-left p-3 border-b">Capacity</th>
                <th className="text-left p-3 border-b">Schedule</th>
                <th className="text-left p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.length > 0 ? (
                classes.map((cls, idx) => (
                  <tr
                    key={cls.id || cls.name || idx}
                    className="hover:bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                  >
                    <td className="p-3 border-b font-medium">{cls.name}</td>
                    <td className="p-3 border-b">{cls.teacher}</td>
                    <td className="p-3 border-b">{cls.room}</td>
                    <td className="p-3 border-b">{cls.capacity}</td>
                    <td className="p-3 border-b">{cls.schedule}</td>
                    <td className="p-3 border-b">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditClassIdx(idx);
                          setEditClassData({ ...cls });
                        }}
                      >
                        <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No classes scheduled. Add a class to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {editClassIdx !== null && editClassData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Class</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditClassIdx(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setClasses((prev) =>
                    prev.map((c, i) =>
                      i === editClassIdx ? { ...editClassData } : c
                    )
                  );
                  setEditClassIdx(null);
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={editClassData.name}
                    onChange={(e) =>
                      setEditClassData((d) => ({ ...d, name: e.target.value }))
                    }
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Teacher
                  </label>
                  <input
                    type="text"
                    value={editClassData.teacher}
                    onChange={(e) =>
                      setEditClassData((d) => ({
                        ...d,
                        teacher: e.target.value,
                      }))
                    }
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Room</label>
                  <input
                    type="text"
                    value={editClassData.room}
                    onChange={(e) =>
                      setEditClassData((d) => ({ ...d, room: e.target.value }))
                    }
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={editClassData.capacity}
                    onChange={(e) =>
                      setEditClassData((d) => ({
                        ...d,
                        capacity: e.target.value,
                      }))
                    }
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Schedule
                  </label>
                  <textarea
                    value={editClassData.schedule}
                    onChange={(e) =>
                      setEditClassData((d) => ({
                        ...d,
                        schedule: e.target.value,
                      }))
                    }
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditClassIdx(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAttendance = () => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Attendance Management
        </CardTitle>
        <CardDescription>
          View and edit student attendance records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id || cls.name} value={cls.name}>
                {cls.name}
              </option>
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
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((rec, idx) => (
                  <tr key={idx}>
                    <td className="p-3 border-b">{rec.date}</td>
                    <td className="p-3 border-b">{rec.section}</td>
                    <td className="p-3 border-b">{rec.subject}</td>
                    <td className="p-3 border-b">{rec.batch}</td>
                    <td className="p-3 border-b">{rec.studentId}</td>
                    <td className="p-3 border-b capitalize">
                      {editAttendanceIdx === idx ? (
                        <select
                          value={editAttendanceStatus}
                          onChange={(e) =>
                            setEditAttendanceStatus(e.target.value)
                          }
                          className="appearance-none px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      ) : (
                        rec.status
                      )}
                    </td>
                    <td className="p-3 border-b">
                      {editAttendanceIdx === idx ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setAttendanceRecords((records) =>
                              records.map((r, i) =>
                                i === idx
                                  ? { ...r, status: editAttendanceStatus }
                                  : r
                              )
                            );
                            setEditAttendanceIdx(null);
                          }}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditAttendanceIdx(idx);
                            setEditAttendanceStatus(rec.status);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Enhanced Attendance Modal */}
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
      </CardContent>
    </Card>
  );

  const renderStudentSearch = () => (
    <div className="space-y-6">
      {/* Student Search */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Student by ID
          </CardTitle>
          <CardDescription>
            Enter student ID to view complete student information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Student ID (e.g., STU-001)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
            />
            <Button onClick={handleStudentSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="">Student ID:</span>
                    <span className="font-medium">
                      {searchResults.studentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Name:</span>
                    <span className="font-medium">{searchResults.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Class:</span>
                    <span className="font-medium">{searchResults.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Roll Number:</span>
                    <span className="font-medium">
                      {searchResults.rollNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Age:</span>
                    <span className="font-medium">
                      {searchResults.age || "-"} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Gender:</span>
                    <span className="font-medium">
                      {searchResults.gender || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 " />
                    <span>{searchResults.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 " />
                    <span>{searchResults.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 " />
                    <span>{searchResults.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 " />
                    <span>Parent: {searchResults.parentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 " />
                    <span>Parent Phone: {searchResults.parentPhone}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Marks */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Recent Marks
                    </h4>
                    <div className="space-y-2">
                      {(searchResults.marks || []).map((mark, index) => (
                        <div
                          key={index}
                          className="flex justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{mark.subject}</span>
                          <span
                            className={`text-sm font-medium ${
                              mark.grade && mark.grade.includes("A")
                                ? "text-green-600"
                                : mark.grade && mark.grade.includes("B")
                                ? "text-blue-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {mark.grade} ({mark.score})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attendance */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Attendance
                    </h4>
                    {(() => {
                      const stats = getStudentAttendanceStats(
                        searchResults.studentId,
                        attendanceRecords
                      );
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Present:</span>
                            <span className="text-sm font-medium text-green-600">
                              {stats.present}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Absent:</span>
                            <span className="text-sm font-medium text-red-600">
                              {stats.absent}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Late:</span>
                            <span className="text-sm font-medium text-yellow-600">
                              {stats.late}
                            </span>
                          </div>
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Percentage:</span>
                            <span className="text-sm font-medium text-blue-600">
                              {stats.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Fees */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      Fee Status
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Total:</span>
                        <span className="text-sm font-medium">
                          {formatNepaliRupees(
                            (searchResults.fees && searchResults.fees.total) ||
                              0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Paid:</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatNepaliRupees(
                            (searchResults.fees && searchResults.fees.paid) || 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Pending:</span>
                        <span className="text-sm font-medium text-red-600">
                          {formatNepaliRupees(
                            (searchResults.fees &&
                              searchResults.fees.pending) ||
                              0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            searchResults.fees &&
                            searchResults.fees.status === "Paid"
                              ? "text-green-600"
                              : searchResults.fees &&
                                searchResults.fees.status === "Partial"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {(searchResults.fees && searchResults.fees.status) ||
                            "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Parent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
              placeholder="Search students..."
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
            />
          </div>
          <Button onClick={() => setIsAddStudentModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {students.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border-b">Name</th>
                  <th className="text-left p-3 border-b">Username</th>
                  <th className="text-left p-3 border-b">Password</th>
                  <th className="text-left p-3 border-b">Student ID</th>
                  <th className="text-left p-3 border-b">Class</th>
                  <th className="text-left p-3 border-b">Roll Number</th>
                  <th className="text-left p-3 border-b">Email</th>
                  <th className="text-left p-3 border-b">Phone</th>
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                  >
                    <td className="p-3 border-b font-medium">{student.name}</td>
                    <td className="p-3 border-b">{student.username}</td>
                    <td className="p-3 border-b">{student.password}</td>
                    <td className="p-3 border-b">{student.studentId}</td>
                    <td className="p-3 border-b">{student.class}</td>
                    <td className="p-3 border-b">{student.rollNumber}</td>
                    <td className="p-3 border-b">{student.email}</td>
                    <td className="p-3 border-b">{student.phone}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditStudentData(student);
                            setIsEditStudentModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteStudent(student.id)}
                        >
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
              <h3 className="text-lg font-semibold  mb-2">
                No Students Registered
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first student to get started
              </p>
              <Button onClick={() => setIsAddStudentModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Student
              </Button>
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
          <Users className="h-5 w-5 text-green-600" />
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
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
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
                  <th className="text-left p-3 border-b">Status</th>
                  <th className="text-left p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white "
                  >
                    <td className="p-3 border-b font-medium">{teacher.name}</td>
                    <td className="p-3 border-b">{teacher.subject}</td>
                    <td className="p-3 border-b">{teacher.department}</td>
                    <td className="p-3 border-b">{teacher.email}</td>
                    <td className="p-3 border-b">{teacher.phone}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          teacher.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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
                          <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTeacher(teacher.id)}
                        >
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
              <h3 className="text-lg font-semibold  mb-2">
                No Teachers Registered
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first teacher to get started
              </p>
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
              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
            />
          </div>
          <Button onClick={() => setIsAddClassModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.length > 0 ? (
            classes.map((cls, idx) => (
              <Card
                key={cls.id || cls.name || idx}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {cls.students} students
                    </span>
                  </div>
                  <div className="space-y-2 text-sm ">
                    <div>
                      Teacher:{" "}
                      <span className="font-medium">{cls.teacher}</span>
                    </div>
                    <div>
                      Room: <span className="font-medium">Room {cls.id}</span>
                    </div>
                    <div>
                      Schedule:{" "}
                      <span className="font-medium">Mon-Fri 8:00 AM</span>
                    </div>
                    <div>
                      Sections:{" "}
                      {cls.sections && cls.sections.length > 0 ? (
                        <select className="ml-2 px-2 py-1 border rounded">
                          {cls.sections.map((section, i) => (
                            <option key={section + "-" + i} value={section}>
                              {section}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="ml-2 text-gray-400">No sections</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditClassIdx(cls.id);
                        setEditClassData({ ...cls });
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white " />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold  mb-2">
                No Classes Created
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first class to get started
              </p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Date */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {new Date().getDate()}
                </div>
                <div className="text-lg font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm opacity-90 mt-2">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Monthly Calendar</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    Schedule Event
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}

                  {/* Calendar Days */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    const isToday = day === new Date().getDate();
                    // Find events for this day
                    const eventForDay = calendarEvents.find((ev) => {
                      if (!ev.date) return false;
                      const evDate = new Date(ev.date);
                      return (
                        evDate.getDate() === day &&
                        evDate.getMonth() === new Date().getMonth()
                      );
                    });
                    return (
                      <div
                        key={i}
                        className={`p-2 text-center text-sm border rounded relative ${
                          isToday
                            ? "bg-blue-500 text-white font-bold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {day <= 31 ? day : ""}
                        {eventForDay && day <= 31 && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calendarEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-sm ">
                      {ev.date} {ev.time && `, ${ev.time}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  // Helper to get receptionists from localStorage
  const getReceptionists = () => {
    const stored = localStorage.getItem("receptionists");
    return stored ? JSON.parse(stored) : [];
  };

  // Use receptionistInfo for display (fallback to previous receptionInfo if not set)
  const { user } = useAuth();
  const { receptionists } = useAccounts();
  // Try to match by id, then by username (case-insensitive)
  let receptionistProfile = null;
  if (Array.isArray(receptionists) && user) {
    receptionistProfile = receptionists.find((r) => r.id === user.id);
    if (!receptionistProfile && user.username) {
      receptionistProfile = receptionists.find(
        (r) =>
          r.username && r.username.toLowerCase() === user.username.toLowerCase()
      );
    }
  }
  // Retrieve profile image from localStorage if available
  let profileImage = null;
  if (user && (user.id || user.studentId)) {
    profileImage = getProfileImage(user.id || user.studentId);
  }
  const info = {
    ...(receptionistProfile || user || receptionInfo),
    profileImage:
      profileImage || receptionistProfile?.profileImage || user?.profileImage,
  };

  // Add state for student account editing
  const [isEditStudentAccountModalOpen, setIsEditStudentAccountModalOpen] =
    useState(false);
  const [editStudentAccountData, setEditStudentAccountData] = useState(null);

  // Handlers for editing student account
  const handleEditStudentAccount = (student) => {
    setEditStudentAccountData(student);
    setIsEditStudentAccountModalOpen(true);
  };

  const handleSaveEditStudentAccount = () => {
    if (editStudentAccountData) {
      updateStudent(editStudentAccountData.id, editStudentAccountData);
    }
    setIsEditStudentAccountModalOpen(false);
    setEditStudentAccountData(null);
  };

  const handleCancelEditStudentAccount = () => {
    setIsEditStudentAccountModalOpen(false);
    setEditStudentAccountData(null);
  };

  const handleEditTeacherAccount = (teacher) => {
    setEditTeacherAccountData(teacher);
    setIsEditTeacherAccountModalOpen(true);
  };

  // Add state for attendanceStudentId, attendanceClass, attendanceStatus
  const [attendanceStudentId, setAttendanceStudentId] = useState("");
  const [attendanceClass, setAttendanceClass] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");

  // For QR modals and parent/teacher edit modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrStudent, setQRStudent] = useState(null);
  const [isQRTeacherModalOpen, setIsQRTeacherModalOpen] = useState(false);
  const [qrTeacher, setQRTeacher] = useState(null);
  const [isQRParentModalOpen, setIsQRParentModalOpen] = useState(false);
  const [qrParent, setQRParent] = useState(null);

  const [isEditParentModalOpen, setIsEditParentModalOpen] = useState(false);
  const [editParentData, setEditParentData] = useState(null);

  // For generated IDs
  const [generatedStudentId, setGeneratedStudentId] = useState("");
  const [generatedParentId, setGeneratedParentId] = useState("");
  const [generatedTeacherId, setGeneratedTeacherId] = useState("");

  // Handler stubs (define real logic as needed)
  const handleCreateParentAccount = () => {};
  const handleCreateTeacherAccount = () => {
    setTeacherAccounts((prev) => [...prev, newTeacherAccount]);
    setIsAddTeacherAccountModalOpen(false);
    // Optionally reset the newTeacherAccount state here if needed
  };
  const handleEditParent = () => {};
  const handleSaveEditParent = () => {};
  const handleCancelEditParent = () => {};

  function handleCreateStudentAccount() {
    if (
      newStudent.name &&
      newStudent.email &&
      newStudent.phone &&
      newStudent.class &&
      newStudent.rollNumber &&
      newStudent.studentId &&
      newStudent.parentName &&
      newStudent.parentPhone &&
      newStudent.parentEmail &&
      newStudent.address
    ) {
      const studentObj = { ...newStudent, status: "active" };
      addStudent(studentObj);
      setStudentSuccess("Student added successfully!");
      // Always create a new parent account for each student
      const parentName = newStudent.parentName.trim();
      const parentEmail = newStudent.parentEmail || "";
      const parentPhone = newStudent.parentPhone;
      const parentId = generateParentId();
      const nameParts = parentName.split(" ");
      const lastName =
        nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
      const studentIdSuffix = newStudent.studentId.slice(-3);
      const parentUsername =
        lastName.toLowerCase().replace(/\s/g, "") + studentIdSuffix;
      const newParent = {
        id: parentId,
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        childId: newStudent.studentId,
        username: parentUsername,
        password: parentUsername,
      };
      setCurrentParentAccounts((prev) => {
        const updated = [...prev, newParent];
        return updated;
      });
      setIsAddStudentModalOpen(false);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        class: "",
        rollNumber: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        address: "",
        studentId: "",
      });
      setTimeout(() => setStudentSuccess(""), 2000);
      addActivity("Created a student account", "success");
    } else {
      setStudentSuccess("All fields are required.");
      setTimeout(() => setStudentSuccess(""), 2000);
    }
  }

  useEffect(() => {
    if (isAddStudentModalOpen) {
      // Generate a new unique student ID
      let newId;
      do {
        newId = generateStudentId();
      } while (students.some((s) => s.studentId === newId));
      setNewStudent((s) => ({ ...s, studentId: newId }));
    }
  }, [isAddStudentModalOpen, students]);

  // Add these handler functions inside the ReceptionDashboard component:
  function handleDeleteTeacherAccount(id) {
    if (
      window.confirm("Are you sure you want to delete this teacher account?")
    ) {
      setTeacherAccounts((prev) => prev.filter((t) => t.id !== id));
      setDeleteSuccess("Teacher account deleted successfully!");
      setTimeout(() => setDeleteSuccess(""), 2000);
      addActivity("Deleted a teacher account", "warning");
    }
  }
  function handleEditParentAccount(parent) {
    setEditParentData(parent);
    setIsEditParentModalOpen(true);
  }
  function handleDeleteParentAccount(id) {
    if (
      window.confirm("Are you sure you want to delete this parent account?")
    ) {
      setCurrentParentAccounts((prev) => prev.filter((p) => p.id !== id));
      setDeleteSuccess("Parent account deleted successfully!");
      setTimeout(() => setDeleteSuccess(""), 2000);
      addActivity("Deleted a parent account", "warning");
    }
  }
  // Add this handler function inside the ReceptionDashboard component:
  function handleDeleteStudentAccount(id) {
    if (
      window.confirm("Are you sure you want to delete this student account?")
    ) {
      if (typeof deleteStudent === "function") {
        // Find the student by id or studentId
        const student = students.find((s) => s.id === id || s.studentId === id);
        // Remove the student
        deleteStudent(id);
        setDeleteSuccess("Student account deleted successfully!");
        setTimeout(() => setDeleteSuccess(""), 2000);
        addActivity("Deleted a student account", "warning");
        // Also remove the parent account with matching childId
        if (student && student.studentId) {
          setCurrentParentAccounts((prev) => {
            const updated = prev.filter((p) => p.childId !== student.studentId);
            localStorage.setItem("parentAccounts", JSON.stringify(updated));
            return updated;
          });
          addActivity(
            "Deleted a parent account (auto, student deleted)",
            "warning"
          );
        }
      }
    }
  }

  // Add at the top of the component:
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // In the Edit Student modal, define a single close handler:
  const closeEditStudentModal = () => {
    setIsEditStudentModalOpen(false);
    setEditStudentAccountData(null);
  };

  // Add a helper function to add activities
  function addActivity(action, type = "info") {
    setRecentActivities((prev) => [
      {
        id: Date.now(),
        action,
        user: "Reception",
        type,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  }

  // Just before the Edit Parent Account modal rendering:
  const studentForParent = editParentData
    ? students.find((s) => s.studentId === editParentData.childId)
    : null;

  const [visibleStudentPasswords, setVisibleStudentPasswords] = useState({});

  // Add state for teacher and parent password visibility
  const [visibleTeacherPasswords, setVisibleTeacherPasswords] = useState({});
  const [visibleParentPasswords, setVisibleParentPasswords] = useState({});

  // Add this handler function inside the ReceptionDashboard component:
  function handleDeleteActivity(id) {
    setRecentActivities((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <DashboardLayout onTabChange={(tab) => {
      console.log('ReceptionDashboard tab change:', tab);
      setActiveTab(tab);
    }} activeTab={activeTab}>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
            Good morning, {info?.name || "Receptionist"}!
          </h1>
          <p className="text-lg text-white/90 font-medium">
            Manage student information, schedules, and attendance from the
            reception desk.
          </p>
        </div>

        {/* Reception Info Card */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="box small">
                <div className="form flex items-center justify-center overflow-hidden">
                {info?.profileImage && isValidImageData(info.profileImage) ? (
                  <img
                    src={info.profileImage}
                    alt={`${info?.name || 'Receptionist'} Profile`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="flex items-center justify-center w-full h-full"
                  style={{ display: info?.profileImage && isValidImageData(info.profileImage) ? 'none' : 'flex' }}
                >
                  <User className="h-8 w-8" />
                </div>
              </div>
            </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {info?.name || "Receptionist"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm  bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                  <div>
                    Role:{" "}
                    <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      {info?.role || "Receptionist"}
                    </span>
                  </div>
                  <div>
                    ID:{" "}
                    <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      {info?.receptionId || info?.id || "N/A"}
                    </span>
                  </div>
                  <div>
                    Department:{" "}
                    <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      {info?.department || "Reception"}
                    </span>
                  </div>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="defult">View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>



        {/* Tab Content */}
        <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-sm">Current Tab: {activeTab}</p>
        </div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "students" && renderStudents()}
        {activeTab === "teachers" && renderTeachers()}
        {activeTab === "classes" && renderClasses()}
        {activeTab === "schedule" && renderClassSchedule()}
        {activeTab === "attendance" && renderAttendance()}
        {activeTab === "search" && renderStudentSearch()}
        {activeTab === "calendar" && renderCalendar()}


        {/* Attendance Edit Modal */}
        {isEditingAttendance && editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Attendance</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAttendance(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student: {editingStudent.studentName}
                  </label>
                  <label className="block text-sm font-medium mb-1">
                    Class: {editingStudent.class}
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Present
                    </label>
                    <input
                      type="number"
                      defaultValue={editingStudent.present}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Absent
                    </label>
                    <input
                      type="number"
                      defaultValue={editingStudent.absent}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Late
                    </label>
                    <input
                      type="number"
                      defaultValue={editingStudent.late}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveAttendance} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingAttendance(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateStudentAccount();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      value={newStudent.class}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, class: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={newStudent.rollNumber}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          rollNumber: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={generatedStudentId}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      placeholder="e.g., STU-2024-001"
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This ID will be used by students to sign up for their
                      account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={newStudent.parentName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentName: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      value={newStudent.parentPhone}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentPhone: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      value={newStudent.parentEmail}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentEmail: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      value={newStudent.address}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          address: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newStudent.username || ""}
                      readOnly
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newStudent.password || ""}
                      readOnly
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
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
              {studentError && (
                <div className="text-red-500 mb-2">{studentError}</div>
              )}
              {studentSuccess && (
                <div className="text-green-600 mb-2">{studentSuccess}</div>
              )}
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
                  <h4 className="font-semibold text-lg mb-4 text-blue-600">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">
                        Full Name
                      </label>
                      <p className="text-lg font-medium">
                        {selectedStudent?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Email
                      </label>
                      <p className="text-lg">{selectedStudent?.email || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Phone
                      </label>
                      <p className="text-lg">{selectedStudent?.phone || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Address
                      </label>
                      <p className="text-lg">
                        {selectedStudent?.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 text-green-600">
                    Academic Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">
                        Class
                      </label>
                      <p className="text-lg font-medium">
                        {selectedStudent?.class || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Roll Number
                      </label>
                      <p className="text-lg">
                        {selectedStudent?.rollNumber || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Status
                      </label>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedStudent?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedStudent?.status || "-"}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Created
                      </label>
                      <p className="text-lg">
                        {selectedStudent?.createdAt
                          ? new Date(
                              selectedStudent.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-4 text-purple-600">
                    Parent Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium ">
                        Parent Name
                      </label>
                      <p className="text-lg">
                        {selectedStudent?.parentName || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Parent Phone
                      </label>
                      <p className="text-lg">
                        {selectedStudent?.parentPhone || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  Edit Student
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsViewStudentDetails(false)}
                >
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
                  <h4 className="font-semibold text-lg mb-4 text-blue-600">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">
                        Full Name
                      </label>
                      <p className="text-lg font-medium">
                        {selectedTeacher?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Email
                      </label>
                      <p className="text-lg">{selectedTeacher?.email || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Phone
                      </label>
                      <p className="text-lg">{selectedTeacher?.phone || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Address
                      </label>
                      <p className="text-lg">
                        {selectedTeacher?.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 text-green-600">
                    Professional Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium ">
                        Subject
                      </label>
                      <p className="text-lg font-medium">
                        {selectedTeacher?.subject || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Department
                      </label>
                      <p className="text-lg">
                        {selectedTeacher?.department || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Qualification
                      </label>
                      <p className="text-lg">
                        {selectedTeacher?.qualification || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Experience
                      </label>
                      <p className="text-lg">
                        {selectedTeacher?.experience || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium ">
                        Status
                      </label>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedTeacher?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedTeacher?.status || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  <Edit className="h-4 w-4 mr-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  Edit Teacher
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsViewTeacherDetails(false)}
                >
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
                <h3 className="text-xl font-semibold">Add New Class</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddClassModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setClasses((prev) => [...prev, newClass]);
                  setNewClass({
                    name: "",
                    teacher: "",
                    room: "",
                    capacity: "",
                    schedule: "",
                  });
                  setIsAddClassModalOpen(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={newClass.name}
                      onChange={(e) =>
                        setNewClass({ ...newClass, name: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Teacher
                    </label>
                    <input
                      type="text"
                      value={newClass.teacher}
                      onChange={(e) =>
                        setNewClass({ ...newClass, teacher: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Room
                    </label>
                    <input
                      type="text"
                      value={newClass.room}
                      onChange={(e) =>
                        setNewClass({ ...newClass, room: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={newClass.capacity}
                      onChange={(e) =>
                        setNewClass({ ...newClass, capacity: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Schedule
                    </label>
                    <textarea
                      value={newClass.schedule}
                      onChange={(e) =>
                        setNewClass({ ...newClass, schedule: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Add Class
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTeacherError("");
                  setTeacherSuccess("");
                  // Validate required fields
                  if (
                    !newTeacher.name.trim() ||
                    !newTeacher.email.trim() ||
                    !newTeacher.phone.trim() ||
                    !newTeacher.subject.trim() ||
                    !newTeacher.department.trim() ||
                    !newTeacher.qualification.trim() ||
                    !newTeacher.experience.trim() ||
                    !newTeacher.address.trim()
                  ) {
                    setTeacherError("All fields are required.");
                    return;
                  }
                  const success = addTeacher(newTeacher);
                  if (success) {
                    setTeacherSuccess("Teacher added successfully!");
                    setNewTeacher({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      department: "",
                      qualification: "",
                      experience: "",
                      address: "",
                    });
                    setTimeout(() => {
                      setIsAddTeacherModalOpen(false);
                      setTeacherSuccess("");
                    }, 1000);
                    addActivity("Created a teacher account", "success");
                  } else {
                    setTeacherError("Failed to add teacher.");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Teacher Name
                    </label>
                    <input
                      type="text"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newTeacher.subject}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          subject: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={newTeacher.department}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          department: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={newTeacher.qualification}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          qualification: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={newTeacher.experience}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          experience: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      placeholder="e.g., 5 years"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      value={newTeacher.address}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          address: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
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
              {teacherError && (
                <div className="text-red-500 mb-2">{teacherError}</div>
              )}
              {teacherSuccess && (
                <div className="text-green-600 mb-2">{teacherSuccess}</div>
              )}
            </div>
          </div>
        )}

        {isAddParentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md border-4 border-blue-500 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-blue-700">
                  Create Parent Account
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddParentModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    !newParentAccountName.trim() ||
                    !newParentAccountEmail.trim() ||
                    !newParentAccountPassword.trim() ||
                    !newParentAccountChildId.trim()
                  ) {
                    return;
                  }
                  handleCreateParentAccount();
                }}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={newParentAccountName}
                      onChange={(e) => setNewParentAccountName(e.target.value)}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newParentAccountEmail}
                      onChange={(e) => setNewParentAccountEmail(e.target.value)}
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newParentAccountPassword}
                      onChange={(e) =>
                        setNewParentAccountPassword(e.target.value)
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Child ID (Student ID)
                    </label>
                    <input
                      type="text"
                      value={newParentAccountChildId}
                      onChange={(e) =>
                        setNewParentAccountChildId(e.target.value)
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddParentModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
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
                  onClick={closeEditStudentModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStudent(editStudentData.id, editStudentData);
                  setIsEditStudentModalOpen(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div>
                    <label className="block text-sm font-medium mb-1 ">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={editStudentData.name}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          name: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editStudentData.email}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          email: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={editStudentData.phoneCountry || "+977"}
                        onChange={(e) =>
                          setEditStudentData({
                            ...editStudentData,
                            phoneCountry: e.target.value,
                          })
                        }
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                        required
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.name})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={editStudentData.phone}
                        onChange={(e) =>
                          setEditStudentData({
                            ...editStudentData,
                            phone: e.target.value,
                          })
                        }
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                        required
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Class
                    </label>
                    <input
                      type="text"
                      value={editStudentData.class}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          class: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      value={editStudentData.rollNumber}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          rollNumber: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={editStudentData.studentId}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          studentId: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      placeholder="e.g., STU-2024-001"
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This ID will be used by students to sign up for their
                      account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Name
                    </label>
                    <input
                      type="text"
                      value={editStudentData.parentName}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          parentName: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Phone
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={
                          editStudentData.parentPhoneCountry || "+977"
                        }
                        onChange={(e) =>
                          setEditStudentData({
                            ...editStudentData,
                            parentPhoneCountry: e.target.value,
                          })
                        }
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                        required
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.name})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={editStudentData.parentPhone}
                        onChange={(e) =>
                          setEditStudentData({
                            ...editStudentData,
                            parentPhone: e.target.value,
                          })
                        }
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                        required
                        placeholder="Parent phone number"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <textarea
                      value={editStudentData.address}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          address: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      rows="3"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEditStudentModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isScheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Schedule New Event</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCalendarEvents((prev) => [
                    ...prev,
                    { title: eventTitle, date: eventDate, time: eventTime },
                  ]);
                  setEventTitle("");
                  setEventDate("");
                  setEventTime("");
                  setIsScheduleModalOpen(false);
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">
                    Add Event
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Receptionist login prompt modal */}
        {showReceptionistLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Receptionist Login</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!receptionistId.trim() || !receptionistPassword.trim()) {
                    setReceptionistLoginError(
                      "Receptionist ID and password are required."
                    );
                    return;
                  }
                  // Case-insensitive, trimmed matching for ID, username/email/name, and password
                  const foundReceptionist = receptionists.find(
                    (r) =>
                      r.id &&
                      r.id.trim().toLowerCase() ===
                        receptionistId.trim().toLowerCase() &&
                      r.password &&
                      r.password === receptionistPassword
                  );
                  if (foundReceptionist) {
                    setReceptionistInfo(foundReceptionist);
                    setShowReceptionistLoginPrompt(false);
                    setReceptionistLoginError("");
                    // Set user in context for ProtectedRoute
                    login(
                      foundReceptionist.username ||
                        foundReceptionist.email ||
                        foundReceptionist.name,
                      receptionistPassword,
                      {
                        role: "reception",
                        id: receptionistId,
                        username: foundReceptionist.username,
                        name: foundReceptionist.name,
                        email: foundReceptionist.email,
                        department: foundReceptionist.department,
                      }
                    );
                    localStorage.setItem(
                      "receptionistId",
                      receptionistId.trim()
                    );
                  } else {
                    setReceptionistLoginError(
                      "Invalid Receptionist ID or Password."
                    );
                  }
                }}
              >
                <label className="block text-sm font-medium mb-1">
                  Receptionist ID
                </label>
                <input
                  type="text"
                  value={receptionistId}
                  onChange={(e) => setReceptionistId(e.target.value)}
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  placeholder="e.g., REC-2025-001"
                  required
                />
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative mb-2" style={{ minHeight: 44 }}>
                  <input
                    type={showReceptionistPassword ? "text" : "password"}
                    value={receptionistPassword}
                    onChange={(e) => setReceptionistPassword(e.target.value)}
                    className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    required
                    style={{
                      padding: "0 10px",
                      borderRadius: "6px",
                      height: 44,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowReceptionistPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500 focus:outline-none"
                    tabIndex={-1}
                    aria-label={
                      showReceptionistPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    style={{
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showReceptionistPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {receptionistLoginError && (
                  <div className="text-red-500 mb-2">
                    {receptionistLoginError}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddTeacherAccountModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Create Teacher Account
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddTeacherAccountModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateTeacherAccount();
                }}
              >
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newTeacherAccount.name}
                  onChange={(e) =>
                    setNewTeacherAccount((t) => ({
                      ...t,
                      name: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newTeacherAccount.email}
                  onChange={(e) =>
                    setNewTeacherAccount((t) => ({
                      ...t,
                      email: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newTeacherAccount.department}
                  onChange={(e) =>
                    setNewTeacherAccount((t) => ({
                      ...t,
                      department: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTeacherAccount.subject}
                  onChange={(e) =>
                    setNewTeacherAccount((t) => ({
                      ...t,
                      subject: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">
                  Teacher ID
                </label>
                <input
                  type="text"
                  value={newTeacherAccount.id}
                  readOnly
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newTeacherAccount.username}
                  readOnly
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={newTeacherAccount.password}
                  readOnly
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTeacherAccountModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Username and Password will be set to the generated ID: e.g.,
                  TEA-2025-002
                </p>
              </form>
            </div>
          </div>
        )}

        {isEditTeacherAccountModalOpen && editTeacherAccountData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                Edit Teacher Account
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTeacherAccounts((prev) =>
                    prev.map((t) =>
                      t.id === editTeacherAccountData.id
                        ? { ...editTeacherAccountData }
                        : t
                    )
                  );
                  setIsEditTeacherAccountModalOpen(false);
                  setEditTeacherAccountData(null);
                }}
              >
                <label className="block text-sm font-medium mb-1">
                  Teacher ID
                </label>
                <input
                  type="text"
                  value={editTeacherAccountData.id}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      id: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editTeacherAccountData.username || ""}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      username: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editTeacherAccountData.name}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      name: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editTeacherAccountData.email}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      email: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={editTeacherAccountData.password}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      password: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                  required
                />
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={editTeacherAccountData.department}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      department: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={editTeacherAccountData.subject}
                  onChange={(e) =>
                    setEditTeacherAccountData((d) => ({
                      ...d,
                      subject: e.target.value,
                    }))
                  }
                  className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                />
                <div className="flex gap-3 mt-4">
                  <Button type="submit" className="flex-1">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditTeacherAccountModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Only show account type selector and tables in overview tab */}
        {activeTab === "overview" && (
          <>
            <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
              <label className="font-semibold">Select Account Type:</label>
              <select
                value={selectedAccountType}
                onChange={(e) => setSelectedAccountType(e.target.value)}
                className="appearance-none  px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
              >
                <option value="student">Student Accounts</option>
                <option value="teacher">Teacher Accounts</option>
                <option value="parent">Parent Accounts</option>
              </select>
            </div>
            {selectedAccountType === "student" && (
              <>
                {/* Student Accounts Table and modals here */}
                <Card className="shadow-md mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Student Accounts
                    </CardTitle>
                    <CardDescription>
                      IDs and passwords to give to students for login
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                            <th className="p-3 border-b text-left">Name</th>
                            <th className="p-3 border-b text-left">Username</th>
                            <th className="p-3 border-b text-left">Email</th>
                            <th className="p-3 border-b text-left">ID</th>
                            <th className="p-3 border-b text-left">Password</th>
                            <th className="p-3 border-b text-left">Class</th>
                            <th className="p-3 border-b text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter((s) => s.status === "active")
                            .map((s, idx) => (
                              <tr key={s.studentId || idx}>
                                <td className="p-3 border-b">{s.name}</td>
                                <td className="p-3 border-b">
                                  {s.username || "-"}
                                </td>
                                <td className="p-3 border-b">{s.email}</td>
                                <td className="p-3 border-b">{s.studentId}</td>
                                <td className="p-3 border-b">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {visibleStudentPasswords[s.studentId]
                                        ? s.password
                                        : "••••••••"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setVisibleStudentPasswords((prev) => ({
                                          ...prev,
                                          [s.studentId]: !prev[s.studentId],
                                        }))
                                      }
                                      className="text-blue-400 hover:text-blue-600 focus:outline-none"
                                      aria-label={
                                        visibleStudentPasswords[s.studentId]
                                          ? "Hide password"
                                          : "Show password"
                                      }
                                    >
                                      {visibleStudentPasswords[s.studentId] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 border-b">
                                  {s.class || "-"}
                                </td>
                                <td className="p-3 border-b flex gap-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditStudentAccount(s)}
                                    className="mr-2"
                                  >
                                    <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setQRStudent(s);
                                      setIsQRModalOpen(true);
                                    }}
                                  >
                                    QR
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteStudentAccount(
                                        s.id || s.studentId
                                      )
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                {/* Student QR and Edit modals here */}
                {isEditStudentModalOpen && editStudentData && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Edit Student</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={closeEditStudentModal}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateStudent(editStudentData.id, editStudentData);
                          setIsEditStudentModalOpen(false);
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Student Name
                            </label>
                            <input
                              type="text"
                              value={editStudentData.name}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  name: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={editStudentData.email}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  email: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Phone
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={editStudentData.phoneCountry || "+977"}
                                onChange={(e) =>
                                  setEditStudentData({
                                    ...editStudentData,
                                    phoneCountry: e.target.value,
                                  })
                                }
                                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                                required
                              >
                                {countryCodes.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.code} ({c.name})
                                  </option>
                                ))}
                              </select>
                              <input
                                type="tel"
                                value={editStudentData.phone}
                                onChange={(e) =>
                                  setEditStudentData({
                                    ...editStudentData,
                                    phone: e.target.value,
                                  })
                                }
                                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                                required
                                placeholder="Phone number"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Class
                            </label>
                            <input
                              type="text"
                              value={editStudentData.class}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  class: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Roll Number
                            </label>
                            <input
                              type="text"
                              value={editStudentData.rollNumber}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  rollNumber: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Student ID
                            </label>
                            <input
                              type="text"
                              value={editStudentData.studentId}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  studentId: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              placeholder="e.g., STU-2024-001"
                              required
                              readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              This ID will be used by students to sign up for
                              their account
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Parent Name
                            </label>
                            <input
                              type="text"
                              value={editStudentData.parentName}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  parentName: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Parent Phone
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={
                                  editStudentData.parentPhoneCountry || "+977"
                                }
                                onChange={(e) =>
                                  setEditStudentData({
                                    ...editStudentData,
                                    parentPhoneCountry: e.target.value,
                                  })
                                }
                                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                                required
                              >
                                {countryCodes.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.code} ({c.name})
                                  </option>
                                ))}
                              </select>
                              <input
                                type="tel"
                                value={editStudentData.parentPhone}
                                onChange={(e) =>
                                  setEditStudentData({
                                    ...editStudentData,
                                    parentPhone: e.target.value,
                                  })
                                }
                                className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                                required
                                placeholder="Parent phone number"
                              />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Address
                            </label>
                            <textarea
                              value={editStudentData.address}
                              onChange={(e) =>
                                setEditStudentData({
                                  ...editStudentData,
                                  address: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              rows="3"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <Button type="submit" className="flex-1">
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeEditStudentModal}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {isQRModalOpen && qrStudent && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">
                          Student QR Code
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsQRModalOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <QRCodeCanvas
                          value={JSON.stringify(qrStudent)}
                          size={200}
                        />
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {qrStudent.name}
                          </div>
                          <div>ID: {qrStudent.id}</div>
                          <div>Email: {qrStudent.email}</div>
                          <div>Class: {qrStudent.class}</div>
                          {/* Add more details as needed, e.g. attendance, grade, etc. */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isEditStudentAccountModalOpen && editStudentAccountData && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Edit Student</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={closeEditStudentModal}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateStudent(
                            editStudentAccountData?.id,
                            editStudentAccountData
                          );
                          // If the edited student is the logged-in user, update the info/profile image in context/localStorage
                          if (
                            user &&
                            user.id === editStudentAccountData?.id &&
                            editStudentAccountData?.profileImage
                          ) {
                            setUser({
                              ...user,
                              profileImage: editStudentAccountData.profileImage,
                            });
                            localStorage.setItem(
                              "user",
                              JSON.stringify({
                                ...user,
                                profileImage:
                                  editStudentAccountData.profileImage,
                              })
                            );
                          }
                          setIsEditStudentAccountModalOpen(false);
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Student Name
                            </label>
                            <input
                              type="text"
                              value={editStudentAccountData?.name || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  name: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={editStudentAccountData?.email || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  email: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={editStudentAccountData?.phone || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  phone: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Class
                            </label>
                            <input
                              type="text"
                              value={editStudentAccountData?.class || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  class: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Parent Name
                            </label>
                            <input
                              type="text"
                              value={editStudentAccountData?.parentName || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  parentName: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Parent Phone
                            </label>
                            <input
                              type="tel"
                              value={editStudentAccountData?.parentPhone || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  parentPhone: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Parent Email
                            </label>
                            <input
                              type="email"
                              value={editStudentAccountData?.parentEmail || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  parentEmail: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Address
                            </label>
                            <textarea
                              value={editStudentAccountData?.address || ""}
                              onChange={(e) =>
                                setEditStudentAccountData({
                                  ...editStudentAccountData,
                                  address: e.target.value,
                                })
                              }
                              className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                              rows="3"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Profile Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setEditStudentAccountData((prev) => ({
                                      ...prev,
                                      profileImage: ev.target.result,
                                    }));
                                    // Save to localStorage by id
                                    if (
                                      editStudentAccountData &&
                                      (editStudentAccountData.id ||
                                        editStudentAccountData.studentId)
                                    ) {
                                      localStorage.setItem(
                                        `profileImage_${
                                          editStudentAccountData.id ||
                                          editStudentAccountData.studentId
                                        }`,
                                        ev.target.result
                                      );
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            {editStudentAccountData?.profileImage && (
                              <img
                                src={editStudentAccountData.profileImage}
                                alt="Profile Preview"
                                style={{
                                  width: 90,
                                  height: 90,
                                  borderRadius: "100%",
                                  objectFit: "cover",
                                  marginTop: 8,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <Button type="submit" className="flex-1">
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={closeEditStudentModal}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
            {selectedAccountType === "teacher" && (
              <>
                <Card className="shadow-md mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Teacher Accounts
                    </CardTitle>
                    <CardDescription>
                      IDs and passwords to give to teachers for login
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                            <th className="p-3 border-b text-left">Name</th>
                            <th className="p-3 border-b text-left">Username</th>
                            <th className="p-3 border-b text-left">Email</th>
                            <th className="p-3 border-b text-left">ID</th>
                            <th className="p-3 border-b text-left">Password</th>
                            <th className="p-3 border-b text-left">
                              Department
                            </th>
                            <th className="p-3 border-b text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teacherAccounts && teacherAccounts.length > 0 ? (
                            teacherAccounts.map((t, idx) => (
                              <tr key={t.id || idx}>
                                <td className="p-3 border-b">{t.name}</td>
                                <td className="p-3 border-b">
                                  {t.username || "-"}
                                </td>
                                <td className="p-3 border-b">{t.email}</td>
                                <td className="p-3 border-b">{t.id}</td>
                                <td className="p-3 border-b">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {visibleTeacherPasswords[t.id]
                                        ? t.password
                                        : "••••••••"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setVisibleTeacherPasswords((prev) => ({
                                          ...prev,
                                          [t.id]: !prev[t.id],
                                        }))
                                      }
                                      className="text-blue-400 hover:text-blue-600 focus:outline-none"
                                      aria-label={
                                        visibleTeacherPasswords[t.id]
                                          ? "Hide password"
                                          : "Show password"
                                      }
                                    >
                                      {visibleTeacherPasswords[t.id] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 border-b">
                                  {t.department || "-"}
                                </td>
                                <td className="p-3 border-b flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditTeacherAccount(t)}
                                    className="mr-2"
                                  >
                                    <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setQRTeacher(t);
                                      setIsQRTeacherModalOpen(true);
                                    }}
                                  >
                                    QR
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteTeacherAccount(t.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center p-4">
                                No Teacher Accounts
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {selectedAccountType === "parent" && (
              <>
                <Card className="shadow-md mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Parent Accounts
                    </CardTitle>
                    <CardDescription>
                      IDs and passwords to give to parents for login
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ">
                            <th className="p-3 border-b text-left">Name</th>
                            <th className="p-3 border-b text-left">Username</th>
                            <th className="p-3 border-b text-left">Email</th>
                            <th className="p-3 border-b text-left">ID</th>
                            <th className="p-3 border-b text-left">Password</th>
                            <th className="p-3 border-b text-left">Child ID</th>
                            <th className="p-3 border-b text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentParentAccounts &&
                          currentParentAccounts.length > 0 ? (
                            currentParentAccounts.map((p, idx) => (
                              <tr key={p.id || idx}>
                                <td className="p-3 border-b">{p.name}</td>
                                <td className="p-3 border-b">
                                  {p.username || "-"}
                                </td>
                                <td className="p-3 border-b">{p.email}</td>
                                <td className="p-3 border-b">{p.id}</td>
                                <td className="p-3 border-b">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      {visibleParentPasswords[p.id]
                                        ? p.password
                                        : "••••••••"}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setVisibleParentPasswords((prev) => ({
                                          ...prev,
                                          [p.id]: !prev[p.id],
                                        }))
                                      }
                                      className="text-blue-400 hover:text-blue-600 focus:outline-none"
                                      aria-label={
                                        visibleParentPasswords[p.id]
                                          ? "Hide password"
                                          : "Show password"
                                      }
                                    >
                                      {visibleParentPasswords[p.id] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 border-b">
                                  {p.childId || "-"}
                                </td>
                                <td className="p-3 border-b flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditParentAccount(p)}
                                    className="mr-2"
                                  >
                                    <Edit className="h-4 w-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setQRParent(p);
                                      setIsQRParentModalOpen(true);
                                    }}
                                  >
                                    QR
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteParentAccount(p.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center p-4">
                                No Parent Accounts
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
        {deleteSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded shadow text-center font-semibold">
            {deleteSuccess}
          </div>
        )}
        {isEditParentModalOpen &&
          editParentData &&
          (() => {
            const studentForParent = students.find(
              (s) => s.studentId === editParentData.childId
            );
            // Debug log
            console.log("Edit Parent Modal:", {
              students,
              childId: editParentData.childId,
              studentForParent,
            });
            return (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">
                      Edit Parent Account
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditParentModalOpen(false);
                        setEditParentData(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Show student info if available, or fallback if not found */}
                  {studentForParent ? (
                    <div className="mb-4 p-3 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-700">
                        Student Info
                      </div>
                      <div>Name: {studentForParent.name}</div>
                      <div>Student ID: {studentForParent.studentId}</div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-yellow-50 rounded text-yellow-700">
                      <div className="font-semibold">
                        No student found for Child ID: {editParentData.childId}
                      </div>
                      <div>
                        Check if the student exists and the Child ID is correct.
                      </div>
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCurrentParentAccounts((prev) =>
                        prev.map((p) =>
                          p.id === editParentData.id
                            ? { ...p, ...editParentData }
                            : p
                        )
                      );
                      setIsEditParentModalOpen(false);
                      setEditParentData(null);
                    }}
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Parent Name
                        </label>
                        <input
                          type="text"
                          value={editParentData?.name || ""}
                          onChange={(e) =>
                            setEditParentData({
                              ...editParentData,
                              name: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editParentData?.email || ""}
                          onChange={(e) =>
                            setEditParentData({
                              ...editParentData,
                              email: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Password
                        </label>
                        <input
                          type="text"
                          value={editParentData?.password || ""}
                          onChange={(e) =>
                            setEditParentData({
                              ...editParentData,
                              password: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Child ID
                        </label>
                        <input
                          type="text"
                          value={editParentData?.childId || ""}
                          onChange={(e) =>
                            setEditParentData({
                              ...editParentData,
                              childId: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button type="submit" className="flex-1">
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditParentModalOpen(false);
                          setEditParentData(null);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            );
          })()}
      </div>
    </DashboardLayout>
  );
}
