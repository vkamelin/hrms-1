<template>
  <div id="app">
    <header class="app-header">
      <h1>HR Management System</h1>
      <nav class="main-nav">
        <router-link to="/">Главная</router-link>
        <router-link to="/employees">Сотрудники</router-link>
        <router-link to="/tasks">Задачи</router-link>
        <router-link to="/kanban">Kanban</router-link>
        <router-link to="/reports">Отчеты</router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} HR Management System</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.main-nav {
  margin-top: 1rem;
}

.main-nav a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}

.main-nav a:hover {
  text-decoration: underline;
}

.app-main {
  flex: 1;
  padding: 1rem;
}

.app-footer {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #dee2e6;
}
</style>