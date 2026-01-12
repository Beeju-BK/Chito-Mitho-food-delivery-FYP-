import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import userModel from "../models/user.model.js"


// register controller
const userSignup = async (req,res)=>{
    try {
        const {firstName,lastName,email,password} = req.body;

        const isUserExist = await userModel.findOne({email});

        if(isUserExist){
            return res.json({message: "user already exists!"})
        }

        const hashPassword = await bcrypt.hash(password,10);
        const newUser = userModel({firstName,lastName,email,password:hashPassword});
        

        const payload = {id: newUser._id, Name: firstName + lastName};
        const token = jsonwebtoken.sign(payload,process.env.SECRET_KEY);
        res.cookie("token",token,{
            httpOnly: true,
        })

        await newUser.save();
        return res.json({message:"registered successfully1"})

        
    } catch (error) {
        console.log(error)
        return res.json({message: "Registration failed"})
        
    }
}

// Login Controller
const userLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(user){
            const isMatched = await bcrypt.compare(password, user.password);
            if(!isMatched){
                return res.json({message: "Invalid email or password"});
            }
            
        }

        const payload = {id: user._id, Name: user.firstName +" "+ user.lastName };
        const token = jsonwebtoken.sign(payload,process.env.SECRET_KEY)
        res.cookie("token",token,{
            httpOnly: true
        })

        return res.json({message: "Logged in successfully!"})
        
    } catch (error) {
        console.log(error);
        return res.json({message: "Login failed!"})
    }
}



export default {userSignup,userLogin};