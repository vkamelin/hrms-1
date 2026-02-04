<template>
  <div class="employee-view">
    <div class="view-header">
      <h1>Сотрудники</h1>
      <p>Управление информацией о персонале</p>
    </div>
    
    <EmployeeList />
  </div>
</template>

<script setup lang="ts">
import EmployeeList from '../components/EmployeeList.vue';
</script>

<style scoped>
.employee-view {
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