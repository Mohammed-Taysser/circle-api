import { Request } from 'express';
import { User } from './user';

interface Configuration {
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
}

interface IRequest extends Request {
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
