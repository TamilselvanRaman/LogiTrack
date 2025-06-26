import http from "./http.service";

const API_URL = "/auth";
const USER_URL = "/user"

// Register new user
const register = async (userData) => {
  const res = await http.post(`${API_URL}/register`, userData);
  return res.data;
};

// Login user and store token + user
const login = async (credentials) => {
  const res = await http.post(`${API_URL}/login`, credentials);
  const { token, user } = res.data;

  console.log("Token:", token);
  console.log("User:", user);

  if (!token || !user) throw new Error("Login failed: Missing user/token");

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Get currently logged-in user
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    localStorage.removeItem("user");
    console.error("Failed to parse user from localStorage:", e);
    return null;
  }
};

// Get stored JWT token
const getToken = () => {
  return localStorage.getItem("token");
};

// Fetch user profile + cargos
const getProfile = async () => {
  const res = await http.get(`${USER_URL}/profile`);
  return res.data;
};

// Update user profile (contact, address) + get updated profile + cargos
const updateProfile = async (profileData) => {
  const res = await http.put(`${USER_URL}/profile/update`, profileData);
  return res.data;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  getProfile,
  updateProfile,
};
