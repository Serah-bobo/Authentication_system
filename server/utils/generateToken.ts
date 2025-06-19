import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwt_secret = process.env.JWT_Access_SECRET
export const generateToken=async(id:string):Promise<string>=>{
    // Generate a JWT token
    try{
        if(!jwt_secret){
            throw new Error('JWT secret is not defined');
        }
      // Generate an access token using the jwt.sign method
      // `id` is embedded into the payload (used for identifying the user)
      // The secret key is used to sign the token ensuring its integrity and security
      // The token will expire in 15minutes

        const token = jwt.sign(
        { id },  // Payload (user's id)
        jwt_secret,  // Secret key used for signing the token
        { expiresIn: "15min" }  
      );
  
      // Return the generated token
      return token;

    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
}