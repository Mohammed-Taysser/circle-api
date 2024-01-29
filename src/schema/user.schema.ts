import mongoose from 'mongoose';
import { IUser } from 'types/user';
import { hashPassword } from '../utils/password';

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
    },
    firstName: { type: String, required: [true, 'first name not provided!'] },
    lastName: { type: String, required: [true, 'last name not provided!'] },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/mohammed-taysser/image/upload/v1654679434/paperCuts/authors/avatar-2_grpukn.png',
    },
    cover: {
      type: String,
      default:
        'https://res.cloudinary.com/mohammed-taysser/image/upload/v1657350049/lama/users/5437842_py0e8h.jpg',
    },
    email: {
      type: String,
      required: [true, 'Email not provided!'],
      unique: [true, 'Email already exists!'],
    },
    password: {
      type: String,
      required: [true, 'password not provided!'],
    },
    badges: [
      {
        badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        earnAt: { type: Date, default: new Date() },
      },
    ],
    bookmarks: [
      {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        saveAt: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'joinAt',
      updatedAt: 'updatedAt',
    },
  }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
});

export default mongoose.model<IUser>('User', userSchema);
