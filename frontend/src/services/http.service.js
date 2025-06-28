import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default http;
