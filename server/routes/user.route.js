

import express from "express";

const router = express.Router();
import verifyJwtToken from "../middlewares/verifyJwtToken.js";

import { 
  userSignup, 
  userLogin, 
  logout, 
  updateUser, 
  deleteUser, 
  getProfile, 
  changePassword,
  forgotPassword,    // ✅ ADDED
  resetPassword      // ✅ ADDED
} from "../controllers/user.controller.js";

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", verifyJwtToken, logout);
router.get("/profile", verifyJwtToken, getProfile);
router.put("/change-password", verifyJwtToken, changePassword);
router.put("/update", verifyJwtToken, updateUser);
router.delete("/delete", verifyJwtToken, deleteUser);

// ✅ NEW FORGOT PASSWORD ROUTES (NO AUTH REQUIRED)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;