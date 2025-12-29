import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL || "https://blog-server-z30k.onrender.com";
//const baseURL = "http://backend:5000"
const API = axios.create({
  baseURL,
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
