import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  //  token && (req.headers.Authorization = `Bearer ${token}`);// alternative way
  return req;
});

export default API;
