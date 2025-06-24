import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../Config/database'
import authRoutes from '../Routes/authRoutes'
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();// Load environment variables from .env file
const app = express();// Create an Express application
app.use(express.json());// Middleware to parse JSON bodies
app.use(cookieParser());// Middleware to parse cookies from requests
app.use(cors({
  origin: 'http://localhost:3000', // React runs on port 3000
  credentials: true, // Needed to allow cookies
}));

//routes
app.use('/api/auth', authRoutes);// Use the authentication routes
const port = process.env.PORT;// Set the port from environment variables 
connectDB()
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})