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
app.use("/uploads", express.static("public/uploads"));
app.use(cors({origin:"http://localhost:5173", credentials: true}));

// importing database connecton
import connectDB from "./config/DBConnection.js";


// importing routes
import verifyJwtToken from "./routes/verifyJwtToken.route.js";
import adminRoute from "./routes/admin.route.js";
import userRoute from "./routes/user.route.js";
import restaurantRoute from "./routes/restaurant.route.js";
import deliverymanRoute from "./routes/deliveryman.route.js"
import menuRoute from "./routes/menu.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";

app.use("/api/jwt",verifyJwtToken)
app.use("/api/admin",adminRoute);
app.use("/api/customer",userRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/deliveryman",deliverymanRoute);
app.use("/api/menu",menuRoute);
app.use("/api/cart",cartRoute);
app.use("/api/order",orderRoute);



connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`server running on http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log("server not working!",error)
})