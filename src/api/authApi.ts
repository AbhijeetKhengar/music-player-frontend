import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data.data; 
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  console.log({response: response.data});
  
  return response.data.data;
};
