import deliveryPartnerModel from "../models/deliveryPartner.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

const deliveryPartnerRegister = async (req,res)=>{
    try {
        const{firstName, lastName, email, phone, password,identityType,identityNumber,identityImageUrl,deliveryPartnerImageUrl} = req.body;
        const hashPassword = await bcrypt.hash(password,10);
        const newUser = userModel({firstName,lastName,email,phone,password:hashPassword});
        const newDeliveryPartner = ({identityType,identityNumber,identityImageUrl,deliveryPartnerImageUrl});
        await newUser.save();
        await newDeliveryPartner.save();

    } catch (error) {
        console.log(error);
    }
}

export default deliveryPartnerRegister;