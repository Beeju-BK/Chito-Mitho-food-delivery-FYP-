
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────────────────────
// Sign Up
// ─────────────────────────────────────────────────────────────────────────────
export const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ FIX: was missing `new` keyword — User({ }) does NOT create a document
    const newUser = new User({ firstName, lastName, phone, address, email, password: hashPassword });

    const payload = {
      userId:  newUser._id,
      name:    `${firstName} ${lastName}`,
      email,
      // ✅ phone stored as [String] array — keep consistent in JWT
      phone:   Array.isArray(phone) ? phone : [phone],
      address,
      role:    "customer",
    };

    const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:   false,
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Sign up successfully!",
      user: {
        userId:  newUser._id,
        name:    `${newUser.firstName} ${newUser.lastName}`,
        email:   newUser.email,
        phone:   newUser.phone,
        address: newUser.address,
        role:    newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────────────────────
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      userId:  user._id,
      name:    `${user.firstName} ${user.lastName}`,
      email:   user.email,
      // ✅ phone is [String] array — pass as-is so JWT carries same type
      phone:   user.phone,
      address: user.address,
      role:    user.role,
    };

    const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure:   false,
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id:    user._id,
        name:  `${user.firstName} ${user.lastName}`,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed!" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Profile
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user   = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,   // [String] array
        address:   user.address,
        role:      user.role,
      },
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (address)   user.address   = address;
    // ✅ phone is [String] array — wrap string input in array if needed
    if (phone) user.phone = Array.isArray(phone) ? phone : [String(phone)];

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,
        address:   user.address,
        role:      user.role,
      },
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Change Password
// ─────────────────────────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ success: false, message: "New password must differ from current" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ success: false, message: "Password change failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Delete Account
// ─────────────────────────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });

    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken  = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: "Password Reset — Chito Mitho",
      html:    `<p>Click the link below to reset your password. It expires in 10 minutes.</p>
                <a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken:  token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password            = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Reset failed" });
  }
};