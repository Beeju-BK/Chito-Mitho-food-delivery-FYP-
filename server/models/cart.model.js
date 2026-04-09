// cart.model.js - FINAL VERSION
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },   
  quantity: { type: Number, required: true, default: 1 },
  subTotal: { type: Number, default: 0 }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // ✅ NO unique: true - allows multiple carts per user!
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [cartItemSchema],
    Total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

cartSchema.pre("save", function () {
  this.Total = this.items.reduce((acc, item) => {
    return acc + (item.subTotal || 0);
  }, 0);
});

export default mongoose.model("Cart", cartSchema);