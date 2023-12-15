import mongoose from "mongoose";

const ListItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true, min: 1 },
});
const RecipeSchema = new mongoose.Schema({
  name : {
    type: String
  },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true }
});
const FamilyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listItem: [ListItemSchema],
  recipes: [RecipeSchema] 
});

export default mongoose.model("FamilyGroup", FamilyGroupSchema);
