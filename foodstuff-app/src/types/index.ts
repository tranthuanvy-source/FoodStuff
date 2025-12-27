export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  expirationDate?: Date
  lowStockThreshold: number
  addedDate: Date
}

export interface ShoppingListItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
  notes?: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  imageUrl?: string
  isFavorite: boolean
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  optional?: boolean
}

export type Category = 'Produce' | 'Dairy' | 'Meat' | 'Grains' | 'Canned' | 'Frozen' | 'Beverages' | 'Snacks' | 'Condiments' | 'Other'
