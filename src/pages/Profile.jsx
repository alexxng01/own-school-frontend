import React, { useState, useEffect } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import { useAuth, useAccounts } from '../context/AuthContext';
import { getProfileImage, saveProfileImage, isValidImageData } from '../utils/fileStorage';
import { Camera, Edit3, Save, X } from 'lucide-react';

// Helper function to resize/compress image
function resizeImage(file, maxWidth = 300, maxHeight = 300, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Profile = () => {
  const { user, setUser } = useAuth();
  const { students, teachers, receptionists, admins, updateTeacher, updateReceptionist, updateAdmin } = useAccounts();
  const { updateStudent } = useAuth();
  const parentAccounts = JSON.parse(localStorage.getItem('parentAccounts') || '[]');
  const updateParent = (id, updatedData) => {
    const updatedParents = parentAccounts.map(p =>
      p.id === id ? { ...p, ...updatedData } : p
    );
    localStorage.setItem('parentAccounts', JSON.stringify(updatedParents));
    // Force a re-render by updating the parentAccounts reference
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'parentAccounts',
      newValue: JSON.stringify(updatedParents)
    }));
  };
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // On mount, apply saved theme only to document, do not setTheme to avoid infinite loop
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (user) {
      // Use current user data directly
      let idKey = user.id || user.studentId;
      let storedImage = idKey ? getProfileImage(idKey) : null;
      
      setProfileData({
        ...user,
        idNumber: user.id || user.studentId,
        role: user.role,
      });
      setImagePreview(storedImage || (user.profileImage && isValidImageData(user.profileImage) ? user.profileImage : null));
    }
  }, [user, receptionists, teachers, students, admins]);

  // Refresh profile data when user changes (after updates)
  useEffect(() => {
    if (user && profileData) {
      // Update profile data with current user data
      setProfileData({
        ...user,
        idNumber: user.id || user.studentId,
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add image upload handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image file size must be less than 5MB.');
          return;
        }

        const resizedDataUrl = await resizeImage(file, 300, 300, 0.7);
        setImagePreview(resizedDataUrl);
        setProfileData(prev => ({ ...prev, profileImage: resizedDataUrl }));
        
        // Save to localStorage by id
        let idKey = (user && (user.id || user.studentId)) || (profileData && (profileData.id || profileData.studentId));
        if (idKey) {
          const success = saveProfileImage(idKey, resizedDataUrl);
          if (success) {
            console.log('Profile image saved successfully');
          } else {
            console.error('Failed to save profile image');
          }
        }
      } catch (err) {
        console.error('Error processing image:', err);
        alert('Failed to process image. Please try a different file.');
      }
    }
  };

  const handleSave = () => {
    if (profileData) {
      // Simple approach: Update current user directly
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        address: profileData.address || ''
      };

      // Update current user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Also try to update the user in their respective role array
      try {
        let userData;
        let userKey;
        
        switch (user.role) {
          case 'admin':
            userData = JSON.parse(localStorage.getItem('admins') || '[]');
            userKey = 'admins';
            break;
          case 'teacher':
            userData = JSON.parse(localStorage.getItem('teacherAccounts') || '[]');
            userKey = 'teacherAccounts';
            break;
          case 'student':
            userData = JSON.parse(localStorage.getItem('students') || '[]');
            userKey = 'students';
            break;
          case 'receptionist':
            userData = JSON.parse(localStorage.getItem('receptionists') || '[]');
            userKey = 'receptionists';
            break;
          case 'parent':
            userData = JSON.parse(localStorage.getItem('parentAccounts') || '[]');
            userKey = 'parentAccounts';
            break;
          default:
            // If role is not recognized, just update current user
            alert('Profile updated successfully!');
            setIsEditing(false);
            return;
        }

        // Try to find and update user in the array
        const userId = user.id || user.studentId;
        const username = user.username;
        const email = user.email;
        
        let found = false;
        
        // Try multiple ways to find the user
        for (let i = 0; i < userData.length; i++) {
          const u = userData[i];
          if ((u.id === userId || u.studentId === userId || u.username === username || u.email === email)) {
            userData[i] = {
              ...u,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone || '',
              address: profileData.address || ''
            };
            found = true;
            break;
          }
        }
        
        // If found, save the updated array
        if (found) {
          localStorage.setItem(userKey, JSON.stringify(userData));
        }
        
      } catch (error) {
        console.log('Could not update role-specific data, but current user was updated:', error);
      }

      // Show success message
      alert('Profile updated successfully!');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Re-fetch original data to cancel changes
    if (user) {
      let userDetails;
      const safeReceptionists = Array.isArray(receptionists) ? receptionists : [];
      const safeTeachers = Array.isArray(teachers) ? teachers : [];
      const safeStudents = Array.isArray(students) ? students : [];
      const safeAdmins = Array.isArray(admins) ? admins : [];
      if (user.role === 'receptionist') {
        userDetails = safeReceptionists.find(r => r.id === user.id);
      } else if (user.role === 'teacher') {
        userDetails = safeTeachers.find(t => t.id === user.id);
      } else if (user.role === 'student') {
        userDetails = safeStudents.find(s => s.studentId === user.id);
      } else if (user.role === 'admin') {
        userDetails = safeAdmins.find(a => a.id === user.id);
      }

      if (userDetails) {
        setProfileData({
          ...userDetails,
          idNumber: userDetails.id || userDetails.studentId,
          role: user.role,
        });
        setImagePreview(userDetails.profileImage && isValidImageData(userDetails.profileImage) ? userDetails.profileImage : null);
      }
    }
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      teacher: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
      parent: 'bg-purple-100 text-purple-800',
      receptionist: 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Show error if profileData is set but missing name/email
  if (!profileData.name && !profileData.email) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <p className="text-red-500">Profile not found. Please contact the administrator.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-500 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-black dark:bg-gray-800 text-gray-900 dark:text-black /20 hover:bg-black dark:bg-gray-800 text-gray-900 dark:text-white /30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 " />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image Section */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4 border-4 border-gray-300">
                    {imagePreview && isValidImageData(imagePreview) ? (
                      <img
                        src={imagePreview}
                        alt={`${profileData?.name || 'User'} Profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load profile image');
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full flex items-center justify-center bg-gray-200"
                      style={{ display: imagePreview && isValidImageData(imagePreview) ? 'none' : 'flex' }}
                    >
                      <Camera className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="h-6 w-6 text-blue-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-2">
                    Click the camera icon to upload a profile picture
                  </p>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-800">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name || ''}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      />
                    ) : (
                      <p className="p-3  dark:bg-gray-800 text-gray-900 dark:text-white  rounded-md">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email || ''}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      />
                    ) : (
                      <p className="p-3  rounded-md">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      ID Number
                    </label>
                    <p className="p-3  rounded-md">{profileData.idNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      />
                    ) : (
                      <p className="p-3  rounded-md">{profileData.phone || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Role and Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Role
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profileData.role)}`}>
                      {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium  mb-1">
                      Department
                    </label>
                    {isEditing && (profileData.role === 'teacher' || profileData.role === 'receptionist' || profileData.role === 'admin') ? (
                      <input
                        type="text"
                        name="department"
                        value={profileData.department || ''}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                      />
                    ) : (
                      <p className="p-3  rounded-md">{profileData.department || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium  mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={profileData.address || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="appearance-none w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 rounded-md mb-2"
                    />
                  ) : (
                    <p className="p-3  rounded-md">{profileData.address || 'N/A'}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 