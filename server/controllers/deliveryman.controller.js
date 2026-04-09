import Deliveryman from "../models/deliveryman.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const deliverymanRegister = async (req, res) => {
    let newUser = null;
    try {
        const { firstName, lastName, phone, dateOfBirth, identityType, zone, vehicle, dutyTime, email, password } = req.body;

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const identityImage = req.files?.identityImage?.[0]
            ? `${baseUrl}/uploads/${req.files.identityImage[0].filename}`
            : null;

        const billBookCopy = req.files?.billBookCopy?.[0]
            ? `${baseUrl}/uploads/${req.files.billBookCopy[0].filename}`
            : null;

        const deliverymanImage = req.files?.deliverymanImage?.[0]
            ? `${baseUrl}/uploads/${req.files.deliverymanImage[0].filename}`
            : null;

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({
                message: "User already exists!",
                status: false,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        newUser = await User.create({
            firstName,
            lastName,
            phone,
            dateOfBirth,
            email,
            password: hashPassword,
            role: "DELIVERYMAN",
        });

        await Deliveryman.create({
            userId: newUser._id,
            identityType,
            zone,
            vehicle,
            dutyTime,
            identityImage,
            billBookCopy,
            deliverymanImage
        });

        return res.status(201).json({
            message: "Deliveryman registered successfully!",
            status: true,
        });

    } catch (error) {
        console.log(error);
        if (newUser) {
            await User.findByIdAndDelete(newUser._id);
            console.log("User rolled back");
        }
        return res.status(500).json({
            message: "Something went wrong",
            status: false,
        });
    }
};

export default deliverymanRegister;