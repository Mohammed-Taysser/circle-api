import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';
import { AuthenticatedRequest } from 'types/app';

const adminRole = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  const request = req as AuthenticatedRequest;

  // user role admin
  if (request.user.role === 'admin') {
    return next();
  }

  // user role not admin
  response.status(statusCode.FORBIDDEN).json({
    error: "You aren't authorize, only admin can use it",
  });
};

module.exports = adminRole;
