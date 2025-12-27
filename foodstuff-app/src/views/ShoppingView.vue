<template>
  <div class="shopping-view">
    <div class="header">
      <h1>Shopping List</h1>
      <div class="header-actions">
        <button @click="clearCheckedItems" class="btn-secondary" :disabled="!hasCheckedItems">
          Clear Checked
        </button>
        <button @click="showAddModal = true" class="btn-primary">+ Add Item</button>
      </div>
    </div>

    <div v-if="store.items.length === 0" class="empty-state">
      <p>Your shopping list is empty. Add items to get started!</p>
    </div>

    <div v-else class="shopping-list">
      <div class="list-stats">
        <span>Total items: {{ store.items.length }}</span>
        <span>Checked: {{ checkedCount }}</span>
        <span>Remaining: {{ remainingCount }}</span>
      </div>

      <div v-for="item in store.items" :key="item.id" class="shopping-item" :class="{ checked: item.checked }">
        <input 
          type="checkbox" 
          :checked="item.checked" 
          @change="store.toggleItem(item.id)"
          class="checkbox"
        />
        <div class="item-details">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-meta">
            <span class="quantity">{{ item.quantity }} {{ item.unit }}</span>
            <span class="category">{{ item.category }}</span>
          </div>
          <div v-if="item.notes" class="item-notes">{{ item.notes }}</div>
        </div>
        <button @click="deleteShoppingItem(item.id)" class="btn-icon">🗑️</button>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>Add Shopping Item</h2>
        <form @submit.prevent="saveItem">
          <div class="form-group">
            <label>Item Name</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Quantity</label>
              <input v-model.number="formData.quantity" type="number" step="0.1" required />
            </div>
            <div class="form-group">
              <label>Unit</label>
              <input v-model="formData.unit" type="text" required />
            </div>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" required>
              <option>Produce</option>
              <option>Dairy</option>
              <option>Meat</option>
              <option>Grains</option>
              <option>Canned</option>
              <option>Frozen</option>
              <option>Beverages</option>
              <option>Snacks</option>
              <option>Condiments</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Notes (optional)</label>
            <textarea v-model="formData.notes" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Add to List</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShoppingStore } from '@/stores/shopping'

const store = useShoppingStore()
const showAddModal = ref(false)

const formData = ref({
  name: '',
  quantity: 1,
  unit: 'count',
  category: 'Other',
  notes: '',
  checked: false
})

const checkedCount = computed(() => {
  return store.items.filter(item => item.checked).length
})

const remainingCount = computed(() => {
  return store.items.filter(item => !item.checked).length
})

const hasCheckedItems = computed(() => checkedCount.value > 0)

function saveItem() {
  store.addItem({ ...formData.value })
  closeModal()
}

function deleteShoppingItem(id: string) {
  if (confirm('Remove this item from your shopping list?')) {
    store.deleteItem(id)
  }
}

function clearCheckedItems() {
  if (confirm('Remove all checked items from the list?')) {
    store.clearChecked()
  }
}

function closeModal() {
  showAddModal.value = false
  formData.value = {
    name: '',
    quantity: 1,
    unit: 'count',
    category: 'Other',
    notes: '',
    checked: false
  }
}
</script>

<style scoped>
.shopping-view {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.list-stats {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.shopping-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shopping-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.2s;
}

.shopping-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.shopping-item.checked {
  opacity: 0.6;
  background: #f8f9fa;
}

.shopping-item.checked .item-name {
  text-decoration: line-through;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.quantity {
  font-weight: 500;
}

.category {
  color: #007bff;
}

.item-notes {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary:hover, .btn-secondary:hover {
  opacity: 0.9;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  max-width: 500px;
}

.modal h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions button {
  flex: 1;
}
</style>
