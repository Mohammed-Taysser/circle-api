import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';

const createEvent = [
  check('title')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Title can not be empty!')
    .bail(),
  check('startDate')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('start date can not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('start date must be valid date!')
    .bail(),
  check('endDate')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('end date can not be empty!')
    .isISO8601()
    .toDate()
    .withMessage('end date must be valid date!')
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
  create: createEvent,
};
