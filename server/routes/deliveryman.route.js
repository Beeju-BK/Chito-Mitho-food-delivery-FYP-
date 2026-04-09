import express from "express";
import upload from "../middlewares/upload.js";
import deliverymanRegister from "../controllers/deliveryman.controller.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "identityImage", maxCount: 1 },
    { name: "billBookCopy", maxCount: 1 },
    {name: "deliverymanImage", maxCount: 1}
  ]),
  deliverymanRegister
);

export default router;