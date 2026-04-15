







import express from "express";
const router = express.Router();


import { createOrder,getUserOrders,getRestaurantOrders,getRestaurantOrdersByStatus,getOrdersByRestaurant,updateOrderStatus } from "../controllers/order.controller.js";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../middlewares/authorization.js";


router.post("/place", verifyJwtToken, createOrder);
router.get("/get-orders", verifyJwtToken, getUserOrders);


// ✅ Restaurant owner routes
router.get('/restaurant/orders', verifyJwtToken, getRestaurantOrders);
router.get('/restaurant/orders/status/:status', verifyJwtToken, authorizeRoles('restaurant'), getRestaurantOrdersByStatus);


// ✅ Admin routes

router.get('/admin/restaurant/:restaurantId', verifyJwtToken, authorizeRoles('admin'), getOrdersByRestaurant);


// ✅ Add this line
router.patch('/:orderId/status',verifyJwtToken, updateOrderStatus);


export default router;

