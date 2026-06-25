import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { AnnouncementForm, AnnouncementList } from './index';
import { backendStorage as localStorage } from '../../utils/backendStorage';

/**
 * AdminAnnouncementPage Component
 * Admin interface for managing announcements (Tailwind CSS only)
 */
export function AdminAnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load announcements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading announcements:', err);
      }
    }
  }, []);

  // Save announcements to localStorage
  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
    // Trigger storage event for real-time sync across tabs
    window.dispatchEvent(new CustomEvent('announcementsUpdated', { detail: announcements }));
  }, [announcements]);

  // Generate unique ID
  const generateId = () => {
    return 'ann-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    try {
      if (editingAnnouncement) {
        // Update existing announcement
        setAnnouncements(prev =>
          prev.map(ann =>
            ann.id === editingAnnouncement.id
              ? { ...ann, ...formData, updatedDate: new Date().toISOString() }
              : ann
          )
        );
        setSuccessMessage('Announcement updated successfully!');
        setEditingAnnouncement(null);
      } else {
        // Create new announcement
        const newAnnouncement = {
          id: generateId(),
          ...formData,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setSuccessMessage('Announcement created successfully!');
      }
      setShowForm(false);
    } catch (err) {
      setErrorMessage('Error saving announcement: ' + err.message);
    } finally {
      setIsLoading(false);
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      setSuccessMessage('Announcement deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Handle pin/unpin
  const handlePin = (id) => {
    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
      )
    );
  };

  // Handle publish/unpublish
  const handleTogglePublish = (id) => {
    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === id ? { ...ann, isPublished: !ann.isPublished } : ann
      )
    );
  };

  // Handle edit
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cancel form
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const stats = {
    total: announcements.length,
    published: announcements.filter(a => a.isPublished).length,
    pinned: announcements.filter(a => a.isPinned).length,
    expired: announcements.filter(a => a.expiryDate && new Date(a.expiryDate) < new Date()).length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create, manage, and publish announcements to the entire school community</p>
        </div>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          onClick={() => {
            setEditingAnnouncement(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-t-purple-500">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold mt-2">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-t-green-500">
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.published}</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold mt-2">Published</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-t-yellow-500">
          <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pinned}</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold mt-2">Pinned</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-t-red-500">
          <div className="text-4xl font-bold text-red-600 dark:text-red-400">{stats.expired}</div>
          <div className="text-gray-600 dark:text-gray-400 font-semibold mt-2">Expired</div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg border border-green-300 dark:border-green-700">
          <div className="text-xl font-bold">✓</div>
          <div className="flex-1">{successMessage}</div>
          <button
            className="text-xl font-bold hover:opacity-70"
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg border border-red-300 dark:border-red-700">
          <AlertCircle size={20} />
          <div className="flex-1">{errorMessage}</div>
          <button
            className="text-xl font-bold hover:opacity-70"
            onClick={() => setErrorMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AnnouncementForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingAnnouncement}
          isLoading={isLoading}
        />
      )}

      {/* Announcements List */}
      <AnnouncementList
        announcements={announcements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPin={handlePin}
        onTogglePublish={handleTogglePublish}
        isAdmin={true}
        compact={false}
      />
    </div>
  );
}
