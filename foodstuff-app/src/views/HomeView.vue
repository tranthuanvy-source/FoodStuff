<script setup lang="ts">
import { computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useShoppingStore } from '@/stores/shopping'
import { useRecipeStore } from '@/stores/recipes'

const inventoryStore = useInventoryStore()
const shoppingStore = useShoppingStore()
const recipeStore = useRecipeStore()

const availableRecipesCount = computed(() => {
  return recipeStore.availableRecipes.filter(r => r.canMake).length
})
</script>

<template>
  <main class="home">
    <div class="hero">
      <h1>🍽️ FoodStuff</h1>
      <p class="tagline">Your household pantry inventory tracking system</p>
    </div>

    <div class="dashboard">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <h3>{{ inventoryStore.items.length }}</h3>
          <p>Items in Inventory</p>
        </div>
        <router-link to="/inventory" class="card-link">View Inventory →</router-link>
      </div>

      <div class="stat-card warning" v-if="inventoryStore.lowStockItems.length > 0">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <h3>{{ inventoryStore.lowStockItems.length }}</h3>
          <p>Low Stock Items</p>
        </div>
        <router-link to="/inventory" class="card-link">Check Items →</router-link>
      </div>

      <div class="stat-card danger" v-if="inventoryStore.expiringSoon.length > 0">
        <div class="stat-icon">🕐</div>
        <div class="stat-info">
          <h3>{{ inventoryStore.expiringSoon.length }}</h3>
          <p>Expiring Soon</p>
        </div>
        <router-link to="/inventory" class="card-link">View Items →</router-link>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🛒</div>
        <div class="stat-info">
          <h3>{{ shoppingStore.items.length }}</h3>
          <p>Shopping List Items</p>
        </div>
        <router-link to="/shopping" class="card-link">View List →</router-link>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">👨‍🍳</div>
        <div class="stat-info">
          <h3>{{ availableRecipesCount }}</h3>
          <p>Recipes You Can Make</p>
        </div>
        <router-link to="/recipes" class="card-link">Browse Recipes →</router-link>
      </div>
    </div>

    <div class="features">
      <h2>Features</h2>
      <div class="features-grid">
        <div class="feature">
          <h3>📦 Inventory Tracking</h3>
          <p>Track all items in your household pantry with quantities, expiration dates, and categories</p>
        </div>
        <div class="feature">
          <h3>🛒 Shopping Lists</h3>
          <p>Create and manage shopping lists with ease, organize by category</p>
        </div>
        <div class="feature">
          <h3>👨‍🍳 Recipe Discovery</h3>
          <p>Browse recipes based on available ingredients and discover what you can make now</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.tagline {
  font-size: 1.25rem;
  color: #666;
  margin: 0;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.stat-card.warning {
  border-left: 4px solid #ffc107;
}

.stat-card.danger {
  border-left: 4px solid #dc3545;
}

.stat-card.success {
  border-left: 4px solid #28a745;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.stat-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.card-link {
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.card-link:hover {
  color: #0056b3;
}

.features {
  margin-top: 4rem;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.feature h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.feature p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}
</style>
