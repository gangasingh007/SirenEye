import express from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword 
    };
    
    const result = await User.create(newUser);

    const token = jwt.sign({ userId: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({
        token : token,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post("/login",async (req, res) => {
  try {
  const {email , password} = req.body;

  const isExistingUser = await User.findOne({email : email});
  if (!isExistingUser) {
    return res.status(400).json({message: "User does not exist"});
  }

  const isPasswordValid =await bcrypt.compare(password, isExistingUser.password);
  if (!isPasswordValid) {
    return res.status(400).json({message: "Invalid password"});
  }

  const token = jwt.sign({userId: isExistingUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

  res.status(200).json({
    token: token,
    firstName: isExistingUser.firstName,
    lastName: isExistingUser.lastName,
    email: isExistingUser.email,
    });
  } catch (error) {
    res.status(500).json({message: "Error logging in user"});  
  }

});

export default router;