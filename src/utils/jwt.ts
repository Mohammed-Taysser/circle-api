import jwt, { VerifyOptions } from 'jsonwebtoken';
import { User } from '../core/app';
import CONFIG from '../core/config';

async function generateToken(user: Partial<User>) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
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
