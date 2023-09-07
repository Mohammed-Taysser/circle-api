import { NextFunction, Response } from 'express';
import statusCode from 'http-status-codes';
import { UserInRequest } from '../core/app';
import schema from '../schema/user.schema';

async function ownerOrAdmin(
  request: UserInRequest,
  response: Response,
  next: NextFunction
) {
  await schema
    .findById(request.user._id)
    .then(() => {
      if (
        request.params.id === request.user._id ||
        request.user?.role === 'admin'
      ) {
        next();
      } else {
        response
          .status(statusCode.UNAUTHORIZED)
          .json({ error: "You aren't The Owner Or Admin" });
      }
    })
    .catch((error) => {
      response.status(statusCode.UNAUTHORIZED).json({ error });
    });
}

export default ownerOrAdmin;
