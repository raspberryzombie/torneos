import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('delegate_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me', data),
  googleLogin: () => api.get('/api/auth/google'),
};

export const delegateService = {
  generateQR: (tournamentId, options) => api.post(`/api/tournaments/${tournamentId}/delegate/qr`, options),
  listSessions: (tournamentId) => api.get(`/api/tournaments/${tournamentId}/delegate/sessions`),
  revokeSession: (tournamentId, sessionId) => api.delete(`/api/tournaments/${tournamentId}/delegate/sessions/${sessionId}`),
  activateDelegate: (token) => api.post('/api/auth/delegate/activate', { token }),
  deactivateDelegate: () => api.post('/api/auth/delegate/deactivate'),
};

export default api;