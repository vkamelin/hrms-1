export interface User {
  id: string;
  email: string;
  password: string; // хэш
  role: 'admin' | 'hr' | 'manager' | 'employee';
  employeeId?: string; // связь с сотрудником
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}