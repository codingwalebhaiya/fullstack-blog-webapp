import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // Get token from cookies
    if (!token) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User does not exist",
      });
    }

    req.user = user;
    req.userId = decoded.id;
    req.userRole = decoded.role; // ✅ role from token
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token is not valid",
      error: error.message,
    });
  }
};

export default authMiddleware;
