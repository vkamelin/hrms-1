import { defineStore } from 'pinia';
import { User, AuthState } from '../models/User';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    login(user: User, token: string) {
      this.user = user;
      this.token = token;
      this.isAuthenticated = true;
      
      // Store in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('isAuthenticated', 'true');
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      // Clear from sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('isAuthenticated');
    },

    initializeAuth() {
      // Check if we have stored auth data
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('token');
      const storedIsAuthenticated = sessionStorage.getItem('isAuthenticated');
      
      if (storedUser && storedToken && storedIsAuthenticated === 'true') {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    }
  },
});