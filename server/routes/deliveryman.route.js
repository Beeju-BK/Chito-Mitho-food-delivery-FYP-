
import express from "express";
import upload   from "../middlewares/upload.js";
import {
  deliverymanRegister,
  deliverymanLogin,
  deliverymanLogout,
  getDeliverymanProfile,
  updateDeliverymanProfile,
  changeDeliverymanPassword,
  toggleAvailability,
} from "../controllers/deliveryman.controller.js";
import verifyJwtToken  from "../middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const router = express.Router();

const auth = [verifyJwtToken, authorizeRoles("deliveryman")];

// ── Public ────────────────────────────────────────────────────────────────────
router.post(
  "/register",
  upload.fields([
    { name: "identityImage",    maxCount: 1 },
    { name: "billBookCopy",     maxCount: 1 },
    { name: "deliverymanImage", maxCount: 1 },
  ]),
  deliverymanRegister
);
router.post("/login", deliverymanLogin);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post("/logout",           ...auth, deliverymanLogout);
router.get("/profile",           ...auth, getDeliverymanProfile);
router.put(
  "/profile",
  ...auth,
  upload.single("deliverymanImage"), // optional profile image update
  updateDeliverymanProfile
);
router.put("/change-password",   ...auth, changeDeliverymanPassword);
router.patch("/toggle-availability", ...auth, toggleAvailability);



export default router;