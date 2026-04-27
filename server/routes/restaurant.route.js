import express from "express";
import upload from "../middlewares/upload.js";
import {register,login,updateRestaurant,deleteRestaurant,getProfile,getAllRestaurants} from "../controllers/restaurant.controller.js";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";

const router = express.Router();

router.post("/register",upload.single("restaurantImage"),register);
router.post("/login",login);
router.put("/update",verifyJwtToken,upload.single("restaurantImage"),updateRestaurant);
router.delete("/delete",verifyJwtToken,deleteRestaurant);
router.get("/profile",verifyJwtToken,getProfile);

router.get("/all", getAllRestaurants); 

export default router;