import { defineStore } from 'pinia';
import { LeaveRequest, LeaveBalance } from '../models/Leave';

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaveRequests: [] as LeaveRequest[],
    leaveBalances: [] as LeaveBalance[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allLeaveRequests: (state) => state.leaveRequests,
    getLeaveRequestById: (state) => (id: string) => {
      return state.leaveRequests.find(request => request.id === id);
    },
    getLeaveRequestsByEmployee: (state) => (employeeId: string) => {
      return state.leaveRequests.filter(request => request.employeeId === employeeId);
    },
    getLeaveRequestsByStatus: (state) => (status: string) => {
      return state.leaveRequests.filter(request => request.status === status);
    },
    getLeaveBalance: (state) => (employeeId: string, year: number) => {
      return state.leaveBalances.find(
        balance => balance.employeeId === employeeId && balance.year === year
      );
    },
    pendingLeaveRequests: (state) => state.leaveRequests.filter(request => request.status === 'pending')
  },

  actions: {
    async fetchLeaveRequests() {
      this.loading = true;
      try {
        const storedRequests = localStorage.getItem('hrms_leave_requests');
        const storedBalances = localStorage.getItem('hrms_leave_balances');
        
        if (storedRequests) {
          this.leaveRequests = JSON.parse(storedRequests);
        } else {
          // Initialize with some sample data
          this.leaveRequests = [
            {
              id: 'leave-001',
              employeeId: 'emp-001',
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-06-10'),
              type: 'vacation',
              status: 'pending',
              reason: 'Ежегодный отпуск',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
        }
        
        if (storedBalances) {
          this.leaveBalances = JSON.parse(storedBalances);
        } else {
          // Initialize with some sample data
          this.leaveBalances = [
            {
              employeeId: 'emp-001',
              year: new Date().getFullYear(),
              vacationDays: 28,
              remainingVacationDays: 20,
              sickDays: 10,
              remainingSickDays: 8
            }
          ];
          localStorage.setItem('hrms_leave_balances', JSON.stringify(this.leaveBalances));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching leave requests';
      } finally {
        this.loading = false;
      }
    },

    async createLeaveRequest(requestData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newRequest: LeaveRequest = {
          ...requestData,
          id: `leave-${Date.now()}`,
          status: 'pending', // Default status
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.leaveRequests.push(newRequest);
        localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
        
        this.error = null;
        return newRequest;
      } catch (error: any) {
        this.error = error.message || 'Error creating leave request';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLeaveRequest(id: string, requestData: Partial<LeaveRequest>) {
      this.loading = true;
      try {
        const index = this.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.leaveRequests[index] = { 
            ...this.leaveRequests[index], 
            ...requestData, 
            updatedAt: new Date() 
          };
          
          localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating leave request';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async approveLeaveRequest(id: string, approverId: string) {
      this.loading = true;
      try {
        const index = this.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.leaveRequests[index].status = 'approved';
          this.leaveRequests[index].approverId = approverId;
          this.leaveRequests[index].approvedAt = new Date();
          this.leaveRequests[index].updatedAt = new Date();
          
          // Update leave balance accordingly
          const request = this.leaveRequests[index];
          const daysRequested = Math.ceil(
            (request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1; // Adding 1 because both start and end dates are inclusive
          
          const balanceIndex = this.leaveBalances.findIndex(
            balance => balance.employeeId === request.employeeId && 
                      balance.year === request.startDate.getFullYear()
          );
          
          if (balanceIndex !== -1) {
            if (request.type === 'vacation') {
              this.leaveBalances[balanceIndex].remainingVacationDays -= daysRequested;
            } else if (request.type === 'sick') {
              this.leaveBalances[balanceIndex].remainingSickDays -= daysRequested;
            }
            
            localStorage.setItem('hrms_leave_balances', JSON.stringify(this.leaveBalances));
          }
          
          localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error approving leave request';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async rejectLeaveRequest(id: string, approverId: string) {
      this.loading = true;
      try {
        const index = this.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.leaveRequests[index].status = 'rejected';
          this.leaveRequests[index].approverId = approverId;
          this.leaveRequests[index].approvedAt = new Date();
          this.leaveRequests[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error rejecting leave request';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelLeaveRequest(id: string) {
      this.loading = true;
      try {
        const index = this.leaveRequests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.leaveRequests[index].status = 'cancelled';
          this.leaveRequests[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_leave_requests', JSON.stringify(this.leaveRequests));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error cancelling leave request';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLeaveBalance(balanceData: LeaveBalance) {
      this.loading = true;
      try {
        const index = this.leaveBalances.findIndex(
          balance => balance.employeeId === balanceData.employeeId && 
                     balance.year === balanceData.year
        );
        
        if (index !== -1) {
          // Update existing balance
          this.leaveBalances[index] = { ...this.leaveBalances[index], ...balanceData };
        } else {
          // Create new balance record
          this.leaveBalances.push(balanceData);
        }
        
        localStorage.setItem('hrms_leave_balances', JSON.stringify(this.leaveBalances));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating leave balance';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});