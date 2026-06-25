import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { 
  BookOpen, 
  Calendar,
  ClipboardList,
  Trophy,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  MessageSquare
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import '../styles/animatedProfile.css';

export function StudentDashboard() {
  useEffect(() => {
    console.log('StudentDashboard loaded');
  }, []);
  const { user, students } = useAuth();
  // Find the student info by user id or studentId
  const studentInfo = {
    name: user?.name || user?.username || '',
    class: user?.class || '',
    rollNumber: user?.rollNumber || '',
    studentId: user?.studentId || '',
  };

  const upcomingClasses = [
    { time: "09:00", subject: "Mathematics", teacher: "Ms. Johnson", room: "Room 201" },
    { time: "10:30", subject: "Physics", teacher: "Dr. Smith", room: "Lab 1" },
    { time: "13:00", subject: "English", teacher: "Mr. Brown", room: "Room 105" },
    { time: "14:30", subject: "History", teacher: "Ms. Davis", room: "Room 302" }
  ];

  const assignments = [
    { id: 1, title: "Math Assignment - Quadratic Equations", subject: "Mathematics", dueDate: "Tomorrow", status: "pending", progress: 60 },
    { id: 2, title: "Physics Lab Report", subject: "Physics", dueDate: "Next Week", status: "in-progress", progress: 30 },
    { id: 3, title: "English Essay - Shakespeare", subject: "English", dueDate: "Today", status: "overdue", progress: 0 },
    { id: 4, title: "History Project", subject: "History", dueDate: "2 Days", status: "completed", progress: 100 }
  ];

  const recentGrades = [
    { subject: "Mathematics", grade: "A-", score: "89%", date: "2 days ago" },
    { subject: "Physics", grade: "B+", score: "87%", date: "1 week ago" },
    { subject: "English", grade: "A", score: "94%", date: "1 week ago" },
    { subject: "History", grade: "B", score: "82%", date: "2 weeks ago" }
  ];

  const attendanceData = {
    present: 87,
    absent: 3,
    late: 2,
    percentage: 95
  };

  const upcomingEvents = [
    { date: "Tomorrow", event: "Math Test", type: "exam" },
    { date: "Friday", event: "Science Fair", type: "event" },
    { date: "Next Week", event: "Parent-Teacher Meeting", type: "meeting" },
    { date: "Next Week", event: "Sports Day", type: "event" }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Welcome back, {studentInfo.name}!</h1>
          <p className="text-lg text-white/90 font-medium">You have 4 classes today and 2 assignments due this week.</p>
        </div>

        {/* Student Info Card */}
        <Card className="shadow-md rounded-2xl p-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="box small">
                <div className="form flex items-center justify-center overflow-hidden">
                  {(() => {
                    const profileImage = getProfileImage(user?.id || user?.studentId);
                    return profileImage && isValidImageData(profileImage) ? (
                      <img 
                        src={profileImage} 
                        alt={`${studentInfo.name || 'Student'} Profile`} 
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
                        const profileImage = getProfileImage(user?.id || user?.studentId);
                        return profileImage && isValidImageData(profileImage) ? 'none' : 'flex';
                      })()
                    }}
                  >
                    <User className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{studentInfo.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                  <div>Class: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{studentInfo.class}</span></div>
                  <div>Roll No: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{studentInfo.rollNumber}</span></div>
                  <div>Student ID: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{studentInfo.studentId}</span></div>
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
          <Card className="shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-gray-600">Active Courses</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
              <ClipboardList className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
          </CardContent>
        </Card>
          <Card className="shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">B+</p>
              <p className="text-sm text-gray-600">Average Grade</p>
          </CardContent>
        </Card>
          <Card className="shadow-lg rounded-2xl p-6 hover:scale-105 transition-all duration-200">
          <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{attendanceData.percentage}%</p>
              <p className="text-sm text-gray-600">Attendance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
          <Card className="shadow-lg rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((class_, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-gray-600">
                      {class_.teacher} • {class_.room}
                    </p>
                  </div>
                    <div className="text-sm font-medium text-blue-600">
                    {class_.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
          <Card className="shadow-lg rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
              Assignments
            </CardTitle>
            <CardDescription>Your current assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                        <p className="text-xs text-gray-600">{assignment.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                          assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          assignment.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                        {assignment.status}
                      </span>
                      {assignment.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : assignment.status === 'overdue' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : null}
                    </div>
                  </div>
                    <p className="text-xs text-gray-600 mb-2">Due: {assignment.dueDate}</p>
                  <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                            assignment.status === 'completed' ? 'bg-green-500' :
                            assignment.status === 'overdue' ? 'bg-red-500' :
                            'bg-blue-500'
                        }`}
                        style={{ width: `${assignment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{assignment.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
          <Card className="lg:col-span-2 shadow-lg rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
              Recent Grades
            </CardTitle>
            <CardDescription>Your latest test and assignment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div>
                    <p className="font-medium">{grade.subject}</p>
                      <p className="text-sm text-gray-600">{grade.date}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{grade.grade}</p>
                      <p className="text-sm text-gray-600">{grade.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
          <Card className="shadow-lg rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              Attendance
            </CardTitle>
            <CardDescription>This semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{attendanceData.percentage}%</div>
                  <p className="text-sm text-gray-600">Overall Attendance</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Present</span>
                    <span className="text-sm font-medium text-green-600">{attendanceData.present} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Absent</span>
                    <span className="text-sm font-medium text-red-600">{attendanceData.absent} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Late</span>
                    <span className="text-sm font-medium text-yellow-600">{attendanceData.late} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card className="shadow-lg rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <div className={`p-2 rounded-full ${
                    event.type === 'exam' ? 'bg-red-100 text-red-600' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {event.type === 'exam' ? <FileText className="h-4 w-4" /> :
                     event.type === 'meeting' ? <MessageSquare className="h-4 w-4" /> :
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

      {/* Quick Actions */}
        <Card className="shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default" className="h-16 flex-col gap-2">
              <FileText className="h-5 w-5" />
              Submit Assignment
            </Button>
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              View Timetable
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Trophy className="h-5 w-5" />
                View Grades
            </Button>
            <Button variant="academic" className="h-16 flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Teacher
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;