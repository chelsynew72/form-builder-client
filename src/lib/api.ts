"use client";

import axios from 'axios';

// Use a function to get the base URL to avoid build-time issues
const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://form-builder-backend-6wju.onrender.com';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Forms API
export const formsApi = {
  getAll: () => api.get('/forms'),
  getOne: (id: string) => api.get(`/forms/${id}`),
  getByPublicId: (publicId: string) => api.get(`/forms/public/${publicId}`),
  create: (data: any) => api.post('/forms', data),
  update: (id: string, data: any) => api.put(`/forms/${id}`, data),
  delete: (id: string) => api.delete(`/forms/${id}`),
};

// Pipelines API
export const pipelinesApi = {
  getByFormId: (formId: string) => api.get(`/pipelines/form/${formId}`),
  create: (data: any) => api.post('/pipelines', data),
  update: (formId: string, data: any) => api.put(`/pipelines/form/${formId}`, data),
  delete: (formId: string) => api.delete(`/pipelines/form/${formId}`),
};

// Submissions API
export const submissionsApi = {
  create: (data: any) => api.post('/submissions', data),
  getByFormId: (formId: string, params?: any) => 
    api.get(`/submissions/form/${formId}`, { params }),
  getOne: (id: string) => api.get(`/submissions/${id}`),
  delete: (id: string) => api.delete(`/submissions/${id}`),
};

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  signup: (data: any) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (data: { firstName: string; lastName: string; email: string }) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  
  updateEmailPreferences: (preferences: any) =>
    api.put('/auth/email-preferences', preferences),
  
  deleteAccount: () => api.delete('/auth/account'),
};

export default api;