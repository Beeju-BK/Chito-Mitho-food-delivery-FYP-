import userModel from "../models/user.model.js";
import restaurantModel from "../models/restaurant.model.js";
import bcrypt from "bcrypt";

const restaurantRegister = async (req,res)=>{
    try {
        const{firstName, lastName, email,phone,password, restaurantName, restaurantImageUrl} = req.body
        const hashPassword = await bcrypt.hash(password,10);
        const newUser = userModel({firstName,lastName,email,phone,password:hashPassword});
        const newRestaurant = restaurantModel({restaurantName,restaurantImageUrl});

        await newUser.save();
        await newRestaurant.save();

       
        
    } catch (error) {
        console.log(error)
    }
}

export default restaurantRegister;