const FridgeItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    categoryId :  { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, default: 1 },
    expiryDate: { type: Date },
  });
  
  const FridgeItem = mongoose.model('FridgeItem', FridgeItemSchema);
  