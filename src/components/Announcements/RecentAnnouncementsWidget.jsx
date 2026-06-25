import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { AnnouncementCard } from './AnnouncementCard';
import { backendStorage as localStorage } from '../../utils/backendStorage';

/**
 * RecentAnnouncementsWidget Component
 * Displays recent announcements on main dashboard (Tailwind CSS only)
 */
export function RecentAnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load announcements from localStorage
    const loadAnnouncements = () => {
      try {
        const saved = localStorage.getItem('announcements');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Filter published announcements and sort by date
          const published = parsed
            .filter(ann => ann.isPublished)
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, 5);
          setAnnouncements(published);
        }
      } catch (err) {
        console.error('Error loading announcements:', err);
      }
      setLoading(false);
    };

    loadAnnouncements();

    // Listen for announcements updates
    const handleUpdate = () => {
      loadAnnouncements();
    };

    window.addEventListener('announcementsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('announcementsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h3 className="text-lg font-bold">Recent Announcements</h3>
        </div>
        {announcements.length > 0 && (
          <span className="bg-white/20 px-2 py-1 rounded text-sm font-semibold">
            {announcements.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📢</div>
            <p className="text-gray-600 dark:text-gray-400">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map(ann => (
              <AnnouncementCard
                key={ann.id}
                announcement={ann}
                onEdit={() => {}}
                onDelete={() => {}}
                onPin={() => {}}
                onTogglePublish={() => {}}
                isAdmin={false}
                compact={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {announcements.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-900/50">
          <a
            href="/admin/announcements"
            className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
          >
            View All <ChevronRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
