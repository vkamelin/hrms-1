import { defineStore } from 'pinia';
import { Employee, EmployeeHistory, Position, Department } from '../models/Employee';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as Employee[],
    positions: [] as Position[],
    departments: [] as Department[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allEmployees: (state) => state.employees,
    getEmployeeById: (state) => (id: string) => {
      return state.employees.find(employee => employee.id === id);
    },
    getEmployeesByDepartment: (state) => (departmentId: string) => {
      return state.employees.filter(employee => employee.departmentId === departmentId);
    },
    getEmployeesByManager: (state) => (managerId: string) => {
      return state.employees.filter(employee => employee.managerId === managerId);
    },
    activeEmployees: (state) => state.employees.filter(employee => employee.status === 'active'),
    allPositions: (state) => state.positions,
    getPositionById: (state) => (id: string) => {
      return state.positions.find(position => position.id === id);
    },
    allDepartments: (state) => state.departments,
    getDepartmentById: (state) => (id: string) => {
      return state.departments.find(department => department.id === id);
    },
    getSubordinates: (state) => (managerId: string) => {
      return state.employees.filter(employee => employee.managerId === managerId);
    }
  },

  actions: {
    async fetchEmployees() {
      this.loading = true;
      try {
        const storedEmployees = localStorage.getItem('hrms_employees');
        const storedPositions = localStorage.getItem('hrms_positions');
        const storedDepartments = localStorage.getItem('hrms_departments');
        
        if (storedEmployees) {
          this.employees = JSON.parse(storedEmployees);
        } else {
          // Initialize with some sample data
          this.employees = [
            {
              id: 'emp-001',
              userId: 'user-001',
              firstName: 'Иван',
              lastName: 'Иванов',
              positionId: 'pos-001',
              departmentId: 'dept-001',
              status: 'active',
              hireDate: new Date('2024-01-15'),
              email: 'ivanov@example.com',
              skills: ['typescript', 'vue', 'backend'],
              history: [],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_employees', JSON.stringify(this.employees));
        }
        
        if (storedPositions) {
          this.positions = JSON.parse(storedPositions);
        } else {
          this.positions = [
            {
              id: 'pos-001',
              name: 'Администратор',
              description: 'Административные функции',
              level: 5,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_positions', JSON.stringify(this.positions));
        }
        
        if (storedDepartments) {
          this.departments = JSON.parse(storedDepartments);
        } else {
          this.departments = [
            {
              id: 'dept-001',
              name: 'Администрация',
              description: 'Административный отдел',
              employees: ['emp-001'],
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_departments', JSON.stringify(this.departments));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching employees';
      } finally {
        this.loading = false;
      }
    },

    async createEmployee(employeeData: Omit<Employee, 'id' | 'history' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newEmployee: Employee = {
          ...employeeData,
          id: `emp-${Date.now()}`,
          history: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add hire event to history
        const hireEvent: EmployeeHistory = {
          id: `hist-${Date.now()}`,
          employeeId: newEmployee.id,
          type: 'hire',
          changes: { status: 'active' },
          authorId: newEmployee.userId || '',
          timestamp: new Date()
        };
        newEmployee.history.push(hireEvent);
        
        this.employees.push(newEmployee);
        localStorage.setItem('hrms_employees', JSON.stringify(this.employees));
        
        // Add employee to department
        const deptIndex = this.departments.findIndex(d => d.id === newEmployee.departmentId);
        if (deptIndex !== -1) {
          this.departments[deptIndex].employees.push(newEmployee.id);
          localStorage.setItem('hrms_departments', JSON.stringify(this.departments));
        }
        
        this.error = null;
        return newEmployee;
      } catch (error: any) {
        this.error = error.message || 'Error creating employee';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEmployee(id: string, employeeData: Partial<Employee>) {
      this.loading = true;
      try {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
          // Track changes for history
          const oldEmployee = { ...this.employees[index] };
          const changes: Record<string, any> = {};
          
          for (const key in employeeData) {
            if ((oldEmployee as any)[key] !== (employeeData as any)[key]) {
              changes[key] = {
                from: (oldEmployee as any)[key],
                to: (employeeData as any)[key]
              };
            }
          }
          
          // Update employee
          this.employees[index] = { 
            ...this.employees[index], 
            ...employeeData, 
            updatedAt: new Date() 
          };
          
          // Add to history if there were changes
          if (Object.keys(changes).length > 0) {
            const updateEvent: EmployeeHistory = {
              id: `hist-${Date.now()}`,
              employeeId: id,
              type: 'update',
              changes,
              authorId: this.employees[index].userId || '',
              timestamp: new Date()
            };
            
            this.employees[index].history.push(updateEvent);
          }
          
          localStorage.setItem('hrms_employees', JSON.stringify(this.employees));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating employee';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteEmployee(id: string) {
      this.loading = true;
      try {
        const employee = this.employees.find(emp => emp.id === id);
        if (employee) {
          // Remove from department employees list
          const deptIndex = this.departments.findIndex(d => d.id === employee.departmentId);
          if (deptIndex !== -1) {
            this.departments[deptIndex].employees = this.departments[deptIndex].employees
              .filter(empId => empId !== id);
            localStorage.setItem('hrms_departments', JSON.stringify(this.departments));
          }
          
          // In a real system, we might archive instead of delete
          this.employees = this.employees.filter(emp => emp.id !== id);
          localStorage.setItem('hrms_employees', JSON.stringify(this.employees));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error deleting employee';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createPosition(positionData: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newPosition: Position = {
          ...positionData,
          id: `pos-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.positions.push(newPosition);
        localStorage.setItem('hrms_positions', JSON.stringify(this.positions));
        
        this.error = null;
        return newPosition;
      } catch (error: any) {
        this.error = error.message || 'Error creating position';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createDepartment(departmentData: Omit<Department, 'id' | 'employees' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newDepartment: Department = {
          ...departmentData,
          id: `dept-${Date.now()}`,
          employees: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.departments.push(newDepartment);
        localStorage.setItem('hrms_departments', JSON.stringify(this.departments));
        
        this.error = null;
        return newDepartment;
      } catch (error: any) {
        this.error = error.message || 'Error creating department';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});