import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../Config/database'
dotenv.config();// Load environment variables from .env file
const app = express();// Create an Express application
app.use(express.json());// Middleware to parse JSON bodies
const port = process.env.PORT;// Set the port from environment variables 
connectDB()
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})