import { defineStore } from 'pinia';
import { PerformanceReview, PerformanceGoal, KPI } from '../models/Performance';

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    performanceReviews: [] as PerformanceReview[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allPerformanceReviews: (state) => state.performanceReviews,
    getPerformanceReviewById: (state) => (id: string) => {
      return state.performanceReviews.find(review => review.id === id);
    },
    getPerformanceReviewsByEmployee: (state) => (employeeId: string) => {
      return state.performanceReviews.filter(review => review.employeeId === employeeId);
    },
    getPerformanceReviewsByReviewer: (state) => (reviewerId: string) => {
      return state.performanceReviews.filter(review => review.reviewerId === reviewerId);
    },
    getActiveReviews: (state) => state.performanceReviews.filter(review => review.status === 'draft' || review.status === 'submitted')
  },

  actions: {
    async fetchPerformanceReviews() {
      this.loading = true;
      try {
        const storedReviews = localStorage.getItem('hrms_performance_reviews');
        
        if (storedReviews) {
          this.performanceReviews = JSON.parse(storedReviews);
        } else {
          // Initialize with some sample data
          this.performanceReviews = [
            {
              id: 'perf-001',
              employeeId: 'emp-001',
              reviewerId: 'user-001',
              periodStart: new Date('2024-01-01'),
              periodEnd: new Date('2024-12-31'),
              rating: 4,
              comments: 'Хорошая работа в этом квартале',
              goals: [
                {
                  id: 'goal-001',
                  description: 'Увеличить производительность на 10%',
                  targetDate: new Date('2024-06-30'),
                  status: 'in_progress'
                }
              ],
              kpis: [
                {
                  id: 'kpi-001',
                  name: 'Выполнение задач',
                  target: 95,
                  actual: 92,
                  unit: '%'
                }
              ],
              status: 'completed',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching performance reviews';
      } finally {
        this.loading = false;
      }
    },

    async createPerformanceReview(reviewData: Omit<PerformanceReview, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      try {
        const newReview: PerformanceReview = {
          ...reviewData,
          id: `perf-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.performanceReviews.push(newReview);
        localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
        
        this.error = null;
        return newReview;
      } catch (error: any) {
        this.error = error.message || 'Error creating performance review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePerformanceReview(id: string, reviewData: Partial<PerformanceReview>) {
      this.loading = true;
      try {
        const index = this.performanceReviews.findIndex(review => review.id === id);
        if (index !== -1) {
          this.performanceReviews[index] = { 
            ...this.performanceReviews[index], 
            ...reviewData, 
            updatedAt: new Date() 
          };
          
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating performance review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async submitPerformanceReview(id: string) {
      this.loading = true;
      try {
        const index = this.performanceReviews.findIndex(review => review.id === id);
        if (index !== -1) {
          this.performanceReviews[index].status = 'submitted';
          this.performanceReviews[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error submitting performance review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async completePerformanceReview(id: string, finalRating: number, finalComments: string) {
      this.loading = true;
      try {
        const index = this.performanceReviews.findIndex(review => review.id === id);
        if (index !== -1) {
          this.performanceReviews[index].rating = finalRating;
          this.performanceReviews[index].comments = finalComments;
          this.performanceReviews[index].status = 'completed';
          this.performanceReviews[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
          this.error = null;
        }
      } catch (error: any) {
        this.error = error.message || 'Error completing performance review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addGoalToReview(reviewId: string, goalData: Omit<PerformanceGoal, 'id'>) {
      this.loading = true;
      try {
        const index = this.performanceReviews.findIndex(review => review.id === reviewId);
        if (index !== -1) {
          const newGoal: PerformanceGoal = {
            ...goalData,
            id: `goal-${Date.now()}`
          };
          
          this.performanceReviews[index].goals.push(newGoal);
          this.performanceReviews[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
          this.error = null;
          
          return newGoal;
        }
      } catch (error: any) {
        this.error = error.message || 'Error adding goal to review';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateGoalStatus(reviewId: string, goalId: string, status: string) {
      this.loading = true;
      try {
        const reviewIndex = this.performanceReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
          const goalIndex = this.performanceReviews[reviewIndex].goals.findIndex(goal => goal.id === goalId);
          if (goalIndex !== -1) {
            this.performanceReviews[reviewIndex].goals[goalIndex].status = status as any;
            this.performanceReviews[reviewIndex].updatedAt = new Date();
            
            localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
            this.error = null;
          }
        }
      } catch (error: any) {
        this.error = error.message || 'Error updating goal status';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addKpiToReview(reviewId: string, kpiData: Omit<KPI, 'id'>) {
      this.loading = true;
      try {
        const index = this.performanceReviews.findIndex(review => review.id === reviewId);
        if (index !== -1) {
          const newKpi: KPI = {
            ...kpiData,
            id: `kpi-${Date.now()}`
          };
          
          this.performanceReviews[index].kpis.push(newKpi);
          this.performanceReviews[index].updatedAt = new Date();
          
          localStorage.setItem('hrms_performance_reviews', JSON.stringify(this.performanceReviews));
          this.error = null;
          
          return newKpi;
        }
      } catch (error: any) {
        this.error = error.message || 'Error adding KPI to review';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});