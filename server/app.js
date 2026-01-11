import dotenv from "dotenv";
dotenv.config()
import express from "express";
const app = express();
const port = process.env.PORT || 4000

import cookieParser from "cookie-parser";
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173", credentials: true}));

// importing database connecton
import connectDB from "./config/DBConnection.js";
// importing routes
import userRoute from "./routes/user.route.js";

app.use("/api",userRoute);




connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`server running on http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log("server not working!",error)
})