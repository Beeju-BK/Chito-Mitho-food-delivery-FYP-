import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password:{
        type: String,
        required: true,
    },

    phone:{
        type: [String],
        required: true,
        default: [],
    },

    role:{
        type: String,
        enum: ["customer", "vendor", "deliveryman", "admin"],
        default: "customer",
    },

    address:{
        type: [{
            label: String,
            street: String,
            city: String
        }],
        default:[],
    }

},{timestamps: true});

const user = mongoose.model("user",userSchema)

export default user; 


