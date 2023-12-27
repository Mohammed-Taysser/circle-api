import { Badge } from './badge';

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
}

export interface UserSaveBody {
  email: string;
  password: string;
}

export type UserUpdateBody = Partial<User>;
