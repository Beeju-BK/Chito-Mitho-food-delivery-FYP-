import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully!")
    } catch (error) {
        console.log("Database can not connect",error)
    }
}

export default connectDB;