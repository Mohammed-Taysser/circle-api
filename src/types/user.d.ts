import { Document } from 'mongoose';
import { Badge } from './badge';
import { Post } from './post';

interface User {
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

type IUser = Document & User;
