

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  menu:     { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  quantity: { type: Number, required: true, default: 1 },
  subTotal: { type: Number, default: 0 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [cartItemSchema],

    // ✅ FIXED: Single consistent field name "Total" (capital T).
    // Order controller reads cart.Total — this must match.
    Total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Pre-save hook recalculates Total from items
cartSchema.pre("save", function () {
  this.Total = this.items.reduce((acc, item) => acc + (item.subTotal || 0), 0);
});

cartSchema.index({ user: 1, restaurantId: 1 }, { unique: true });

export default mongoose.model("Cart", cartSchema);