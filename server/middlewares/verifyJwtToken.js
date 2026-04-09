import jwt from "jsonwebtoken";

const verifyJwtToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token " });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifyJwtToken;



// ✅ Your /jwt/verify route (minimal change)

// import User from "../models/user.model.js";

// const verifyJwtToken = async (req, res) => {
//   try {
//     const token = req.cookies?.accessToken; // or req.headers.authorization
//     if (!token) return res.status(401).json({ message: "No token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // ✅ ENSURE role is included
//     const user = await User.findById(decoded.userId)
//       .select('name email phone role restaurantId') // ✅ Add role!
//       .lean();
    
//     if (!user) return res.status(401).json({ message: "User not found" });

//     res.json({ 
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role || 'customer',     // ✅ Critical!
//         restaurantId: user.restaurantId    // For restaurant owners
//       }
//     });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default verifyJwtToken;