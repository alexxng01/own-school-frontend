import React from 'react';
import { Button } from '../../components/Button';

export default function StudentAccountsTable({ students, setQRStudent, setIsQRModalOpen }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
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
        {students.filter(s => s.status === 'active').map((s, idx) => (
          <tr key={s.studentId || idx}> 
            <td className="p-3 border-b">{s.name}</td>
            <td className="p-3 border-b">{s.username || '-'}</td>
            <td className="p-3 border-b">{s.email}</td>
            <td className="p-3 border-b">{s.studentId}</td>
            <td className="p-3 border-b">{s.password}</td>
            <td className="p-3 border-b">{s.class || '-'}</td>
            <td className="p-3 border-b">
              <Button size="sm" variant="outline" onClick={() => {
                setQRStudent(s);
                setIsQRModalOpen(true);
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