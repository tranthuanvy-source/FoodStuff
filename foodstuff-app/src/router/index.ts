import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue'),
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: () => import('../views/ShoppingView.vue'),
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
    },
  ],
})

export default router
