import { Document } from 'mongoose';
import userSchema from '../schema/user.schema';
import { Request } from 'express';

interface User extends Document {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
}

declare global {
  namespace Express {
    interface UserInRequest {
      user: User;
    }
  }
}

export { User, UserInRequest };
