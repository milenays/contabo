import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const createTodo = (todoData) => axios.post(API_URL, todoData, config);
export const getTodos = () => axios.get(API_URL);
export const updateTodo = (id, todoData) => axios.put(`${API_URL}/${id}`, todoData, config);
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`);
export const addLog = (id, logData) => axios.post(`${API_URL}/${id}/log`, logData, config);