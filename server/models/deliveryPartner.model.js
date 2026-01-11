import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    identityType:{
        type: String,
        enum: ["Passport","Driving license", "Nagrikta"],
    },
    identityNumber:{
        type: String,
        requried: true,
    },
    identityImageUrl:{
        type: String,
        required: true,
    },
    deliveryPartnerImageUrl:{
        type: String,
        required: true,
    }
},{timestamps: true});          

const deliveryPartner = mongoose.model("deliveryPartner",deliveryPartnerSchema);

export default deliveryPartner;