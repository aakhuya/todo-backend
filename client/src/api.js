import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5555',
});

export const fetchUsers = () => api.get('/users');
export const fetchTasks = () => api.get('/tasks');
export const fetchCategories = () => api.get('/categories');
export const fetchUserTasks = () => api.get('/user_tasks');

export const addUser = (data) => api.post('/users', data);
export const addTask = (data) => api.post('/tasks', data);
export const addCategory = (data) => api.post('/categories', data);
export const addUserTask = (data) => api.post('/user_tasks', data);

export const updateUser = (id, data) => api.patch(`/users/${id}`, data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const deleteUserTask = (id) => api.delete(`/user_tasks/${id}`);
