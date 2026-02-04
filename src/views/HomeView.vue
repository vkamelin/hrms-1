<template>
  <div class="home">
    <section class="dashboard-stats">
      <div class="stat-card">
        <h3>Сотрудники</h3>
        <div class="stat-number">{{ employeeCount }}</div>
        <p>Всего в системе</p>
      </div>
      <div class="stat-card">
        <h3>Задачи</h3>
        <div class="stat-number">{{ taskCount }}</div>
        <p>Активных задач</p>
      </div>
      <div class="stat-card">
        <h3>Отпуска</h3>
        <div class="stat-number">{{ leaveCount }}</div>
        <p>Запланировано</p>
      </div>
      <div class="stat-card">
        <h3>Проекты</h3>
        <div class="stat-number">{{ projectCount }}</div>
        <p>Активных проектов</p>
      </div>
    </section>
    
    <section class="dashboard-content">
      <div class="quick-actions">
        <h2>Быстрые действия</h2>
        <div class="actions-grid">
          <router-link to="/employees" class="action-card">
            <div class="action-icon">👥</div>
            <h3>Сотрудники</h3>
            <p>Управление персоналом</p>
          </router-link>
          <router-link to="/tasks" class="action-card">
            <div class="action-icon">✅</div>
            <h3>Задачи</h3>
            <p>Планирование и контроль</p>
          </router-link>
          <router-link to="/kanban" class="action-card">
            <div class="action-icon">📋</div>
            <h3>Kanban</h3>
            <p>Доска задач</p>
          </router-link>
          <router-link to="/reports" class="action-card">
            <div class="action-icon">📊</div>
            <h3>Отчеты</h3>
            <p>Аналитика и статистика</p>
          </router-link>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Недавняя активность</h2>
        <div class="activity-list">
          <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <h4>{{ activity.title }}</h4>
              <p>{{ activity.description }}</p>
              <small>{{ formatDate(activity.timestamp) }}</small>
            </div>
          </div>
          <div v-if="recentActivities.length === 0" class="no-activities">
            Нет недавней активности
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';
import { useTaskStore } from '../stores/taskStore';
import { useLeaveStore } from '../stores/leaveStore';

const employeeStore = useEmployeeStore();
const taskStore = useTaskStore();
const leaveStore = useLeaveStore();

onMounted(async () => {
  await Promise.all([
    employeeStore.fetchEmployees(),
    taskStore.fetchTasks(),
    leaveStore.fetchLeaveRequests()
  ]);
});

const employeeCount = computed(() => employeeStore.allEmployees.length);
const taskCount = computed(() => taskStore.allTasks.length);
const leaveCount = computed(() => {
  // Count approved leave requests that are upcoming or ongoing
  return leaveStore.allLeaveRequests.filter(
    req => req.status === 'approved' && 
    new Date(req.endDate) >= new Date() // End date is in the future
  ).length;
});
const projectCount = computed(() => taskStore.allBoards.length);

// Sample recent activities - in a real app, these would come from a dedicated activity log
const recentActivities = computed(() => {
  // Combine recent items from different stores
  const activities: any[] = [];
  
  // Recent employees
  const recentEmployees = [...employeeStore.allEmployees]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  recentEmployees.forEach(emp => {
    activities.push({
      id: `emp-${emp.id}`,
      icon: '👤',
      title: `Новый сотрудник: ${emp.firstName} ${emp.lastName}`,
      description: `Добавлен в отдел ${employeeStore.getDepartmentById(emp.departmentId)?.name || 'не указан'}`,
      timestamp: emp.createdAt
    });
  });
  
  // Recent tasks
  const recentTasks = [...taskStore.allTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  recentTasks.forEach(task => {
    activities.push({
      id: `task-${task.id}`,
      icon: '✅',
      title: `Новая задача: ${task.title}`,
      description: `Назначена ${task.assigneeId ? `исполнителю ${employeeStore.getEmployeeById(task.assigneeId)?.firstName || ''}` : 'без исполнителя'}`,
      timestamp: task.createdAt
    });
  });
  
  // Recent leave requests
  const recentLeaves = [...leaveStore.allLeaveRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  recentLeaves.forEach(leave => {
    const employee = employeeStore.getEmployeeById(leave.employeeId);
    activities.push({
      id: `leave-${leave.id}`,
      icon: '🏖️',
      title: `Запрос на отпуск: ${employee?.firstName || ''} ${employee?.lastName || ''}`,
      description: `С ${formatDate(leave.startDate)} по ${formatDate(leave.endDate)}. Статус: ${getStatusText(leave.status)}`,
      timestamp: leave.createdAt
    });
  });
  
  // Sort all activities by timestamp and take the most recent ones
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
});

const getStatusText = (status: string) => {
  switch(status) {
    case 'pending': return 'ожидает рассмотрения';
    case 'approved': return 'одобрен';
    case 'rejected': return 'отклонен';
    case 'cancelled': return 'отменен';
    default: return status;
  }
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru-RU');
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #6c757d;
  font-size: 16px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.stat-card p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.quick-actions h2,
.recent-activity h2 {
  margin: 0 0 20px 0;
  color: #343a40;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.action-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.action-card h3 {
  margin: 10px 0 5px 0;
  color: #007bff;
  font-size: 18px;
}

.action-card p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.activity-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 24px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-content h4 {
  margin: 0 0 5px 0;
  color: #343a40;
}

.activity-content p {
  margin: 0 0 5px 0;
  color: #6c757d;
  font-size: 14px;
}

.activity-content small {
  color: #adb5bd;
}

.no-activities {
  text-align: center;
  color: #6c757d;
  padding: 20px 0;
  font-style: italic;
}
</style>