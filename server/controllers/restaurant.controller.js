
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";
import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────────────────────────────────────
// Register (vendor + restaurant — pending admin approval)
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  let newUser = null;
  try {
    const {
      firstName, lastName, phone, address,
      email, password, restaurantName,
      restaurantType, openingTime, closingTime,
    } = req.body;

    const baseUrl        = `${req.protocol}://${req.get("host")}`;
    const restaurantImage = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : null;

    if (!restaurantImage) {
      return res.status(400).json({ message: "Restaurant image is required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    newUser = await User.create({
      firstName, lastName, phone, address,
      email, password: hashPassword,
      role: "vendor",
    });

    await Restaurant.create({
      owner:         newUser._id,
      restaurantName,
      restaurantType,
      openingTime,
      closingTime,
      restaurantImage,
      isApproved: false, // pending admin approval
      isBlocked:  false,
    });

    return res.status(201).json({
      message: "Registration submitted! Please wait for admin approval before logging in.",
      status:  true,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    if (newUser) await User.findByIdAndDelete(newUser._id);
    return res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Login (vendor)
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", status: false });
    }

    // ✅ FIX: single DB call — reuse restaurant for both checks and JWT payload
    const restaurant = await Restaurant.findOne({ owner: user._id });
    if (!restaurant) {
      return res.status(403).json({ message: "Restaurant not found", status: false });
    }

    if (!restaurant.isApproved) {
      return res.status(403).json({
        message: "Your restaurant is pending admin approval.",
        status:  false,
        pending: true,
      });
    }

    if (restaurant.isBlocked) {
      return res.status(403).json({
        message: "Your restaurant has been blocked. Please contact support.",
        status:  false,
      });
    }

    // ✅ role: "vendor" — matches authorizeRoles("vendor") in routes
    const payload = {
      userId:         user._id,
      restaurantId:   restaurant._id,
      restaurantName: restaurant.restaurantName,
      name:           `${user.firstName} ${user.lastName}`,
      email:          user.email,
      role:           "vendor",
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      status:  true,
      user: {
        name:           `${user.firstName} ${user.lastName}`,
        email:          user.email,
        role:           "vendor",
        restaurantId:   restaurant._id,
        restaurantName: restaurant.restaurantName,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Something went wrong!", status: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Update restaurant + vendor profile
// ─────────────────────────────────────────────────────────────────────────────
export const updateRestaurant = async (req, res) => {
  try {
    const { userId, restaurantId } = req.user;

    const {
      firstName, lastName, phone, address, password,
      restaurantName, restaurantType, openingTime, closingTime,
    } = req.body;

    const user       = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({ message: "User or Restaurant not found" });
    }

    if (firstName)    user.firstName = firstName;
    if (lastName)     user.lastName  = lastName;
    if (phone)        user.phone     = phone;
    if (address)      user.address   = address;
    if (password)     user.password  = await bcrypt.hash(password, 10);

    if (restaurantName) restaurant.restaurantName = restaurantName;
    if (restaurantType) restaurant.restaurantType = restaurantType;
    if (openingTime)    restaurant.openingTime    = openingTime;
    if (closingTime)    restaurant.closingTime    = closingTime;

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      restaurant.restaurantImage = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await user.save();
    await restaurant.save();

    return res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete restaurant + vendor account
// ─────────────────────────────────────────────────────────────────────────────
export const deleteRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;

    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Menu.deleteMany({ restaurant_id: restaurant._id });
    await Restaurant.findByIdAndDelete(restaurant._id);
    await User.findByIdAndDelete(userId);

    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });

    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get vendor profile
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const { userId, restaurantId } = req.user;

    const user       = await User.findById(userId).select("-password");
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({ success: false, message: "User or Restaurant not found" });
    }

    return res.status(200).json({ success: true, data: { user, restaurant } });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get all restaurants (public — active and approved only)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isBlocked: false, isApproved: true })
      .populate("owner", "firstName lastName phone address")
      .select("restaurantName restaurantType restaurantImage openingTime closingTime")
      .sort({ createdAt: -1 });

    res.json({ success: true, restaurants, totalActive: restaurants.length });
  } catch (error) {
    console.error("getAllRestaurants error:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};