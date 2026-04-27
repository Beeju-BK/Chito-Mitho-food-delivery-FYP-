
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Restaurant from "../models/restaurant.model.js";
import Deliveryman from "../models/deliveryman.model.js";
import axios from "axios";

const safePhone = (phone) => {
  if (!phone) return "";
  if (Array.isArray(phone)) return String(phone[0] || "");
  return String(phone);
};

// Vendor-side transitions
const VENDOR_TRANSITIONS = {
  pending:   ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],  // customer can also cancel at this stage
  preparing: ["ready"],                    // NO cancel after preparing
  ready:     [],                           // deliveryman takes over
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared order builder
// ─────────────────────────────────────────────────────────────────────────────
const buildAndSaveOrder = async ({
  userId, cart, shippingAddress,
  paymentMethod, transactionId, pidx, isKhalti,
}) => {
  const subtotal        = cart.Total || 0;
  const tax             = Math.round(subtotal * 0.13);
  const adminCommission = isKhalti ? Math.round(subtotal * 0.10) : 0;
  const deliveryFee     = cart.restaurantId?.deliveryFee || 100;
  const totalAmount     = Math.round(subtotal + tax + adminCommission + deliveryFee);

  const order = new Order({
    user:       userId,
    restaurant: cart.restaurantId._id,
    items:      cart.items.map((item) => ({
      menu:         item.menu._id,
      quantity:     item.quantity,
      price:        item.menu.price,
      total:        item.menu.price * item.quantity,
      restaurantId: cart.restaurantId._id,
    })),
    subtotal:   Math.round(subtotal),
    tax,
    commission:     adminCommission,
    commissionRate: isKhalti ? 0.10 : 0,
    deliveryFee:    Math.round(deliveryFee),
    totalAmount,
    status:         "pending",
    deliveryStatus: null,
    shippingAddress: {
      address: shippingAddress.address,
      phone:   String(shippingAddress.phone),
    },
    paymentInfo: {
      method:        paymentMethod,
      transactionId: transactionId || null,
    },
    paymentMethod,
    paymentStatus: isKhalti ? "completed" : "pending",
    khaltiPidx:    pidx || "",
    cartIds:       [cart._id],
  });

  await order.save();
  await Cart.findByIdAndDelete(cart._id);
  return order;
};

// Populate helper used by all roles
const populateOrder = (query) =>
  query
    .populate({ path: "items.menu", select: "name description menuImage price" })
    .populate("restaurant", "restaurantName restaurantImage address phone deliveryFee")
    .populate("user", "firstName lastName phone email")
    .populate({
      path:     "deliveryman",
      populate: { path: "userId", select: "firstName lastName phone" },
    });

