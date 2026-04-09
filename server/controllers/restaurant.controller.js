
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  let newUser = null;

  try {

    const {
      firstName,
      lastName,
      phone,
      address,
      email,
      password,
      restaurantName,
      restaurantType,
      openingTime,
      closingTime,
    } = req.body;


    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const restaurantImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
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
      address,
      email,
      password: hashPassword,
      role: "vendor",
    });


    const newRestaurant = await Restaurant.create({
      owner: newUser._id,
      restaurantName,
      restaurantType,
      openingTime,
      closingTime,
      restaurantImage,

    });

    const payload = {
      userId: newUser._id,
      restaurantId: newRestaurant._id,
      restaurantName: newRestaurant.restaurantName,
      role: "vendor"
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.cookie("token", token, {
      httpOnly: true,
    })

    return res.status(201).json({
      message: "Restaurant registered successfully",
      status: true,
      data: {
        userId: newUser._id,
        restaurantId: newRestaurant._id,
      },
    });

  } catch (error) {
    console.error("Registration Error:", error);
    if (newUser) {
      await User.findByIdAndDelete(newUser._id);
      console.log("User rolled back");
    }
    return res.status(500).json({
      message: "Something went wrong!",
      status: false,
    });
  }
};



// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      return res.status(404).json({
        message: "User does not exist, please sign up",
        status: false,
      });
    }

    // Find restaurant owned by this user
    const restaurant = await Restaurant.findOne({ owner: isUserExist._id });
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found for this user" });
    }

    const isMatched = await bcrypt.compare(password, isUserExist.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Payload includes both userId and restaurantId
    const payload = {
      userId: isUserExist._id,
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      name: isUserExist.firstName + " " + isUserExist.lastName,
      role: "vendor"
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);



    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({
      message: "Restaurant owner logged in successfully!",
      user: {
        name: isUserExist.firstName + " " + isUserExist.lastName,
        email: isUserExist.email,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      status: false,
    });
  }
};


// update restaurant

export const updateRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;
    const restaurantId = req.user.restaurantId;

    const {
      firstName,
      lastName,
      phone,
      address,
      password,
      restaurantName,
      restaurantType,
      openingTime,
      closingTime,
    } = req.body;

    // find user + restaurant
    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({
        message: "User or Restaurant not found",
      });
    }

    // update user
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // update restaurant
    if (restaurantName) restaurant.restaurantName = restaurantName;
    if (restaurantType) restaurant.restaurantType = restaurantType;
    if (openingTime) restaurant.openingTime = openingTime;
    if (closingTime) restaurant.closingTime = closingTime;

    // image update

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      restaurant.restaurantImage = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await user.save();
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Vendor & Restaurant updated successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Update failed",
    });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Delete

export const deleteRestaurant = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get this vendor's restaurant
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurantId = restaurant._id;

    // Delete only this restaurant's menus
    await Menu.deleteMany({ restaurant_id: restaurantId });

    // Delete the restaurant
    await Restaurant.findByIdAndDelete(restaurantId);

    // Delete the vendor user
    await User.findByIdAndDelete(userId);

    // Clear token
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });

    return res.status(200).json({
      success: true,
      message: "Vendor, Restaurant, and Menus deleted successfully",
    });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};



export const getProfile = async (req, res) => {
  try {
    const { userId, restaurantId } = req.user;

    // fetch user (exclude password)
    const user = await User.findById(userId).select("-password");

    // fetch restaurant
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({
        success: false,
        message: "User or Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        restaurant,
      },
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};