import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { profileUpload } from "../utils/upload";
import User from "../model/User";
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { loginSchema, registerSchema } from "../middleware/validation";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log("CLOUDINARY_CLOUD_NAME",process.env.CLOUDINARY_CLOUD_NAME)
console.log("CLOUDINARY_API_KEY",process.env.CLOUDINARY_API_KEY)
console.log("CLOUDINARY_API_SECRET",process.env.CLOUDINARY_API_SECRET)


// Register User
export const registerUser = asyncHandler(async (req: Request, res: Response):Promise<any> => {

   
    profileUpload(req, res, async (err) => {
      console.log(req.body)
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
      }
      const { name, email, password, mobile } = validation.data;
      if (!name || !email || !password || !mobile ) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (err) {
        return res.status(400).json({ message: "File upload failed.", error: err.message });
      }

    // const { name, email, password, mobile } = req.body;

    // Check if all required fields are provided
    // if (!name || !email || !password || !mobile || !req.file) {
    //   return res.status(400).json({ message: "All fields are required." });
    // }

    // Check if user already exists
    const userExists = await User.findOne({
        $or: [{ email }, { mobile }],
      });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

  
    const hash= await bcrypt.hash(password, 10);
    let x
    
    if (req.file) {
      var {secure_url} = await cloudinary.uploader.upload(req.file.path)
      x= secure_url
  }

    // Create user
    const result = await User.create({
      name,
      email,
      password: hash,
      mobile,
      hero: x
    });
    res.status(200).json({message:"create successfully",result})

    // if (newUser) {
    //   res.status(201).json({
    //     message: "User registered successfully!",
    //     user: {
    //       id: newUser._id,
    //       name: newUser.name,
    //       email: newUser.email,
    //       mobile: newUser.mobile,
    //       hero: newUser.hero,
    //     },
    //   });
    // } else {
    //   res.status(500).json({ message: "Failed to register user." });
    // }
  });
});

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response):Promise<any> => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }
  
    const { email, password } = validation.data;

  // Find user by email
  const user = await User.findOne({ 
    email
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials." });
  }


  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY as string, { expiresIn: "7d" });
  res.cookie("user", token, { maxAge: 1000 * 60 * 60 * 24})
  res.status(200).json({
    message: "Login successful!",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      hero: user.hero,
    },
  });
});
