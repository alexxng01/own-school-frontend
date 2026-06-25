import React from 'react';
import { Pin, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

/**
 * AnnouncementCard Component
 * Displays individual announcement with actions (Tailwind CSS only)
 */
export function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
  onPin,
  onTogglePublish,
  isAdmin = false,
  compact = false
}) {
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'Important':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'Normal':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    }
  };

  const getAudienceClasses = (audience) => {
    switch (audience) {
      case 'Students':
        return 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300';
      case 'Teachers':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Parents':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'Staff':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300';
    }
  };

  const isExpired = announcement.expiryDate && new Date(announcement.expiryDate) < new Date();
  const isNotPublished = !announcement.isPublished;

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border transition-all cursor-pointer ${
        announcement.isPinned
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      } ${isExpired ? 'opacity-70' : ''} ${isNotPublished ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500`}>
        <div className="flex gap-2 items-start mb-2">
          {announcement.isPinned && (
            <div className="bg-yellow-200 dark:bg-yellow-600 p-1 rounded">
              <Pin size={12} className="text-yellow-700 dark:text-yellow-100" />
            </div>
          )}
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex-1">{announcement.title}</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{announcement.description.substring(0, 100)}...</p>
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityClasses(announcement.priority)}`}>
            {announcement.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded font-medium ${getAudienceClasses(announcement.audience)}`}>
            {announcement.audience}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-md hover:shadow-lg transition-all ${
      announcement.isPinned
        ? 'border-l-yellow-400 dark:border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800'
        : 'border-l-purple-500 dark:border-l-purple-400'
    } ${isExpired ? 'opacity-70' : ''} ${isNotPublished ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
      {/* Status Indicators */}
      {isExpired && (
        <div className="absolute top-3 right-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 text-xs font-bold px-3 py-1 rounded">
          EXPIRED
        </div>
      )}
      {isNotPublished && (
        <div className="absolute top-3 right-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold px-3 py-1 rounded">
          DRAFT
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3 items-start flex-1">
          {announcement.isPinned && (
            <div className="text-yellow-400 mt-1 flex-shrink-0" title="Pinned announcement">
              <Pin size={18} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Published: {new Date(announcement.publishDate).toLocaleDateString()}
              {announcement.expiryDate && ` • Expires: ${new Date(announcement.expiryDate).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        {/* Priority Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getPriorityClasses(announcement.priority)}`}>
          {announcement.priority}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{announcement.description}</p>
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAudienceClasses(announcement.audience)}`}>
            {announcement.audience}
          </span>
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onTogglePublish(announcement.id)}
              title={announcement.isPublished ? 'Unpublish' : 'Publish'}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-all"
            >
              {announcement.isPublished ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>

            <button
              onClick={() => onPin(announcement.id)}
              title={announcement.isPinned ? 'Unpin' : 'Pin'}
              className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded transition-all"
            >
              <Pin size={18} />
            </button>

            <button
              onClick={() => onEdit(announcement)}
              title="Edit announcement"
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded transition-all"
            >
              <Edit2 size={18} />
            </button>

            <button
              onClick={() => onDelete(announcement.id)}
              title="Delete announcement"
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
