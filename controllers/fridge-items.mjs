import FridgeItem from '../models/fridgeItem.mjs';

const fridgeItemController = {
  // Get all fridge items
  getAll: async (req, res) => {
    try {
      const fridgeItems = await FridgeItem.find();
      res.json(fridgeItems);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new fridge item
  create: async (req, res) => {
    const { userId, foodId, quantity, expiryDate } = req.body;

    const newFridgeItem = new FridgeItem({
      userId,
      foodId,
      quantity,
      expiryDate,
      // Add other fields if needed
    });

    try {
      const savedFridgeItem = await newFridgeItem.save();
      res.status(201).json(savedFridgeItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a fridge item by ID
  edit: async (req, res) => {
    try {
      const fridgeItem = await FridgeItem.findById(req.params.id);
      if (!fridgeItem) {
        return res.status(404).json({ message: 'Fridge item not found' });
      }

      // Update fridge item fields
      fridgeItem.userId = req.body.userId || fridgeItem.userId;
      fridgeItem.foodId = req.body.foodId || fridgeItem.foodId;
      fridgeItem.quantity = req.body.quantity || fridgeItem.quantity;
      fridgeItem.expiryDate = req.body.expiryDate || fridgeItem.expiryDate;

      // Save updated fridge item
      const updatedFridgeItem = await fridgeItem.save();
      res.json(updatedFridgeItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a fridge item by ID
  delete: async (req, res) => {
    try {
      const fridgeItem = await FridgeItem.findById(req.params.id);
      if (!fridgeItem) {
        return res.status(404).json({ message: 'Fridge item not found' });
      }

      await fridgeItem.remove();
      res.json({ message: 'Fridge item deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default fridgeItemController;
