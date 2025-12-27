<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <div class="header-content">
        <router-link to="/" class="logo">
          <span class="logo-icon">🍽️</span>
          <span class="logo-text">FoodStuff</span>
        </router-link>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/inventory">Inventory</RouterLink>
          <RouterLink to="/shopping">Shopping</RouterLink>
          <RouterLink to="/recipes">Recipes</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>&copy; 2025 FoodStuff - Pantry Inventory Tracking System</p>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  color: #007bff;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

nav a:hover {
  color: #007bff;
  background: #e7f3ff;
}

nav a.router-link-active {
  color: #007bff;
  background: #e7f3ff;
}

main {
  flex: 1;
}

footer {
  background: white;
  border-top: 1px solid #ddd;
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 4rem;
}

footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  nav {
    gap: 1rem;
  }

  nav a {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
