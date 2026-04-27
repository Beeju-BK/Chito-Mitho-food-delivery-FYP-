
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Restaurant",
      required: true,
    },

    // Assigned deliveryman — set when deliveryman accepts the order
    deliveryman: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "Deliveryman",
      default: null,
    },

    items: [
      {
        menu: {
          type: mongoose.Schema.Types.ObjectId,
          ref:  "Menu",
          required: true,
        },
        quantity:     { type: Number, required: true, min: 1 },
        price:        { type: Number, required: true },
        total:        { type: Number, required: true },
        notes:        { type: String },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
      },
    ],

    subtotal:       { type: Number, required: true },
    tax:            { type: Number, required: true, default: 0 },
    commission:     { type: Number, required: true, default: 0 },
    commissionRate: { type: Number, default: 0 },
    deliveryFee:    { type: Number, default: 100 },
    totalAmount:    { type: Number, required: true },

    // Vendor-controlled order status
    status: {
      type: String,
      enum: [
        "pending",        // just placed, waiting vendor
        "confirmed",      // vendor confirmed — customer can still cancel
        "preparing",      // vendor started — NO more cancellation
        "ready",          // ready for pickup by deliveryman
        "out_for_delivery",// deliveryman accepted
        "delivered",      // completed
        "cancelled",
      ],
      default: "pending",
    },

    // Deliveryman-controlled delivery status
    // Only active when status = out_for_delivery
    deliveryStatus: {
      type: String,
      enum: [null, "accepted", "picked_up", "on_the_way", "delivered"],
      default: null,
    },

    shippingAddress: {
      address: { type: String, required: true },
      phone:   { type: String, required: true },
    },

    paymentInfo: {
      method:        { type: String, enum: ["khalti", "cash"], required: true },
      transactionId: { type: String, default: null },
    },

    paymentMethod: { type: String, default: "cash" },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    khaltiPidx: { type: String, default: "" },

    cartIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);