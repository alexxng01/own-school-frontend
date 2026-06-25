import React from 'react';
import { Button } from '../../components/Button';
import { User, Calendar, CheckCircle, Plus, FileText } from 'lucide-react';

export default function QuickActions({
  setIsAddStudentModalOpen,
  setIsAddParentModalOpen,
  setIsAddStudentAccountModalOpen,
  setIsAddTeacherAccountModalOpen,
  setIsScheduleModalOpen,
  setIsAttendanceModalOpen,
  setActiveTab,
  activeTab
}) {
  if (activeTab !== 'overview') return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button variant="default" className="h-16 flex-col gap-2" onClick={() => setIsAddStudentModalOpen(true)}>
        <User className="h-5 w-5" />
        Add Student
      </Button>
      <Button variant="secondary" className="h-16 flex-col gap-2" onClick={() => setIsAddTeacherAccountModalOpen(true)}>
        <User className="h-5 w-5" />
        Add Teacher
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2" onClick={() => setIsScheduleModalOpen(true)}>
        <Calendar className="h-5 w-5" />
        Schedule Class
      </Button>
      <Button variant="academic" className="h-16 flex-col gap-2" onClick={() => { setActiveTab && setActiveTab('attendance'); setIsAttendanceModalOpen(true); }}>
        <CheckCircle className="h-5 w-5" />
        Take Attendance
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2" onClick={() => setIsAddStudentAccountModalOpen()}>
        <FileText className="h-5 w-5" />
        Create Student Account
      </Button>
      <Button variant="outline" className="h-16 flex-col gap-2" onClick={() => setIsScheduleModalOpen(true)}>
        <Calendar className="h-5 w-5" />
        Schedule Event
      </Button>
    </div>
  );
} 