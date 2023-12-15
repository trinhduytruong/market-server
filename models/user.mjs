import mongoose from "mongoose";
const CartItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const ListItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true, min: 1 },
});
const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
});
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isGroup: {
      type: Boolean,
      default: false,
    },
    idGroup: {
      type: String,
    },
    cart: [CartItemSchema], // Thêm trường cart với kiểu là mảng các CartItem
    listItem: [ListItemSchema],
    recipes: [RecipeSchema],
    isAdmin: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
