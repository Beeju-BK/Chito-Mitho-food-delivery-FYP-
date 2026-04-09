import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: [String],
        required: true,
        default: [],
    },

    address: {
        type: String,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,

    },
    role: {
        type: String,
        enum: ["customer", "vendor", "deliveryman", "admin"],
        default: "customer",
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema)

export default User;


