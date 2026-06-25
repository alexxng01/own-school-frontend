import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { AnnouncementCard } from './AnnouncementCard';

/**
 * AnnouncementList Component
 * Displays list of announcements with filtering and search (Tailwind CSS only)
 */
export function AnnouncementList({
  announcements = [],
  onEdit,
  onDelete,
  onPin,
  onTogglePublish,
  isAdmin = false,
  compact = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = [...announcements];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(query) ||
        ann.description.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(ann => ann.priority === priorityFilter);
    }

    // Audience filter
    if (audienceFilter !== 'All') {
      filtered = filtered.filter(ann => ann.audience === audienceFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Published') {
        filtered = filtered.filter(ann => ann.isPublished);
      } else if (statusFilter === 'Draft') {
        filtered = filtered.filter(ann => !ann.isPublished);
      } else if (statusFilter === 'Expired') {
        filtered = filtered.filter(ann =>
          ann.expiryDate && new Date(ann.expiryDate) < new Date()
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.publishDate) - new Date(a.publishDate);
        case 'date-asc':
          return new Date(a.publishDate) - new Date(b.publishDate);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'pinned-first':
          return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        default:
          return 0;
      }
    });

    // Pinned announcements at top if sorting by date
    if (sortBy.startsWith('date') || sortBy === 'pinned-first') {
      const pinned = filtered.filter(ann => ann.isPinned);
      const unpinned = filtered.filter(ann => !ann.isPinned);
      filtered = [...pinned, ...unpinned];
    }

    return filtered;
  }, [announcements, searchQuery, priorityFilter, audienceFilter, statusFilter, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setPriorityFilter('All');
    setAudienceFilter('All');
    setStatusFilter('All');
    setSortBy('date-desc');
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No announcements yet</p>
          </div>
        ) : (
          filteredAnnouncements.slice(0, 5).map(ann => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onTogglePublish={onTogglePublish}
              isAdmin={isAdmin}
              compact={true}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Announcements {filteredAnnouncements.length > 0 && `(${filteredAnnouncements.length})`}</h2>
        </div>
        <button
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all"
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle filters"
        >
          <Filter size={20} />
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-gray-800 dark:text-white dark:focus:ring-purple-900/30 transition-all"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-gray-800 dark:text-white transition-all"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Audience Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Audience</label>
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-gray-800 dark:text-white transition-all"
              >
                <option value="All">All Audiences</option>
                <option value="All">All Users</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
                <option value="Parents">Parents</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            {/* Status Filter */}
            {isAdmin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-gray-800 dark:text-white transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 dark:bg-gray-800 dark:text-white transition-all"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="pinned-first">Pinned First</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          {(searchQuery || priorityFilter !== 'All' || audienceFilter !== 'All' || statusFilter !== 'All') && (
            <button
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
              onClick={handleReset}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No announcements found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'No announcements match your filters'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAnnouncements.map(ann => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onTogglePublish={onTogglePublish}
              isAdmin={isAdmin}
              compact={false}
            />
          ))}
        </div>
      )}

      {/* Results Info */}
      {filteredAnnouncements.length > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 py-3 rounded-lg">
          Showing {filteredAnnouncements.length} of {announcements.length} announcements
        </div>
      )}
    </div>
  );
}
