export interface Employee {
  id: string;
  userId?: string; // связь с пользователем
  firstName: string;
  lastName: string;
  middleName?: string;
  positionId: string; // ID должности
  departmentId: string; // ID отдела
  managerId?: string; // ID руководителя
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: Date;
  terminationDate?: Date;
  phone?: string;
  email: string;
  photo?: string; // URL или base64
  bio?: string;
  skills: string[];
  history: EmployeeHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeHistory {
  id: string;
  employeeId: string;
  type: 'hire' | 'transfer' | 'promotion' | 'termination' | 'update';
  changes: Record<string, any>;
  authorId: string;
  timestamp: Date;
}

export interface Position {
  id: string;
  name: string;
  description?: string;
  level: number; // уровень в иерархии
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // для иерархии
  headId?: string; // ID руководителя отдела
  employees: string[]; // IDs сотрудников
  createdAt: Date;
  updatedAt: Date;
}