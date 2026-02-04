<template>
  <div class="task-view">
    <div class="view-header">
      <h1>Задачи</h1>
      <p>Управление задачами и проектами</p>
    </div>
    
    <TaskList />
  </div>
</template>

<script setup lang="ts">
import TaskList from '../components/TaskList.vue';
</script>

<style scoped>
.task-view {
  padding: 20px;
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
</style>