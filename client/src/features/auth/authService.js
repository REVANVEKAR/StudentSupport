import axios from 'axios';

const API_URL = '/api/users/';

// Register user
const register = async (userData) => {
  // Append @reva.edu.in to email if not already included
  if (!userData.email.includes('@')) {
    userData.email = `${userData.email}@reva.edu.in`;
  }
  
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;