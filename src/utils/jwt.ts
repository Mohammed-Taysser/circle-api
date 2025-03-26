import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwtTokenPayload } from 'types/app';
import CONFIG from '../core/config';

async function generateToken(user: JwtTokenPayload) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
    CONFIG.jwt.secret,
    {
      expiresIn: CONFIG.jwt.life,
    }
  );
}

function verifyToken(token: string, options?: VerifyOptions) {
  return jwt.verify(token, CONFIG.jwt.secret, options) as JwtPayload;
}

export { generateToken, verifyToken };
