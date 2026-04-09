import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  menuImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuItemSchema);

export default Menu;