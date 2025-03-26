import { NextFunction, Request, Response } from 'express';

type AsyncFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

function catchAsync(fn: AsyncFunction): AsyncFunction {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export { catchAsync };
