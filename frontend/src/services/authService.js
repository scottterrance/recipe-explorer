import API from './api';

class AuthService {
  static async register(username, email, password) {
    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  }
  
  static async login(email, password) {
    try {
      const response = await API.post('/auth/login', {
        email,
        password
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { access_token, user };
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default AuthService;