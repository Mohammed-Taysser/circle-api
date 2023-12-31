import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import statusCode from 'http-status-codes';
import service from '../services/subscription.service';

const subscription = [
  check('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail()
    .custom(async (value) => {
      await service
        .getByEmail(value)
        .then((subscription) => {
          if (subscription) {
            return Promise.reject('Email already in use');
          }

          return null;
        })
        .catch((error) => Promise.reject(error));
    })
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

const emailSubscriptionVerify = [
  check('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email an not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail()
];

export default {
  emailSubscriptionVerify,
  subscription,
};