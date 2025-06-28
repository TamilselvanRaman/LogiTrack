import http from "./http.service";

const API_URL = "/auth";
const USER_URL = "/user";

// Register new user
const register = async (userData) => {
  const res = await http.post(`${API_URL}/register`, userData, {
    withCredentials: true,
  });
  return res.data;
};

// Login user (cookie automatically set by backend)
const login = async (credentials) => {
  const res = await http.post(`${API_URL}/login`, credentials, {
    withCredentials: true,
  });

  const { user } = res.data;
  if (!user) throw new Error("Login failed: Missing user");

  localStorage.setItem("user", JSON.stringify(user));
  return { user };
};

// Logout (clear cookie)
const logout = async () => {
  await http.post(`${API_URL}/logout`, {}, { withCredentials: true });
  localStorage.removeItem("user");
};

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.log(e.message);
    localStorage.removeItem("user");
    return null;
  }
};

// Get profile from backend (with cookie)
const getProfile = async () => {
  const res = await http.get(`${USER_URL}/profile`, {
    withCredentials: true,
  });
  return res.data;
};

const updateProfile = async (profileData) => {
  const res = await http.put(`${USER_URL}/profile/update`, profileData, {
    withCredentials: true,
  });
  return res.data;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getProfile,
  updateProfile,
};
