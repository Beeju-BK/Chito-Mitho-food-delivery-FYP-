import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";
// import nodemailer from "nodemailer";
// import crypto from "crypto";


// sign up controller
export const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, phone, address,email, password } = req.body;

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.json({ message: "user already exists!" })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = User({ firstName, lastName, phone,address, email, password: hashPassword });


        const payload = { userId: newUser._id, name: firstName + " " + lastName, email: email, address};
        const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        })

        await newUser.save();
        return res.json({
            message: "Sign up successfully!",
            user: {
                userId: newUser._id,
                name: newUser.firstName + " " + newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address,
                role: newUser.role
            }
        })


    } catch (error) {
        console.log(error)
        return res.json({ message: "Registration failed" })

    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
// Login Controller
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // if (user.role.toLowerCase() !== "customer") {
        //     return res.json({ message: "Access denied. Only customers can login." });
        // }


        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        const payload = {
            userId: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        };

        const token = jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge:7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Customer logged in successfully!",
            user: {
                id: user._id,
                name: user.firstName + " " + user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login failed!" });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// logout
export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",   // must match your login cookie
            secure: false      // must match your login cookie
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1️⃣ Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // 3️⃣ Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4️⃣ Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 5️⃣ Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // 6️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Password change failed",
    });
  }
};





////////////////////////////////////////////////////////////////////////////////////////////////////

// Upadate customer or put
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { firstName, lastName, phone, address, password } = req.body;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // update fields (only if provided)
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    
   
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

////////////////////////////////////////////////////////////////////////////////
// Delete customer
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // delete user
    await User.findByIdAndDelete(userId);

    // clear cookie (logout)
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};




// forgot password
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate OTP (6-digit)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Set OTP & expiry (10 min)
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com", // Gmail example
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER, // your email
//         pass: process.env.EMAIL_PASS, // app password if Gmail
//       },
//     });

//     await transporter.sendMail({
//       from: `"Support" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP for Password Reset",
//       text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
//     });

//     return res.status(200).json({ message: "OTP sent to email" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to send OTP" });
//   }
// };