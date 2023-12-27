import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';

const routeNotFound = async (
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  response
    .status(statusCode.NOT_FOUND)
    .json({ error: `Sorry can't find that!` });
};

export default routeNotFound;
