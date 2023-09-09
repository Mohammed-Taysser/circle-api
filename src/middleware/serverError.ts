import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';

const serverError = async (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  response.status(statusCode.BAD_REQUEST).json({ error });
};

export default serverError;
