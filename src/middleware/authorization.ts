import { NextFunction, Response } from 'express';
import statusCode from 'http-status-codes';
import { UserInRequest } from '../types/app';
import { verifyToken } from '../utils/jwt';

const authorization = async (
  request: UserInRequest,
  response: Response,
  next: NextFunction
) => {
  const token = request.headers['authorization'];

  if (token?.startsWith('Bearer')) {
    try {
      const user = verifyToken(token.split(' ')[1]);

      request.user = user;
      next();
    } catch (err) {
      response
        .status(statusCode.FORBIDDEN)
        .json({ error: `you aren't authorize, token is invalid` });
    }
  } else {
    response
      .status(statusCode.UNAUTHORIZED)
      .json({ error: 'no token provide' });
  }
};

export default authorization;
