import User from '../Models/UserSchema';
import { Request, Response } from 'express';
import { generateToken} from '../utils/generateToken';
import {generateRefreshToken} from '../utils/generateRefreshToken'
import bcrypt from 'bcrypt';
import {sendEmail} from '../utils/sendEmail'
import {generateEmailToken} from '../utils/generateEmailToken'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const signUpUser=async(req: Request, res: Response): Promise<void> => {
    const verifyLink= process.env.EMAIL_VERIFY_URL;
    const { name, email, password } = req.body;
    // Check if all required fields are provided
    if (!name || !email || !password) {
        res.status(400).json({ message: 'Please provide all required fields' });
        return;
    }
    // Check if the user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    // Create a new user
    const newUser = new User({ name, email, password });
    // Generate an email verification token
    const verifyToken = await generateEmailToken(newUser._id.toString());
    try{
        // Save the new user to the database
       newUser.verifyToken= verifyToken
       const savedUser=await newUser.save();
        // Send verification email
        const verificationLink=`${verifyLink}/${verifyToken}`; // Construct the verification link
        //email content
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Welcome to Our App, ${savedUser.name} 👋</h2>
        <p>We're excited to have you on board! Please verify your email address to activate your account:</p>
        <p>
          <a href="${verificationLink}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-word;">${verificationLink}</p>
        <hr />
        <small>This link will expire in 5 minutes.</small>
      </div>
    `;
    // Send the verification email
    await sendEmail({
            to: savedUser.email,
            subject: 'please verify your email address',
            html,
    })
        // Generate a token for the user
    const accessToken = await generateToken(savedUser._id.toString());// Generate an access token for the user
    const refreshToken = await generateRefreshToken(savedUser._id.toString());// Generate a refresh token for the user        //Set token in HTTP-only cookie
        
     res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
        // Respond with the user data and token
    res.status(201).json({
            message: 'User created successfully. Please check your email to verify your account.',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            accessToken,        });
        return;       
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}
//login user
export const loginUser=async (req: Request, res: Response): Promise<void> => {
    try{
    const { email, password } = req.body;
    // Check if all required fields are provided
    if (!email || !password) {
        res.status(400).json({ message: 'Please provide all required fields' });
        return;
    }
        // Check if the user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(400).json({ message: 'User does not exist' });
        return;
    }
    if (!user.isVerified) {
    res.status(401).json({ message: 'Please verify your email first' });
    return;
    }

    // Compare the provided password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate a token for the user
    const accessToken = await generateToken(user._id.toString());// Generate an access token for the user
    const refreshToken = await generateRefreshToken(user._id.toString());// Generate a refresh token for the user
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });
    // Respond with the user data and token
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        accessToken,
    });
}catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
   
}

//logout user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie('refreshToken', '', {// Clear the token cookie
      httpOnly: true,
      expires: new Date(0), // Immediately expires the cookie
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};


//verify email
export const verifyEmail = async (req: Request, res: Response): Promise<void> =>{
    const { token } = req.params; // Get the token from the request parameters
     const jwt_email_secret = process.env.JWT_EMAIL_SECRET; // Get the secret from environment variables

    // Check if the token is provided
    if (!token) {
        res.status(400).json({ message: 'user not found' });
        return;
    }
    
    try {
        //verify token
        const decoded = jwt.verify(token, jwt_email_secret!) as { id: string }; // Decode the token to get the user ID
        // Find the user by the verification token
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired verification token' });
            return;
        }
        // Check if the user is already verified
        if (user.isVerified) {
            res.status(400).json({ message: 'Email is already verified' });
            return;
        }
        // Update the user's verification status
        user.isVerified = true;
        user.verifyToken = ''; // Clear the verification token
        await user.save(); // Save the updated user to the database
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ message: 'invalid or expired token' });
    }
}