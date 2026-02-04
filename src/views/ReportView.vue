<template>
  <div class="report-view">
    <div class="view-header">
      <h1>Отчеты</h1>
      <p>Аналитика и статистика по системе</p>
    </div>
    
    <div class="report-options">
      <div class="report-card" @click="showEmployeeReport">
        <div class="report-icon">👥</div>
        <h3>Отчет по сотрудникам</h3>
        <p>Статистика по персоналу, найму, увольнениям</p>
      </div>
      
      <div class="report-card" @click="showTaskReport">
        <div class="report-icon">✅</div>
        <h3>Отчет по задачам</h3>
        <p>Статистика по выполнению задач, загрузке сотрудников</p>
      </div>
      
      <div class="report-card" @click="showPerformanceReport">
        <div class="report-icon">📈</div>
        <h3>Отчет по эффективности</h3>
        <p>Оценка производительности и KPI</p>
      </div>
      
      <div class="report-card" @click="showLeaveReport">
        <div class="report-icon">🏖️</div>
        <h3>Отчет по отпускам</h3>
        <p>Статистика по использованию отпусков</p>
      </div>
    </div>
    
    <div v-if="currentReport" class="report-container">
      <div class="report-header">
        <h2>{{ reportTitle }}</h2>
        <button @click="closeReport" class="btn btn-secondary">Закрыть</button>
      </div>
      
      <div class="report-content">
        <div v-if="currentReport === 'employee'" class="employee-report">
          <h3>Статистика по сотрудникам</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-value">{{ employeeStats.total }}</div>
              <div class="stat-label">Всего сотрудников</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ employeeStats.active }}</div>
              <div class="stat-label">Активные</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ employeeStats.onLeave }}</div>
              <div class="stat-label">В отпуске</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ employeeStats.departments }}</div>
              <div class="stat-label">Отделов</div>
            </div>
          </div>
          
          <div class="chart-container">
            <h4>Распределение по отделам</h4>
            <div class="department-chart">
              <div 
                v-for="dept in departmentStats" 
                :key="dept.id" 
                class="dept-bar"
                :style="{ height: `${Math.max(20, (dept.count / employeeStats.total) * 100)}%` }"
              >
                <span class="dept-name">{{ dept.name }}</span>
                <span class="dept-count">{{ dept.count }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="currentReport === 'task'" class="task-report">
          <h3>Статистика по задачам</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-value">{{ taskStats.total }}</div>
              <div class="stat-label">Всего задач</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ taskStats.completed }}</div>
              <div class="stat-label">Выполнено</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ taskStats.inProgress }}</div>
              <div class="stat-label">В работе</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ taskStats.overdue }}</div>
              <div class="stat-label">Просрочено</div>
            </div>
          </div>
        </div>
        
        <div v-if="currentReport === 'leave'" class="leave-report">
          <h3>Статистика по отпускам</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-value">{{ leaveStats.pending }}</div>
              <div class="stat-label">На рассмотрении</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ leaveStats.approved }}</div>
              <div class="stat-label">Одобренные</div>
            </div>
            <div class="stat-box">
              <div class="stat-value">{{ leaveStats.thisMonth }}</div>
              <div class="stat-label">В этом месяце</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEmployeeStore } from '../stores/employeeStore';
import { useTaskStore } from '../stores/taskStore';
import { useLeaveStore } from '../stores/leaveStore';

const employeeStore = useEmployeeStore();
const taskStore = useTaskStore();
const leaveStore = useLeaveStore();

const currentReport = ref<string | null>(null);
const reportTitle = computed(() => {
  switch(currentReport.value) {
    case 'employee': return 'Отчет по сотрудникам';
    case 'task': return 'Отчет по задачам';
    case 'performance': return 'Отчет по эффективности';
    case 'leave': return 'Отчет по отпускам';
    default: return 'Отчет';
  }
});

onMounted(async () => {
  await Promise.all([
    employeeStore.fetchEmployees(),
    taskStore.fetchTasks(),
    leaveStore.fetchLeaveRequests()
  ]);
});

// Employee stats
const employeeStats = computed(() => {
  const total = employeeStore.allEmployees.length;
  const active = employeeStore.activeEmployees.length;
  const onLeave = employeeStore.allEmployees.filter(e => e.status === 'on_leave').length;
  const departments = employeeStore.allDepartments.length;
  
  return { total, active, onLeave, departments };
});

// Department stats
const departmentStats = computed(() => {
  return employeeStore.allDepartments.map(dept => {
    const count = employeeStore.getEmployeesByDepartment(dept.id).length;
    return {
      id: dept.id,
      name: dept.name,
      count
    };
  }).filter(dept => dept.count > 0); // Only include departments with employees
});

// Task stats
const taskStats = computed(() => {
  const total = taskStore.allTasks.length;
  const completed = taskStore.getTasksByStatus('done').length;
  const inProgress = taskStore.getTasksByStatus('in-progress').length;
  
  // Calculate overdue tasks (tasks with deadline in the past that are not completed)
  const now = new Date();
  const overdue = taskStore.allTasks.filter(task => {
    return task.deadline && new Date(task.deadline) < now && task.status !== 'done';
  }).length;
  
  return { total, completed, inProgress, overdue };
});

// Leave stats
const leaveStats = computed(() => {
  const pending = leaveStore.getLeaveRequestsByStatus('pending').length;
  const approved = leaveStore.getLeaveRequestsByStatus('approved').length;
  
  // Leaves happening this month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const thisMonth = leaveStore.allLeaveRequests.filter(leave => {
    const leaveStart = new Date(leave.startDate);
    return leave.status === 'approved' &&
           leaveStart.getFullYear() === currentYear &&
           leaveStart.getMonth() === currentMonth;
  }).length;
  
  return { pending, approved, thisMonth };
});

const showEmployeeReport = () => {
  currentReport.value = 'employee';
};

const showTaskReport = () => {
  currentReport.value = 'task';
};

const showPerformanceReport = () => {
  currentReport.value = 'performance';
  alert('Отчет по эффективности временно недоступен');
};

const showLeaveReport = () => {
  currentReport.value = 'leave';
};

const closeReport = () => {
  currentReport.value = null;
};
</script>

<style scoped>
.report-view {
  padding: 20px;
  height: 100%;
}

.view-header {
  margin-bottom: 20px;
}

.view-header h1 {
  margin: 0 0 5px 0;
  color: #343a40;
}

.view-header p {
  margin: 0;
  color: #6c757d;
}

.report-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.report-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.report-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.report-card h3 {
  margin: 0 0 10px 0;
  color: #007bff;
}

.report-card p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
}

.report-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.report-header h2 {
  margin: 0;
  color: #343a40;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: background-color 0.3s;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.report-content {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  color: #6c757d;
  font-size: 14px;
}

.chart-container {
  margin-top: 30px;
}

.department-chart {
  display: flex;
  align-items: end;
  justify-content: space-around;
  height: 200px;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.dept-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  background-color: #007bff;
  color: white;
  border-radius: 4px 4px 0 0;
  transition: opacity 0.3s;
  position: relative;
}

.dept-bar:hover {
  opacity: 0.8;
}

.dept-name {
  position: absolute;
  top: -25px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dept-count {
  padding: 5px;
  font-size: 14px;
  font-weight: bold;
}
</style>