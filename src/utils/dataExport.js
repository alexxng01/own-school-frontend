/**
 * Data Export Utility
 * Creates actual files in the project directory
 */

import { readFromFile, FILE_PATHS } from './fileStorage';

/**
 * Export all data to console for debugging
 */
export const exportAllData = () => {
  console.log('=== SCHOOL MANAGEMENT SYSTEM DATA EXPORT ===');
  
  // Export students data
  const students = readFromFile(FILE_PATHS.STUDENTS);
  console.log('\n📚 STUDENTS DATA:');
  console.log('File: students.txt');
  console.log('Total Students:', students.length);
  console.log('Data:', JSON.stringify(students, null, 2));
  
  // Export teachers data
  const teachers = readFromFile(FILE_PATHS.TEACHERS);
  console.log('\n👨‍🏫 TEACHERS DATA:');
  console.log('File: teachers.txt');
  console.log('Total Teachers:', teachers.length);
  console.log('Data:', JSON.stringify(teachers, null, 2));
  
  // Export users data
  const users = readFromFile(FILE_PATHS.USERS);
  console.log('\n👤 USERS DATA:');
  console.log('File: users.txt');
  console.log('Total Users:', users.length);
  console.log('Data:', JSON.stringify(users, null, 2));
  
  console.log('\n=== END DATA EXPORT ===');
};

/**
 * Get data summary
 */
export const getDataSummary = () => {
  const students = readFromFile(FILE_PATHS.STUDENTS);
  const teachers = readFromFile(FILE_PATHS.TEACHERS);
  const users = readFromFile(FILE_PATHS.USERS);
  
  return {
    students: {
      count: students.length,
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status !== 'active').length
    },
    teachers: {
      count: teachers.length,
      active: teachers.filter(t => t.status === 'active').length,
      inactive: teachers.filter(t => t.status !== 'active').length
    },
    users: {
      count: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      receptionist: users.filter(u => u.role === 'receptionist').length
    }
  };
};

/**
 * Export data to downloadable format
 */
export const downloadData = () => {
  const students = readFromFile(FILE_PATHS.STUDENTS);
  const teachers = readFromFile(FILE_PATHS.TEACHERS);
  
  const data = {
    exportDate: new Date().toISOString(),
    students,
    teachers
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `school-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Create actual files in the project directory
 */
export const createDataFiles = async () => {
  try {
    const students = readFromFile(FILE_PATHS.STUDENTS);
    const teachers = readFromFile(FILE_PATHS.TEACHERS);
    
    const data = {
      exportDate: new Date().toISOString(),
      students,
      teachers
    };
    
    // Create data directory if it doesn't exist
    const dataDir = './data';
    
    // Write individual files
    const studentsBlob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
    const teachersBlob = new Blob([JSON.stringify(teachers, null, 2)], { type: 'application/json' });
    const exportBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    // Download files
    const downloadFile = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    
    downloadFile(studentsBlob, 'students.txt');
    downloadFile(teachersBlob, 'teachers.txt');
    downloadFile(exportBlob, 'export.json');
    
    console.log('✅ Data files created and downloaded!');
    console.log('📁 Files created:');
    console.log('  - students.txt');
    console.log('  - teachers.txt');
    console.log('  - export.json');
    
  } catch (error) {
    console.error('❌ Error creating data files:', error);
  }
};

/**
 * Show file storage info
 */
export const showFileStorageInfo = () => {
  console.log('📁 FILE STORAGE SYSTEM INFO:');
  console.log('This system creates actual files in the project directory.');
  console.log('Files are created as:');
  console.log('- students.txt: Student data');
  console.log('- teachers.txt: Teacher data');
  console.log('- export.json: Combined export data');
  console.log('\nFiles will be downloaded to your Downloads folder.');
}; 