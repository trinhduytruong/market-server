import ShoppingList from '../models/shoppingList.mjs';

const shoppingListController = {
  // Get all shopping lists
  getAll: async (req, res) => {
    try {
      const shoppingLists = await ShoppingList.find();
      res.json(shoppingLists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new shopping list
  create: async (req, res) => {
    const { name, items } = req.body;

    const newShoppingList = new ShoppingList({
      name,
      items,
      // Add other fields if needed
    });

    try {
      const savedShoppingList = await newShoppingList.save();
      res.status(201).json(savedShoppingList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a shopping list by ID
  edit: async (req, res) => {
    try {
      const shoppingList = await ShoppingList.findById(req.params.id);
      if (!shoppingList) {
        return res.status(404).json({ message: 'Shopping list not found' });
      }

      // Update shopping list fields
      shoppingList.name = req.body.name || shoppingList.name;
      shoppingList.items = req.body.items || shoppingList.items;

      // Save updated shopping list
      const updatedShoppingList = await shoppingList.save();
      res.json(updatedShoppingList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a shopping list by ID
  delete: async (req, res) => {
    try {
      const shoppingList = await ShoppingList.findById(req.params.id);
      if (!shoppingList) {
        return res.status(404).json({ message: 'Shopping list not found' });
      }

      await shoppingList.remove();
      res.json({ message: 'Shopping list deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add item to a shopping list by ID
  addItem: async (req, res) => {
    try {
      const shoppingList = await ShoppingList.findById(req.params.id);
      if (!shoppingList) {
        return res.status(404).json({ message: 'Shopping list not found' });
      }

      const newItem = {
        name: req.body.name,
        quantity: req.body.quantity
      };

      shoppingList.items.push(newItem);

      const updatedShoppingList = await shoppingList.save();
      res.json(updatedShoppingList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default shoppingListController;
