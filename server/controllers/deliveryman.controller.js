


import Deliveryman from "../models/deliveryman.model.js";
import User        from "../models/user.model.js";
import bcrypt      from "bcrypt";
import jwt         from "jsonwebtoken";

// ─────────────────────────────────────────────────────────────────────────────
// Register — pending admin approval
// POST /api/deliveryman/register
// ─────────────────────────────────────────────────────────────────────────────
export const deliverymanRegister = async (req, res) => {
  let newUser = null;
  try {
    const {
      firstName, lastName, phone, dateOfBirth,
      identityType, identityNumber,
      zone, vehicle, dutyTime,
      email, password,
    } = req.body;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const identityImage    = req.files?.identityImage?.[0]
      ? `${baseUrl}/uploads/${req.files.identityImage[0].filename}` : null;
    const billBookCopy     = req.files?.billBookCopy?.[0]
      ? `${baseUrl}/uploads/${req.files.billBookCopy[0].filename}` : null;
    const deliverymanImage = req.files?.deliverymanImage?.[0]
      ? `${baseUrl}/uploads/${req.files.deliverymanImage[0].filename}` : null;

    if (!identityImage || !billBookCopy || !deliverymanImage) {
      return res.status(400).json({ message: "All images are required", status: false });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    newUser = await User.create({
      firstName, lastName, phone, dateOfBirth,
      email, password: hashPassword,
      role: "deliveryman",
    });

    await Deliveryman.create({
      userId: newUser._id,
      identityType, identityNumber,
      zone, vehicle, dutyTime,
      identityImage, billBookCopy, deliverymanImage,
      isApproved:  false,
      isBlocked:   false,
      isAvailable: false, // not available until approved
    });

    return res.status(201).json({
      message: "Registration submitted! Please wait for admin approval.",
      status:  true,
    });
  } catch (error) {
    console.error("Deliveryman register error:", error);
    if (newUser) await User.findByIdAndDelete(newUser._id);
    return res.status(500).json({ message: "Something went wrong", status: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Login
// POST /api/deliveryman/login
// ─────────────────────────────────────────────────────────────────────────────
export const deliverymanLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "deliveryman" });
    if (!user) {
      return res.status(404).json({ message: "Deliveryman not found", status: false });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "Account suspended. Contact support.", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", status: false });
    }

    const deliveryman = await Deliveryman.findOne({ userId: user._id });
    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman profile not found", status: false });
    }
    if (!deliveryman.isApproved) {
      return res.status(403).json({
        message: "Your account is pending admin approval.",
        status:  false,
        pending: true,
      });
    }

    // ✅ deliverymanId in JWT — required by order.controller.js for all order actions
    const payload = {
      userId:        user._id,
      deliverymanId: deliveryman._id,
      name:          `${user.firstName} ${user.lastName}`,
      email:         user.email,
      role:          "deliveryman",
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
        name:          `${user.firstName} ${user.lastName}`,
        email:         user.email,
        role:          "deliveryman",
        deliverymanId: deliveryman._id,
        zone:          deliveryman.zone,
        vehicle:       deliveryman.vehicle,
        isAvailable:   deliveryman.isAvailable,
      },
    });
  } catch (error) {
    console.error("Deliveryman login error:", error);
    return res.status(500).json({ message: "Something went wrong", status: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// POST /api/deliveryman/logout
// ─────────────────────────────────────────────────────────────────────────────
export const deliverymanLogout = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Profile
// GET /api/deliveryman/profile
// ─────────────────────────────────────────────────────────────────────────────
export const getDeliverymanProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user        = await User.findById(userId).select("-password");
    const deliveryman = await Deliveryman.findOne({ userId });

    if (!user || !deliveryman) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      data:    { user, deliveryman },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Profile
// PUT /api/deliveryman/profile
// ─────────────────────────────────────────────────────────────────────────────
export const updateDeliverymanProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone, zone, vehicle, dutyTime } = req.body;

    const user        = await User.findById(userId);
    const deliveryman = await Deliveryman.findOne({ userId });

    if (!user || !deliveryman) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (phone)     user.phone     = Array.isArray(phone) ? phone : [String(phone)];

    // Update deliveryman fields
    if (zone)     deliveryman.zone     = zone;
    if (vehicle)  deliveryman.vehicle  = vehicle;
    if (dutyTime) deliveryman.dutyTime = dutyTime;

    // Update profile image if uploaded
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      deliveryman.deliverymanImage = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await user.save();
    await deliveryman.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data:    { user, deliveryman },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Change Password
// PUT /api/deliveryman/change-password
// ─────────────────────────────────────────────────────────────────────────────
export const changeDeliverymanPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password must differ from current" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Toggle availability (online / offline)
// PATCH /api/deliveryman/toggle-availability
// ─────────────────────────────────────────────────────────────────────────────
export const toggleAvailability = async (req, res) => {
  try {
    const deliverymanId = req.user.deliverymanId; // from JWT

    const deliveryman = await Deliveryman.findById(deliverymanId);
    if (!deliveryman) return res.status(404).json({ message: "Not found" });

    deliveryman.isAvailable = !deliveryman.isAvailable;
    await deliveryman.save();

    res.json({
      success:     true,
      isAvailable: deliveryman.isAvailable,
      message:     deliveryman.isAvailable ? "You are now online" : "You are now offline",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};