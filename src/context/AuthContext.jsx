import React, { createContext, useContext, useState, useEffect } from 'react';
import { backendStorage as localStorage } from '../utils/backendStorage';
import { 
  getAllStudents, 
  addStudent as addStudentToFile, 
  updateStudent as updateStudentInFile, 
  deleteStudent as deleteStudentFromFile,
  getAllTeachers,
  addTeacher as addTeacherToFile,
  updateTeacher as updateTeacherInFile,
  deleteTeacher as deleteTeacherFromFile
} from '../utils/fileStorage';
import { Button } from '../components/Button';
import { X } from 'lucide-react';

const AuthContext = createContext();

// AccountsContext for global receptionist and teacher accounts
const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  // Receptionist and teacher accounts state
  const [receptionists, setReceptionists] = useState(() => {
    const stored = localStorage.getItem('receptionists');
    return stored ? JSON.parse(stored) : [{ id: 'REC-2024-001', name: 'Sarah Reception', role: 'Receptionist', department: 'Reception', username: 'sarah', password: 'password' }];
  });
  const [teacherAccounts, setTeacherAccounts] = useState(() => {
    const stored = localStorage.getItem('teacherAccounts');
    return stored ? JSON.parse(stored) : [];
  });
  const [admins, setAdmins] = useState(() => {
    const stored = localStorage.getItem('admins');
    return stored ? JSON.parse(stored) : [{ 
      id: 'ADM-2024-001', 
      name: 'Rahul kumar Mahato', 
      email: 'admin@school.com',
      phone: '+977123456789',
      address: 'School Administration Office',
      role: 'School Administrator', 
      department: 'Administration', 
      username: 'Alex', 
      password: '123456' 
    }];
  });
  const [managers, setManagers] = useState(() => {
    const stored = localStorage.getItem('managers');
    return stored ? JSON.parse(stored) : [];
  });

  // MIGRATION: Ensure all admin objects have all required fields
  React.useEffect(() => {
    const requiredFields = {
      name: 'Administrator',
      email: 'admin@school.com',
      phone: '+977123456789',
      address: 'School Administration Office',
      role: 'School Administrator',
      department: 'Administration',
      username: 'Alex',
      password: '123456'
    };
    const migratedAdmins = admins.map(a => ({ ...requiredFields, ...a }));
    const hasMissing = admins.some(a => Object.keys(requiredFields).some(f => !(f in a)));
    if (hasMissing) {
      setAdmins(migratedAdmins);
      localStorage.setItem('admins', JSON.stringify(migratedAdmins));
    }
  }, []);

  // Keep localStorage in sync for persistence
  useEffect(() => {
    localStorage.setItem('receptionists', JSON.stringify(receptionists));
  }, [receptionists]);
  useEffect(() => {
    localStorage.setItem('teacherAccounts', JSON.stringify(teacherAccounts));
  }, [teacherAccounts]);
  useEffect(() => {
    localStorage.setItem('admins', JSON.stringify(admins));
  }, [admins]);
  useEffect(() => {
    localStorage.setItem('managers', JSON.stringify(managers));
  }, [managers]);

  const updateReceptionist = (id, updatedData) => {
    const updatedReceptionists = receptionists.map(r =>
      r.id === id ? { ...r, ...updatedData } : r
    );
    setReceptionists(updatedReceptionists);
  };

  const updateTeacher = (id, updatedData) => {
    const updatedTeachers = teacherAccounts.map(t =>
      t.id === id ? { ...t, ...updatedData } : t
    );
    setTeacherAccounts(updatedTeachers);
  };

  const updateAdmin = (id, updatedData) => {
    const adminsFromStorage = JSON.parse(localStorage.getItem('admins')) || admins;
    const requiredFields = {
      name: updatedData.name || '',
      email: updatedData.email || '',
      phone: updatedData.phone || '',
      address: updatedData.address || '',
      role: updatedData.role || 'School Administrator',
      department: updatedData.department || 'Administration',
      username: updatedData.username || '',
      password: updatedData.password || '',
    };
    const updatedAdmins = adminsFromStorage.map(a =>
      (a.id === id || a.username === updatedData.username)
        ? { ...a, ...requiredFields, ...updatedData }
        : a
    );
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
  };

  const updateManager = (id, updatedData) => {
    const updatedManagers = managers.map(m =>
      m.id === id ? { ...m, ...updatedData } : m
    );
    setManagers(updatedManagers);
  };
  
  return (
    <AccountsContext.Provider value={{ 
      receptionists, 
      setReceptionists, 
      teacherAccounts, 
      setTeacherAccounts,
      admins,
      setAdmins,
      managers,
      setManagers,
      updateReceptionist,
      updateTeacher,
      updateAdmin,
      updateManager
    }}>
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => useContext(AccountsContext);

export const AuthProvider = ({ children }) => {
  const { receptionists, teacherAccounts, setTeacherAccounts, admins, setAdmins, managers, setManagers } = useAccounts();
  const [user, setUser] = useState(() => {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  });
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('schoolUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  const [students, setStudents] = useState(() => {
    return getAllStudents();
  });
  const [teachers, setTeachers] = useState(() => {
    return getAllTeachers();
  });
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudentData, setEditStudentData] = useState(null);
  // Add global state for classes and sections
  const [classes, setClasses] = useState(() => {
    const stored = localStorage.getItem('classes');
    return stored ? JSON.parse(stored) : [];
  });
  const [sections, setSections] = useState(() => {
    const stored = localStorage.getItem('sections');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);

  const signup = (username, email, password, role, studentId = null, profileInfo = {}) => {
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this username or email');
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // In a real app, this should be hashed
      role,
      studentId, // Add studentId for student accounts
      createdAt: new Date().toISOString()
    };

    // If it's an admin, also add to admins array with complete profile info
    if (role === 'admin') {
      const newAdmin = {
        id: newUser.id,
        name: profileInfo.name || username, // Use provided name or username as fallback
        email: email,
        phone: profileInfo.phone || '+977123456789', // Default phone
        address: profileInfo.address || 'School Administration Office', // Default address
        role: 'School Administrator',
        department: 'Administration',
        username: username,
        password: password
      };
      
      const updatedAdmins = [...admins, newAdmin];
      setAdmins(updatedAdmins);
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('schoolUsers', JSON.stringify(updatedUsers));
    return newUser;
  };

  const login = (username, password) => {
    // Check admin accounts
    const admin = admins.find(a => (a.username === username || a.email === username) && a.password === password);
    if (admin) {
      // Store complete profile data for admins
      const adminUser = {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        phone: admin.phone || '',
        address: admin.address || '',
        role: 'admin',
        department: admin.department
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return adminUser;
    }

    // Check teacher accounts
    const teacher = teacherAccounts.find(t => (t.username === username || t.email === username) && t.password === password);
    if (teacher) {
      // Store complete profile data for teachers
      const teacherUser = {
        id: teacher.id,
        name: teacher.name,
        username: teacher.username,
        email: teacher.email,
        phone: teacher.phone || '',
        address: teacher.address || '',
        role: 'teacher',
        department: teacher.department,
        subject: teacher.subject
      };
      setUser(teacherUser);
      localStorage.setItem('currentUser', JSON.stringify(teacherUser));
      return teacherUser;
    }

    // Check receptionist accounts
    const receptionist = receptionists.find(r => (r.username === username || r.email === username) && r.password === password);
    if (receptionist) {
      // Store complete profile data for receptionists
      const receptionistUser = {
        id: receptionist.id,
        name: receptionist.name,
        username: receptionist.username,
        email: receptionist.email,
        phone: receptionist.phone || '',
        address: receptionist.address || '',
        role: 'receptionist',
        department: receptionist.department
      };
      setUser(receptionistUser);
      localStorage.setItem('currentUser', JSON.stringify(receptionistUser));
      return receptionistUser;
    }

    // Check manager accounts
    console.log('Checking manager accounts:', managers);
    console.log('Login attempt - username:', username, 'password:', password);
    const manager = managers.find(m => (m.username === username || m.email === username) && m.password === password);
    console.log('Found manager:', manager);
    if (manager) {
      // Store complete profile data for managers
      const managerUser = {
        id: manager.id,
        name: manager.name,
        username: manager.username,
        email: manager.email,
        phone: manager.phone || '',
        address: manager.address || '',
        role: 'manager',
        department: manager.department
      };
      console.log('Setting manager user:', managerUser);
      setUser(managerUser);
      localStorage.setItem('currentUser', JSON.stringify(managerUser));
      console.log('Manager login successful, returning user:', managerUser);
      return managerUser;
    }

    // Check student accounts (allow login by username, email, or studentId)
    const student = students.find(s => (s.username === username || s.email === username || s.studentId === username) && s.password === password);
    if (student) {
      // Store complete profile data for students
      const studentUser = {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        username: student.username,
        email: student.email,
        phone: student.phone || '',
        address: student.address || '',
        role: 'student',
        class: student.class
      };
      setUser(studentUser);
      localStorage.setItem('currentUser', JSON.stringify(studentUser));
      return studentUser;
    }

    // Check parent accounts (from localStorage)
    const parentAccounts = JSON.parse(localStorage.getItem('parentAccounts') || '[]');
    const parent = parentAccounts.find(p => (p.username === username || p.email === username) && p.password === password);
    if (parent) {
      // Store complete profile data for parents
      const parentUser = {
        id: parent.id,
        name: parent.name,
        username: parent.username,
        email: parent.email,
        phone: parent.phone || '',
        address: parent.address || '',
        role: 'parent',
        childId: parent.childId
      };
      setUser(parentUser);
      localStorage.setItem('currentUser', JSON.stringify(parentUser));
      return parentUser;
    }

    // Check standard users
    const standardUser = users.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );
    if (standardUser) {
      // Store complete profile data for standard users
      const userData = {
        id: standardUser.id,
        name: standardUser.name,
        username: standardUser.username,
        email: standardUser.email,
        phone: standardUser.phone || '',
        address: standardUser.address || '',
        role: standardUser.role
      };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    }

    throw new Error('Invalid username/email/ID or password');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isUserExists = (username, email) => {
    return users.some(u => u.username === username || u.email === email);
  };

  // Student management functions
  const addStudent = (studentData) => {
    const success = addStudentToFile(studentData);
    if (success) {
      // Reload students from file
      const updatedStudents = getAllStudents();
      setStudents(updatedStudents);
    }
    return success;
  };

  const updateStudent = (id, updatedData) => {
    const success = updateStudentInFile(id, updatedData);
    if (success) {
      // Reload students from file
      const updatedStudents = getAllStudents();
      setStudents(updatedStudents);
    }
    return success;
  };

  const deleteStudent = (id) => {
    const success = deleteStudentFromFile(id);
    if (success) {
      // Reload students from file
      const updatedStudents = getAllStudents();
      setStudents(updatedStudents);
    }
    return success;
  };

  const getStudent = (id) => {
    return students.find(student => student.id === id);
  };

  const getAllStudentsList = () => {
    return students;
  };

  // Teacher management functions
  const addTeacher = (teacherData) => {
    const success = addTeacherToFile(teacherData);
    if (success) {
      // Reload teachers from file
      const updatedTeachers = getAllTeachers();
      setTeachers(updatedTeachers);
    }
    return success;
  };

  const updateTeacher = (id, updatedData) => {
    const success = updateTeacherInFile(id, updatedData);
    if (success) {
      // Reload teachers from file
      const updatedTeachers = getAllTeachers();
      setTeachers(updatedTeachers);
    }
    return success;
  };

  const deleteTeacher = (id) => {
    const success = deleteTeacherFromFile(id);
    if (success) {
      // Reload teachers from file
      const updatedTeachers = getAllTeachers();
      setTeachers(updatedTeachers);
    }
    return success;
  };

  const getTeacher = (id) => {
    return teachers.find(teacher => teacher.id === id);
  };

  const getAllTeachersList = () => {
    return teachers;
  };

  // Add class with uniqueness check
  const addClass = (classData) => {
    if (classes.some(cls => cls.name === classData.name)) {
      throw new Error('Class name must be unique');
    }
    setClasses(prev => [...prev, { ...classData, id: Date.now() }]);
  };

  // Add section with uniqueness check
  const addSection = (sectionData) => {
    if (sections.some(sec => sec.name === sectionData.name)) {
      throw new Error('Section name must be unique');
    }
    setSections(prev => [...prev, { ...sectionData, id: Date.now() }]);
  };

  // Add student with unique roll number and id
  const addStudentUnique = (studentData) => {
    if (students.some(s => s.rollNumber === studentData.rollNumber)) {
      throw new Error('Roll number must be unique');
    }
    if (students.some(s => s.id === studentData.id)) {
      throw new Error('Student ID must be unique');
    }
    setStudents(prev => [...prev, { ...studentData, id: Date.now() }]);
  };

  // Teacher accounts are already global, but let's ensure add/update/list functions are exposed
  const addTeacherAccount = (teacherData) => {
    if (teacherAccounts.some(t => t.id === teacherData.id)) {
      throw new Error('Teacher ID must be unique');
    }
    setTeacherAccounts(prev => [...prev, teacherData]);
  };

  const updateTeacherAccount = (id, updatedData) => {
    setTeacherAccounts(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const getAllTeacherAccounts = () => teacherAccounts;

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      users,
      students,
      teachers,
      login, 
      logout, 
      signup,
      isUserExists,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudent,
      getAllStudents: getAllStudentsList,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      getTeacher,
      getAllTeachers: getAllTeachersList,
      classes,
      setClasses,
      addClass,
      sections,
      setSections,
      addSection,
      addStudentUnique,
      addTeacherAccount,
      updateTeacherAccount,
      getAllTeacherAccounts,
    }}>
      {children}
      {isEditStudentModalOpen && editStudentData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white  rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Edit Student</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditStudentModalOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        updateStudent(editStudentData.id, editStudentData);
        setIsEditStudentModalOpen(false);
      }}>
        <label>Name</label>
        <input
          value={editStudentData.name}
          onChange={e => setEditStudentData({ ...editStudentData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {/* Repeat for other fields: email, phone, class, etc. */}
        <label>Email</label>
        <input
          value={editStudentData.email}
          onChange={e => setEditStudentData({ ...editStudentData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {/* ...add more fields as needed... */}
        <div className="flex gap-3 mt-6">
          <Button type="submit" className="flex-1">Save</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditStudentModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);