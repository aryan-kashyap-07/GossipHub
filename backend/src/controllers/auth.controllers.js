const User= require('../models/User')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/utils');
const cloudinary  = require('../config/cloudinary');

// const signup = async (req, res) => {
//     const { fullName, email, password } = req.body;
//     try {
//       if (!fullName || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//       }
  
//       if (password.length < 6) {
//         return res.status(400).json({ message: "Password must be at least 6 characters" });
//       }
  
//       const user = await User.findOne({ email });
  
//       if (user) return res.status(400).json({ message: "Email already exists" });
  
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
  
//       const newUser = new User({
//         fullName,
//         email,
//         password: hashedPassword,
//       });
  
//       if (newUser) {
//         // generate jwt token here
//         await newUser.save();
//         generateToken(newUser._id, res);
        
  
//         res.status(201).json({
//           _id: newUser._id,
//           fullName: newUser.fullName,
//           email: newUser.email,
//           profilePic: newUser.profilePic,
//         });
//       } else {
//         res.status(400).json({ message: "Invalid user data" });
//       }
//     } catch (error) {
//       console.log("Error in signup controller", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
  
    try {
      // Basic validation
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      await newUser.save(); // Ensure user is saved before generating token
  
      // Generate JWT Token
      generateToken(newUser._id, res);
  
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
  
    } catch (error) {
      console.log("Error in signup controller:", error);
  
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({messgae:"Invalid Credentials"})
        }
        const isPassCorrect=await bcrypt.compare(password,user.password);
        if(!isPassCorrect){
            return res.status(400).json({messgae:"Invalid Credentials"})
        }
        generateToken(user._id,res)
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            email: user.email,
            profilePic:user.profilePic
        }) 

    } catch (error) {
        console.log(error.message);
        res.status(500).json({messgae:"Internal error"})
    }
   
}

const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({messgae:" Logged out successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({messgae:"Internal error"})
    }
}

const updateProfile= async(req,res)=>{ 
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({messgae:"Profile Pic is required"});
        }

        const uploadResponse= await cloudinary.uploader.upload(profilePic);
        const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({messgae:"Internal error"})
    }
}

const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

module.exports={signup,login,logout,updateProfile,checkAuth};