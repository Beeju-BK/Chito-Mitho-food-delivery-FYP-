import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    restaurantName:{
        type: String,
        required: true
    },
    restaurantImageUrl:{
        type: String,
        required: true
    },
    
},{timestamps: true});

const restaurant = mongoose.model("restuarant",restaurantSchema);

export default restaurant;          