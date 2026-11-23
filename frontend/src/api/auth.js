import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

// LOGIN
export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};

// REGISTER (we will use later)
export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};