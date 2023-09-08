/// <reference types="express" />
/// <reference types="mongoose" />

import { Request } from 'express';
import { Document } from 'mongoose';

interface User extends Document {
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  password: string;
}

declare module 'express' {
  interface  UserInRequest extends Request {
    user: User;
  }
}

// interface UserInRequest extends Request {
//   user?: User;
// }

// type UserInRequest = Request<{}, {}, { user: User; }>;

export { User, UserInRequest };
