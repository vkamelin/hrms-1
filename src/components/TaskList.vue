<template>
  <div class="task-list">
    <div class="list-header">
      <h2>Список задач</h2>
      <div class="actions">
        <button @click="addTask" class="btn btn-primary">Добавить задачу</button>
      </div>
    </div>
    
    <div class="search-filter">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по названию, описанию или исполнителю..." 
        class="search-input"
      />
      <select v-model="selectedAssignee" class="filter-select">
        <option value="">Все исполнители</option>
        <option v-for="employee in employees" :key="employee.id" :value="employee.id">
          {{ employee.firstName }} {{ employee.lastName }}
        </option>
      </select>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Все статусы</option>
        <option v-for="column in allColumns" :key="column.id" :value="column.id">
          {{ column.title }}
        </option>
      </select>
      <select v-model="selectedPriority" class="filter-select">
        <option value="">Все приоритеты</option>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
        <option value="urgent">Срочный</option>
      </select>
    </div>
    
    <div class="table-container">
      <table class="task-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Исполнитель</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Дедлайн</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>
              <div class="task-title">
                <span :class="'priority-indicator ' + task.priority"></span>
                <strong>{{ task.title }}</strong>
              </div>
            </td>
            <td>
              <div class="task-description" v-if="task.description">
                {{ task.description.substring(0, 100) }}...
              </div>
              <div class="task-description" v-else>
                <em>Без описания</em>
              </div>
            </td>
            <td>
              <div class="assignee-info">
                <span v-if="task.assigneeId" class="assignee-name">
                  {{ getAssigneeName(task.assigneeId) }}
                </span>
                <span v-else class="no-assignee">Не назначен</span>
              </div>
            </td>
            <td>
              <span class="status-badge" :style="{ backgroundColor: getColumnColor(task.status) }">
                {{ getColumnTitle(task.status) }}
              </span>
            </td>
            <td>
              <span :class="'priority-badge ' + task.priority">
                {{ getPriorityText(task.priority) }}
              </span>
            </td>
            <td>
              <div :class="getDeadlineClass(task.deadline)">
                {{ formatDate(task.deadline) }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewTask(task)" class="btn btn-secondary btn-small">Просмотр</button>
                <button @click="editTask(task)" class="btn btn-outline btn-small">Редактировать</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Task Detail Modal -->
    <div v-if="selectedTask" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedTask.title }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="task-detail">
            <div class="detail-section">
              <h4>Описание</h4>
              <p v-if="selectedTask.description">{{ selectedTask.description }}</p>
              <p v-else><em>Описание отсутствует</em></p>
            </div>
            
            <div class="detail-grid">
              <div class="detail-item">
                <label>Статус:</label>
                <span class="status-value" :style="{ backgroundColor: getColumnColor(selectedTask.status) }">
                  {{ getColumnTitle(selectedTask.status) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Приоритет:</label>
                <span :class="'priority-value ' + selectedTask.priority">
                  {{ getPriorityText(selectedTask.priority) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Исполнитель:</label>
                <span v-if="selectedTask.assigneeId" class="assignee-value">
                  {{ getAssigneeName(selectedTask.assigneeId) }}
                </span>
                <span v-else class="no-assignee">Не назначен</span>
              </div>
              <div class="detail-item">
                <label>Дедлайн:</label>
                <span :class="getDeadlineClass(selectedTask.deadline)">
                  {{ formatDate(selectedTask.deadline) }}
                </span>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedTask.tags && selectedTask.tags.length > 0">
              <h4>Теги</h4>
              <div class="tags-list">
                <span 
                  v-for="tag in selectedTask.tags" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>История изменений</h4>
              <div class="history-list">
                <div 
                  v-for="record in selectedTask.history" 
                  :key="record.id" 
                  class="history-record"
                >
                  <div class="history-date">{{ formatDate(record.timestamp) }}</div>
                  <div class="history-action">{{ getActionText(record.action) }}</div>
                  <div class="history-changes" v-if="record.changes">
                    <pre>{{ JSON.stringify(record.changes, null, 2) }}</pre>
                  </div>
                </div>
                <div v-if="!selectedTask.history || selectedTask.history.length === 0">
                  История изменений отсутствует
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from '../stores/taskStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { TaskCard } from '../models/Task';

const taskStore = useTaskStore();
const employeeStore = useEmployeeStore();
const selectedTask = ref<TaskCard | null>(null);
const searchQuery = ref('');
const selectedAssignee = ref('');
const selectedStatus = ref('');
const selectedPriority = ref('');

onMounted(async () => {
  await taskStore.fetchTasks();
  await employeeStore.fetchEmployees();
});

const tasks = computed(() => taskStore.allTasks);
const employees = computed(() => employeeStore.allEmployees);
const allBoards = computed(() => taskStore.allBoards);

// Получаем все колонки из всех досок
const allColumns = computed(() => {
  return allBoards.value.flatMap(board => board.columns);
});

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    // Apply search filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (task.assigneeId && getAssigneeName(task.assigneeId).toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    // Apply assignee filter
    const matchesAssignee = !selectedAssignee.value || task.assigneeId === selectedAssignee.value;
    
    // Apply status filter
    const matchesStatus = !selectedStatus.value || task.status === selectedStatus.value;
    
    // Apply priority filter
    const matchesPriority = !selectedPriority.value || task.priority === selectedPriority.value;
    
    return matchesSearch && matchesAssignee && matchesStatus && matchesPriority;
  });
});

