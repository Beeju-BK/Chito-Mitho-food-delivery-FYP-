import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    // personal information
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        unique: true,
        required: true,
    },

    // Business Information
    restaurantName:{
        type: String,
        required: true,
        trim: true,
    },

    restaurantType:{
        type: String,
        required: true,
    },

    cuisineTypes:{
        type:[String],
    },

    openingTime: {
    type: String,
    required: true,
    
  },
  closingTime: {
    type: String,
    required: true,
  },

  // Documents
  restaurantImage:{
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isApproved: { type: Boolean, default: false }, 
  approvedAt: { type: Date, default: null },

},{timestamps: true});

const Restaurant = mongoose.model("Restaurant",restaurantSchema);

export default Restaurant;          