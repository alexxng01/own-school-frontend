import React from 'react';
import { Button } from '../../components/Button';

export default function TeacherAccountsTable({ teacherAccounts, setQRTeacher, setIsQRTeacherModalOpen, setEditTeacherAccountData, setIsEditTeacherAccountModalOpen }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3 border-b text-left">Name</th>
          <th className="p-3 border-b text-left">Username</th>
          <th className="p-3 border-b text-left">Email</th>
          <th className="p-3 border-b text-left">ID</th>
          <th className="p-3 border-b text-left">Password</th>
          <th className="p-3 border-b text-left">Department</th>
          <th className="p-3 border-b text-left">Subject</th>
          <th className="p-3 border-b text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {teacherAccounts.map((t, idx) => (
          <tr key={`teacher-${t.id || idx}`}> 
            <td className="p-3 border-b">{t.name}</td>
            <td className="p-3 border-b">{t.username || '-'}</td>
            <td className="p-3 border-b">{t.email}</td>
            <td className="p-3 border-b">{t.id}</td>
            <td className="p-3 border-b">{t.password}</td>
            <td className="p-3 border-b">{t.department || '-'}</td>
            <td className="p-3 border-b">{t.subject || '-'}</td>
            <td className="p-3 border-b">
              <Button size="sm" variant="outline" style={{ marginRight: 8 }} onClick={() => {
                setEditTeacherAccountData(t);
                setIsEditTeacherAccountModalOpen(true);
              }}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setQRTeacher(t);
                setIsQRTeacherModalOpen(true);
              }}>
                QR
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 