import React, { useState } from 'react';

const MessageBox = ({ onSend }) => {
  const [message, setMessage] = useState('');
  return (
    <form
      className="flex items-center space-x-2 mt-4"
      onSubmit={e => {
        e.preventDefault();
        if (message.trim()) {
          onSend(message);
          setMessage('');
        }
      }}
    >
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Type a message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Send
      </button>
    </form>
  );
};

export default MessageBox; 