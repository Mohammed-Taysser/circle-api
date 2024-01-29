import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { IRequest } from 'types/app';
import schema from '../schema/user.schema';
import { verifyToken } from '../utils/jwt';

const authorization = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  const request = req as IRequest;
  const token = request.headers['authorization'];

  if (token?.startsWith('Bearer')) {
    try {
      const user = verifyToken(token.split(' ')[1]);

      const userDB = await schema.findById(String(user._id));

      if (userDB) {
        request.user = userDB;
      } else {
        response
          .status(statusCode.FORBIDDEN)
          .json({ error: `you aren't authorize, token is invalid` });
      }

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
