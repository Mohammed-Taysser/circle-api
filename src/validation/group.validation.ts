import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';

const createGroup = [
  check('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Group name can not be empty!')
    .bail(),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(statusCode.BAD_REQUEST).json({ errors: errors.array() });
    } else {
      next();
    }
  },
];

export default {
  create: createGroup,
};
