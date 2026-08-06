import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healthsync_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateLocation: (data) => api.put('/auth/location', data),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Chat (supports { message, sessionId, lat, lng })
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getSessions: () => api.get('/chat/sessions'),
  getSession: (id) => api.get(`/chat/sessions/${id}`)
};

// Doctors
export const doctorsAPI = {
  list: (params) => api.get('/doctors', { params }),
  getNearby: (params) => api.get('/doctors/nearby', { params }),
  searchLive: (params) => api.get('/doctors/search-live', { params }),
  getById: (id) => api.get(`/doctors/${id}`)
};

// Appointments
export const appointmentsAPI = {
  create: (data) => api.post('/appointments', data),
  list: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.patch(`/appointments/${id}`, data)
};

// Pharmacies
export const pharmaciesAPI = {
  getNearby: (params) => api.get('/pharmacies/nearby', { params }),
  list: () => api.get('/pharmacies')
};

// Prescriptions
export const prescriptionsAPI = {
  list: () => api.get('/prescriptions'),
  create: (data) => api.post('/prescriptions', data)
};

// Treatment Plans (per-user saved care plans)
export const treatmentPlansAPI = {
  save: (data) => api.post('/treatment-plans', data),
  list: () => api.get('/treatment-plans'),
  getById: (id) => api.get(`/treatment-plans/${id}`),
  update: (id, data) => api.patch(`/treatment-plans/${id}`, data),
  delete: (id) => api.delete(`/treatment-plans/${id}`)
};

export default api;
