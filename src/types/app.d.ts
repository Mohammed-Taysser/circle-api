import { Request } from 'express';
import { User } from './user';

export interface Configuration {
  env: string;
  server: {
    port: number;
    mongoUrl: string;
  };
  jwt: {
    secret: string;
    refresh: string;
    life: string;
  };

  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export interface IRequest extends Request {
  user: User;
}

// JWT
interface JwtTokenPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

// Cloudinary
type CloudinaryUploaderType = 'users' | 'groups' | 'badges';
