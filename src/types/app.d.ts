import { Request } from 'express';
import { User } from './user';
import { Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';

interface Configuration {
  env: string;
  server: {
    port: number;
    mongoUrl: string;
  };
  jwt: {
    secret: Secret;
    refresh: string;
    life: StringValue | number;
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
