import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { AuthenticatedRequest } from 'types/app';
import schema from '../schema/user.schema';
import { verifyToken } from '../utils/jwt';

const authorization = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  const request = req as AuthenticatedRequest;
  const token = request.headers['authorization'];

  if (token?.startsWith('Bearer')) {
    try {
      const userJWT = verifyToken(token.split(' ')[1]);

      const userDB = await schema.findById(String(userJWT._id));

      if (!userDB) {
        return response
          .status(statusCode.FORBIDDEN)
          .json({ error: `you aren't authorize, token is invalid` });
      }

      if (userDB.status !== 'active') {
        return response
          .status(statusCode.FORBIDDEN)
          .json({ error: "you aren't authorize, your account is inactive" });
      }

      if (!userDB.isVerified) {
        return response.status(statusCode.FORBIDDEN).json({
          error: "you aren't authorize, your account is not verified",
        });
      }

      if (userJWT.iat && userDB.passwordChangeAt.getTime() < userJWT.iat) {
        return response
          .status(statusCode.FORBIDDEN)
          .json({ error: "you aren't authorize, please change your password" });
      }

      const { password, ...restUserInfo } = userDB;
      request.user = restUserInfo;

      next();
    } catch (_error) {
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
