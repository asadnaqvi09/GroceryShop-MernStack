import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import {generateOTP} from "../utility/generateOTP.js";
import {generateToken} from '../utility/generateToken.js';
import {sendEmail} from "../utility/sendEmail.js";

const GEN_SALT = 10;

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const errors = [];
    if (!name || !email || !password || !confirmPassword) {
      errors.push("All fields are required");
    }
    if (name && name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }
    if (email && !validator.isEmail(email)) {
      errors.push("Invalid Email");
    }
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (errors.length >0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const [existingUser, hashedPassword] = await Promise.all([
      User.findOne({ email }),
      bcrypt.hash(password, GEN_SALT),
    ])
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const { otp, hashedOTP } = await generateOTP();
    const newUser = await User.create({
       name,
       email,
       password: hashedPassword,
       otpCode: hashedOTP,
       otpExpire: Date.now() + 60000,
       isVerified: false,
     });

    const html = `
      <div style="font-family:sans-serif">
        <h2>Email Verification</h2>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This code will expire in <b>1 minute</b>.</p>
      </div>
    `;
    sendEmail(email, "Verify your Grocery Shop account", html).catch((err)=> {
      console.error("Error sending email:", err);
    });
    res.status(201).json({ message: "Verification Code sent to your email" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (Date.now() > user.otpExpire) {
      return res.status(400).json({ message: "OTP Expired.Please Request New One" });
    }
    const isOTPValid = await bcrypt.compare(otpCode, user.otpCode);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000, // 1 day
    });

    res.status(200).json({
      message: "User Logged In Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (Date.now() < user.otpExpire) {
      return res.status(400).json({ message: "OTP not expired yet" });
    }
    const { otp, hashedOTP } = await generateOTP();
    user.otpCode = hashedOTP;
    user.otpExpire = Date.now() + 60000;
    await user.save();

    const html = `
      <div style="font-family:sans-serif">
        <h2>Email Verification</h2>
        <p>Hi ${user.name},</p>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This code will expire in <b>1 minute</b>.</p>
      </div>
    `;
    await sendEmail(email, "Verify your Grocery Shop account", html);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "Email and Password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid Email or Password" });
    }
    if (!user.isVerified) {
      return res.status(401).json({message: "Email not verified.Please verify your email before logging in"});
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req,res)=> {
  try {
    const {email} = req.body;
    if(!email || !validator.isEmail(email)){
      return res.status(400).json({message: "Invalid Email"})
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }
    const { otp,hashedOTP } = await generateOTP();
    user.resetOTP = hashedOTP;
    user.resetOTPExpire = Date.now() + 60000;
    await user.save();
    const html = `
      <h2> Password Reset Code : </h2>
      <p>Hi ${user.name}, </p>
      <p>Your password reset code is:</p>
      <h1 style="letter-spacing:5px">${otp}</h1>
      <p>This code will expire in <b>1 minute</b>.</p>
    `
    await sendEmail(email, "Grocery Shop Password Reset Code", html);
    res.status(200).json({message: "Reset OTP sent to your email"})
  } catch (error) {
    console.error("Error In Reset Password Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyResetOTP = async(req,res)=> {
  try {
    const { email,otpCode } = req.body;
    const user = await User.findOne({email});
    if (!user){
      return res.status(404).json({ message: "User not found"});
    }
    const isOTPValid = await bcrypt.compare(otpCode, user.resetOTP);
    if (!isOTPValid || Date.now()> user.resetOTPExpire){
      return res.status(400).json({ message: "Invalid OTP or OTP Expired"});
    }
    user.isResetVerified = true;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();
    res.status(200).json({message: "OTP Verified Successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const resetPassword = async (req,res)=> {
  try {
    const { email,newPassword,confirmPassword } = req.body;
    const user = await User.findOne({email});
    if (!user){
      return res.status(404).json({ message: "User not found"});
    }
    if (!newPassword || !confirmPassword){
      return res.status(400).json( {message:"Please fill all required fields"} );
    }
    if (newPassword.length < 6){
      return res.status(400).json( {message: "Password must be at least 6 characters long"});
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords did not match"});
    }
    if(!user.isResetVerified){
      return res.status(401).json({message: "Unauthorized Request OTP not verified"});
    }
    const hashPass = await bcrypt.hash(newPassword, GEN_SALT);
    user.password = hashPass;
    user.isResetVerified = false;
    await user.save();
    res.status(200).json({message: "Password Reset Successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    console.log("Error In Reset Password Controller:", error);
  }
}

export { loginUser, registerUser, logoutUser, verifyOTP, forgotPassword, resetPassword, resendOTP, verifyResetOTP };