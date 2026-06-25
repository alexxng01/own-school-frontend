import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * AnnouncementForm Component
 * Provides form for admins to create and edit announcements (Tailwind CSS only)
 */
export function AnnouncementForm({ onSubmit, onCancel, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    audience: 'All',
    priority: 'Normal',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isPinned: false,
    isPublished: true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.expiryDate && formData.publishDate > formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date must be after publish date';
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 md:p-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit Announcement' : 'Create Announcement'}</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="title" className="font-semibold text-gray-700 dark:text-gray-200">
                Title *
              </label>
              {errors.title && <span className="text-red-500 text-sm font-medium">{errors.title}</span>}
            </div>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter announcement title"
              maxLength="200"
              disabled={isLoading}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.title
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600'
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
            />
            <small className="text-gray-500 dark:text-gray-400 text-right block">{formData.title.length}/200</small>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <label htmlFor="description" className="font-semibold text-gray-700 dark:text-gray-200">
                Description *
              </label>
              {errors.description && <span className="text-red-500 text-sm font-medium">{errors.description}</span>}
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed announcement description"
              maxLength="5000"
              rows="6"
              disabled={isLoading}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.description
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600'
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
              }`}
            />
            <small className="text-gray-500 dark:text-gray-400 text-right block">{formData.description.length}/5000</small>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audience Field */}
            <div className="space-y-2">
              <label htmlFor="audience" className="font-semibold text-gray-700 dark:text-gray-200">Audience</label>
              <select
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-60"
              >
                <option value="All">All Users</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Teachers Only</option>
                <option value="Parents">Parents Only</option>
                <option value="Staff">Staff Only</option>
              </select>
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <label htmlFor="priority" className="font-semibold text-gray-700 dark:text-gray-200">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-60"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Publish Date */}
            <div className="space-y-2">
              <label htmlFor="publishDate" className="font-semibold text-gray-700 dark:text-gray-200">Publish Date</label>
              <input
                id="publishDate"
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 bg-gray-50 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-60"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <label htmlFor="expiryDate" className="font-semibold text-gray-700 dark:text-gray-200">Expiry Date</label>
                {errors.expiryDate && <span className="text-red-500 text-sm font-medium">{errors.expiryDate}</span>}
              </div>
              <input
                id="expiryDate"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-all dark:bg-gray-700 dark:text-white ${
                  errors.expiryDate
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600'
                    : 'border-gray-300 bg-gray-50 dark:border-gray-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-100'
                }`}
              />
            </div>
          </div>

          {/* Checkbox Fields */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPinned"
                checked={formData.isPinned}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-5 h-5 accent-purple-600 cursor-pointer disabled:opacity-60"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">Pin this announcement to the top</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-5 h-5 accent-purple-600 cursor-pointer disabled:opacity-60"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">Publish immediately</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update Announcement' : 'Create Announcement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
