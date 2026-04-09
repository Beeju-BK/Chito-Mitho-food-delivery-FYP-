import express from "express";
const router = express.Router();
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import {addToCart,removeFromCart,getCart,updateCart} from "../controllers/cart.controller.js";


router.post("/add", verifyJwtToken,addToCart);
router.delete("/remove", verifyJwtToken, removeFromCart);
router.put("/update",verifyJwtToken,updateCart);
router.get("/get",verifyJwtToken,getCart);



export default router;

