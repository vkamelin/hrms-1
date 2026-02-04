import { defineStore } from 'pinia';
import { User } from '../models/User';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allUsers: (state) => state.users,
    getUserById: (state) => (id: string) => {
      return state.users.find(user => user.id === id);
    },
    getUsersByRole: (state) => (role: string) => {
      return state.users.filter(user => user.role === role);
    },
    activeUsers: (state) => state.users.filter(user => user.isActive),
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate with local storage
        const storedUsers = localStorage.getItem('hrms_users');
        if (storedUsers) {
          this.users = JSON.parse(storedUsers);
        } else {
          // Initialize with some sample data
          this.users = [
            {
              id: 'user-001',
              email: 'admin@example.com',
              password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
              role: 'admin',
              employeeId: 'emp-001',
              isActive: true,
              lastLogin: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_users', JSON.stringify(this.users));
        }
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching users';
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.users.push(newUser);
        localStorage.setItem('hrms_users', JSON.stringify(this.users));
        
        this.error = null;
        return newUser;
      } catch (error: any) {
        this.error = error.message || 'Error creating user';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: string, userData: Partial<User>) {
      this.loading = true;
      try {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData, updatedAt: new Date() };
          localStorage.setItem('hrms_users', JSON.stringify(this.users));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating user';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: string) {
      this.loading = true;
      try {
        this.users = this.users.filter(user => user.id !== id);
        localStorage.setItem('hrms_users', JSON.stringify(this.users));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error deleting user';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});