// ─────────────────────────────────────────────────────────────────────────────
// 1. CUSTOMER — Create Order (COD)
// ─────────────────────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartId, shippingAddress, paymentInfo } = req.body;

    if (!shippingAddress?.address) return res.status(400).json({ message: "Shipping address is required" });
    if (!shippingAddress?.phone)   return res.status(400).json({ message: "Phone number is required" });

    // Duplicate guard
    const existing = await Order.findOne({ cartIds: cartId });
    if (existing) {
      return res.status(409).json({ message: "Order already placed for this cart", orderId: existing._id.toString() });
    }

    const cart = await Cart.findOne({ _id: cartId, user: userId })
      .populate("restaurantId items.menu");

    if (!cart)               return res.status(404).json({ message: "Cart not found" });
    if (!cart.items?.length) return res.status(400).json({ message: "Cart is empty" });

    const order = await buildAndSaveOrder({
      userId, cart, shippingAddress,
      paymentMethod: paymentInfo.method,
      isKhalti: false,
    });

    const populated = await populateOrder(Order.findById(order._id));

    res.status(201).json({
      success: true,
      message: `✅ Order #${order._id.toString().slice(-6)} placed with ${cart.restaurantId.restaurantName}!`,
      orderId: order._id.toString(),
      order:   populated,
    });
  } catch (error) {
    console.error("CREATE_ORDER_ERROR:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CUSTOMER — Get My Orders (active first)
// ─────────────────────────────────────────────────────────────────────────────
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await populateOrder(
      Order.find({ user: userId }).sort({ createdAt: -1 })
    ).lean();

    // Active orders first, then completed/cancelled
    const sorted = [
      ...orders.filter((o) => !["delivered", "cancelled"].includes(o.status)),
      ...orders.filter((o) =>  ["delivered", "cancelled"].includes(o.status)),
    ];

    res.json({ success: true, orders: sorted, count: sorted.length });
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CUSTOMER — Cancel Order
// Only allowed when status is pending or confirmed
// ─────────────────────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId      = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Cannot cancel once preparing has started
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order — it is already ${order.status}. Please contact the restaurant.`,
        cannotCancel: true,
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. VENDOR — Get My Restaurant Orders
// ─────────────────────────────────────────────────────────────────────────────
export const getRestaurantOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found for this account" });

    const orders = await populateOrder(
      Order.find({ restaurant: restaurant._id }).sort({ createdAt: -1 })
    ).lean();

    res.json({
      success: true,
      orders,
      count:   orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. VENDOR — Update Order Status (confirm / cancel / prepare / ready)
// ─────────────────────────────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status }  = req.body;
    const userId      = req.user.userId;

    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });

    const order = await Order.findOne({ _id: orderId, restaurant: restaurant._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const allowed = VENDOR_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid transition: ${order.status} → ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order ${status}`,
      order: {
        _id:    order._id,
        status: order.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. DELIVERYMAN — Get Available Orders (status = ready, no deliveryman yet)
// ─────────────────────────────────────────────────────────────────────────────
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await populateOrder(
      Order.find({ status: "ready", deliveryman: null }).sort({ createdAt: -1 })
    ).lean();

    res.json({ success: true, orders, count: orders.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. DELIVERYMAN — Accept Order
// ─────────────────────────────────────────────────────────────────────────────
export const acceptOrder = async (req, res) => {
  try {
    const { orderId }   = req.params;
    const deliverymanId = req.user.deliverymanId;

    // Check deliveryman is not already on a delivery
    const dm = await Deliveryman.findById(deliverymanId);
    if (!dm) return res.status(404).json({ message: "Deliveryman not found" });
    if (!dm.isAvailable) {
      return res.status(400).json({ message: "You are already on a delivery. Complete it first." });
    }

    // Atomic update — prevent race condition (two deliverymen accepting same order)
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "ready", deliveryman: null },
      {
        deliveryman:    deliverymanId,
        status:         "out_for_delivery",
        deliveryStatus: "accepted",
      },
      { new: true }
    );

    if (!order) {
      return res.status(409).json({ message: "Order already taken or no longer available" });
    }

    // Mark deliveryman as busy
    dm.isAvailable  = false;
    dm.currentOrder = order._id;
    await dm.save();

    const populated = await populateOrder(Order.findById(order._id));

    res.json({ success: true, message: "Order accepted!", order: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. DELIVERYMAN — Update Delivery Status
// accepted → picked_up → on_the_way → delivered
// ─────────────────────────────────────────────────────────────────────────────
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId }      = req.params;
    const { deliveryStatus } = req.body;
    const deliverymanId    = req.user.deliverymanId;

    const DELIVERY_TRANSITIONS = {
      accepted:  "picked_up",
      picked_up: "on_the_way",
      on_the_way:"delivered",
    };

    const order = await Order.findOne({
      _id:        orderId,
      deliveryman: deliverymanId,
      status:     "out_for_delivery",
    });

    if (!order) return res.status(404).json({ message: "Order not found or not assigned to you" });

    // Validate transition
    const expected = DELIVERY_TRANSITIONS[order.deliveryStatus];
    if (deliveryStatus !== expected) {
      return res.status(400).json({
        message: `Invalid delivery transition: ${order.deliveryStatus} → ${deliveryStatus}`,
      });
    }

    order.deliveryStatus = deliveryStatus;

    // When delivered — sync main status too
    if (deliveryStatus === "delivered") {
      order.status      = "delivered";
      order.paymentStatus = order.paymentMethod === "cash" ? "completed" : order.paymentStatus;

      // Free up deliveryman
      await Deliveryman.findByIdAndUpdate(deliverymanId, {
        isAvailable:  true,
        currentOrder: null,
      });
    }

    await order.save();

    res.json({
      success:        true,
      message:        `Delivery status: ${deliveryStatus}`,
      deliveryStatus: order.deliveryStatus,
      status:         order.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. DELIVERYMAN — Get My Active + Past Deliveries
// ─────────────────────────────────────────────────────────────────────────────
export const getMyDeliveries = async (req, res) => {
  try {
    const deliverymanId = req.user.deliverymanId;

    const orders = await populateOrder(
      Order.find({ deliveryman: deliverymanId }).sort({ updatedAt: -1 })
    ).lean();

    res.json({
      success:   true,
      orders,
      active:    orders.filter((o) => o.status === "out_for_delivery").length,
      completed: orders.filter((o) => o.status === "delivered").length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. ADMIN — Get All Orders (with full details)
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter     = {};
    if (status && status !== "all") filter.status = status;

    const orders = await populateOrder(
      Order.find(filter).sort({ createdAt: -1 }).limit(200)
    ).lean();

    // Stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    res.json({
      success: true,
      orders,
      stats: {
        total:          orders.length,
        pending:        orders.filter((o) => o.status === "pending").length,
        active:         orders.filter((o) => !["delivered", "cancelled", "pending"].includes(o.status)).length,
        delivered:      orders.filter((o) => o.status === "delivered").length,
        cancelled:      orders.filter((o) => o.status === "cancelled").length,
        todayRevenue:   orders
          .filter((o) => new Date(o.createdAt) >= today && o.status !== "cancelled")
          .reduce((s, o) => s + (o.totalAmount || 0), 0),
        totalCommission: orders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + (o.commission || 0), 0),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. Khalti: Initiate Payment
// ─────────────────────────────────────────────────────────────────────────────
export const khaltiInitiatePayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartId, shippingAddress, phone } = req.body;

    if (!shippingAddress?.address) return res.status(400).json({ message: "Address required" });

    const existing = await Order.findOne({ cartIds: cartId, paymentStatus: "completed" });
    if (existing) return res.status(409).json({ message: "Already paid" });

    const cart = await Cart.findOne({ _id: cartId, user: userId })
      .populate("restaurantId items.menu");

    if (!cart)               return res.status(404).json({ message: "Cart not found" });
    if (!cart.items?.length) return res.status(400).json({ message: "Cart is empty" });

    const subtotal        = cart.Total || 0;
    const tax             = Math.round(subtotal * 0.13);
    const adminCommission = Math.round(subtotal * 0.10);
    const deliveryFee     = cart.restaurantId?.deliveryFee || 100;
    const totalAmount     = Math.round(subtotal + tax + adminCommission + deliveryFee);

    const purchase_order_id = `CM-${cartId.toString().slice(-6)}-${Date.now()}`;
    const frontendUrl       = process.env.FRONTEND_URL || "http://localhost:5173";

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url:          `${frontendUrl}/verify-payment`,
        website_url:          frontendUrl,
        amount:               totalAmount * 100,
        purchase_order_id,
        purchase_order_name: `Order from ${cart.restaurantId?.restaurantName || "Restaurant"}`,
        customer_info: {
          name:  String(req.user.name || "Customer"),
          email: String(req.user.email || "customer@email.com"),
          phone: safePhone(phone || req.user.phone) || "9800000001",
        },
      },
      { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
    );

    res.json({
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
      purchase_order_id,
      totalAmount,
      cartId,
      shippingAddress,
    });
  } catch (error) {
    console.error("KHALTI_INITIATE_ERROR:", error?.response?.data || error.message);
    res.status(500).json({ message: "Payment initiation failed", error: error?.response?.data });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. Khalti: Verify + Place Order
// ─────────────────────────────────────────────────────────────────────────────
export const khaltiVerifyAndPlaceOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { pidx, cartId, shippingAddress } = req.body;

    if (!pidx)                     return res.status(400).json({ message: "pidx required" });
    if (!cartId)                   return res.status(400).json({ message: "cartId required" });
    if (!shippingAddress?.address) return res.status(400).json({ message: "Address required" });
    if (!shippingAddress?.phone)   return res.status(400).json({ message: "Phone required" });

    // Idempotency
    const existing = await Order.findOne({ khaltiPidx: pidx });
    if (existing) {
      return res.status(200).json({ success: true, message: "Order already placed", orderId: existing._id.toString(), order: existing });
    }

    const lookupRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" } }
    );

    const { status: khaltiStatus, transaction_id } = lookupRes.data;
    if (khaltiStatus !== "Completed") {
      return res.status(400).json({ success: false, message: `Payment not completed. Status: ${khaltiStatus}` });
    }

    const cart = await Cart.findOne({ _id: cartId, user: userId })
      .populate("restaurantId items.menu");

    if (!cart)               return res.status(404).json({ message: "Cart not found" });
    if (!cart.items?.length) return res.status(400).json({ message: "Cart is empty" });

    const order = await buildAndSaveOrder({
      userId, cart, shippingAddress,
      paymentMethod: "khalti",
      transactionId: transaction_id,
      pidx,
      isKhalti: true,
    });

    const populated = await populateOrder(Order.findById(order._id));

    res.status(201).json({
      success: true,
      message: `✅ Order #${order._id.toString().slice(-6)} placed!`,
      orderId: order._id.toString(),
      order:   populated,
    });
  } catch (error) {
    console.error("KHALTI_VERIFY_ERROR:", error?.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed", error: error?.response?.data || error.message });
  }
};