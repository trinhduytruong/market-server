import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number },
    image: { type: String }, // Đường dẫn đến ảnh của thực phẩm
    productionDate: { type: Date },
    expirationDate: { type: Date },
    des : { type : String},
  });
  
  export default mongoose.model("Food", FoodSchema);

  