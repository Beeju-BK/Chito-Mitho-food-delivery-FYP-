import express from "express";
const router = express.Router();

import userController from "../controllers/user.controller.js";

router.post("/register",userController.userRegister);
router.post("/login",userController.userLogin);



export default router;