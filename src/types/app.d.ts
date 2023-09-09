/// <reference types="express" />
/// <reference types="mongoose" />

import 'express';
import { Document } from 'mongoose';

type CloudinaryUploaderType = 'users' | 'groups';

interface User extends Document {
  username: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  cover: string;
  password: string;
}

declare module 'express' {
  interface UserInRequest extends Request {
    user: User;
  }
}

interface Group extends Document {
  name: string;
  visibility: 'public' | 'private';
  cover: string;
  avatar: string;
}

export { Group, User, UserInRequest, CloudinaryUploaderType };
