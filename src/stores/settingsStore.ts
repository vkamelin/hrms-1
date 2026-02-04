import { defineStore } from 'pinia';
import { SystemSettings, NotificationSettings } from '../models/SystemSettings';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {
      id: 'system-settings',
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
      vacationDaysPerYear: 28,
      sickLeaveDaysPerYear: 10,
      notificationSettings: {
        email: true,
        browser: true,
        taskAssigned: true,
        taskDeadline: true,
        leaveRequest: true,
        performanceReview: true
      },
      language: 'ru',
      timezone: 'Europe/Moscow'
    } as SystemSettings,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    systemSettings: (state) => state.settings,
    workingDays: (state) => state.settings.workingDays,
    vacationDays: (state) => state.settings.vacationDaysPerYear,
    sickLeaveDays: (state) => state.settings.sickLeaveDaysPerYear,
    notifications: (state) => state.settings.notificationSettings,
    language: (state) => state.settings.language,
    timezone: (state) => state.settings.timezone
  },

  actions: {
    async fetchSettings() {
      this.loading = true;
      try {
        const storedSettings = localStorage.getItem('hrms_system_settings');
        
        if (storedSettings) {
          this.settings = JSON.parse(storedSettings);
        } else {
          // Initialize with default settings
          localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        }
        
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error fetching settings';
      } finally {
        this.loading = false;
      }
    },

    async updateWorkingDays(days: number[]) {
      this.loading = true;
      try {
        this.settings.workingDays = days;
        this.settings.updatedAt = new Date(); // This field doesn't exist in our interface, but we'll add it anyway
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating working days';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateVacationDays(days: number) {
      this.loading = true;
      try {
        this.settings.vacationDaysPerYear = days;
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating vacation days';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSickLeaveDays(days: number) {
      this.loading = true;
      try {
        this.settings.sickLeaveDaysPerYear = days;
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating sick leave days';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateNotificationSettings(settings: Partial<NotificationSettings>) {
      this.loading = true;
      try {
        this.settings.notificationSettings = {
          ...this.settings.notificationSettings,
          ...settings
        };
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating notification settings';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLanguage(lang: string) {
      this.loading = true;
      try {
        this.settings.language = lang;
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating language';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTimezone(tz: string) {
      this.loading = true;
      try {
        this.settings.timezone = tz;
        
        localStorage.setItem('hrms_system_settings', JSON.stringify(this.settings));
        this.error = null;
      } catch (error: any) {
        this.error = error.message || 'Error updating timezone';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});