<template>
  <div class="recipes-view">
    <div class="header">
      <h1>Recipe Discovery</h1>
      <div class="filter-buttons">
        <button 
          :class="{ active: filter === 'all' }" 
          @click="filter = 'all'"
          class="filter-btn"
        >
          All Recipes
        </button>
        <button 
          :class="{ active: filter === 'available' }" 
          @click="filter = 'available'"
          class="filter-btn"
        >
          Can Make Now
        </button>
        <button 
          :class="{ active: filter === 'favorites' }" 
          @click="filter = 'favorites'"
          class="filter-btn"
        >
          ⭐ Favorites
        </button>
      </div>
    </div>

    <div class="recipes-grid">
      <div v-for="recipe in filteredRecipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-header">
          <h3>{{ recipe.name }}</h3>
          <button @click="store.toggleFavorite(recipe.id)" class="btn-favorite">
            {{ recipe.isFavorite ? '⭐' : '☆' }}
          </button>
        </div>

        <div class="recipe-meta">
          <span>⏱️ {{ recipe.prepTime + recipe.cookTime }} min</span>
          <span>🍽️ {{ recipe.servings }} servings</span>
        </div>

        <div v-if="recipe.canMake !== undefined" class="availability-badge" :class="{
          'can-make': recipe.canMake,
          'cannot-make': !recipe.canMake
        }">
          {{ recipe.canMake ? '✓ Can Make Now' : '✗ Missing Ingredients' }}
        </div>

        <div class="ingredients">
          <h4>Ingredients:</h4>
          <ul>
            <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx" :class="{
              optional: ingredient.optional,
              available: isIngredientAvailable(ingredient),
              missing: !isIngredientAvailable(ingredient) && !ingredient.optional
            }">
              {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
              <span v-if="ingredient.optional" class="optional-tag">(optional)</span>
            </li>
          </ul>
        </div>

        <div class="card-actions">
          <button @click="selectedRecipe = recipe" class="btn-primary">View Recipe</button>
          <button 
            v-if="!recipe.canMake" 
            @click="quickAddToShoppingList(recipe.id)" 
            class="btn-secondary"
            title="Add missing ingredients to shopping list"
          >
            🛒 Add to List
          </button>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
    <div v-if="selectedRecipe" class="modal-overlay" @click="selectedRecipe = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedRecipe.name }}</h2>
          <button @click="selectedRecipe = null" class="btn-close">×</button>
        </div>

        <div class="recipe-detail">
          <div class="recipe-meta">
            <span>⏱️ Prep: {{ selectedRecipe.prepTime }} min</span>
            <span>🔥 Cook: {{ selectedRecipe.cookTime }} min</span>
            <span>🍽️ Servings: {{ selectedRecipe.servings }}</span>
          </div>

          <div class="ingredients-section">
            <h3>Ingredients</h3>
            <ul>
              <li v-for="(ingredient, idx) in selectedRecipe.ingredients" :key="idx">
                {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
                <span v-if="ingredient.optional" class="optional-tag">(optional)</span>
              </li>
            </ul>
          </div>

          <div class="instructions-section">
            <h3>Instructions</h3>
            <ol>
              <li v-for="(step, idx) in selectedRecipe.instructions" :key="idx">
                {{ step }}
              </li>
            </ol>
          </div>

          <button @click="addIngredientsToShoppingList" class="btn-primary btn-full">
            Add Missing Ingredients to Shopping List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipeStore } from '@/stores/recipes'
import { useInventoryStore } from '@/stores/inventory'
import { useShoppingStore } from '@/stores/shopping'
import type { Recipe, RecipeIngredient } from '@/types'

const recipeStore = useRecipeStore()
const inventoryStore = useInventoryStore()
const shoppingStore = useShoppingStore()

const filter = ref<'all' | 'available' | 'favorites'>('all')
const selectedRecipe = ref<Recipe | null>(null)

const filteredRecipes = computed(() => {
  let recipes = recipeStore.availableRecipes

  if (filter.value === 'available') {
    recipes = recipes.filter(r => r.canMake)
  } else if (filter.value === 'favorites') {
    recipes = recipes.filter(r => r.isFavorite)
  }

  return recipes
})

function isIngredientAvailable(ingredient: RecipeIngredient): boolean {
  if (ingredient.optional) return true
  const inventoryItem = inventoryStore.items.find(
    item => item.name.toLowerCase() === ingredient.name.toLowerCase()
  )
  return inventoryItem !== undefined && inventoryItem.quantity >= ingredient.quantity
}

function addIngredientsToShoppingList() {
  if (!selectedRecipe.value) return

  try {
    const addedCount = recipeStore.addRecipeToShoppingList(selectedRecipe.value.id)
    
    if (addedCount > 0) {
      alert(`Added ${addedCount} missing ingredient(s) to your shopping list!`)
    } else {
      alert('You have all the ingredients needed for this recipe!')
    }
  } catch (error) {
    alert('Error adding ingredients to shopping list')
    console.error(error)
  }
}

function quickAddToShoppingList(recipeId: string) {
  try {
    const addedCount = recipeStore.addRecipeToShoppingList(recipeId)
    
    if (addedCount > 0) {
      alert(`✓ Added ${addedCount} missing ingredient(s) to your shopping list!`)
    } else {
      alert('You have all the ingredients needed for this recipe!')
    }
  } catch (error) {
    alert('Error adding ingredients to shopping list')
    console.error(error)
  }
}

const store = recipeStore
</script>

<style scoped>
.recipes-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin-bottom: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e7f3ff;
}

.filter-btn.active {
  background: #007bff;
  color: white;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.recipe-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.recipe-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.recipe-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.btn-favorite {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
}

.btn-favorite:hover {
  transform: scale(1.2);
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.availability-badge {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.availability-badge.can-make {
  background: #d4edda;
  color: #155724;
}

.availability-badge.cannot-make {
  background: #f8d7da;
  color: #721c24;
}

.ingredients {
  margin-bottom: 1rem;
}

.ingredients h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.ingredients ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients li {
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.ingredients li.available {
  color: #28a745;
}

.ingredients li.missing {
  color: #dc3545;
}

.ingredients li.optional {
  color: #6c757d;
  font-style: italic;
}

.optional-tag {
  font-size: 0.8rem;
  color: #6c757d;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.btn-secondary:hover {
  opacity: 0.9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  color: #666;
}

.btn-close:hover {
  color: #000;
}

.recipe-detail .recipe-meta {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.ingredients-section,
.instructions-section {
  margin-bottom: 1.5rem;
}

.ingredients-section h3,
.instructions-section h3 {
  margin: 0 0 1rem 0;
}

.ingredients-section ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.ingredients-section li {
  margin-bottom: 0.5rem;
}

.instructions-section ol {
  padding-left: 1.5rem;
}

.instructions-section li {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.btn-full {
  width: 100%;
}
</style>
