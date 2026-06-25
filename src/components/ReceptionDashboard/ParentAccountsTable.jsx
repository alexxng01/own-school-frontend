import React from 'react';
import { Button } from '../../components/Button';

export default function ParentAccountsTable({ parentAccounts, setQRParent, setIsQRParentModalOpen, handleEditParent }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
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
        {parentAccounts.map((p, idx) => (
          <tr key={`parent-${p.id || idx}`}> 
            <td className="p-3 border-b">{p.name}</td>
            <td className="p-3 border-b">{p.username || '-'}</td>
            <td className="p-3 border-b">{p.email}</td>
            <td className="p-3 border-b">{p.id}</td>
            <td className="p-3 border-b">{p.password}</td>
            <td className="p-3 border-b">{p.childId || '-'}</td>
            <td className="p-3 border-b">
              <Button size="sm" variant="outline" style={{ marginRight: 8 }} onClick={() => handleEditParent(p)}>
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setQRParent(p);
                setIsQRParentModalOpen(true);
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