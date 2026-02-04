<template>
  <div class="kanban-board">
    <div class="board-header">
      <h2>{{ board.name }}</h2>
      <div class="board-actions">
        <button @click="addColumn" class="btn btn-primary">Добавить колонку</button>
      </div>
    </div>
    
    <div class="board-columns">
      <div 
        v-for="column in orderedColumns" 
        :key="column.id" 
        class="column"
        :style="{ backgroundColor: column.color ? `${column.color}20` : '#f0f0f0' }"
      >
        <div class="column-header">
          <h3>{{ column.title }}</h3>
          <span class="task-count">{{ column.tasks.length }}</span>
        </div>
        
        <div 
          class="task-list"
          :id="`column-${column.id}`"
          @dragover.prevent
          @drop="onDrop($event, column.id)"
        >
          <div
            v-for="task in getColumnTasks(column.id)"
            :key="task.id"
            class="task-card"
            draggable
            @dragstart="onDragStart($event, task.id)"
            @click="openTaskDetails(task)"
          >
            <h4>{{ task.title }}</h4>
            <p v-if="task.description" class="task-description">{{ task.description.substring(0, 100) }}...</p>
            <div class="task-meta">
              <span v-if="task.assigneeId" class="assignee">{{ getAssigneeName(task.assigneeId) }}</span>
              <span v-if="task.deadline" :class="getDeadlineClass(task.deadline)" class="deadline">
                {{ formatDate(task.deadline) }}
              </span>
              <span :class="'priority-' + task.priority" class="priority">{{ task.priority }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Task Details Modal -->
    <div v-if="selectedTask" class="modal-overlay" @click="closeTaskDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedTask.title }}</h3>
          <button @click="closeTaskDetails" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p v-if="selectedTask.description">{{ selectedTask.description }}</p>
          <div class="task-details">
            <div class="detail-item">
              <label>Статус:</label>
              <select 
                :value="selectedTask.status" 
                @change="updateTaskStatus(selectedTask.id, $event.target.value)"
              >
                <option v-for="col in board.columns" :key="col.id" :value="col.id">{{ col.title }}</option>
              </select>
            </div>
            <div class="detail-item">
              <label>Приоритет:</label>
              <select 
                :value="selectedTask.priority" 
                @change="updateTaskPriority(selectedTask.id, $event.target.value)"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>
            <div class="detail-item">
              <label>Исполнитель:</label>
              <select 
                :value="selectedTask.assigneeId || ''" 
                @change="updateTaskAssignee(selectedTask.id, $event.target.value)"
              >
                <option value="">Не назначен</option>
                <option v-for="employee in allEmployees" :key="employee.id" :value="employee.id">
                  {{ employee.firstName }} {{ employee.lastName }}
                </option>
              </select>
            </div>
            <div class="detail-item">
              <label>Дедлайн:</label>
              <input 
                type="date" 
                :value="formatDateForInput(selectedTask.deadline)" 
                @change="updateTaskDeadline(selectedTask.id, $event.target.value)"
              />
            </div>
            <div class="detail-item">
              <label>Теги:</label>
              <input 
                type="text" 
                :value="selectedTask.tags.join(', ')" 
                @change="updateTaskTags(selectedTask.id, $event.target.value)"
                placeholder="Тег1, Тег2, ..."
              />
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
import { TaskCard, KanbanBoard, KanbanColumn } from '../models/Task';

const props = defineProps<{
  boardId: string;
}>();

const taskStore = useTaskStore();
const employeeStore = useEmployeeStore();
const selectedTask = ref<TaskCard | null>(null);

onMounted(async () => {
  await taskStore.fetchTasks();
  await employeeStore.fetchEmployees();
});

const board = computed(() => {
  return taskStore.getBoardById(props.boardId);
});

const orderedColumns = computed(() => {
  if (!board.value) return [];
  return [...board.value.columns].sort((a, b) => a.order - b.order);
});

const allEmployees = computed(() => employeeStore.allEmployees);

const getColumnTasks = (columnId: string) => {
  if (!board.value) return [];
  return taskStore.tasks.filter(task => task.status === columnId);
};

const getAssigneeName = (assigneeId: string) => {
  const employee = employeeStore.getEmployeeById(assigneeId);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Не назначен';
};

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const formatDateForInput = (date: Date | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
};

const getDeadlineClass = (deadline: Date) => {
  const today = new Date();
  const dueDate = new Date(deadline);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'deadline-overdue';
  if (diffDays <= 1) return 'deadline-today';
  if (diffDays <= 3) return 'deadline-soon';
  return 'deadline-future';
};

const openTaskDetails = (task: TaskCard) => {
  selectedTask.value = { ...task }; // Create a copy to avoid direct mutation
};

const closeTaskDetails = () => {
  selectedTask.value = null;
};

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  if (selectedTask.value) {
    selectedTask.value.status = newStatus;
    await taskStore.updateTask(taskId, { status: newStatus });
  }
};

