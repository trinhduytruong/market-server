import Category from "../models/category.mjs";

const categoryController = {
  // Get all categories
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new category
  create: async (req, res) => {
    const { name, image } = req.body;

    const newCategory = new Category({
      name,
      image,
    });

    try {
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a category by ID
  edit: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Update category fields
      category.name = req.body.name || category.name;

      // Save updated category
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a category by ID
  delete: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      await category.remove();
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default categoryController;
