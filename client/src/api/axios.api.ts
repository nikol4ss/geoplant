import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
