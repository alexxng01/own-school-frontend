/**
 * File Storage Utility for Student and Teacher Data
 * This saves data to browser localStorage only (frontend-safe)
 */

import { backendStorage } from './backendStorage';

// File paths for different data types
const FILE_PATHS = {
  STUDENTS: 'students.txt',
  TEACHERS: 'teachers.txt',
  USERS: 'users.txt'
};

/**
 * Write data to a file (localStorage only)
 * @param {string} filename - Name of the file
 * @param {Array} data - Data to write
 */
export const writeToFile = (filename, data) => {
  try {
    const fileData = JSON.stringify(data, null, 2);
    backendStorage.setItem(`file_${filename}`, fileData);
    console.log(`Data written to ${filename}:`, data);
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    return false;
  }
};

/**
 * Read data from a file (localStorage only)
 * @param {string} filename - Name of the file
 * @returns {Array} Data from file
 */
export const readFromFile = (filename) => {
  try {
    const fileData = backendStorage.getItem(`file_${filename}`);
    if (fileData) {
      return JSON.parse(fileData);
    }
    return [];
  } catch (error) {
    console.error(`Error reading from ${filename}:`, error);
    return [];
  }
};

/**
 * Append data to a file (localStorage only)
 * @param {string} filename - Name of the file
 * @param {Object} newData - New data to append
 */
export const appendToFile = (filename, newData) => {
  try {
    const existingData = readFromFile(filename);
    const updatedData = [...existingData, newData];
    return writeToFile(filename, updatedData);
  } catch (error) {
    console.error(`Error appending to ${filename}:`, error);
    return false;
  }
};

/**
 * Update data in a file (localStorage only)
 * @param {string} filename - Name of the file
 * @param {number} id - ID of the item to update
 * @param {Object} updatedData - Updated data
 */
export const updateInFile = (filename, id, updatedData) => {
  try {
    const existingData = readFromFile(filename);
    const updatedArray = existingData.map(item => 
      item.id === id ? { ...item, ...updatedData, updatedAt: new Date().toISOString() } : item
    );
    return writeToFile(filename, updatedArray);
  } catch (error) {
    console.error(`Error updating in ${filename}:`, error);
    return false;
  }
};

/**
 * Delete data from a file (localStorage only)
 * @param {string} filename - Name of the file
 * @param {number} id - ID of the item to delete
 */
export const deleteFromFile = (filename, id) => {
  try {
    const existingData = readFromFile(filename);
    const filteredData = existingData.filter(item => item.id !== id);
    return writeToFile(filename, filteredData);
  } catch (error) {
    console.error(`Error deleting from ${filename}:`, error);
    return false;
  }
};

/**
 * Find item in a file by ID (localStorage only)
 * @param {string} filename - Name of the file
 * @param {number} id - ID to search for
 * @returns {Object|null} Found item or null
 */
export const findInFile = (filename, id) => {
  try {
    const existingData = readFromFile(filename);
    return existingData.find(item => item.id === id) || null;
  } catch (error) {
    console.error(`Error finding in ${filename}:`, error);
    return null;
  }
};

/**
 * Search items in a file (localStorage only)
 * @param {string} filename - Name of the file
 * @param {string} searchTerm - Search term
 * @param {string} field - Field to search in
 * @returns {Array} Matching items
 */
export const searchInFile = (filename, searchTerm, field = 'name') => {
  try {
    const existingData = readFromFile(filename);
    return existingData.filter(item => 
      item[field] && item[field].toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error(`Error searching in ${filename}:`, error);
    return [];
  }
};

/**
 * Get profile image for a user by ID
 * @param {string} userId - User ID to get profile image for
 * @returns {string|null} Profile image data URL or null if not found
 */
export const getProfileImage = (userId) => {
  if (!userId) return null;
  
  try {
    const imageData = backendStorage.getItem(`profileImage_${userId}`);
    if (imageData && imageData.startsWith('data:image')) {
      return imageData;
    }
    return null;
  } catch (error) {
    console.error(`Error getting profile image for ${userId}:`, error);
    return null;
  }
};

/**
 * Save profile image for a user by ID
 * @param {string} userId - User ID to save profile image for
 * @param {string} imageData - Base64 image data URL
 * @returns {boolean} Success status
 */
export const saveProfileImage = (userId, imageData) => {
  if (!userId || !imageData) return false;
  
  try {
    if (imageData.startsWith('data:image')) {
      backendStorage.setItem(`profileImage_${userId}`, imageData);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error saving profile image for ${userId}:`, error);
    return false;
  }
};

/**
 * Remove profile image for a user by ID
 * @param {string} userId - User ID to remove profile image for
 * @returns {boolean} Success status
 */
export const removeProfileImage = (userId) => {
  if (!userId) return false;
  
  try {
    backendStorage.removeItem(`profileImage_${userId}`);
    return true;
  } catch (error) {
    console.error(`Error removing profile image for ${userId}:`, error);
    return false;
  }
};

/**
 * Validate if a string is a valid image data URL
 * @param {string} imageData - Image data to validate
 * @returns {boolean} Whether the image data is valid
 */
export const isValidImageData = (imageData) => {
  if (!imageData || typeof imageData !== 'string') return false;
  return imageData.startsWith('data:image/');
};

// Student-specific functions
export const addStudent = (studentData) => {
  const newStudent = {
    id: Date.now(),
    ...studentData,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  return appendToFile(FILE_PATHS.STUDENTS, newStudent);
};

export const updateStudent = (id, updatedData) => {
  return updateInFile(FILE_PATHS.STUDENTS, id, updatedData);
};

export const deleteStudent = (id) => {
  return deleteFromFile(FILE_PATHS.STUDENTS, id);
};

export const getStudent = (id) => {
  return findInFile(FILE_PATHS.STUDENTS, id);
};

export const getAllStudents = () => {
  return readFromFile(FILE_PATHS.STUDENTS);
};

export const searchStudents = (searchTerm, field = 'name') => {
  return searchInFile(FILE_PATHS.STUDENTS, searchTerm, field);
};

// Teacher-specific functions
export const addTeacher = (teacherData) => {
  const newTeacher = {
    id: Date.now(),
    ...teacherData,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  return appendToFile(FILE_PATHS.TEACHERS, newTeacher);
};

export const updateTeacher = (id, updatedData) => {
  return updateInFile(FILE_PATHS.TEACHERS, id, updatedData);
};

export const deleteTeacher = (id) => {
  return deleteFromFile(FILE_PATHS.TEACHERS, id);
};

export const getTeacher = (id) => {
  return findInFile(FILE_PATHS.TEACHERS, id);
};

export const getAllTeachers = () => {
  return readFromFile(FILE_PATHS.TEACHERS);
};

export const searchTeachers = (searchTerm, field = 'name') => {
  return searchInFile(FILE_PATHS.TEACHERS, searchTerm, field);
};

// Export file paths for reference
export { FILE_PATHS }; 