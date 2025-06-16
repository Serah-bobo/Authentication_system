import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 
const mongo_uri= process.env.MONGO_URI ;

const connectDB = async () => {
    if (!mongo_uri) {
        throw new Error('MONGO_URI is not defined');
    }
    try{// Attempt to connect to MongoDB using the URI from environment variables
        await mongoose.connect(mongo_uri);//
        console.log('MongoDB connected successfully');
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}
export default connectDB;// Export the connectDB function for use in other parts of the application
// This code connects to a MongoDB database using Mongoose and environment variables.
// It handles connection errors and logs success or failure messages.