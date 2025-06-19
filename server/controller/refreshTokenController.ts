import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import dotenv from "dotenv";

dotenv.config();

const jwt_refresh_token = process.env.JWT_Refresh_SECRET;

export const refreshAccessToken=async(req: Request, res: Response): Promise<void> => {
   try{
     const token=req.cookies.refreshToken; // Read refresh token from cookies sent by client
    // Check if the refresh token is provided
    if (!token) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
    }
    //verify the refresh token
    const decoded= jwt.verify(token, jwt_refresh_token!) as { id: string };// Decode the token to get the user ID
    const newAccessToken = await generateToken(decoded.id); // Generate a new access token using the user ID
    res.status(200).json({ accessToken: newAccessToken }); // Respond with the new access token
    }catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
