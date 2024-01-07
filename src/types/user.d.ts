import mongoose from 'mongoose';
import { Badge } from './badge';
import { Post } from './post';

export interface User {
  _id: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cover: string;
  email: string;
  password: string;
  badges: Badge[];
  bookmarks: Post[];
}

export interface UserSaveBody {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cover: string;
  email: string;
  password: string;
  bookmarks: Post[];
  badges: Badge[];
}

export type UserUpdateBody = Partial<User>;

export type UserDocument = mongoose.Document & User;
