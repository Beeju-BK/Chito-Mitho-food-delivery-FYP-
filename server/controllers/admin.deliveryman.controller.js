// Add these functions to your existing admin.controller.js
// or keep as a separate file and import into admin.routes.js

import Deliveryman from "../models/deliveryman.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// Get all deliverymen (with approval status)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllDeliverymen = async (req, res) => {
  try {
    const deliverymen = await Deliveryman.find()
      .populate("userId", "firstName lastName email phone isBlocked")
      .populate("currentOrder")
      .sort({ createdAt: -1 });

    const formatted = deliverymen.map((d) => ({
      _id:             d._id,
      userId:          d.userId?._id,
      name:            `${d.userId?.firstName || ""} ${d.userId?.lastName || ""}`.trim(),
      email:           d.userId?.email,
      phone:           Array.isArray(d.userId?.phone) ? d.userId.phone[0] : d.userId?.phone,
      zone:            d.zone,
      vehicle:         d.vehicle,
      dutyTime:        d.dutyTime,
      deliverymanImage:d.deliverymanImage,
      identityType:    d.identityType,
      isApproved:      d.isApproved,
      isBlocked:       d.userId?.isBlocked || false,
      isAvailable:     d.isAvailable,
      currentOrder:    d.currentOrder,
      joinedDate:      new Date(d.createdAt).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
    }));

    res.json({
      success:     true,
      deliverymen: formatted,
      stats: {
        total:     formatted.length,
        approved:  formatted.filter((d) => d.isApproved).length,
        pending:   formatted.filter((d) => !d.isApproved).length,
        available: formatted.filter((d) => d.isApproved && d.isAvailable && !d.isBlocked).length,
        blocked:   formatted.filter((d) => d.isBlocked).length,
      },
    });
  } catch (error) {
    console.error("getAllDeliverymen error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Approve deliveryman
// ─────────────────────────────────────────────────────────────────────────────
export const approveDeliveryman = async (req, res) => {
  try {
    const { deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findByIdAndUpdate(
      deliverymanId,
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    ).populate("userId", "firstName lastName email");

    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found" });
    }

    res.json({
      success: true,
      message: `${deliveryman.userId?.firstName} has been approved`,
      deliveryman,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Reject deliveryman (delete user + profile)
// ─────────────────────────────────────────────────────────────────────────────
export const rejectDeliveryman = async (req, res) => {
  try {
    const { deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findById(deliverymanId);
    if (!deliveryman) return res.status(404).json({ message: "Deliveryman not found" });

    await User.findByIdAndDelete(deliveryman.userId);
    await Deliveryman.findByIdAndDelete(deliverymanId);

    res.json({ success: true, message: "Deliveryman rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Toggle block deliveryman
// ─────────────────────────────────────────────────────────────────────────────
export const toggleDeliverymanBlock = async (req, res) => {
  try {
    const { deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findById(deliverymanId).populate("userId");
    if (!deliveryman) return res.status(404).json({ message: "Deliveryman not found" });

    const user = await User.findById(deliveryman.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success:   true,
      message:   `Deliveryman ${user.isBlocked ? "blocked" : "unblocked"}`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Assign deliveryman to a "ready" order
// Called by admin OR triggered when vendor marks order as out_for_delivery
// ─────────────────────────────────────────────────────────────────────────────
export const assignDeliveryman = async (req, res) => {
  try {
    const { orderId }       = req.params;
    const { deliverymanId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["ready", "out_for_delivery"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot assign deliveryman to order with status: ${order.status}`,
      });
    }

    const deliveryman = await Deliveryman.findById(deliverymanId);
    if (!deliveryman) return res.status(404).json({ message: "Deliveryman not found" });
    if (!deliveryman.isApproved) return res.status(400).json({ message: "Deliveryman is not approved" });
    if (!deliveryman.isAvailable) return res.status(400).json({ message: "Deliveryman is not available" });

    // Assign
    order.deliveryman = deliverymanId;
    order.status      = "out_for_delivery";
    await order.save();

    // Mark deliveryman as busy
    deliveryman.isAvailable  = false;
    deliveryman.currentOrder = orderId;
    await deliveryman.save();

    const populated = await Order.findById(orderId)
      .populate("deliveryman")
      .populate("user", "firstName lastName phone")
      .populate("restaurant", "restaurantName");

    res.json({
      success: true,
      message: "Deliveryman assigned and order is out for delivery",
      order:   populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get available deliverymen (for assignment dropdown)
// ─────────────────────────────────────────────────────────────────────────────
export const getAvailableDeliverymen = async (req, res) => {
  try {
    const deliverymen = await Deliveryman.find({
      isApproved:  true,
      isAvailable: true,
    }).populate("userId", "firstName lastName phone isBlocked");

    // Filter out blocked ones
    const available = deliverymen
      .filter((d) => !d.userId?.isBlocked)
      .map((d) => ({
        _id:     d._id,
        name:    `${d.userId?.firstName || ""} ${d.userId?.lastName || ""}`.trim(),
        phone:   Array.isArray(d.userId?.phone) ? d.userId.phone[0] : d.userId?.phone,
        zone:    d.zone,
        vehicle: d.vehicle,
      }));

    res.json({ success: true, deliverymen: available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};