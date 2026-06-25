import React, { useState, useEffect } from "react";
import { backendStorage as localStorage } from "../utils/backendStorage";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Plus,
  Edit,
  Trash2,
  X,
  Bell,
  Settings,
  User,
} from "lucide-react";

export default function ManageDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);

  // Class Management
  const [newClass, setNewClass] = useState({
    name: "",
    teacher: "",
    subject: "",
    capacity: "",
    section: "",
    schedule: "",
    room: "",
  });

  // Schedule Management
  const [newSchedule, setNewSchedule] = useState({
    class: "",
    day: "",
    startTime: "",
    endTime: "",
    teacher: "",
    room: "",
  });

  // Result Management
  const [newResult, setNewResult] = useState({
    studentId: "",
    class: "",
    subject: "",
    examType: "",
    marks: "",
    totalMarks: "",
    grade: "",
    remarks: "",
  });

  // Student Management
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    section: "",
    rollNumber: "",
    parentName: "",
    parentPhone: "",
    address: "",
  });

  // Section Management
  const [newSection, setNewSection] = useState({
    name: "",
    class: "",
    capacity: "",
    teacher: "",
    room: "",
  });
  const [selectedSectionStudents, setSelectedSectionStudents] = useState([]);
  const {
    students: globalStudents = [],
    teachers = [],
    classes = [],
    teacherAccounts,
    addStudent,
    setStudents: setGlobalStudents,
  } = useAuth();

  const [students, setStudents] = useState(globalStudents);

  useEffect(() => {
    setStudents(globalStudents);
  }, [globalStudents]);

  const [classSchedules, setClassSchedules] = useState(() => {
    const stored = localStorage.getItem("classSchedules");
    return stored ? JSON.parse(stored) : [];
  });

  const [results, setResults] = useState(() => {
    const stored = localStorage.getItem("results");
    return stored ? JSON.parse(stored) : [];
  });

  const [sections, setSections] = useState(() => {
    const stored = localStorage.getItem("sections");
    return stored ? JSON.parse(stored) : [];
  });

  const [modalClasses, setModalClasses] = useState([]);
  const [dashboardClasses, setDashboardClasses] = useState(() => {
    const stored = localStorage.getItem("classes");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(dashboardClasses));
  }, [dashboardClasses]);

  const [activities, setActivities] = useState(() => {
    const stored = localStorage.getItem("activities");
    return stored ? JSON.parse(stored) : [];
  });

  const [editSectionData, setEditSectionData] = useState(null);

  // State for editing modals
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [editClassData, setEditClassData] = useState(null);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
  const [editScheduleData, setEditScheduleData] = useState(null);
  const [isEditResultModalOpen, setIsEditResultModalOpen] = useState(false);
  const [editResultData, setEditResultData] = useState(null);

  useEffect(() => {
    if (activeTab === 'classes') {
      const stored = localStorage.getItem("classes");
      setDashboardClasses(stored ? JSON.parse(stored) : []);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isSectionModalOpen || isScheduleModalOpen) {
      const stored = localStorage.getItem("classes");
      setModalClasses(stored ? JSON.parse(stored) : []);
    }
  }, [isSectionModalOpen, isScheduleModalOpen]);


  // Debug logging - moved after all state declarations
  console.log('ManageDashboard loaded with data:', {
    students: students?.length || 0,
    teachers: teachers?.length || 0,
    classes: classes?.length || 0,
    classSchedules: classSchedules?.length || 0,
    results: results?.length || 0,
    sections: sections?.length || 0
  });

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("classSchedules", JSON.stringify(classSchedules));
  }, [classSchedules]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);


  const addActivity = (action, type = "info") => {
    const activity = {
      id: Date.now(),
      action,
      type,
      timestamp: new Date().toLocaleString(),
    };
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    activities.unshift(activity);
    localStorage.setItem("activities", JSON.stringify(activities.slice(0, 50)));
  };

  const deleteActivity = (id) => {
    const updated = activities.filter(activity => activity.id !== id);
    setActivities(updated);
  };

  const handleEditSection = (section) => {
    setEditSectionData(section);
    setIsEditSectionModalOpen(true);
  };

  const handleSaveEditSection = () => {
    const updatedSections = sections.map(s =>
      s.name === editSectionData.name ? editSectionData : s
    );
    setSections(updatedSections);
    setIsEditSectionModalOpen(false);
    setEditSectionData(null);
  };

  const handleEditStudent = (student) => {
    setEditStudentData(student);
    setIsEditStudentModalOpen(true);
  };

  const handleSaveEditStudent = () => {
    const updated = students.map(s => s.id === editStudentData.id ? editStudentData : s);
    setStudents(updated);
    setIsEditStudentModalOpen(false);
    setEditStudentData(null);
  };

  const handleEditClass = (cls) => {
    setEditClassData(cls);
    setIsEditClassModalOpen(true);
  };

  const handleSaveEditClass = () => {
    const updated = dashboardClasses.map(c => c.name === editClassData.name ? editClassData : c);
    setDashboardClasses(updated);
    setIsEditClassModalOpen(false);
    setEditClassData(null);
  };

  const handleEditSchedule = (schedule) => {
    setEditScheduleData(schedule);
    setIsEditScheduleModalOpen(true);
  };

  const handleSaveEditSchedule = () => {
    const updated = classSchedules.map(s => s.id === editScheduleData.id ? editScheduleData : s);
    setClassSchedules(updated);
    setIsEditScheduleModalOpen(false);
    setEditScheduleData(null);
  };

  const handleEditResult = (result) => {
    setEditResultData(result);
    setIsEditResultModalOpen(true);
  };

  const handleSaveEditResult = () => {
    const updated = results.map(r => r.id === editResultData.id ? editResultData : r);
    setResults(updated);
    setIsEditResultModalOpen(false);
    setEditResultData(null);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    const newClassObj = { ...newClass, id: Date.now() };
    setDashboardClasses(prev => [...prev, newClassObj]);
    setNewClass({
      name: "",
      teacher: "",
      subject: "",
      capacity: "",
      section: "",
      schedule: "",
      room: "",
    });
    setIsClassModalOpen(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
          Manage Dashboard
        </h1>
        <p className="text-lg text-white/90 font-medium">
          Comprehensive management system for classes, schedules, results, and students.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{students?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{classes?.length || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Classes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{classSchedules?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published Results</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{results?.length || 0}</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setIsClassModalOpen(true)}
              className="h-16 flex-col gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Class
            </Button>
            <Button 
              onClick={() => setIsScheduleModalOpen(true)}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <Clock className="h-5 w-5" />
              Schedule Class
            </Button>
            <Button 
              onClick={() => setIsResultModalOpen(true)}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <Award className="h-5 w-5" />
              Publish Result
            </Button>
            <Button 
              onClick={() => setIsStudentModalOpen(true)}
              variant="outline"
              className="h-16 flex-col gap-2"
            >
              <User className="h-5 w-5" />
              Add Student
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-600" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => deleteActivity(activity.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderClassManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Class Management</h2>
        <Button onClick={() => setIsClassModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(dashboardClasses || []).map((cls, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{cls.name}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClass(cls)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{cls.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Teacher:</strong> {cls.teacher}</p>
                <p><strong>Section:</strong> {cls.section}</p>
                <p><strong>Capacity:</strong> {cls.capacity}</p>
                <p><strong>Room:</strong> {cls.room}</p>
                <p><strong>Schedule:</strong> {cls.schedule}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Class Modal */}
      {isEditClassModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Class</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEditClass(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class Name</label>
                <input
                  type="text"
                  value={editClassData.name}
                  onChange={(e) => setEditClassData({...editClassData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <select
                  value={editClassData.teacher}
                  onChange={(e) => setEditClassData({...editClassData, teacher: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teacherAccounts.map(teacher => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={editClassData.subject}
                  onChange={(e) => setEditClassData({...editClassData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Section</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editClassData.section}
                  onChange={e => setEditClassData({ ...editClassData, section: e.target.value })}
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section.name} value={section.name}>{section.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  value={editClassData.capacity}
                  onChange={(e) => setEditClassData({...editClassData, capacity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Room</label>
                <input
                  type="text"
                  value={editClassData.room}
                  onChange={(e) => setEditClassData({...editClassData, room: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditClassModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderScheduleManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule Management</h2>
        <Button onClick={() => setIsScheduleModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Class</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Day</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Time</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Teacher</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Room</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(classSchedules || []).map((schedule, index) => (
              <tr key={index}>
                <td className="border border-gray-300 dark:border-gray-600 p-3">{schedule.class}</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">{schedule.day}</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">{schedule.startTime} - {schedule.endTime}</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">{schedule.teacher}</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">{schedule.room}</td>
                <td className="border border-gray-300 dark:border-gray-600 p-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditSchedule(schedule)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Schedule Modal */}
      {isEditScheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Schedule</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEditSchedule(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  value={editScheduleData.class}
                  onChange={(e) => setEditScheduleData({...editScheduleData, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Class</option>
                  {(modalClasses || []).map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Day</label>
                <select
                  value={editScheduleData.day}
                  onChange={(e) => setEditScheduleData({...editScheduleData, day: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={editScheduleData.startTime}
                  onChange={(e) => setEditScheduleData({...editScheduleData, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={editScheduleData.endTime}
                  onChange={(e) => setEditScheduleData({...editScheduleData, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <select
                  value={editScheduleData.teacher}
                  onChange={(e) => setEditScheduleData({...editScheduleData, teacher: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teacherAccounts.map(teacher => (
                    <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Room</label>
                <input
                  type="text"
                  value={editScheduleData.room}
                  onChange={(e) => setEditScheduleData({...editScheduleData, room: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditScheduleModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderResultManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Result Management</h2>
        <Button onClick={() => setIsResultModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Publish Result
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(results || []).map((result, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{result.studentId}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditResult(result)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{result.subject} - {result.examType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Class:</strong> {result.class}</p>
                <p><strong>Marks:</strong> {result.marks}/{result.totalMarks}</p>
                <p><strong>Percentage:</strong> {Math.round((result.marks / result.totalMarks) * 100)}%</p>
                <p><strong>Remarks:</strong> {result.remarks}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Result Modal */}
      {isEditResultModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Result</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEditResult(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Student ID</label>
                <select
                  value={editResultData.studentId}
                  onChange={(e) => setEditResultData({...editResultData, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Student</option>
                  {(students || []).map(student => (
                    <option key={student.id} value={student.studentId}>{student.name} - {student.studentId}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class</label>
                <select
                  value={editResultData.class}
                  onChange={(e) => setEditResultData({...editResultData, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Class</option>
                  {(classes || []).map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  value={editResultData.subject}
                  onChange={(e) => setEditResultData({...editResultData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Exam Type</label>
                <select
                  value={editResultData.examType}
                  onChange={(e) => setEditResultData({...editResultData, examType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Exam Type</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Term">Final Term</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Marks Obtained</label>
                <input
                  type="number"
                  value={editResultData.marks}
                  onChange={(e) => setEditResultData({...editResultData, marks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Total Marks</label>
                <input
                  type="number"
                  value={editResultData.totalMarks}
                  onChange={(e) => setEditResultData({...editResultData, totalMarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Grade</label>
                <select
                  value={editResultData.grade}
                  onChange={(e) => setEditResultData({...editResultData, grade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="A">A (90-100%)</option>
                  <option value="B">B (80-89%)</option>
                  <option value="C">C (70-79%)</option>
                  <option value="D">D (60-69%)</option>
                  <option value="F">F (Below 60%)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <textarea
                  value={editResultData.remarks}
                  onChange={(e) => setEditResultData({...editResultData, remarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">Publish Result</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditResultModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudentManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Button onClick={() => setIsStudentModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Student Management List with Edit Button and full details */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Section</th>
              <th className="px-4 py-2">Roll No</th>
              <th className="px-4 py-2">Parent</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.class}</td>
                <td className="px-4 py-2">{student.section}</td>
                <td className="px-4 py-2">{student.rollNumber}</td>
                <td className="px-4 py-2">{student.parentName}</td>
                <td className="px-4 py-2">
                  <Button size="icon" variant="primary" style={{ minWidth: 32, minHeight: 32, padding: 0 }} onClick={() => handleEditStudent(student)}>
                    <Edit className="h-3 w-3" style={{ color: '#2563eb' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Student Modal */}
      {isEditStudentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEditStudent(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border rounded px-2 py-1" value={editStudentData.name} onChange={e => setEditStudentData({ ...editStudentData, name: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class</label>
                <input className="w-full border rounded px-2 py-1" value={editStudentData.class} onChange={e => setEditStudentData({ ...editStudentData, class: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Section</label>
                <input className="w-full border rounded px-2 py-1" value={editStudentData.section} onChange={e => setEditStudentData({ ...editStudentData, section: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <input className="w-full border rounded px-2 py-1" value={editStudentData.rollNumber} onChange={e => setEditStudentData({ ...editStudentData, rollNumber: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Parent Name</label>
                <input className="w-full border rounded px-2 py-1" value={editStudentData.parentName} onChange={e => setEditStudentData({ ...editStudentData, parentName: e.target.value })} required />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditStudentModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderSectionManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Section Management</h2>
        <Button onClick={() => setIsSectionModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Section List with Edit Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(section => (
          <Card key={section.name} className="shadow-md">
            <CardHeader>
              <CardTitle>{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Class: {section.class}</p>
              <p>Capacity: {section.capacity}</p>
              <p>Teacher: {section.teacher}</p>
              <p>Room: {section.room}</p>
              <Button size="sm" variant="outline" onClick={() => handleEditSection(section)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Section Modal */}
      {isEditSectionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Section</h2>
            <form onSubmit={e => { e.preventDefault(); handleSaveEditSection(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Section Name</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editSectionData.name}
                  onChange={e => setEditSectionData({ ...editSectionData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Class</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editSectionData.class}
                  onChange={e => setEditSectionData({ ...editSectionData, class: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editSectionData.capacity}
                  onChange={e => setEditSectionData({ ...editSectionData, capacity: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Teacher</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editSectionData.teacher}
                  onChange={e => setEditSectionData({ ...editSectionData, teacher: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Room</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editSectionData.room}
                  onChange={e => setEditSectionData({ ...editSectionData, room: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditSectionModalOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout onTabChange={setActiveTab} activeTab={activeTab}>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "classes" && renderClassManagement()}
        {activeTab === "schedule" && renderScheduleManagement()}
        {activeTab === "results" && renderResultManagement()}
        {activeTab === "students" && renderStudentManagement()}
        {activeTab === "sections" && renderSectionManagement()}


        {/* Class Modal */}
        {isClassModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Class</h3>
                <Button variant="outline" size="sm" onClick={() => setIsClassModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={handleAddClass}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Class Name</label>
                  <input className="w-full border rounded px-2 py-1" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Teacher</label>
                  <select className="w-full border rounded px-2 py-1" value={newClass.teacher} onChange={e => setNewClass({ ...newClass, teacher: e.target.value })} required>
                    <option value="">Select Teacher</option>
                    {teacherAccounts.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input className="w-full border rounded px-2 py-1" value={newClass.subject} onChange={e => setNewClass({ ...newClass, subject: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Section</label>
                  <select className="w-full border rounded px-2 py-1" value={newClass.section} onChange={e => setNewClass({ ...newClass, section: e.target.value })} required>
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section.name} value={section.name}>{section.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input className="w-full border rounded px-2 py-1" value={newClass.capacity} onChange={e => setNewClass({ ...newClass, capacity: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Room</label>
                  <input className="w-full border rounded px-2 py-1" value={newClass.room} onChange={e => setNewClass({ ...newClass, room: e.target.value })} required />
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Add Class</Button>
                  <Button type="button" variant="outline" onClick={() => setIsClassModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add Class Schedule</h3>
                <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                setClassSchedules(prev => [...prev, newSchedule]);
                setIsScheduleModalOpen(false);
                addActivity("Added new class schedule", "success");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                      value={newSchedule.class}
                      onChange={(e) => setNewSchedule({...newSchedule, class: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Class</option>
                      {(modalClasses || []).map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Day</label>
                    <select
                      value={newSchedule.day}
                      onChange={(e) => setNewSchedule({...newSchedule, day: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teacher</label>
                    <select
                      value={newSchedule.teacher}
                      onChange={(e) => setNewSchedule({...newSchedule, teacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {teacherAccounts.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Room</label>
                    <input
                      type="text"
                      value={newSchedule.room}
                      onChange={(e) => setNewSchedule({...newSchedule, room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Add Schedule</Button>
                  <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Result Modal */}
        {isResultModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Publish Result</h3>
                <Button variant="outline" size="sm" onClick={() => setIsResultModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                setResults(prev => [...prev, newResult]);
                setIsResultModalOpen(false);
                addActivity("Published new result", "success");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Student ID</label>
                    <select
                      value={newResult.studentId}
                      onChange={(e) => setNewResult({...newResult, studentId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Student</option>
                      {(students || []).map(student => (
                        <option key={student.id} value={student.studentId}>{student.name} - {student.studentId}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                      value={newResult.class}
                      onChange={(e) => setNewResult({...newResult, class: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Class</option>
                      {(classes || []).map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      value={newResult.subject}
                      onChange={(e) => setNewResult({...newResult, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Exam Type</label>
                    <select
                      value={newResult.examType}
                      onChange={(e) => setNewResult({...newResult, examType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Exam Type</option>
                      <option value="Mid Term">Mid Term</option>
                      <option value="Final Term">Final Term</option>
                      <option value="Unit Test">Unit Test</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      value={newResult.marks}
                      onChange={(e) => setNewResult({...newResult, marks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={newResult.totalMarks}
                      onChange={(e) => setNewResult({...newResult, totalMarks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Grade</label>
                    <select
                      value={newResult.grade}
                      onChange={(e) => setNewResult({...newResult, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A (90-100%)</option>
                      <option value="B">B (80-89%)</option>
                      <option value="C">C (70-79%)</option>
                      <option value="D">D (60-69%)</option>
                      <option value="F">F (Below 60%)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Remarks</label>
                    <textarea
                      value={newResult.remarks}
                      onChange={(e) => setNewResult({...newResult, remarks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Publish Result</Button>
                  <Button type="button" variant="outline" onClick={() => setIsResultModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Modal */}
        {isStudentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Student</h3>
                <Button variant="outline" size="sm" onClick={() => setIsStudentModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                addStudent(newStudent);
                setIsStudentModalOpen(false);
                addActivity("Added new student", "success");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
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
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                      value={newStudent.class}
                      onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Class</option>
                      {(classes || []).map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <select
                      value={newStudent.section}
                      onChange={(e) => setNewStudent({...newStudent, section: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Section</option>
                      {(sections || []).map(section => (
                        <option key={section.name} value={section.name}>{section.name}</option>
                      ))}
                    </select>
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
                    <input
                      type="tel"
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
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
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Add Student</Button>
                  <Button type="button" variant="outline" onClick={() => setIsStudentModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section Modal */}
        {isSectionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Section</h3>
                <Button variant="outline" size="sm" onClick={() => setIsSectionModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newSectionWithId = {
                  ...newSection,
                  id: Date.now(),
                  createdAt: new Date().toISOString()
                };
                setSections(prev => [...prev, newSectionWithId]);
                // Assign selected students to this section
                if (selectedSectionStudents.length > 0) {
                  const updatedStudents = students.map(s =>
                    selectedSectionStudents.includes(s.id)
                      ? { ...s, section: newSection.name, class: newSection.class }
                      : s
                  );
                  localStorage.setItem('students', JSON.stringify(updatedStudents));
                }
                setNewSection({
                  name: "",
                  class: "",
                  capacity: "",
                  teacher: "",
                  room: "",
                });
                setSelectedSectionStudents([]);
                setIsSectionModalOpen(false);
                addActivity("Added new section", "success");
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Section Name</label>
                    <input
                      type="text"
                      value={newSection.name}
                      onChange={(e) => setNewSection({...newSection, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Section A, Section B"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                      value={newSection.class}
                      onChange={(e) => {
                        setNewSection({...newSection, class: e.target.value});
                        setSelectedSectionStudents([]); // reset when class changes
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Class</option>
                      {(modalClasses || []).map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Capacity</label>
                    <input
                      type="number"
                      value={newSection.capacity}
                      onChange={(e) => setNewSection({...newSection, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Maximum number of students"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teacher</label>
                    <select
                      value={newSection.teacher}
                      onChange={(e) => setNewSection({...newSection, teacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {(teachers || []).map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Room</label>
                    <input
                      type="text"
                      value={newSection.room}
                      onChange={(e) => setNewSection({...newSection, room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Room 101, Lab 2"
                      required
                    />
                  </div>
                  {/* Student selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Assign Students (from selected class)</label>
                    <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                      {(students || []).filter(s => s.class === newSection.class && (!s.section || s.section === "")).length === 0 ? (
                        <div className="text-gray-400 text-sm">No available students for this class.</div>
                      ) : (
                        (students || []).filter(s => s.class === newSection.class && (!s.section || s.section === "")).map(s => (
                          <label key={s.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSectionStudents.includes(s.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedSectionStudents(prev => [...prev, s.id]);
                                } else {
                                  setSelectedSectionStudents(prev => prev.filter(id => id !== s.id));
                                }
                              }}
                            />
                            <span>{s.name} ({s.email})</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="flex-1">Add Section</Button>
                  <Button type="button" variant="outline" onClick={() => setIsSectionModalOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}