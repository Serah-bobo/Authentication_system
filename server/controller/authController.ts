import User from '../Models/UserSchema';
import { Request, Response } from 'express';
import { generateToken} from '../utils/generateToken';
import {generateRefreshToken} from '../utils/generateRefreshToken'
import bcrypt from 'bcrypt';
import {generateResetToken} from '../utils/generateResetToken'
import {sendEmail} from '../utils/sendEmail'
import {generateEmailToken} from '../utils/generateEmailToken'
import {generateOtp} from '../utils/generateOtp'
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
    // If the password matches, proceed with login using otp
    const otpCode = generateOtp(); // Generate a 6-digit OTP
    user.otpCode = otpCode; // Store the OTP in the user document
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set OTP expiration time (10 minutes)
    await user.save(); // Save the updated user document to the database
    // Send the OTP to the user's email
  const html = `
  <h2>Hello, ${user.name}</h2>
  <p>Your 2FA verification code is: <strong>${otpCode}</strong></p>
  <p>It expires in 10 minutes.</p>
`;  
// Send the OTP email
    await sendEmail({
        to: user.email,
        subject: 'Your 2FA Verification Code',
        html,
    });
    // Respond with a message indicating that the OTP has been sent
    res.status(200).json({
        message: 'OTP sent to your email. Please enter the OTP to complete login.',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });

    
}catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
   
}



export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const jwt_email_secret = process.env.JWT_EMAIL_SECRET;
  const clientURL = process.env.CLIENT_URL; // Frontend base URL

  if (!token || !jwt_email_secret || !clientURL) {
    res.status(400).json({ message: 'Invalid server configuration or missing token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwt_email_secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect(`${clientURL}/verify-failed`);
    }

    if (user.isVerified) {
      return res.redirect(`${clientURL}/verify-success`); // Already verified is still success
    }

    user.isVerified = true;
    user.verifyToken = '';
    await user.save();

    return res.redirect(`${clientURL}/verify-success`);
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.redirect(`${clientURL}/verify-failed`);
  }
};

//verify otp
export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  const { userId, code } = req.body;
  const user = await User.findById(userId);

  if (!user || !user.otpCode || !user.otpExpires) {
    res.status(400).json({ message: 'Invalid or expired OTP.' });
    return;
  }

  if (user.otpCode !== code || user.otpExpires < new Date()) {
    res.status(401).json({ message: 'Incorrect or expired code.' });
    return;
  }

  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();
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
  
  
};


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


//forgot password
export const forgotPassword = async (req: Request, res: Response): Promise<void> =>{
  const {email}=req.body;
  if (!email) {
    res.status(400).json({ message: 'Please provide an email address' });
    return;
  }
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }
  // Generate a password reset token
  const resetToken = await generateResetToken(user._id.toString());
  console.log('RESET TOKEN:', resetToken);
  // Set the reset token and its expiration time
  user.resetToken = resetToken;
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes
  await user.save(); // Save the updated user document to the database
  // Construct the password reset link
  const resetLink = `${process.env.PASSWORD_RESET_URL}/${resetToken}`; // Use the environment variable for the reset URL
  console.log('RESET LINK:', process.env.PASSWORD_RESET_URL);
  // Email content
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <p>
        <a href="${resetLink}" 
           style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
      <p style="word-break: break-word;">${resetLink}</p>
      <hr />
      <small>This link will expire in 15 minutes.</small>
    </div>
  `;
  // Send the password reset email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html,
    });
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
}

//reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> =>{
  const {token}=req.params; // Get the token from the request parameters
  const {newPassword}=req.body; // Get the new password from the request body
  const jwt_reset_secret = process.env.RESET_TOKEN_SECRET; // Get the secret from environment variables
  // Check if the token is provided
  if (!token) {
    res.status(400).json({ message: 'Token is required' });
    return;
  }
  try{
    const decoded = jwt.verify(token, jwt_reset_secret!) as { id: string }; // Decode the token to get the user ID
    // Find the user by the reset token
    const user = await User.findById(decoded.id);
    if (
      !user||
      user.resetToken !== token ||
      user.resetTokenExpires! < new Date() // Check if the token is valid and not expired

    ) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }
    // Update the user's password
    user.password = newPassword; // Set the new password
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpires = undefined; // Clear the reset token expiration
    await user.save(); // Save the updated user to the database
    res.status(200).json({ message: 'Password reset successfully' });
    
  }catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}