import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check against env credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const payload = { role: "admin", email };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });

    // Send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin logged in successfully",
      user: { role: "admin", email },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};