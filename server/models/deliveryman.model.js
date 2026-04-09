import mongoose from "mongoose";

const deliverymanSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    identityType:{
        type: String,
        required: true,
    },
    identityNumber:{
        type: String,
        // requried: true,
    },
    identityImage:{
        type: String,
        required: true,
    },
    zone:{
        type: String,
        required: true
    },
    vehicle:{
        type: String,
        required: true
    },
    billBookCopy:{
        type: String,
        required: true,
    },
    dutyTime:{
        type: String,
        // enum: ["Day","Night"]
    },
    deliverymanImage:{
        type: String,
        required: true,
    }
},{timestamps: true});          

const Deliveryman = mongoose.model("Deliveryman",deliverymanSchema);

export default Deliveryman;