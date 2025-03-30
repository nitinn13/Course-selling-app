import axios from 'axios';
import type { Course, UserProfile, InstructorProfile } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token Handling
const getToken = () => localStorage.getItem('token');

api.interceptors.request.use(
  (config) => {
    // Use the token from headers or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token; // Change to match backend expectation
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'No response from server. Please try again.' });
    }
    return Promise.reject({ message: 'Failed to make request. Please try again.' });
  }
);

// User API
export const userApi = {
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post<{ token: string; user: UserProfile }>('/user/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: UserProfile }>('/user/login', data),

  getPurchases: async () => {
    try {
      const response = await api.get<{ courseData: Course[] }>('/user/purchases');
      return response.data.courseData;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  },

  getProfile: () => api.get<UserProfile>('/user/profile'),
};

// Instructor API
export const instructorApi = {
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post<{ token: string; user: InstructorProfile }>('/admin/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: InstructorProfile }>('/admin/login', data),

  createCourse: (data: Partial<Course>) => api.post<Course>('/admin/course', data),

  getCourses: () => api.get<Course[]>('/admin/course/bulk'),

  getProfile: () => api.get<InstructorProfile>('/admin/profile'),
};

// Course API
export const courseApi = {
  purchase: (courseId: string) => api.post<{ message: string }>(`/course/purchase/${courseId}`),

  getAllCourses: () => api.get<Course[]>('/course/preview'),

  getCourseDetails: (courseId: string) => api.get<Course>(`/course/${courseId}`),
};
