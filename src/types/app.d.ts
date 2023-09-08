/// <reference types="express" />
/// <reference types="mongoose" />

import 'express';
import { Document } from 'mongoose';

interface User extends Document {
  username: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
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
  avatar: string;
}

export { Group, User, UserInRequest };

