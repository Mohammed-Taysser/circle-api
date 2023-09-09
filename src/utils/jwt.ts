import jwt, { VerifyOptions } from 'jsonwebtoken';
import CONFIG from '../core/config';
import { User } from '../types/app';

async function generateToken(user: Partial<User>) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
    CONFIG.JWT_SECRET_KEY,
    {
      expiresIn: CONFIG.JWT_LIFE_TIME,
    }
  );
}

function verifyToken(token: string, options?: VerifyOptions) {
  return jwt.verify(token, CONFIG.JWT_SECRET_KEY, options);
}

export { generateToken, verifyToken };
