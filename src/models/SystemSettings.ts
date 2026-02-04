export interface SystemSettings {
  id: string;
  workingDays: number[]; // 0-6 (воскресенье-суббота)
  vacationDaysPerYear: number;
  sickLeaveDaysPerYear: number;
  notificationSettings: NotificationSettings;
  language: string;
  timezone: string;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  taskAssigned: boolean;
  taskDeadline: boolean;
  leaveRequest: boolean;
  performanceReview: boolean;
}

export interface StorageSchema {
  version: string; // '1.0.0'
  entities: {
    users: any[];
    employees: any[];
    departments: any[];
    positions: any[];
    tasks: any[];
    boards: any[];
    leaveRequests: any[];
    performanceReviews: any[];
    documents: any[];
    notes: any[];
    settings: SystemSettings;
  };
  metadata: {
    lastSync?: Date;
    lastBackup?: Date;
    checksum?: string;
  };
}