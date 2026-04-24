import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const protectedRoute = async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message: "Unauthorized User not found Please Login"});
        }
        req.user = user;
        next();
    }catch(error){
        return res.status(401).json({message: "Unauthorized: Invalid token"});
    }
}

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

export { protectedRoute, isAdmin };