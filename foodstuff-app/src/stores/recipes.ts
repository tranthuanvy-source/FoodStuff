import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe } from '@/types'
import { useInventoryStore } from './inventory'

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([
    {
      id: '1',
      name: 'Scrambled Eggs',
      ingredients: [
        { name: 'Eggs', quantity: 3, unit: 'count' },
        { name: 'Milk', quantity: 0.05, unit: 'L' },
        { name: 'Butter', quantity: 1, unit: 'tbsp', optional: true }
      ],
      instructions: [
        'Beat eggs and milk together in a bowl',
        'Heat butter in a pan over medium heat',
        'Pour egg mixture into pan',
        'Stir gently until eggs are cooked'
      ],
      prepTime: 5,
      cookTime: 5,
      servings: 2,
      isFavorite: false
    },
    {
      id: '2',
      name: 'Tomato Salad',
      ingredients: [
        { name: 'Tomatoes', quantity: 3, unit: 'count' },
        { name: 'Olive Oil', quantity: 2, unit: 'tbsp' },
        { name: 'Salt', quantity: 1, unit: 'tsp' }
      ],
      instructions: [
        'Chop tomatoes into quarters',
        'Drizzle with olive oil',
        'Season with salt',
        'Serve fresh'
      ],
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      isFavorite: false
    },
    {
      id: '3',
      name: 'Egg Salad Sandwich',
      ingredients: [
        { name: 'Eggs', quantity: 4, unit: 'count' },
        { name: 'Bread', quantity: 4, unit: 'slices' },
        { name: 'Mayonnaise', quantity: 3, unit: 'tbsp' }
      ],
      instructions: [
        'Hard boil eggs for 10 minutes',
        'Peel and chop eggs',
        'Mix with mayonnaise',
        'Spread on bread and serve'
      ],
      prepTime: 5,
      cookTime: 15,
      servings: 2,
      isFavorite: false
    }
  ])

  const availableRecipes = computed(() => {
    const inventoryStore = useInventoryStore()
    return recipes.value.map(recipe => {
      const canMake = recipe.ingredients.every(ingredient => {
        if (ingredient.optional) return true
        const inventoryItem = inventoryStore.items.find(
          item => item.name.toLowerCase() === ingredient.name.toLowerCase()
        )
        return inventoryItem && inventoryItem.quantity >= ingredient.quantity
      })
      return {
        ...recipe,
        canMake
      }
    })
  })

  const favoriteRecipes = computed(() => {
    return recipes.value.filter(recipe => recipe.isFavorite)
  })

  function toggleFavorite(id: string) {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite
    }
  }

  function addRecipe(recipe: Omit<Recipe, 'id'>) {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString()
    }
    recipes.value.push(newRecipe)
  }

  return {
    recipes,
    availableRecipes,
    favoriteRecipes,
    toggleFavorite,
    addRecipe
  }
})
