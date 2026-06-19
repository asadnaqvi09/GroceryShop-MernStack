import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectReset = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, error: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "reset") {
      return res.status(401).json({ success: false, error: "Invalid reset token" });
    }
    const user = await User.findById(decoded.id);
    if (!user || !user.isResetVerified) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    req.resetUser = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export { protectReset };
