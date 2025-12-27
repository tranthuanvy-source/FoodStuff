<template>
  <div class="inventory-view">
    <div class="header">
      <h1>Pantry Inventory</h1>
      <button @click="showAddModal = true" class="btn-primary">+ Add Item</button>
    </div>

    <!-- Alerts -->
    <div v-if="store.lowStockItems.length > 0" class="alert alert-warning">
      <strong>⚠️ Low Stock Alert:</strong>
      {{ store.lowStockItems.length }} item(s) running low
    </div>

    <div v-if="store.expiringSoon.length > 0" class="alert alert-danger">
      <strong>🕐 Expiring Soon:</strong>
      {{ store.expiringSoon.length }} item(s) expiring within 3 days
    </div>

    <!-- Inventory List -->
    <div class="inventory-grid">
      <div v-for="item in store.items" :key="item.id" class="inventory-card">
        <div class="card-header">
          <h3>{{ item.name }}</h3>
          <span class="category-badge">{{ item.category }}</span>
        </div>
        <div class="card-body">
          <div class="item-info">
            <span class="quantity">{{ item.quantity }} {{ item.unit }}</span>
            <span v-if="item.expirationDate" class="expiration" :class="{
              'expiring-soon': isExpiringSoon(item.expirationDate)
            }">
              Exp: {{ formatDate(item.expirationDate) }}
            </span>
          </div>
          <div v-if="item.quantity <= item.lowStockThreshold" class="low-stock-badge">
            Low Stock
          </div>
        </div>
        <div class="card-actions">
          <button @click="editItem(item)" class="btn-secondary">Edit</button>
          <button @click="deleteInventoryItem(item.id)" class="btn-danger">Delete</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingItem ? 'Edit Item' : 'Add New Item' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="form-group">
            <label>Name</label>
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
            <label>Expiration Date (optional)</label>
            <input v-model="formData.expirationDate" type="date" />
          </div>
          <div class="form-group">
            <label>Low Stock Threshold</label>
            <input v-model.number="formData.lowStockThreshold" type="number" required />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import type { InventoryItem } from '@/types'

const store = useInventoryStore()
const showAddModal = ref(false)
const editingItem = ref<InventoryItem | null>(null)

const formData = ref({
  name: '',
  quantity: 1,
  unit: 'count',
  category: 'Other',
  expirationDate: '',
  lowStockThreshold: 1
})

function editItem(item: InventoryItem) {
  editingItem.value = item
  formData.value = {
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    category: item.category,
    expirationDate: item.expirationDate ? item.expirationDate.toISOString().split('T')[0] : '',
    lowStockThreshold: item.lowStockThreshold
  }
  showAddModal.value = true
}

function saveItem() {
  if (editingItem.value) {
    store.updateItem(editingItem.value.id, {
      ...formData.value,
      expirationDate: formData.value.expirationDate ? new Date(formData.value.expirationDate) : undefined
    })
  } else {
    store.addItem({
      ...formData.value,
      expirationDate: formData.value.expirationDate ? new Date(formData.value.expirationDate) : undefined
    })
  }
  closeModal()
}

function deleteInventoryItem(id: string) {
  if (confirm('Are you sure you want to delete this item?')) {
    store.deleteItem(id)
  }
}

function closeModal() {
  showAddModal.value = false
  editingItem.value = null
  formData.value = {
    name: '',
    quantity: 1,
    unit: 'count',
    category: 'Other',
    expirationDate: '',
    lowStockThreshold: 1
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

function isExpiringSoon(date: Date): boolean {
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  return new Date(date) <= threeDaysFromNow
}
</script>

<style scoped>
.inventory-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.inventory-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.inventory-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.category-badge {
  background: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quantity {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.expiration {
  color: #666;
  font-size: 0.9rem;
}

.expiration.expiring-soon {
  color: #dc3545;
  font-weight: bold;
}

.low-stock-badge {
  background: #ffc107;
  color: #856404;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary, .btn-danger {
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
  flex: 1;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-primary:hover, .btn-secondary:hover, .btn-danger:hover {
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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
