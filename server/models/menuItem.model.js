import mongoose from "mongoose";


const menuItemSchema = new mongoose.Schema({
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"restaurant"
    },
    name: {
        type: String,
        required: true,
    },

    desciption: {
        type: String,
    },
    price:{
        type: Number,
        required: true,
    },
    type:{
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true,
    },
    availabiliity: {
        type: Boolean,
        default: true,
    },
    menuItemImageUrl:{
        type: String,

    },


},{timestamps: true});

const menuItem = mongoose.model("menuItem", menuItemSchema);

export default menuItem;

