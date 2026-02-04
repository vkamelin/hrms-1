<template>
  <div class="kanban-view">
    <div class="view-header">
      <h1>Kanban-доска</h1>
      <p>Визуальное управление задачами</p>
    </div>
    
    <div class="board-selector" v-if="boards.length > 1">
      <label for="board-select">Выберите доску:</label>
      <select id="board-select" v-model="selectedBoardId" class="board-select">
        <option v-for="board in boards" :key="board.id" :value="board.id">
          {{ board.name }}
        </option>
      </select>
    </div>
    
    <div v-if="selectedBoardId" class="kanban-container">
      <KanbanBoard :board-id="selectedBoardId" />
    </div>
    <div v-else class="no-board-message">
      <p>Нет доступных досок. Создайте новую доску для начала работы.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import KanbanBoard from '../components/KanbanBoard.vue';
import { useTaskStore } from '../stores/taskStore';

const taskStore = useTaskStore();
const selectedBoardId = ref<string | null>(null);

onMounted(async () => {
  await taskStore.fetchTasks();
  
  // If there are boards, select the first one by default
  if (taskStore.allBoards.length > 0) {
    selectedBoardId.value = taskStore.allBoards[0].id;
  }
});

const boards = computed(() => taskStore.allBoards);
</script>

<style scoped>
.kanban-view {
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

.board-selector {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.board-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.kanban-container {
  height: calc(100vh - 200px);
}

.no-board-message {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-style: italic;
}
</style>