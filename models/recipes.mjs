const RecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String },
      },
    ],
    instructions: { type: String },
  });
  
  const Recipe = mongoose.model('Recipe', RecipeSchema);
  