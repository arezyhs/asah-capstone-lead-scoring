import apiClient from './apiClient';

const authService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/api/auth/login', { username, password });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userName', response.data.user.name);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    if (token && userName) {
      return { name: userName, token: token };
    }
    return null;
  }
};

export default authService;