const getAssigneeName = (assigneeId: string) => {
  const employee = employeeStore.getEmployeeById(assigneeId);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Не найден';
};

const getColumnTitle = (statusId: string) => {
  const column = allColumns.value.find(col => col.id === statusId);
  return column ? column.title : 'Неизвестно';
};

const getColumnColor = (statusId: string) => {
  const column = allColumns.value.find(col => col.id === statusId);
  return column ? (column.color || '#ccc') : '#ccc';
};

const getPriorityText = (priority: string) => {
  switch(priority) {
    case 'low': return 'Низкий';
    case 'medium': return 'Средний';
    case 'high': return 'Высокий';
    case 'urgent': return 'Срочный';
    default: return priority;
  }
};

const getActionText = (action: string) => {
  switch(action) {
    case 'created': return 'Создана';
    case 'updated': return 'Обновлена';
    case 'moved': return 'Перемещена';
    case 'assigned': return 'Назначена';
    case 'completed': return 'Завершена';
    default: return action;
  }
};

const formatDate = (date: Date | undefined) => {
  if (!date) return 'Не указан';
  return new Date(date).toLocaleDateString();
};

const getDeadlineClass = (deadline: Date | undefined) => {
  if (!deadline) return '';
  
  const today = new Date();
  const dueDate = new Date(deadline);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'deadline-overdue';
  if (diffDays <= 1) return 'deadline-today';
  if (diffDays <= 3) return 'deadline-soon';
  return 'deadline-future';
};

const viewTask = (task: TaskCard) => {
  selectedTask.value = { ...task };
};

const editTask = (task: TaskCard) => {
  // In a real app, this would open an edit form
  alert(`Редактирование задачи: ${task.title}`);
};

const addTask = () => {
  // In a real app, this would open an add form
  alert('Добавить новую задачу');
};

const closeModal = () => {
  selectedTask.value = null;
};
</script>

<style scoped>
.task-list {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
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

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.search-filter {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.table-container {
  overflow-x: auto;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.task-table th,
.task-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.task-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-indicator.low {
  background-color: #d3d3d3;
}

.priority-indicator.medium {
  background-color: #f8d7da;
}

.priority-indicator.high {
  background-color: #fff3cd;
}

.priority-indicator.urgent {
  background-color: #f8d7da;
}

.task-description {
  color: #6c757d;
  font-size: 13px;
}

.assignee-info {
  display: flex;
  align-items: center;
}

.assignee-name {
  color: #007bff;
  font-weight: 500;
}

.no-assignee {
  color: #6c757d;
  font-style: italic;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-badge.low {
  background-color: #d3d3d3;
  color: #333;
}

.priority-badge.medium {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-badge.high {
  background-color: #fff3cd;
  color: #856404;
}

.priority-badge.urgent {
  background-color: #f8d7da;
  color: #721c24;
}

.deadline-overdue {
  color: #dc3545;
  font-weight: 600;
}

.deadline-today {
  color: #fd7e14;
  font-weight: 600;
}

.deadline-soon {
  color: #ffc107;
  font-weight: 600;
}

.deadline-future {
  color: #28a745;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 700px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.task-detail .detail-section {
  margin-bottom: 25px;
}

.task-detail h4 {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: #495057;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item label {
  font-weight: 600;
  margin-bottom: 4px;
  color: #495057;
  font-size: 13px;
}

.status-value {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.priority-value {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-value.low {
  background-color: #d3d3d3;
  color: #333;
}

.priority-value.medium {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-value.high {
  background-color: #fff3cd;
  color: #856404;
}

.priority-value.urgent {
  background-color: #f8d7da;
  color: #721c24;
}

.assignee-value {
  color: #007bff;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #e9ecef;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-record {
  padding: 12px;
  border-left: 3px solid #007bff;
  background-color: #f8f9fa;
  border-radius: 0 4px 4px 0;
}

.history-date {
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
}

.history-action {
  color: #6c757d;
  margin-bottom: 5px;
}

.history-changes pre {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  overflow-x: auto;
}
</style>