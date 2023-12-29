import mongoose from 'mongoose';
import { SavedUserDocument } from 'types/user';
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
      required: [true, 'Please specify user role'],
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
      required: [true, 'email not provided!'],
      unique: [true, 'email already exists!'],
    },
    password: {
      type: String,
      required: [true, 'password not provided!'],
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
});

export default mongoose.model<SavedUserDocument>('User', userSchema);
