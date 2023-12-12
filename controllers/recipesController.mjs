import Recipe from '../models/recipe.mjs';

const recipeController = {
  // Get all recipes
  getAll: async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new recipe
  create: async (req, res) => {
    const { name, ingredients, instructions } = req.body;

    const newRecipe = new Recipe({
      name,
      ingredients,
      instructions,
      // Add other fields if needed
    });

    try {
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a recipe by ID
  edit: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      // Update recipe fields
      recipe.name = req.body.name || recipe.name;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.instructions = req.body.instructions || recipe.instructions;

      // Save updated recipe
      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a recipe by ID
  delete: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      await recipe.remove();
      res.json({ message: 'Recipe deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default recipeController;
