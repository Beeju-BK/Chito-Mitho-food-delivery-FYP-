
import express from "express";
import {
  adminLogin, adminLogout, adminDashboard,
  getPendingCommissions, markCommissionPaid,
  getAllRestaurants, toggleRestaurantBlock,
  getAllCustomers, toggleCustomerBlock,
  getAdminOrders, updateOrderStatus, cancelOrder,
  advanceOrderStatus, getOrderStats,
  approveRestaurant, rejectRestaurant,
} from "../controllers/admin.controller.js";
import {
  getAllDeliverymen, approveDeliveryman, rejectDeliveryman,
  toggleDeliverymanBlock, assignDeliveryman, getAvailableDeliverymen,
} from "../controllers/admin.deliveryman.controller.js";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const router = express.Router();
const adminAuth = [verifyJwtToken, authorizeRoles("admin")];

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/login",  adminLogin);
router.post("/logout", verifyJwtToken, adminLogout);

// ── Dashboard ─────────────────────────────────────────────────────────────────
router.get("/dashboard", ...adminAuth, adminDashboard);

// ── Commissions ───────────────────────────────────────────────────────────────
router.get("/commissions/pending",          ...adminAuth, getPendingCommissions);
router.patch("/commissions/:orderId/paid",  ...adminAuth, markCommissionPaid);

// ── Restaurants ───────────────────────────────────────────────────────────────
router.get("/restaurants",                          ...adminAuth, getAllRestaurants);
router.patch("/restaurants/:id/toggle-block",       ...adminAuth, toggleRestaurantBlock);
router.patch("/restaurant/approve/:restaurantId",   ...adminAuth, approveRestaurant);
router.delete("/restaurant/reject/:restaurantId",   ...adminAuth, rejectRestaurant);

// ── Customers ─────────────────────────────────────────────────────────────────
router.get("/customers",                      ...adminAuth, getAllCustomers);
router.patch("/customers/:id/toggle-block",   ...adminAuth, toggleCustomerBlock);

// ── Orders ────────────────────────────────────────────────────────────────────
router.get("/orders",                       ...adminAuth, getAdminOrders);
router.get("/orders/stats",                 ...adminAuth, getOrderStats);
router.patch("/orders/:orderId/status",     ...adminAuth, updateOrderStatus);
router.patch("/orders/:orderId/cancel",     ...adminAuth, cancelOrder);
router.patch("/orders/:orderId/advance",    ...adminAuth, advanceOrderStatus);
router.patch("/orders/:orderId/assign-deliveryman", ...adminAuth, assignDeliveryman);

// ── Deliverymen ───────────────────────────────────────────────────────────────
router.get("/deliverymen",                              ...adminAuth, getAllDeliverymen);
router.get("/deliverymen/available",                    ...adminAuth, getAvailableDeliverymen);
router.patch("/deliverymen/:deliverymanId/approve",     ...adminAuth, approveDeliveryman);
router.delete("/deliverymen/:deliverymanId/reject",     ...adminAuth, rejectDeliveryman);
router.patch("/deliverymen/:deliverymanId/toggle-block",...adminAuth, toggleDeliverymanBlock);

export default router;