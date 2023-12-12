import mongoose from "mongoose";

const FamilyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  
  export default mongoose.model("FamilyGroup", FamilyGroupSchema);
