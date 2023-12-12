const ShoppingListSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyGroup' },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        completed: { type: Boolean, default: false },
      },
    ],
  });
  
  const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);
  