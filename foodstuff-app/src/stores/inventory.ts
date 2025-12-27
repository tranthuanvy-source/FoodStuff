import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { InventoryItem } from '@/types'

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref<InventoryItem[]>([
    {
      id: '1',
      name: 'Milk',
      quantity: 2,
      unit: 'L',
      category: 'Dairy',
      expirationDate: new Date('2025-12-30'),
      lowStockThreshold: 1,
      addedDate: new Date()
    },
    {
      id: '2',
      name: 'Eggs',
      quantity: 12,
      unit: 'count',
      category: 'Dairy',
      expirationDate: new Date('2026-01-05'),
      lowStockThreshold: 6,
      addedDate: new Date()
    },
    {
      id: '3',
      name: 'Tomatoes',
      quantity: 5,
      unit: 'count',
      category: 'Produce',
      expirationDate: new Date('2025-12-28'),
      lowStockThreshold: 2,
      addedDate: new Date()
    }
  ])

  const lowStockItems = computed(() => {
    return items.value.filter(item => item.quantity <= item.lowStockThreshold)
  })

  const expiringSoon = computed(() => {
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return items.value.filter(item => 
      item.expirationDate && item.expirationDate <= threeDaysFromNow
    )
  })

  function addItem(item: Omit<InventoryItem, 'id' | 'addedDate'>) {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      addedDate: new Date()
    }
    items.value.push(newItem)
  }

  function updateItem(id: string, updates: Partial<InventoryItem>) {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates } as InventoryItem
    }
  }

  function deleteItem(id: string) {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function getItemsByCategory(category: string) {
    return items.value.filter(item => item.category === category)
  }

  return {
    items,
    lowStockItems,
    expiringSoon,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory
  }
})
