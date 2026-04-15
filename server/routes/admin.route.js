import express from "express";
import { adminLogin, adminLogout } from "../controllers/admin.controller.js";
import verifyJwtToken from "../middlewares/verifyJwtToken.js";
import {authorizeRoles} from "../middlewares/authorization.js";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", verifyJwtToken, adminLogout);

export default router;