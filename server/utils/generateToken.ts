import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwt_secret = process.env.JWT_SECRET
export const generateToken=async(id:string):Promise<string>=>{
    // Generate a JWT token
    try{
        if(!jwt_secret){
            throw new Error('JWT secret is not defined');
        }
      // Generate a token using the jwt.sign method
      // `id` is embedded into the payload (used for identifying the user)
      // The secret key is used to sign the token ensuring its integrity and security
      // The token will expire in 12 hours

        const token = jwt.sign(
        { id },  // Payload (user's id)
        jwt_secret,  // Secret key used for signing the token
        { expiresIn: "12h" }  
      );
  
      // Return the generated token
      return token;

    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
}