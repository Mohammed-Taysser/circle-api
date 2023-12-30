import { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status-codes';

const createBadge = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { body } = request;

  const errors = [];

  if (!body.body) {
    errors.push({ field: 'body', msg: "body can't be empty" });
  }

  if (!body.label) {
    errors.push({ field: 'label', msg: "label can't be empty" });
  }

  if (!request.file) {
    errors.push({ field: 'picture', msg: "picture can't be empty" });
  }

  if (body.body && body.label && request.file) {
    request.body.picture = request.file;

    next();
  } else {
    response.status(statusCode.BAD_REQUEST).json({ errors });
  }
};

export default {
  create: createBadge,
};
