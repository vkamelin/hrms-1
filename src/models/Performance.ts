export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  periodStart: Date;
  periodEnd: Date;
  rating: number; // 1-5
  comments: string;
  goals: PerformanceGoal[];
  kpis: KPI[];
  status: 'draft' | 'submitted' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceGoal {
  id: string;
  description: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
}