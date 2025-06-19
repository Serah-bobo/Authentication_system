import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Function to generate an email verification token
export const generateEmailToken = async (id: string) => {
    try {
        const jwt_email_secret = process.env.JWT_EMAIL_SECRET; // Get the secret from environment variables
    
        if (!jwt_email_secret) {
        throw new Error('JWT email secret is not defined');
        }
    
        // Generate a JWT token for email verification
        const token = jwt.sign(
        { id }, // Payload containing the user ID
        jwt_email_secret, // Secret key used for signing the token
        { expiresIn: '5min' } // Token expiration time set to 5minutes
        );
    
        return token; // Return the generated token
    } catch (error) {
        console.error('Error generating email token:', error);
        throw new Error('Email token generation failed');
    }
}