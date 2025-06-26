import axios from "axios";
import authService from "./auth.service";

const API_BASE = "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    console.log("Sending token:", token);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token available");
  }
  return config;
});

export default http;
