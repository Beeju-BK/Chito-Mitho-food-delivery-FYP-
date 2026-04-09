import express from "express";
const router = express.Router();


import verifyJwtToken from "../middlewares/verifyJwtToken.js";

router.get("/verify",verifyJwtToken, (req,res)=>{
    res.json({ user: req.user });
});



export default router;