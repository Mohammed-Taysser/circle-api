import { Request } from 'express';
import { User } from './user';
import { Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { RootFilterQuery } from 'mongoose';

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

interface AuthenticatedRequest extends Request {
  user: User;
}

interface FilterRequest<T> extends Request {
  filters: RootFilterQuery<T>;
}

// JWT
interface JwtTokenPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}
