import React from 'react';

const Notification = ({ message, type = 'info' }) => {
  if (!message) return null;
  const color = type === 'error' ? 'bg-red-100 text-red-700' : type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  return (
    <div className={`p-3 mb-4 rounded ${color}`}>{message}</div>
  );
};

export default Notification; 