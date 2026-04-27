

import mongoose from "mongoose";

const deliverymanSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      unique:   true,
    },

    // Documents
    identityType:     { type: String, required: true },
    identityNumber:   { type: String },
    identityImage:    { type: String, required: true },
    billBookCopy:     { type: String, required: true },
    deliverymanImage: { type: String, required: true },

    // Work info
    zone:     { type: String, required: true },
    vehicle:  { type: String, required: true },
    dutyTime: { type: String },

    // Admin approval
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date,    default: null  },
    isBlocked:  { type: Boolean, default: false },

    // Availability for order assignment
    isAvailable: { type: Boolean, default: true },

    // Currently assigned active order
    currentOrder: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     "Order",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Deliveryman", deliverymanSchema);