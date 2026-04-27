
import express from "express";
import upload from "../middlewares/upload.js";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import {addMenu,updateMenu,deleteMenu,getMenu,getPublicMenu,getRestaurantMenus} from "../controllers/menu.controller.js";

const router = express.Router();

// Single file upload for menuItemImageUrl
router.post("/add",verifyJwtToken, upload.single("menuImage"), addMenu);
router.get("/get",verifyJwtToken,getMenu);
router.put("/update/:id", verifyJwtToken, upload.single("menuImage"), updateMenu);
router.delete("/delete/:id", verifyJwtToken, deleteMenu);
router.get("/public",getPublicMenu);
router.get("/restaurant/:id", getRestaurantMenus);


export default router;



