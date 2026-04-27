

import express from "express";
const router = express.Router();

import {
  createOrder,
  getUserOrders,
  cancelOrder,
  getRestaurantOrders,
  updateOrderStatus,
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
  getMyDeliveries,
  getAdminOrders,
  khaltiInitiatePayment,
  khaltiVerifyAndPlaceOrder,
} from "../controllers/order.controller.js";

import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../middlewares/authorization.js";

// ── Customer ──────────────────────────────────────────────────────────────────
router.post("/place",              verifyJwtToken, createOrder);
router.get("/get-orders",          verifyJwtToken, getUserOrders);
router.patch("/:orderId/cancel",   verifyJwtToken, cancelOrder);

// ── Vendor ────────────────────────────────────────────────────────────────────
router.get(
  "/restaurant/orders",
  verifyJwtToken, authorizeRoles("vendor"),
  getRestaurantOrders
);
router.patch(
  "/:orderId/status",
  verifyJwtToken, authorizeRoles("vendor"),
  updateOrderStatus
);

// ── Deliveryman ───────────────────────────────────────────────────────────────
router.get(
  "/deliveryman/available",
  verifyJwtToken, authorizeRoles("deliveryman"),
  getAvailableOrders
);
router.patch(
  "/:orderId/accept",
  verifyJwtToken, authorizeRoles("deliveryman"),
  acceptOrder
);
router.patch(
  "/:orderId/delivery-status",
  verifyJwtToken, authorizeRoles("deliveryman"),
  updateDeliveryStatus
);
router.get(
  "/deliveryman/my-deliveries",
  verifyJwtToken, authorizeRoles("deliveryman"),
  getMyDeliveries
);

// ── Admin ─────────────────────────────────────────────────────────────────────
router.get(
  "/admin/all",
  verifyJwtToken, authorizeRoles("admin"),
  getAdminOrders
);

// ── Khalti ────────────────────────────────────────────────────────────────────
router.post("/khalti-initiate", verifyJwtToken, khaltiInitiatePayment);
router.post("/khalti-verify",   verifyJwtToken, khaltiVerifyAndPlaceOrder);

export default router;