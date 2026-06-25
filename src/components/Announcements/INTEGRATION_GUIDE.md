# Integration Guide: Adding Announcements to Admin Dashboard

## Step 1: Update Your Routing (AppRoutes.jsx or Routes Configuration)

Add this route to make the announcements page accessible:

```jsx
import { AdminAnnouncementPage } from './components/Announcements';

// In your routes configuration
{
  path: '/admin/announcements',
  element: <AdminAnnouncementPage />
}
```

## Step 2: Add Announcements Tab to Admin Dashboard

If you want to add it as a tab in the existing AdminDashboard component:

```jsx
// In AdminDashboard.jsx

import { AdminAnnouncementPage } from '../components/Announcements';

// Add to your activeTab state management
const [activeTab, setActiveTab] = useState('overview');

// Then in your render/return section, add:
{activeTab === 'announcements' && <AdminAnnouncementPage />}

// And add this to your sidebar navigation items:
{
  id: 'announcements',
  label: 'Announcements',
  icon: <Bell className="w-5 h-5" />,
  type: 'tab'
}
```

## Step 3: Add Recent Announcements Widget to Dashboards

Add the widget to any dashboard (Student, Teacher, Parent, Main):

```jsx
// In your dashboard file
import { RecentAnnouncementsWidget } from '../components/Announcements';

// In your component render:
<div className="dashboard-widgets">
  {/* Other widgets */}
  <RecentAnnouncementsWidget 
    maxItems={3}
    onViewAll={() => navigate('/announcements')}
  />
</div>
```

## Step 4: Display Announcements in User Dashboards

For students/teachers/parents to see announcements:

```jsx
// In StudentDashboard.jsx / TeacherDashboard.jsx / ParentDashboard.jsx
import { AnnouncementList } from '../components/Announcements';
import { useState, useEffect } from 'react';

export function StudentDashboard() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Load announcements from localStorage
    const saved = localStorage.getItem('announcements');
    if (saved) {
      try {
        let all = JSON.parse(saved);
        // Filter for this user type
        all = all.filter(a => 
          a.audience === 'All' || a.audience === 'Students'
        );
        // Filter expired
        const now = new Date();
        all = all.filter(a => 
          !a.expiryDate || new Date(a.expiryDate) >= now
        );
        setAnnouncements(all);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    }

    // Listen for updates
    const handleUpdate = (event) => {
      // Repeat loading logic
    };
    window.addEventListener('announcementsUpdated', handleUpdate);
    return () => window.removeEventListener('announcementsUpdated', handleUpdate);
  }, []);

  return (
    <div className="student-dashboard">
      {/* Other dashboard content */}
      
      {/* Announcements section */}
      <section className="announcements-section">
        <AnnouncementList
          announcements={announcements}
          isAdmin={false}
        />
      </section>
    </div>
  );
}
```

## File Structure Created

```
frontend/src/components/Announcements/
├── AnnouncementForm.jsx          # Create/Edit form
├── AnnouncementForm.css           # Form styles
├── AnnouncementCard.jsx           # Individual announcement card
├── AnnouncementCard.css           # Card styles
├── AnnouncementList.jsx           # List with filters
├── AnnouncementList.css           # List styles
├── AdminAnnouncementPage.jsx      # Main admin page
├── AdminAnnouncementPage.css      # Admin page styles
├── RecentAnnouncementsWidget.jsx  # Dashboard widget
├── RecentAnnouncementsWidget.css  # Widget styles
├── index.js                        # Exports
└── ANNOUNCEMENTS_README.md        # Full documentation
```

## Key Features Implemented

✅ **Admin Controls**
- Create announcements with title, description
- Edit existing announcements
- Delete with confirmation
- Pin important announcements
- Set audience and priority
- Schedule publish and expiry dates

✅ **User Experience**
- Search announcements
- Filter by priority and audience
- Beautiful card-based layout
- Responsive design
- Dark mode support

✅ **Technical**
- localStorage persistence
- Cross-tab synchronization
- Real-time notifications
- Form validation
- No external dependencies (except React & lucide-react)

## Component Props Reference

### AdminAnnouncementPage
- No required props
- Handles all state management internally

### AnnouncementList
- `announcements`: Array of announcement objects
- `onEdit`: Function(announcement) => void
- `onDelete`: Function(id) => void
- `onPin`: Function(id) => void
- `onCreateNew`: Function() => void
- `isAdmin`: Boolean (default: false)

### RecentAnnouncementsWidget
- `maxItems`: Number (default: 3)
- `onViewAll`: Function() => void

### AnnouncementForm
- `onSubmit`: Function(formData) => void
- `onCancel`: Function() => void
- `initialData`: Announcement object (optional, for editing)

## Data Storage

Announcements are stored in `localStorage` under key `'announcements'` as a JSON array.

Example announcement object:
```javascript
{
  id: '1234567890',
  title: 'Holiday Notice',
  description: 'School will be closed tomorrow',
  audience: 'All',
  priority: 'Normal',
  publishDate: '2024-03-15',
  expiryDate: '2024-04-15',
  isPinned: false,
  isPublished: true,
  createdDate: '2024-03-14T10:30:00Z'
}
```

## Styling Customization

All components use CSS classes with consistent naming:
- `.announcement-form-*` for form
- `.announcement-card-*` for cards
- `.announcement-list-*` for list
- `.recent-announcements-*` for widget

To customize colors, update the CSS files:
- Primary color: `#667eea` → change in all CSS files
- Secondary color: `#764ba2` → change in all CSS files

## Testing the Implementation

1. **Create announcement**
   - Navigate to `/admin/announcements`
   - Click "New Announcement"
   - Fill form and submit

2. **View in dashboard**
   - Go to any dashboard
   - See recent announcements widget
   - See full announcements list

3. **Edit announcement**
   - Click edit button on card
   - Modify and save

4. **Delete announcement**
   - Click delete button
   - Confirm deletion

5. **Pin announcement**
   - Click pin icon
   - Should appear first in list

6. **Test filters**
   - Search by keyword
   - Filter by priority
   - Filter by audience

## Troubleshooting

### Announcements not appearing
- Check browser Developer Tools > Application > LocalStorage
- Look for key 'announcements'
- Verify JSON format is valid

### Widget not updating
- Refresh the page
- Check if announcements were saved
- Check audience filter matches user type

### Form validation errors
- Title: minimum 3 characters
- Description: minimum 10 characters
- Dates: must be valid YYYY-MM-DD format

## Performance Tips

1. Limit maxItems in RecentAnnouncementsWidget to 3-5
2. Filter expired announcements on load
3. Use localStorage.clear() if quota exceeded
4. Index announcements by audience for faster filtering

## Next Steps

1. Integrate with backend API (optional)
2. Add user authentication checks
3. Implement notification system
4. Add announcement categories
5. Add read/unread tracking
6. Add analytics
