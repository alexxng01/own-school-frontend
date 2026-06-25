const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(username, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  }

  async getProfile(role, id) {
    return this.request(`/auth/profile/${role}/${id}`);
  }

  async updateProfile(role, id, data) {
    return this.request(`/auth/profile/${role}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Students
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(id) {
    return this.request(`/students/${id}`);
  }

  async createStudent(data) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id, data) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudentsByClass(className) {
    return this.request(`/students/class/${className}`);
  }

  // Teachers
  async getTeachers() {
    return this.request('/teachers');
  }

  async getTeacher(id) {
    return this.request(`/teachers/${id}`);
  }

  async createTeacher(data) {
    return this.request('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacher(id, data) {
    return this.request(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeacher(id) {
    return this.request(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async getTeachersByDepartment(department) {
    return this.request(`/teachers/department/${department}`);
  }

  async getTeachersBySubject(subject) {
    return this.request(`/teachers/subject/${subject}`);
  }

  // Contact Submissions
  async getContactSubmissions() {
    return this.request('/contact');
  }

  async getContactSubmission(id) {
    return this.request(`/contact/${id}`);
  }

  async createContactSubmission(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContactSubmission(id, data) {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContactSubmission(id) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async getContactSubmissionsByStatus(status) {
    return this.request(`/contact/status/${status}`);
  }

  async getContactSubmissionStats() {
    return this.request('/contact/stats/count');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
