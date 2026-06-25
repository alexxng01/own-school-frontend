import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { formatNepaliRupees } from '../utils/currencyFormatter';
import { 
  User, 
  Calendar,
  Trophy,
  CreditCard,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BookOpen
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getProfileImage, isValidImageData } from '../utils/fileStorage';
import '../styles/animatedProfile.css';

export function ParentDashboard() {
  const { user, students } = useAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (user && students && students.length > 0) {
      const found = students.find(s => s.studentId === user.childId);
      setStudent(found || null);
    }
  }, [user, students]);

  // Debug log for parent and student info
  console.log('ParentDashboard:', { user, students, student });
  // Debug log for header rendering
  console.log('Header Render:', { user, student });

  const recentGrades = [
    { subject: "Mathematics", grade: "A-", score: "89%", date: "2 days ago", trend: "up" },
    { subject: "Physics", grade: "B+", score: "87%", date: "1 week ago", trend: "up" },
    { subject: "English", grade: "A", score: "94%", date: "1 week ago", trend: "stable" },
    { subject: "History", grade: "B", score: "82%", date: "2 weeks ago", trend: "down" }
  ];

  const attendanceData = {
    thisWeek: { present: 4, absent: 1, late: 0 },
    thisMonth: { present: 18, absent: 2, late: 1 },
    percentage: 89
  };

  const upcomingEvents = [
    { date: "Tomorrow", event: "Math Test", type: "exam" },
    { date: "Friday", event: "Parent-Teacher Meeting", type: "meeting" },
    { date: "Next Week", event: "Science Fair", type: "event" },
    { date: "Next Week", event: "Fee Payment Due", type: "payment" }
  ];

  const feeStatus = {
    totalAmount: 500000,
    paidAmount: 350000,
    pendingAmount: 150000,
    dueDate: "March 15, 2024",
    status: "partial"
  };

  const behaviorReport = [
    { aspect: "Homework Completion", score: 85, status: "good" },
    { aspect: "Class Participation", score: 92, status: "excellent" },
    { aspect: "Punctuality", score: 78, status: "needs-improvement" },
    { aspect: "Discipline", score: 95, status: "excellent" }
  ];

  return (
    <DashboardLayout>
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-500">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Good morning, {user?.name || 'Parent'}!</h1>
          <p className="text-lg text-white/90 font-medium">Manage your child's information, schedules, and progress from your dashboard.</p>
        </div>

        {/* Child Info Card */}
        <Card className="shadow-soft rounded-2xl p-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="box small">
                <div className="form flex items-center justify-center overflow-hidden">
                  {(() => {
                    const profileImage = getProfileImage(user?.id);
                    return profileImage && isValidImageData(profileImage) ? (
                      <img 
                        src={profileImage} 
                        alt={`${user?.name || 'Parent'} Profile`} 
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
                        const profileImage = getProfileImage(user?.id);
                        return profileImage && isValidImageData(profileImage) ? 'none' : 'flex';
                      })()
                    }}
                  >
                    <User className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{user?.name || 'Parent'}{student ? ` (${student.name})` : ''}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                  <div>Class: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{student ? student.class : '-'}</span></div>
                  <div>Roll No: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{student ? student.rollNumber : '-'}</span></div>
                  <div>Class Teacher: <span className="font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{student ? student.teacher || '-' : '-'}</span></div>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="outline">View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:scale-105 transition-smooth shadow-soft rounded-2xl p-6">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">B+</p>
              <p className="text-sm text-muted-foreground">Overall Grade</p>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-smooth shadow-soft rounded-2xl p-6">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold">{attendanceData.percentage}%</p>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-smooth shadow-soft rounded-2xl p-6">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-smooth shadow-soft rounded-2xl p-6">
            <CardContent className="p-4 text-center">
              <CreditCard className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold">{formatNepaliRupees(feeStatus.pendingAmount)}</p>
              <p className="text-sm text-muted-foreground">Pending Fees</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Grades */}
          <Card className="shadow-soft rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Recent Grades
              </CardTitle>
              <CardDescription>Latest test and assignment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card hover:shadow-soft transition-smooth">
                    <div>
                      <p className="font-medium">{grade.subject}</p>
                      <p className="text-sm text-muted-foreground">{grade.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-lg font-bold text-secondary">{grade.grade}</p>
                        <p className="text-sm text-muted-foreground">{grade.score}</p>
                      </div>
                      <TrendingUp className={`h-4 w-4 ${
                        grade.trend === 'up' ? 'text-secondary' :
                        grade.trend === 'down' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card className="shadow-soft rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                Attendance Summary
              </CardTitle>
              <CardDescription>Current attendance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-card">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-secondary">{attendanceData.percentage}%</div>
                    <p className="text-sm text-muted-foreground">Overall Attendance</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">This Week</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Present:</span>
                          <span className="text-secondary font-medium">{attendanceData.thisWeek.present}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Absent:</span>
                          <span className="text-destructive font-medium">{attendanceData.thisWeek.absent}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-2">This Month</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Present:</span>
                          <span className="text-secondary font-medium">{attendanceData.thisMonth.present}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Absent:</span>
                          <span className="text-destructive font-medium">{attendanceData.thisMonth.absent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <Card className="shadow-soft rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card">
                    <div className={`p-2 rounded-full ${
                      event.type === 'exam' ? 'bg-accent/10 text-accent' :
                      event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                      event.type === 'payment' ? 'bg-destructive/10 text-destructive' :
                      'bg-secondary/10 text-secondary'
                    }`}>
                      {event.type === 'exam' ? <BookOpen className="h-4 w-4" /> :
                       event.type === 'meeting' ? <MessageSquare className="h-4 w-4" /> :
                       event.type === 'payment' ? <CreditCard className="h-4 w-4" /> :
                       <Calendar className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fee Status */}
          <Card className="shadow-soft rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Fee Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{formatNepaliRupees(feeStatus.pendingAmount)}</div>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className="font-medium">{formatNepaliRupees(feeStatus.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Paid:</span>
                    <span className="font-medium text-secondary">{formatNepaliRupees(feeStatus.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due Date:</span>
                    <span className="font-medium">{feeStatus.dueDate}</span>
                  </div>
                </div>
                
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${(feeStatus.paidAmount / feeStatus.totalAmount) * 100}%` }}
                  />
                </div>
                
                <Button variant="default" className="w-full">
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Behavior Report */}
          <Card className="shadow-soft rounded-2xl p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                Behavior Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {behaviorReport.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.aspect}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'excellent' ? 'bg-secondary/10 text-secondary' :
                        item.status === 'good' ? 'bg-primary/10 text-primary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.status === 'excellent' ? 'bg-secondary' :
                            item.status === 'good' ? 'bg-primary' :
                            'bg-accent'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft rounded-2xl p-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="default" className="h-16 flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Teacher
              </Button>
              <Button variant="secondary" className="h-16 flex-col gap-2">
                <CreditCard className="h-5 w-5" />
                Pay Fees
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                View Timetable
              </Button>
              <Button variant="academic" className="h-16 flex-col gap-2">
                <Trophy className="h-5 w-5" />
                View Report Card
              </Button>
            </div>
                  </CardContent>
      </Card>


    </div>
    </DashboardLayout>
  );
}

export default ParentDashboard; 