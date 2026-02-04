<template>
  <div class="employee-list">
    <div class="list-header">
      <h2>Список сотрудников</h2>
      <div class="actions">
        <button @click="addEmployee" class="btn btn-primary">Добавить сотрудника</button>
      </div>
    </div>
    
    <div class="search-filter">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по имени, должности или отделу..." 
        class="search-input"
      />
      <select v-model="selectedDepartment" class="filter-select">
        <option value="">Все отделы</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Все статусы</option>
        <option value="active">Активный</option>
        <option value="on_leave">В отпуске</option>
        <option value="terminated">Уволен</option>
      </select>
    </div>
    
    <div class="table-container">
      <table class="employee-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Статус</th>
            <th>Дата найма</th>
            <th>Контакты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="employee in filteredEmployees" 
            :key="employee.id"
            :class="{ 'inactive-row': employee.status === 'terminated' }"
          >
            <td>
              <div class="employee-info">
                <div class="avatar">{{ getInitials(employee) }}</div>
                <div class="name-details">
                  <div class="full-name">{{ employee.lastName }} {{ employee.firstName }} {{ employee.middleName || '' }}</div>
                  <div class="email">{{ employee.email }}</div>
                </div>
              </div>
            </td>
            <td>{{ getPositionName(employee.positionId) }}</td>
            <td>{{ getDepartmentName(employee.departmentId) }}</td>
            <td>
              <span :class="'status-badge ' + employee.status">
                {{ getStatusText(employee.status) }}
              </span>
            </td>
            <td>{{ formatDate(employee.hireDate) }}</td>
            <td>
              <div class="contact-info">
                <span v-if="employee.phone">{{ employee.phone }}</span>
                <span v-else>Не указан</span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewEmployee(employee)" class="btn btn-secondary btn-small">Просмотр</button>
                <button @click="editEmployee(employee)" class="btn btn-outline btn-small">Редактировать</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Employee Detail Modal -->
    <div v-if="selectedEmployee" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Информация о сотруднике</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="employee-detail">
            <div class="detail-section">
              <h4>Личная информация</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Фамилия:</label>
                  <span>{{ selectedEmployee.lastName }}</span>
                </div>
                <div class="detail-item">
                  <label>Имя:</label>
                  <span>{{ selectedEmployee.firstName }}</span>
                </div>
                <div class="detail-item" v-if="selectedEmployee.middleName">
                  <label>Отчество:</label>
                  <span>{{ selectedEmployee.middleName }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span>{{ selectedEmployee.email }}</span>
                </div>
                <div class="detail-item" v-if="selectedEmployee.phone">
                  <label>Телефон:</label>
                  <span>{{ selectedEmployee.phone }}</span>
                </div>
                <div class="detail-item">
                  <label>Дата найма:</label>
                  <span>{{ formatDate(selectedEmployee.hireDate) }}</span>
                </div>
                <div class="detail-item" v-if="selectedEmployee.terminationDate">
                  <label>Дата увольнения:</label>
                  <span>{{ formatDate(selectedEmployee.terminationDate) }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Работа</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Должность:</label>
                  <span>{{ getPositionName(selectedEmployee.positionId) }}</span>
                </div>
                <div class="detail-item">
                  <label>Отдел:</label>
                  <span>{{ getDepartmentName(selectedEmployee.departmentId) }}</span>
                </div>
                <div class="detail-item">
                  <label>Руководитель:</label>
                  <span v-if="selectedEmployee.managerId">
                    {{ getManagerName(selectedEmployee.managerId) }}
                  </span>
                  <span v-else>Не назначен</span>
                </div>
                <div class="detail-item">
                  <label>Статус:</label>
                  <span :class="'status-badge ' + selectedEmployee.status">
                    {{ getStatusText(selectedEmployee.status) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedEmployee.skills && selectedEmployee.skills.length > 0">
              <h4>Навыки</h4>
              <div class="skills-list">
                <span 
                  v-for="skill in selectedEmployee.skills" 
                  :key="skill" 
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedEmployee.bio">
              <h4>Биография</h4>
              <p>{{ selectedEmployee.bio }}</p>
            </div>
            
            <div class="detail-section">
              <h4>История изменений</h4>
              <div class="history-list">
                <div 
                  v-for="record in selectedEmployee.history" 
                  :key="record.id" 
                  class="history-record"
                >
                  <div class="history-date">{{ formatDate(record.timestamp) }}</div>
                  <div class="history-type">{{ getHistoryTypeText(record.type) }}</div>
                  <div class="history-changes" v-if="record.changes">
                    <pre>{{ JSON.stringify(record.changes, null, 2) }}</pre>
                  </div>
                </div>
                <div v-if="!selectedEmployee.history || selectedEmployee.history.length === 0">
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
import { useEmployeeStore } from '../stores/employeeStore';
import { Employee } from '../models/Employee';

const employeeStore = useEmployeeStore();
const selectedEmployee = ref<Employee | null>(null);
const searchQuery = ref('');
const selectedDepartment = ref('');
const selectedStatus = ref('');

onMounted(async () => {
  await employeeStore.fetchEmployees();
});

const employees = computed(() => employeeStore.allEmployees);
const departments = computed(() => employeeStore.allDepartments);
const positions = computed(() => employeeStore.allPositions);

const filteredEmployees = computed(() => {
  return employees.value.filter(emp => {
    // Apply search filter
    const matchesSearch = 
      `${emp.firstName} ${emp.lastName} ${emp.middleName || ''}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      getPositionName(emp.positionId).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      getDepartmentName(emp.departmentId).toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Apply department filter
    const matchesDepartment = !selectedDepartment.value || emp.departmentId === selectedDepartment.value;
    
    // Apply status filter
    const matchesStatus = !selectedStatus.value || emp.status === selectedStatus.value;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
});

const getPositionName = (positionId: string) => {
  const position = positions.value.find(p => p.id === positionId);
  return position ? position.name : 'Не указана';
};

const getDepartmentName = (departmentId: string) => {
  const department = departments.value.find(d => d.id === departmentId);
  return department ? department.name : 'Не указан';
};

const getManagerName = (managerId: string) => {
  const manager = employeeStore.getEmployeeById(managerId);
  return manager ? `${manager.firstName} ${manager.lastName}` : 'Не найден';
};

const getInitials = (employee: Employee) => {
  const first = employee.firstName.charAt(0);
  const last = employee.lastName.charAt(0);
  return `${first}${last}`.toUpperCase();
};

const getStatusText = (status: string) => {
  switch(status) {
    case 'active': return 'Активный';
    case 'on_leave': return 'В отпуске';
    case 'terminated': return 'Уволен';
    default: return status;
  }
};

const getHistoryTypeText = (type: string) => {
  switch(type) {
    case 'hire': return 'Найм';
    case 'transfer': return 'Перевод';
    case 'promotion': return 'Повышение';
    case 'termination': return 'Увольнение';
    case 'update': return 'Обновление';
    default: return type;
  }
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const viewEmployee = (employee: Employee) => {
  selectedEmployee.value = { ...employee };
};

const editEmployee = (employee: Employee) => {
  // In a real app, this would open an edit form
  alert(`Редактирование сотрудника: ${employee.firstName} ${employee.lastName}`);
};

const addEmployee = () => {
  // In a real app, this would open an add form
  alert('Добавить нового сотрудника');
};

const closeModal = () => {
  selectedEmployee.value = null;
};
</script>

<style scoped>
.employee-list {
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

.employee-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.employee-table th,
.employee-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.employee-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.inactive-row {
  opacity: 0.6;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.name-details .full-name {
  font-weight: 600;
}

.name-details .email {
  color: #6c757d;
  font-size: 13px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.on_leave {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.terminated {
  background-color: #f8d7da;
  color: #721c24;
}

.contact-info {
  font-size: 13px;
  color: #6c757d;
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
  width: 800px;
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

.employee-detail .detail-section {
  margin-bottom: 25px;
}

.employee-detail h4 {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: #495057;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
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

.detail-item span {
  color: #6c757d;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
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

.history-type {
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