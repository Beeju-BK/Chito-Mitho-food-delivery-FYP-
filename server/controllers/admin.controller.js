
import jwt from "jsonwebtoken";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { role: "admin", name: "Admin", email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Admin logged in successfully", user: { role: "admin", email } });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export const adminDashboard = async (req, res) => {
  try {
    const completedOrders = await Order.find({
      paymentStatus: "completed",
      status:        { $ne: "cancelled" },
    });

    const totalAdminCommission = completedOrders.reduce((sum, o) => sum + (o.commission || 0), 0);
    const totalOrders          = completedOrders.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEarnings = completedOrders
      .filter((o) => new Date(o.createdAt) >= today)
      .reduce((sum, o) => sum + (o.commission || 0), 0);

    // Summary counts
    const totalRevenue    = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalCustomers  = await User.countDocuments({ role: "customer" });
    const totalRestaurants = await Restaurant.countDocuments({ isApproved: true, isBlocked: false });
    const pendingRestaurants = await Restaurant.countDocuments({ isApproved: false });

    res.json({
      success: true,
      dashboard: {
        totalAdminEarnings:    Math.round(totalAdminCommission),
        totalRevenue:          Math.round(totalRevenue),
        totalOrders,
        todayEarnings:         Math.round(todayEarnings),
        avgCommissionPerOrder: Math.round(totalAdminCommission / (totalOrders || 1)),
        totalCustomers,
        totalRestaurants,
        pendingRestaurants,
      },
    });
  } catch (error) {
    console.error("adminDashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Commissions
// ─────────────────────────────────────────────────────────────────────────────
export const getPendingCommissions = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentStatus: "completed",
      status:        { $in: ["confirmed", "preparing", "ready"] },
    })
      .populate("user", "firstName lastName phone email")
      // ✅ FIX: restaurant is now a single ObjectId — not array
      .populate("restaurant", "restaurantName")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      pendingCommissions: orders.map((order) => ({
        orderId:     order._id,
        orderNumber: `#${order._id.toString().slice(-6)}`,
        restaurant:  order.restaurant?.restaurantName || "N/A",
        customer:    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim(),
        subtotal:    order.subtotal,
        commission:  order.commission,
        totalAmount: order.totalAmount,
        createdAt:   order.createdAt,
      })),
      totalPending: orders.reduce((sum, o) => sum + (o.commission || 0), 0),
    });
  } catch (error) {
    console.error("getPendingCommissions error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const markCommissionPaid = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.adminCommissionPaidAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: `NRS. ${order.commission} commission marked as paid!`,
      orderId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant management
// ─────────────────────────────────────────────────────────────────────────────
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("owner", "firstName lastName phone address")
      .sort({ createdAt: -1 });

    const restaurantsWithStats = await Promise.all(
      restaurants.map(async (r) => {
        const totalOrders = await Order.countDocuments({ restaurant: r._id });
        return {
          _id:             r._id,
          restaurantName:  r.restaurantName,
          restaurantImage: r.restaurantImage || null,
          ownerName:       `${r.owner?.firstName || ""} ${r.owner?.lastName || ""}`.trim(),
          phone:           r.owner?.phone?.[0] || r.owner?.phone || "N/A",
          address:         r.owner?.address || "N/A",
          isBlocked:       r.isBlocked  || false,
          isApproved:      r.isApproved || false,
          totalOrders,
          joinedDate:      new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
        };
      })
    );

    res.json({
      success:     true,
      restaurants: restaurantsWithStats,
      stats: {
        totalActive:   restaurants.filter((r) => !r.isBlocked && r.isApproved).length,
        totalBlocked:  restaurants.filter((r) => r.isBlocked).length,
        totalPending:  restaurants.filter((r) => !r.isApproved).length,
        totalAll:      restaurants.length,
      },
    });
  } catch (error) {
    console.error("getAllRestaurants error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const approveRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isApproved: true, approvedAt: new Date() },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    return res.status(200).json({
      message: `${restaurant.restaurantName} has been approved`,
      status:  true,
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

export const rejectRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    await User.findByIdAndDelete(restaurant.owner);
    await Restaurant.findByIdAndDelete(restaurantId);

    return res.status(200).json({ message: "Restaurant registration rejected and removed", status: true });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

export const toggleRestaurantBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    restaurant.isBlocked = !restaurant.isBlocked;
    await restaurant.save();

    res.json({
      success:    true,
      message:    `Restaurant ${restaurant.isBlocked ? "blocked" : "unblocked"}`,
      restaurant: { _id: restaurant._id, restaurantName: restaurant.restaurantName, isBlocked: restaurant.isBlocked },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Customer management
// ─────────────────────────────────────────────────────────────────────────────
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("firstName lastName email phone address isBlocked createdAt")
      .sort({ createdAt: -1 });

    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const totalOrders = await Order.countDocuments({ user: c._id });
        return {
          ...c.toObject(),
          name:       `${c.firstName} ${c.lastName}`.trim(),
          // ✅ phone is [String] array — flatten for display
          phoneDisplay: Array.isArray(c.phone) ? c.phone[0] : c.phone,
          orderCount: totalOrders,
          joinedDate: new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          }),
        };
      })
    );

    res.json({
      success:   true,
      customers: customersWithStats,
      stats: {
        totalActive:    customersWithStats.filter((c) => !c.isBlocked).length,
        totalBlocked:   customersWithStats.filter((c) => c.isBlocked).length,
        totalCustomers: customersWithStats.length,
      },
    });
  } catch (error) {
    console.error("getAllCustomers error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

export const toggleCustomerBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await User.findById(id);
    if (!customer || customer.role !== "customer") {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    customer.isBlocked = !customer.isBlocked;
    await customer.save();

    res.json({
      success:  true,
      message:  `Customer ${customer.isBlocked ? "blocked" : "unblocked"} successfully`,
      customer: {
        _id:       customer._id,
        name:      `${customer.firstName} ${customer.lastName}`.trim(),
        email:     customer.email,
        isBlocked: customer.isBlocked,
      },
    });
  } catch (error) {
    console.error("toggleCustomerBlock error:", error);
    res.status(500).json({ success: false, message: "Failed to update customer status" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Order management
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const orders = await Order.find(filter)
      .populate("user", "firstName lastName phone email")
      // ✅ FIX: restaurant is single ObjectId — no array populate needed
      .populate("restaurant", "restaurantName")
      .sort({ createdAt: -1 })
      .limit(100);

    const formattedOrders = orders.map((order) => ({
      _id:           order._id.toString(),
      orderNumber:   `#${order._id.toString().slice(-6).toUpperCase()}`,
      customerName:  `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "Unknown",
      customerPhone: Array.isArray(order.user?.phone) ? order.user.phone[0] : order.user?.phone || "N/A",
      customerEmail: order.user?.email || "N/A",
      restaurant:    order.restaurant?.restaurantName || "N/A",
      items:         (order.items || []).map((item) => ({
        name:     item.menu?.name || "Item",
        quantity: item.quantity,
        price:    item.price,
        total:    item.total,
      })),
      subtotal:        order.subtotal,
      tax:             order.tax,
      deliveryFee:     order.deliveryFee,
      commission:      order.commission,
      totalAmount:     order.totalAmount,
      status:          order.status,
      paymentMethod:   order.paymentInfo?.method || order.paymentMethod,
      paymentStatus:   order.paymentStatus,
      shippingAddress: order.shippingAddress,
      createdAt:       order.createdAt,
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      orders:  formattedOrders,
      stats: {
        totalOrders:  await Order.countDocuments(filter),
        todayRevenue: todayRevenue[0]?.total || 0,
        totalCommission: await Order.aggregate([
          { $match: { paymentStatus: "completed" } },
          { $group: { _id: null, total: { $sum: "$commission" } } },
        ]).then((r) => r[0]?.total || 0),
      },
    });
  } catch (error) {
    console.error("getAdminOrders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const advanceOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) {
      return res.status(400).json({ success: false, message: "Cannot advance further" });
    }

    order.status = STATUS_FLOW[idx + 1];
    await order.save();

    res.json({
      success: true,
      message: `Status updated to ${order.status}`,
      order:   { _id: order._id.toString(), status: order.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled", order: { _id: order._id.toString(), status: order.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status }  = req.body;

    if (!STATUS_FLOW.includes(status) && status !== "cancelled") {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "firstName lastName phone");

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
    ]);
    res.json({ success: true, stats: stats[0] || { totalRevenue: 0, totalOrders: 0 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