const updateTaskPriority = async (taskId: string, newPriority: string) => {
  if (selectedTask.value) {
    selectedTask.value.priority = newPriority as any;
    await taskStore.updateTask(taskId, { priority: newPriority });
  }
};

const updateTaskAssignee = async (taskId: string, newAssigneeId: string) => {
  if (selectedTask.value) {
    selectedTask.value.assigneeId = newAssigneeId || undefined;
    await taskStore.updateTask(taskId, { assigneeId: newAssigneeId || null });
  }
};

const updateTaskDeadline = async (taskId: string, newDeadline: string) => {
  if (selectedTask.value) {
    const date = newDeadline ? new Date(newDeadline) : undefined;
    selectedTask.value.deadline = date;
    await taskStore.updateTask(taskId, { deadline: date });
  }
};

const updateTaskTags = async (taskId: string, tagsString: string) => {
  if (selectedTask.value) {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    selectedTask.value.tags = tags;
    await taskStore.updateTask(taskId, { tags });
  }
};

const addColumn = async () => {
  if (board.value) {
    const newColumnTitle = prompt('Введите название новой колонки:');
    if (newColumnTitle) {
      await taskStore.addColumnToBoard(props.boardId, {
        title: newColumnTitle,
        order: board.value.columns.length + 1
      });
    }
  }
};

// Drag and drop functionality
const draggedTaskId = ref<string | null>(null);

const onDragStart = (event: DragEvent, taskId: string) => {
  draggedTaskId.value = taskId;
  event.dataTransfer?.setData('text/plain', taskId);
};

const onDrop = async (event: Event, columnId: string) => {
  event.preventDefault();
  if (draggedTaskId.value) {
    await taskStore.moveTaskToColumn(draggedTaskId.value, columnId);
    draggedTaskId.value = null;
  }
};
</script>

<style scoped>
.kanban-board {
  padding: 20px;
  min-height: 100%;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.board-columns {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.column {
  min-width: 280px;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.task-count {
  background-color: #ccc;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.task-list {
  flex: 1;
  min-height: 200px;
}

.task-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.task-description {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
}

.assignee {
  background-color: #e9ecef;
  padding: 2px 6px;
  border-radius: 3px;
}

.deadline {
  padding: 2px 6px;
  border-radius: 3px;
}

.deadline-overdue {
  background-color: #dc3545;
  color: white;
}

.deadline-today {
  background-color: #fd7e14;
  color: white;
}

.deadline-soon {
  background-color: #ffc107;
  color: black;
}

.deadline-future {
  background-color: #28a745;
  color: white;
}

.priority {
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
}

.priority-low {
  background-color: #d3d3d3;
}

.priority-medium {
  background-color: #f8d7da;
  color: #721c24;
}

.priority-high {
  background-color: #fff3cd;
  color: #856404;
}

.priority-urgent {
  background-color: #f8d7da;
  color: #721c24;
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
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
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
  padding: 15px;
}

.task-details {
  margin-top: 15px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.detail-item select,
.detail-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>