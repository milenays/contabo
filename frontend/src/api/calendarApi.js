import axios from 'axios';

const API_URL = 'http://localhost:5000/api/calendar';

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const createEvent = (eventData) => axios.post(API_URL, eventData, config);
export const getEvents = () => axios.get(API_URL);
export const updateEvent = (id, eventData) => axios.put(`${API_URL}/${id}`, eventData, config);
export const deleteEvent = (id) => axios.delete(`${API_URL}/${id}`);