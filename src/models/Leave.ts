export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'unpaid' | 'maternity';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason?: string;
  approverId?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  employeeId: string;
  year: number;
  vacationDays: number;
  remainingVacationDays: number;
  sickDays: number;
  remainingSickDays: number;
}