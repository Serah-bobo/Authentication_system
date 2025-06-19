import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwt_refresh = process.env.JWT_Refresh_SECRET;

export const generateRefreshToken = async (id: string): Promise<string> => {
    // Generate a JWT refresh token
    try {
        if (!jwt_refresh) {
            throw new Error('JWT refresh secret is not defined');
        }
        // Generate a refresh token using the jwt.sign method
        // `id` is embedded into the payload (used for identifying the user)
        // The secret key is used to sign the token ensuring its integrity and security
        // The token will expire in 7 days

        const refreshToken = jwt.sign(
            { id },  // Payload (user's id)
            jwt_refresh,  // Secret key used for signing the token
            { expiresIn: "7d" }  
        );

        // Return the generated refresh token
        return refreshToken;

    } catch (error) {
        console.error('Error generating refresh token:', error);
        throw new Error('Refresh token generation failed');
    }
}