# FoodStuff

FoodStuff is a comprehensive household pantry inventory tracking system that helps you manage your food items, build shopping lists, and discover recipes based on what you have.

## Features

### Inventory Tracking
- Track all items in your household pantry
- Monitor quantities and expiration dates
- Categorize items for easy organization
- Get low-stock alerts

### Shopping Lists
- Create and manage shopping lists
- Add items directly from your inventory
- Organize by store or category
- Share lists with household members

### Recipe Feature
- Browse recipes based on available ingredients
- Get suggestions for meals you can make now
- Save favorite recipes
- Track ingredients needed for recipes

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **Pinia** - State management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Navigate to the app directory:
```bash
cd foodstuff-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
foodstuff-app/
├── src/
│   ├── views/           # Page components
│   │   ├── HomeView.vue
│   │   ├── InventoryView.vue
│   │   ├── ShoppingView.vue
│   │   └── RecipesView.vue
│   ├── stores/          # Pinia stores
│   │   ├── inventory.ts
│   │   ├── shopping.ts
│   │   └── recipes.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── router/          # Vue Router config
│   │   └── index.ts
│   └── App.vue          # Root component
└── package.json
```

## Usage

### Managing Inventory
1. Click "Inventory" in the navigation
2. Add items with the "+ Add Item" button
3. Track quantities, expiration dates, and categories
4. Get alerts for low stock and expiring items

### Shopping Lists
1. Click "Shopping" in the navigation
2. Add items to your shopping list
3. Check off items as you shop
4. Clear completed items

### Recipe Discovery
1. Click "Recipes" in the navigation
2. Browse all recipes or filter by "Can Make Now"
3. View detailed instructions
4. Add missing ingredients to your shopping list

## License

MIT
