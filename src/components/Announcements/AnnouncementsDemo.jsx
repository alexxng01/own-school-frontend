import React, { useState, useEffect } from 'react';
import { AnnouncementList, RecentAnnouncementsWidget } from './index';
import { backendStorage as localStorage } from '../../utils/backendStorage';

/**
 * Demo Component for Testing Announcements System
 * 
 * This component demonstrates all announcement features:
 * - Admin announcement management
 * - Recent announcements widget
 * - Announcement filtering and search
 * - User-facing announcement display
 * 
 * Usage:
 * <AnnouncementsDemo />
 */
export function AnnouncementsDemo() {
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState('admin');

  useEffect(() => {
    // Load sample data
    const sampleAnnouncements = [
      {
        id: '1',
        title: 'School Holiday Announcement',
        description: 'School will be closed on March 17-19 for maintenance. Classes will resume on March 20.',
        audience: 'All',
        priority: 'Important',
        publishDate: '2024-03-15',
        expiryDate: '2024-04-15',
        isPinned: true,
        isPublished: true,
        createdDate: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Important: Science Exam Postponed',
        description: 'Due to unforeseen circumstances, the Science exam scheduled for March 18 has been postponed to March 25. All students must be present.',
        audience: 'Students',
        priority: 'Urgent',
        publishDate: '2024-03-14',
        expiryDate: '2024-03-25',
        isPinned: false,
        isPublished: true,
        createdDate: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Parent-Teacher Conference',
        description: 'Parent-teacher conferences will be held on March 22 from 2:00 PM to 5:00 PM. Please schedule your appointment through the school portal.',
        audience: 'Parents',
        priority: 'Normal',
        publishDate: '2024-03-10',
        expiryDate: '2024-03-22',
        isPinned: false,
        isPublished: true,
        createdDate: new Date().toISOString()
      },
      {
        id: '4',
        title: 'New Library Opening Hours',
        description: 'The library will now be open from 7:00 AM to 6:00 PM on weekdays. Weekend hours remain unchanged.',
        audience: 'All',
        priority: 'Normal',
        publishDate: '2024-03-12',
        expiryDate: '',
        isPinned: false,
        isPublished: true,
        createdDate: new Date().toISOString()
      }
    ];

    setAnnouncements(sampleAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
  }, []);

  const loadAnnouncements = () => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    }
  };

  const handlePin = (id) => {
    const updated = announcements.map(a =>
      a.id === id ? { ...a, isPinned: !a.isPinned } : a
    );
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const handleEdit = (announcement) => {
    console.log('Edit:', announcement);
    // Implement edit functionality
  };

  const handleCreateNew = () => {
    console.log('Create new announcement');
    // Implement create functionality
  };

  return (
    <div className="announcements-demo">
      <div className="demo-header">
        <h1>📢 Announcements System Demo</h1>
        <p>Complete announcement management system for your school</p>
      </div>

      <div className="demo-tabs">
        <button
          className={`demo-tab ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Admin View
        </button>
        <button
          className={`demo-tab ${activeTab === 'widget' ? 'active' : ''}`}
          onClick={() => setActiveTab('widget')}
        >
          Widget View
        </button>
        <button
          className={`demo-tab ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          User View
        </button>
        <button
          className={`demo-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          Documentation
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'admin' && (
          <div className="demo-section">
            <h2>Admin - Manage Announcements</h2>
            <p className="demo-description">
              Full CRUD operations with create, edit, delete, and pin features
            </p>
            <button className="demo-reload-btn" onClick={loadAnnouncements}>
              Reload Data
            </button>
            <div className="demo-component">
              <AnnouncementList
                announcements={announcements}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPin={handlePin}
                onCreateNew={handleCreateNew}
                isAdmin={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'widget' && (
          <div className="demo-section">
            <h2>Dashboard Widget - Recent Announcements</h2>
            <p className="demo-description">
              Compact widget showing the 3 most recent announcements
            </p>
            <div className="demo-grid">
              <div className="demo-component-small">
                <RecentAnnouncementsWidget
                  maxItems={3}
                  onViewAll={() => setActiveTab('user')}
                />
              </div>
              <div className="demo-info">
                <h3>Features:</h3>
                <ul>
                  <li>Shows most recent announcements first</li>
                  <li>Displays pinned announcements at top</li>
                  <li>Shows priority indicators with pulse effects</li>
                  <li>Displays relative timestamps</li>
                  <li>Auto-updates when data changes</li>
                  <li>Responsive design for all devices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="demo-section">
            <h2>User View - Browse Announcements</h2>
            <p className="demo-description">
              Students, teachers, and parents see announcements without admin controls
            </p>
            <div className="demo-component">
              <AnnouncementList
                announcements={announcements}
                isAdmin={false}
              />
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="demo-section docs">
            <h2>Quick Reference</h2>
            <div className="docs-grid">
              <div className="docs-card">
                <h3>📋 Announcement Fields</h3>
                <ul>
                  <li><strong>Title</strong> - Up to 100 characters</li>
                  <li><strong>Description</strong> - Up to 500 characters</li>
                  <li><strong>Audience</strong> - All, Students, Teachers, Parents, Staff</li>
                  <li><strong>Priority</strong> - Normal, Important, Urgent</li>
                  <li><strong>Publish Date</strong> - When to show</li>
                  <li><strong>Expiry Date</strong> - Optional, when to hide</li>
                  <li><strong>Pin</strong> - Show at top of list</li>
                </ul>
              </div>

              <div className="docs-card">
                <h3>🎨 Features</h3>
                <ul>
                  <li>✅ Create, read, update, delete</li>
                  <li>✅ Pin important announcements</li>
                  <li>✅ Search by title/description</li>
                  <li>✅ Filter by priority and audience</li>
                  <li>✅ Automatic expiry handling</li>
                  <li>✅ Dark mode support</li>
                  <li>✅ Responsive design</li>
                </ul>
              </div>

              <div className="docs-card">
                <h3>📦 Components</h3>
                <ul>
                  <li><code>AnnouncementForm</code> - Create/Edit</li>
                  <li><code>AnnouncementCard</code> - Single item</li>
                  <li><code>AnnouncementList</code> - List view</li>
                  <li><code>AdminAnnouncementPage</code> - Full page</li>
                  <li><code>RecentAnnouncementsWidget</code> - Dashboard widget</li>
                </ul>
              </div>

              <div className="docs-card">
                <h3>💾 Storage</h3>
                <ul>
                  <li><strong>Key:</strong> <code>announcements</code></li>
                  <li><strong>Format:</strong> JSON Array</li>
                  <li><strong>Persistence:</strong> LocalStorage</li>
                  <li><strong>Cross-tab sync:</strong> Yes</li>
                  <li><strong>Auto-save:</strong> On every change</li>
                </ul>
              </div>
            </div>

            <div className="docs-example">
              <h3>Sample Announcement Object</h3>
              <pre className="code-block">
{`{
  id: '1234567890',
  title: 'Holiday Notice',
  description: 'School will be closed',
  audience: 'All',
  priority: 'Important',
  publishDate: '2024-03-15',
  expiryDate: '2024-04-15',
  isPinned: true,
  isPublished: true,
  createdDate: '2024-03-14T10:30:00Z'
}`}
              </pre>
            </div>

            <div className="docs-usage">
              <h3>Quick Integration</h3>
              <pre className="code-block">
{`// Import components
import { AdminAnnouncementPage, RecentAnnouncementsWidget } from './components/Announcements';

// Use in admin page
<AdminAnnouncementPage />

// Use as dashboard widget
<RecentAnnouncementsWidget maxItems={3} />

// Show to users (students/teachers/parents)
<AnnouncementList announcements={data} isAdmin={false} />`}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="demo-footer">
        <p>✨ Announcement System v1.0 - Built with React & CSS3</p>
        <p>All announcements stored in browser localStorage</p>
      </div>
    </div>
  );
}

export default AnnouncementsDemo;
