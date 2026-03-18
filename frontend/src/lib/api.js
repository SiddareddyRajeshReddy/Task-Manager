import axios from './axios.js';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
  signup: (data) => axios.post('/auth/signup', data),
  login:  (data) => axios.post('/auth/login',  data),
  getMe:  ()     => axios.get('/auth/me'),
};

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const tasksAPI = {
  /**
   * @param {{ status?: string, search?: string, page?: number, limit?: number }} params
   */
  getAll:  (params = {}) => axios.get('/tasks',       { params }),
  create:  (data)        => axios.post('/tasks',        data),
  update:  (id, data)    => axios.patch(`/tasks/${id}`, data),
  remove:  (id)          => axios.delete(`/tasks/${id}`),
};