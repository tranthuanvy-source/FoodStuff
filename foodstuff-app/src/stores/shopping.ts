import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShoppingListItem } from '@/types'

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingListItem[]>([
    {
      id: '1',
      name: 'Bread',
      quantity: 1,
      unit: 'loaf',
      category: 'Grains',
      checked: false
    },
    {
      id: '2',
      name: 'Apples',
      quantity: 6,
      unit: 'count',
      category: 'Produce',
      checked: false
    }
  ])

  function addItem(item: Omit<ShoppingListItem, 'id'>) {
    const newItem: ShoppingListItem = {
      ...item,
      id: Date.now().toString()
    }
    items.value.push(newItem)
  }

  function toggleItem(id: string) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.checked = !item.checked
    }
  }

  function deleteItem(id: string) {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function clearChecked() {
    items.value = items.value.filter(item => !item.checked)
  }

  return {
    items,
    addItem,
    toggleItem,
    deleteItem,
    clearChecked
  }
})
