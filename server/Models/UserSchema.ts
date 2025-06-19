import {Schema,Document} from 'mongoose';
import mongoose, { Types } from "mongoose"
import bcrypt from 'bcrypt';
import validator from 'validator';
export interface IUser extends Document {
    _id:Types.ObjectId;
    name: string;
    email: string;
    password: string;
    comparePassword(enteredPassword: string): Promise<boolean>;// Method to compare passwords
    isVerified: boolean; 
    verifyToken?: string; 
}
const userSchema=new Schema<IUser>({
    name:{
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        },

    },
    isVerified: {
        type: Boolean,
        default: false, // Default value for verification status
    },
    verifyToken: {
        type: String//temporary token for email verification
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [15, 'Password must be at most 15 characters long'],
        trim: true,
        select: false, // Do not return password in queries
        validate(value:string) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain "password"');
            }
            // At least one letter, one number, and one special character
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_\\-])[A-Za-z\d@$!%*?&_\\-]{6,}$/.test(value);
                },
        message: 'Password must contain at least one letter, one number, and one special character'

      }, 

},
{
    timestamps:true, // Automatically add createdAt and updatedAt fields
}
)
//hash passwords before saving
//runs before the document is saved in document hence the pre 
userSchema.pre<IUser>('save',async function(next){
// Check if the password is modified
// If the password is not modified, skip hashing
     if(this.isModified('password')){
    // Hash the password before saving
    //this.password refers to users password which will be hashed and 20 refers to how much time to be spent
    //in hashing the more rounds the  stronger the security
    this.password = await bcrypt.hash(this.password, 12);
     }
    // after hashing save the document
    next();
})
// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    // Compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};
// Export the user model
const User = mongoose.model<IUser>('User', userSchema);
export default User;