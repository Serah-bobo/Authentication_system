import User from '../Models/UserSchema';
import { Request, Response } from 'express';
import { generateToken } from '../utils/generateToken';
import bcrypt from 'bcrypt';

export const signUpUser=async(req: Request, res: Response): Promise<void> => {
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
    try{
        // Save the new user to the database
        await newUser.save();
        // Generate a token for the user
        const token = await generateToken(newUser._id.toString());
        //Set token in HTTP-only cookie
        res.cookie('token', token, {// Set the cookie with the token
        httpOnly: true,// Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production',// Use secure cookies in production
        sameSite: 'strict',// Helps prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });
        // Respond with the user data and token
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,        });
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
    // Compare the provided password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate a token for the user
    const token = await generateToken(user._id.toString());
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
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
        token,
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
    res.cookie('token', '', {// Clear the token cookie
      httpOnly: true,
      expires: new Date(0), // Immediately expires the cookie
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};
