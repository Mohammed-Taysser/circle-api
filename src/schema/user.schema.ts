import mongoose from 'mongoose';
import { IUser } from 'types/user';
import { hashPassword } from '../utils/bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username not provided!'],
      unique: [true, 'username already exists!'],
      max: [100, 'username is too long!'],
      min: [8, 'username is too short!'],
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
      default: '/avatar.jpg',
    },
    cover: {
      type: String,
      default: '/cover.jpg',
    },
    email: {
      type: String,
      required: [true, 'Email not provided!'],
      unique: [true, 'Email already exists!'],
      max: [100, 'Email is too long!'],
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
    passwordChangeAt: {
      type: Date,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'banned'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
    this.passwordChangeAt = new Date();
  }
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ isDeleted: { $ne: false } });

//   next();
// });

export default mongoose.model<IUser>('User', userSchema);
