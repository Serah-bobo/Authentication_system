import { Schema, Document } from 'mongoose';
import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  isVerified: boolean;
  verifyToken?: string;
  otpCode?: string;
  otpExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
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
      default: false,
    },
    verifyToken: String,
    otpCode: String,
    otpExpires: Date,
    resetToken: { type: String },
    resetTokenExpires: { type: Date },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      trim: true,
      select: false,
    },
  },
  { timestamps: true }
);

// ✅ Validate and hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const plain = this.password;

  // ✅ Only validate *before* hashing
  const strongRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_\\-])[A-Za-z\d@$!%*?&_\\-]{6,}$/;
  if (!strongRegex.test(plain)) {
    return next(
      new Error(
        'Password must contain at least one letter, one number, and one special character'
      )
    );
  }

  if (plain.toLowerCase().includes('password')) {
    return next(new Error('Password must not contain "password"'));
  }

  // ✅ Hash the password
  this.password = await bcrypt.hash(plain, 12);
  next();
});

// ✅ Password comparison method
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
