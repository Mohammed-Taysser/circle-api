import mongoose from 'mongoose';
import { hashPassword } from '../utils/hashPassword';
import { User } from '../core/app';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username not provided!'],
      unique: [true, 'username already exists!'],
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user'],
      required: [true, 'Please specify user role'],
    },
    firstName: { type: String },
    lastName: { type: String },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/mohammed-taysser/image/upload/v1654679434/paperCuts/authors/avatar-2_grpukn.png',
    },
    email: {
      type: String,
      required: [true, 'email not provided!'],
      unique: [true, 'email already exists!'],
    },
    password: { type: String, required: [true, 'password not provided!'] },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<User>('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
});

export default mongoose.model<User>('User', userSchema);
